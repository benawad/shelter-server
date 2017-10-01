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
  },

  Mutation: {
    createShelter: (parent, args, { models }) => models.Shelter.create(args),
    createDonor: (parent, args, { models }) => {
      try {
        const donor = models.Donor.create(args);
        return {
          ok: true,
          donor,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e),
        };
      }
    },
    createGuest: (parent, args, { models }) => {
      try {
        const guest = models.Guest.create(args);
        return {
          ok: true,
          guest,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e),
        };
      }
    },
    // register: async (parent, args, { models }) => {
    //   const hashedPassword = await bcrypt.hash(args.password, 12);
    //   try {
    //     const user = await models.User.create({
    //       ...args,
    //       password: hashedPassword,
    //     });
    //     return {
    //       ok: true,
    //       user,
    //     };
    //   } catch (e) {
    //     return {
    //       ok: false,
    //       errors: formatErrors(e, models),
    //     };
    //   }
    // },
    // login: async (parent, { email, password }, { models, SECRET, SECRET_2 }) =>
    //   tryLogin(email, password, models, SECRET, SECRET_2),
    // refreshTokens: (parent, { token, refreshToken }, { models, SECRET, SECRET_2 }) =>
    //   refreshTokens(token, refreshToken, models, SECRET, SECRET_2),
  },
};
