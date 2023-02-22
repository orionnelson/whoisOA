import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';



const ports: string = process.env.APOLLO_PORT || '5000'
const port: number = parseInt(ports,10)



interface Registrant {
  name: string;
  email: string;
  organization: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface WHOIS {
  registrar: string;
  creationDate: string;
  expirationDate: string;
  updatedDate: string;
  registrant: Registrant;
}

interface IP {
  address: string;
  whois: WHOIS;
}

interface Website {
  url: string;
  whois: WHOIS;
}
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
/*
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};
*/
const ip_items: IP[] = [
    {
      "address": "192.0.2.1",
      "whois": {
        "registrar": "Example Registrar, Inc.",
        "creationDate": "2010-01-01",
        "expirationDate": "2020-01-01",
        "updatedDate": "2019-12-31",
        "registrant": {
          "name": "John Smith",
          "email": "john.smith@example.com",
          "organization": "Example Company",
          "address": "123 Main St.",
          "city": "Anytown",
          "state": "CA",
          "zip": "12345",
          "country": "US"
        }
      }
    },
    {
      "address": "203.0.113.2",
      "whois": {
        "registrar": "Another Registrar, LLC",
        "creationDate": "2005-06-15",
        "expirationDate": "2025-06-15",
        "updatedDate": "2021-02-22",
        "registrant": {
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "organization": "Another Company",
          "address": "456 Main St.",
          "city": "Anytown",
          "state": "NY",
          "zip": "67890",
          "country": "US"
        }
      }
    }
  ];

const website_items: Website[] = [
    {
      "url": "example.com",
      "whois": {
        "registrar": "Example Registrar, Inc.",
        "creationDate": "1995-03-14",
        "expirationDate": "2025-03-15",
        "updatedDate": "2021-02-22",
        "registrant": {
          "name": "John Smith",
          "email": "john.smith@example.com",
          "organization": "Example Company",
          "address": "123 Main St.",
          "city": "Anytown",
          "state": "CA",
          "zip": "12345",
          "country": "US"
        }
      }
    },
    {
      "url": "example.net",
      "whois": {
        "registrar": "Another Registrar, LLC",
        "creationDate": "1997-06-05",
        "expirationDate": "2022-06-06",
        "updatedDate": "2021-02-22",
        "registrant": {
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "organization": "Another Company",
          "address": "456 Main St.",
          "city": "Anytown",
          "state": "NY",
          "zip": "67890",
          "country": "US"
        }
      }
    }
  ];

  const resolvers = {
    Query: {
      ip: (_parent: any, args: { address: string }) => {
        return ip_items.find((ip) => ip.address === args.address) ?? null;
      },
      website: (_parent: any, args: { url: string }) => {
        return website_items.find((site) => site.url === args.url) ?? null;
      },
    },
  };
  
  
  
  
  


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: port },
});

//console.log(`🚀  Server ready at: ${url}`);