const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');

console.log("Launch with: PGUSER=postgres PGHOST=localhost PGPASSWORD=maddie17 PGDATABASE=Rabbithole-proto PGPORT=5432 node src/app.js ");

// The GraphQL schema
const schemaText = fs.readFileSync('./src/typedefs.graphql');
const typeDefs = gql`${schemaText}`;


// Resolver API's
const pgAPI = require('./datasources/pgAPI.js');

const dataSources = () => ({
  pgAPI: new pgAPI()
});
 




// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: async (parent, args, context, info) => {
    	return "world";
    },
    getAllNodes: async (_, __, { dataSources }) => {
      return dataSources.pgAPI.getAllNodes();
    },
  },
  Mutation: {
    addNode: (_, { url }, { dataSources }) => {
      return dataSources.pgAPI.addNode({url: url});
    }
  },
  NodeUnion: {
    __resolveType(obj, context, info){
      return 'Node';
    }
  },
};
 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources
});
 
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});