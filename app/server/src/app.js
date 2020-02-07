const { ApolloServer, gql, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const fs = require('fs');

// The GraphQL schema
const schemaText = fs.readFileSync('./src/typedefs.graphql');
const typeDefs = gql`${schemaText}`;


// Resolver API's
const pgAPI = require('./datasources/pgAPI.js');

const dataSources = () => ({
  pgAPI: new pgAPI()
});
 

// Client Authentication:
const client = jwksClient({
  jwksUri: `https://rabbithole-proto.auth0.com/.well-known/jwks.json`
});

function getKey(header, cb){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: 'mxMK30hB3kVXXtB11OZ88Wid7NFd3EnT',
  issuer: `https://rabbithole-proto.auth0.com/`,
  algorithms: ['RS256']
};

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: async (parent, args, context, info) => {
    	return "world";
    },
    getAllNodes: async (_, __, { dataSources }) => {
      return dataSources.pgAPI.getAllNodes();
    },
    getMostRecentNodes: async (_, { n }, { dataSources, user }) => {
      try {
        const email = await user; // catching the reject from the user promise
        return dataSources.pgAPI.getMostRecentNodes(n);
      } catch (e) {
        throw new AuthenticationError("You must be logged in to do this");
      }
    },
    getMostRecentNodeVisits: async (_, { n }, { dataSources }) => {
      return dataSources.pgAPI.getMostRecentNodeVisits(n);
    },
    getLastNodeVisitId: (_, { nodeId }, { dataSources }) => {
      return dataSources.pgAPI.getLastNodeVisitId({nodeId: nodeId});
    }, 
    getNodeVisit: (_, { nodeVisitId }, { dataSources }) => {
      return dataSources.pgAPI.getNodeVisit({nodeVisitId: nodeVisitId});
    }
  },
  Mutation: {
    addNode: (_, { url }, { dataSources }) => {
      return dataSources.pgAPI.addNode({url: url});
    }, 
    getOrCreateNode: (_, { url }, { dataSources }) => {
      return dataSources.pgAPI.getOrCreateNode({url: url});
    },
    setNodeIsStarredValue: (_, { nodeId, isStarredValue }, { dataSources }) => {
      return dataSources.pgAPI.setNodeIsStarredValue({ nodeId: nodeId, isStarredValue: isStarredValue });
    },
    addNodeVisit: (_, { nodeId }, { dataSources }) => {
      return dataSources.pgAPI.addNodeVisit({ nodeId: nodeId});
    }, 
    addNodeVisit: (_, { nodeId }, { dataSources }) => {
      return dataSources.pgAPI.addNodeVisit({ nodeId: nodeId });
    }, 
    addNodeVisitToNode: (_, { nodeId, nodeVisitId }, { dataSources }) => {
      return dataSources.pgAPI.addNodeVisitToNode({nodeId: nodeId , nodeVisitId: nodeVisitId });
    },
    addDomCache: (_, { nodeVisitId, domCache }, { dataSources }) => {
      return dataSources.pgAPI.addDomCache({nodeVisitId: nodeVisitId, domCache: domCache});
    },
    addFaviconPath: (_, { nodeVisitId, faviconPath }, { dataSources }) => {
      return dataSources.pgAPI.addFaviconPath({nodeVisitId: nodeVisitId, faviconPath: faviconPath});
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
  dataSources,
  context: ({ req }) => {

    // simple auth check on every request
    const token = req.headers.authorization;
    console.log("Token is: ", token);
    const user = new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded.email);
      });
    });

    return { user };
  }
});
 
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});