export const resolvers = {
    Query: {
      ip: async (_, { address }, { dataSources }) => {
        return dataSources.whoisAPI.getIP(address);
      },
      domain: async (_, { name }, { dataSources }) => {
        return dataSources.whoisAPI.getDomain(name);
      },
    },
  };

export const typeDefs = `
  type IP {
    address: String!
    whois: WHOIS!
  }

  type Website {
    url: String!
    whois: WHOIS!
  }

  type WHOIS {
    registrar: String
    creationDate: String
    expirationDate: String
    updatedDate: String
    registrant: Registrant
  }

  type Registrant {
    name: String
    email: String
    organization: String
    address: String
    city: String
    state: String
    zip: String
    country: String
  }

  type Query {
    ip(address: String!): IP
    website(url: String!): Website
  }

    type Movie {
      id: ID!
      title: String!
      year: Int!
    }
  
    type User {
      id: ID!
      name: String!
      email: String!
    }
  
    type Query {
      movie(id: ID!): Movie
      movies(year: Int): [Movie]
      user(id: ID!): User
    }
  
    type Mutation {
      createUser(name: String!, email: String!): User
      updateUser(id: ID!, name: String, email: String): User
      deleteUser(id: ID!): User
    }
  `;
  /*
  type Movie {
    id: ID!
    title: String!
    year: Int!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    movie(id: ID!): Movie
    movies(year: Int): [Movie]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): User
  }*/