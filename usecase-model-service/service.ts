import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import http from 'http';
import mongoose from 'mongoose';
import { RestDirective } from './src/directives/RestDirective';
import { UpperCaseDirective } from './src/directives/UpperCaseDirective';
import { UsecaseModelResolver as resolver } from './src/resolver';
import gqlSchema from './src/typedef.graphql';
const { ApolloLogExtension } = require('apollo-log');

import cookieParser = require('cookie-parser');
import { buildFederatedSchema } from '@apollo/federation';

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

// Mount cookie parser
app.use(cookieParser());

const extensions = [ () => new ApolloLogExtension( {
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  timestamp: true,
  prefix: 'apollo:'
} ) ];

/* Configuring Mongoose */
mongoose.plugin((schema: any) => { schema.options.usePushEach = true; });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

/* Establishing mongodb connection */
const dbCredentials = (process.env.DB_USER && process.env.DB_PASSWORD)
  ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`
  : '';
const dbConnection = `mongodb://${dbCredentials}${process.env.DB_PATH}/${process.env.DB_NAME}`;
mongoose.connect(dbConnection, { useNewUrlParser: true, useCreateIndex: true }).catch(console.error);
mongoose.connection.on('error', error => console.error(error));

/* Defining the Apollo Server */
const apollo = new ApolloServer({
  playground: process.env.NODE_ENV !== 'production',
  typeDefs: gqlSchema,
  resolvers: resolver,
  engine: {    
    reportSchema: true,
    apiKey: process.env.APOLLO_KEY,
  },
  schemaDirectives: {
    rest: RestDirective,
    upper: UpperCaseDirective,
  },
  subscriptions: {
    path: '/subscriptions',
  },
  tracing: true,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  }),
  // extensions
});

/* Applying apollo middleware to express server */
apollo.applyMiddleware({ app });

/*  Creating the server based on the environment */
const server =  http.createServer(app);

app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));
// Installing the apollo ws subscription handlers
apollo.installSubscriptionHandlers(server);
// UsecaseModel
export default server.listen({ port: port }, () => {
  console.log(`Microservice running on ${process.env.NODE_ENV} at ${port}${apollo.graphqlPath}`);
});
