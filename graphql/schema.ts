import fs from "fs";
import path from "path";
import sift from "sift";
import { fileURLToPath } from "url";
import gql from 'graphql-tag';
// Read the schema file
import {WhoisAPI} from './whois-api.js'

const schema = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "./schema.graphqls"),
  "utf8"
);

export const typeDefs = gql(schema);
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
  interface IP {
    address: string;
    whois: WHOIS;
    }
    
    interface Website {
    url: string;
    whois: WHOIS;
    }
    
    interface WHOIS {
    domainName?: string;
    domainStatus?: string;
    registrar?: Registrar;
    creationDate?: string;
    expirationDate?: string;
    updatedDate?: string;
    location?: Location;
    registrant?: Person;
    nameServers?: NameServer[];
    }
    
    interface NameServer {
    name?: string;
    }
    
    interface Registrar {
    name?: string;
    url?: string;
    abuseContactEmail?: string;
    abuseContactPhone?: string;
    whoisServer?: string;
    }
    
    interface Location {
    position?: Position;
    ip?: string;
    network?: string;
    org?: string;
    flagurl?: string;
    }
    
    interface Position {
    latitude?: string;
    longitude?: string;
    }
    
    interface Person {
    name?: string;
    email?: string;
    organization?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    }

    interface QueryResult {
      ip: IP | null;
      website: Website | null;
    }
    
  /*
  // A schema is a collection of type definitions (hence "typeDefs")
  // that together define the "shape" of queries that are executed against
  // your data.
  export const typeDefs = `#graphql
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
  export const resolvers = {
    Query: {
      books: () => books,
    },
  };
  */
  const ip_items: IP[] = [
    {
      "address": "192.0.2.1",
      "whois": {
        "domainName": "EXAMPLE.COM",
        "domainStatus": "clientTransferProhibited https://icann.org/epp#clientTransferProhibited",
        "registrar": {
          "name": "Registrar, Inc.",
          "url": "http://www.registrar.example",
          "abuseContactEmail": "abuse@example.com",
          "abuseContactPhone": "+1.5555555555",
          "whoisServer": "whois.registrar.example"
        },
        "creationDate": "1995-08-14T04:00:00Z",
        "expirationDate": "2022-08-13T04:00:00Z",
        "updatedDate": "2021-08-15T04:00:00Z",
        "location": {
          "position": {
            "latitude": "37.751",
            "longitude": "-97.822"
          },
          "ip": "192.0.2.1",
          "network": "192.0.2.0/24",
          "org": "Example Corp.",
          "flagurl": "https://ipworld.info/static/flags/us.png"
        },
        "registrant": {
          "name": "John Doe",
          "email": "johndoe@example.com",
          "organization": "Example Corp.",
          "address": "123 Main St.",
          "city": "Anytown",
          "state": "CA",
          "zip": "90210",
          "country": "US"
        },
        "nameServers": [
          {
            "name": "ns1.example.com"
          },
          {
            "name": "ns2.example.com"
          }
        ]
      }
    },
    {
      "address": "203.0.113.1",
      "whois": {
        "domainName": "EXAMPLE.NET",
        "domainStatus": "clientHold https://icann.org/epp#clientHold",
        "registrar": {
          "name": "Registrar, Inc.",
          "url": "http://www.registrar.example",
          "abuseContactEmail": "abuse@example.com",
          "abuseContactPhone": "+1.5555555555",
          "whoisServer": "whois.registrar.example"
        },
        "creationDate": "2000-01-01T00:00:00Z",
        "expirationDate": "2023-01-01T00:00:00Z",
        "updatedDate": "2022-01-01T00:00:00Z",
        "location": {
          "position": {
            "latitude": "35.6895",
            "longitude": "139.6917"
          },
          "ip": "203.0.113.1",
          "network": "203.0.113.0/24",
          "org": "Example Corp.",
          "flagurl": "https://ipworld.info/static/flags/jp.png"
        },
        "registrant": {
          "name": "Jane Smith",
          "email": "janesmith@example.net",
          "organization": "Example Corp.",
          "address": "456 Second St.",
          "city": "Anytown",
          "state": "CA",
          "zip": "90210",
          "country": "US"
        },
        "nameServers": [
          {
            "name": "ns1.example.net"
          },
          {
            "name": "ns2.example.net"
          }
        ]
      }
    }
    ];
  
  const website_items: Website[] = [
      {
        "url": "https://www.example.com",
        "whois": {
          "domainName": "example.com",
          "domainStatus": "clientTransferProhibited https://icann.org/epp#clientTransferProhibited",
          "registrar": {
            "name": "Registrar Name",
            "url": "https://www.registrar.com",
            "abuseContactEmail": "abuse@registrar.com",
            "abuseContactPhone": "+1.1234567890",
            "whoisServer": "whois.registrar.com"
          },
          "creationDate": "2020-01-01T00:00:00Z",
          "expirationDate": "2022-01-01T00:00:00Z",
          "updatedDate": "2021-01-01T00:00:00Z",
          "location": {
            "position": {
              "latitude": "37.7749",
              "longitude": "-122.4194"
            },
            "ip": "192.0.2.1",
            "network": "192.0.2.0/24",
            "org": "Example Inc.",
            "flagurl": "https://ipworld.info/static/flags/us.png"
          },
          "registrant": {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "organization": "Example Inc.",
            "address": "123 Main St.",
            "city": "San Francisco",
            "state": "CA",
            "zip": "94105",
            "country": "US"
          },
          "nameServers": [
            {
              "name": "ns1.example.com"
            },
            {
              "name": "ns2.example.com"
            }
          ]
        }
      },
      {
        "url": "https://www.example.org",
        "whois": {
          "domainName": "example.org",
          "domainStatus": "clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited",
          "registrar": {
            "name": "Registrar Name",
            "url": "https://www.registrar.org",
            "abuseContactEmail": "abuse@registrar.org",
            "abuseContactPhone": "+1.9876543210",
            "whoisServer": "whois.registrar.org"
          },
          "creationDate": "2010-05-01T00:00:00Z",
          "expirationDate": "2025-05-01T00:00:00Z",
          "updatedDate": "2022-01-01T00:00:00Z",
          "location": {
            "position": {
              "latitude": "51.5074",
              "longitude": "-0.1278"
            },
            "ip": "203.0.113.1",
            "network": "203.0.112.0/22",
            "org": "Example Organization",
            "flagurl": "https://ipworld.info/static/flags/gb.png"
          },
          "registrant": {
            "name": "Jane Smith",
            "email": "jane.smith@example.org",
            "organization": "Example Organization",
            "address": "1 Oxford St.",
            "city": "London",
            "state": "",
            "zip": "W1D 1LD",
            "country": "GB"
          },
          "nameServers": [
            {
              "name": "ns1.example.org"
            },
            {
              "name": "ns2.example.org"
            }
          ]
        }
      }
    ];
    // Map Our Json Fields that we want to display to our Schema
    function mapJsonToSchema(json: any): WHOIS {
      const position: Position = { latitude: json.latitude, longitude: json.longitude };
      const location: Location = { position, ip: json.ip, network: json.network, org: json.org, flagurl: json.flag };
      const nameServer: NameServer = { name: json.name_server };
      const registrar: Registrar = { name: json.registrar_url, url: json.registrar_url, abuseContactEmail: json.registrar_abuse_contact_email, abuseContactPhone: json.registrar_abuse_contact_phone, whoisServer: json.registrar_whois_server };
      const registrant: Person = { name: json.registrant_name, email: json.registrant_email, organization: json.registrant_organization, address: json.registrant_street, city: json.registrant_city, state: json.registrant_state, zip: json.registrant_postal_code, country: json.registrant_country };
      const nameServers: NameServer[] = [nameServer];
      const whois: WHOIS = { domainName: json.domain_name, domainStatus: json.domain_status, registrar, creationDate: json.creation_date, expirationDate: json.registry_expiry_date, updatedDate: json.updated_date, location, registrant, nameServers };
      return whois;
    }

    export const resolvers = {
      Query: {
        ip: async (_parent: any, args: { address: string }) => {
          const whoisAPI = new WhoisAPI();
          const result = await whoisAPI.getInformation(args.address);
          if (result.success && result.data) {
            const whois = mapJsonToSchema(result.data);
            const ip = { address: args.address, whois };
            ip_items.push(ip);
            return ip;
          } else {
            return null;
          }
        },
        website: async (_parent: any, args: { url: string }) => {
          const whoisAPI = new WhoisAPI();
          const result = await whoisAPI.getInformation(args.url);
          if (result.success && result.data) {
            const whois = mapJsonToSchema(result.data);
            const website = { url: args.url, whois };
            website_items.push(website);
            return website;
          } else {
            return null;
          }
        },
      },
    };

