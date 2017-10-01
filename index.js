import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import joinMonsterAdapt from 'join-monster-graphql-tools-adapter';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import { createTokens, refreshTokens } from './auth';
import joinMonsterMetadata from './joinMonsterMetadata';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

joinMonsterAdapt(schema, joinMonsterMetadata);

const SECRET = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd';

const app = express();

const addUser = async (req, res, next) => {
  const guestId = req.headers['x-guest-id'];
  const donorId = req.headers['x-donor-id'];
  req.guestId = guestId;
  req.donorId = donorId;
  next();
};

app.use(cors('*'));
app.use(addUser);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
);

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      SECRET,
      guestId: req.guestId,
      donorId: req.donorId,
    },
  })),
);

const server = createServer(app);

models.sequelize.sync().then(() =>
  server.listen(3030, () => {
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server,
        path: '/subscriptions',
      },
    );
  }),
);
