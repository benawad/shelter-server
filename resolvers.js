import bcrypt from 'bcrypt';
import { PubSub } from 'graphql-subscriptions';
import _ from 'lodash';
import joinMonster from 'join-monster';

import { requiresAuth, requiresAdmin } from './permissions';
import { refreshTokens, tryLogin } from './auth';

export const pubsub = new PubSub();

const OCCUPANCY_CHANGED = 'OCCUPANCY_CHANGED';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

export default {
  Subscription: {
    occupancyChange: {
      subscribe: () => pubsub.asyncIterator(OCCUPANCY_CHANGED),
    },
  },
  Query: {
    allShelters: (parent, args, { models }, info) =>
      joinMonster(
        info,
        args,
        sql => models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }),
        { dialect: 'pg' },
      ),
    guestList: async (parent, args, { models, donorId }, info) => {
      const response = await models.sequelize.query(
        `
      select shelters.id as "shelterId", guests.id as "guestId", requests.rooms as "rooms", shelters.name as "shelterName", guests.name as "guestName", guests."phoneNumber" as "guestPhonenumber" from donors, requests, shelters, guests where  ${donorId} = shelters."donorId" and shelters.id = requests."shelterId" and requests.touched = false and guests.id = requests."guestId";
      `,
        { type: models.sequelize.QueryTypes.SELECT },
      );

      const normalizeResponse = response.map(x => ({
        rooms: x.rooms,
        shelter: {
          id: x.shelterId,
          name: x.shelterName,
        },
        guest: {
          id: x.guestId,
          name: x.guestName,
          phoneNumber: x.guestPhonenumber,
        },
      }));

      return normalizeResponse;
    },
  },

  Mutation: {
    createShelter: (parent, args, { models }) => models.Shelter.create(args),
    createDonor: async (parent, args, { models }) => {
      try {
        const donor = await models.Donor.create(args);
        return {
          ok: true,
          donor,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },
    createGuest: async (parent, args, { models }) => {
      try {
        const guest = await models.Guest.create(args);
        return {
          ok: true,
          guest,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },
    createShelterRequest: async (parent, args, { models, guestId }) => {
      try {
        await models.Request.create({
          ...args,
          guestId,
        });

        // const updateShelterPromise = models.Shelter.update(
        //   {
        //     occupancy: models.sequelize.literal(`occupancy - ${args.rooms}`),
        //   },
        //   { where: { id: args.shelterId } },
        // );

        // await Promise.all([shelterRequestPromise, updateShelterPromise]);

        // pubsub.publish(OCCUPANCY_CHANGED, {
        //   occupancyChange: -args.rooms,
        // });

        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },
    decideOnGuest: async (parent, args, { models }) => {
      try {
        await models.Request.update(
          { accepted: args.accepted, touched: true },
          {
            where: { guestId: args.guestId, shelterId: args.shelterId },
          },
        );

        if (args.accepted) {
          models.sequelize.query(`
          update shelters set occupancy = occupancy - requests.rooms from requests where requests."shelterId" = ${args.shelterId} and requests."guestId" = ${args.guestId}
          `);
        }

        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },
  },
};
