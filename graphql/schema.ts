/*
export const resolvers = {
    Query: {
      ip: async (_: any, { address }: { address: string }, { dataSources }: { dataSources: any }) => {
        return dataSources.whoisAPI.getIP(address);
      },
      website: async (_: any, { url }: { url: string }, { dataSources }: { dataSources: any }) => {
        return dataSources.whoisAPI.getWebsite(url);
      },
    },
  };
  */

export const typeDefs =`#graphql
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
  }`;