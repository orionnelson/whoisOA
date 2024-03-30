import fs from "fs";
import path from "path";
import sift from "sift";
import { fileURLToPath } from "url";
import gql from 'graphql-tag';
import { getCachedResponse, saveToCache } from './database.js';
// Read the schema file
import {WhoisAPI} from './whois-api.js'

const schema = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "./schema.graphqls"),
  "utf8"
);

export const typeDefs = gql(schema);

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
    
    export function mapJsonToSchema(json: any): WHOIS {
      // Default values for location and IP details in case they are missing
      const defaultLocation = { latitude: null, longitude: null, accuracy_radius: Infinity };
      const defaultIpDetails = { ip: null, asn_subnet: null, asn_name: null, flag_url: null };
    
      // Safely attempt to access IPv4 and IPv6 details, defaulting to safe values if missing
      const ipv4Location = json.ipv4?.location || defaultLocation;
      const ipv6Location = json.ipv6?.location || defaultLocation;
      let bestLocation = ipv4Location.accuracy_radius <= ipv6Location.accuracy_radius ? ipv4Location : ipv6Location;
    
      // Check for the existence of latitude and longitude before converting to string
      const position: Position = {
        latitude: bestLocation.latitude?.toString() || null,
        longitude: bestLocation.longitude?.toString() || null,
      };
      console.log(`[schemats] mapped to position : ${JSON.stringify(position, null, 2)}`);
    
      const ipv4Details = json.ipv4 || defaultIpDetails;
      const ipv6Details = json.ipv6 || defaultIpDetails;
    
      const location: Location = { 
        position,
        ip: ipv4Details.ip || ipv6Details.ip, 
        network: ipv4Details.asn_subnet || ipv6Details.asn_subnet, 
        org: ipv4Details.asn_name || ipv6Details.asn_name, 
        flagurl: ipv4Details.flag_url || ipv6Details.flag_url
      };
      console.log(`[schemats] mapped to location : ${JSON.stringify(location, null, 2)}`);
    
      const nameServers: NameServer[] = json.domain?.name_server?.map((ns: string) => ({ name: ns })) || [];
      //const nameServers: NameServer[] = json.domain.name_server.map((ns: string) => ({ name: ns }));
    
      const registrar: Registrar = {
        name: json.domain?.registrar || null,
        url: json.domain?.registrar_url || null,
        abuseContactEmail: json.domain?.registrar_abuse_contact_email || null,
        abuseContactPhone: json.domain?.registrar_abuse_contact_phone || null,
        whoisServer: json.domain?.registrar_whois_server || null,
      };
  
      const registrant: Person = {
        name: json.domain?.registrant_name || json.domain?.admin_name || null,
        email: json.domain?.registrant_email || json.domain?.admin_email || null,
        organization: json.domain?.registrant_organization || json.domain?.admin_organization || null,
        address: json.domain?.registrant_street || json.domain?.admin_street || null,
        city: json.domain?.registrant_city || json.domain?.admin_city || null,
        state: json.domain?.registrant_state || json.domain?.tech_state || null, // Assuming tech state as a fallback
        zip: json.domain?.registrant_postal_code || json.domain?.admin_postal_code || null,
        country: json.domain?.registrant_country || json.domain?.admin_country || null,
      };

      
      const whois: WHOIS = { 
        domainName: json.domain?.domain_name || null,
        domainStatus: json.domain?.domain_status ? json.domain.domain_status.toString() : null,
        registrar , 
        creationDate: json.domain?.creation_date || null, 
        expirationDate: json.domain?.registry_expiry_date|| null, 
        updatedDate: json.domain?.updated_date || null, 
        location, 
        registrant, 
        nameServers 
      };
/*
      const whois: WHOIS = { 
        location, // Assuming the location part is unchanged and required
        // Conditional properties
        ...(json.domain?.domain_name && { domainName: json.domain.domain_name }),
        ...(json.domain?.domain_status && { domainStatus: json.domain.domain_status.toString() }),
        ...(Object.keys(registrar).length > 0 && { registrar }), // Include registrar only if it has any non-null properties
        ...(json.domain?.creation_date && { creationDate: json.domain.creation_date }),
        ...(json.domain?.registry_expiry_date && { expirationDate: json.domain.registry_expiry_date }),
        ...(json.domain?.updated_date && { updatedDate: json.domain.updated_date }),
        ...(nameServers.length > 0 && { nameServers }), // Include nameServers only if it's not empty
        ...(json.domain?.registrant_organization && {registrant}), // Include registrant only if it has any non-null properties
      };
*/

      
      
    
      return whois;
    }
    
    export const resolvers = {
      Query: {
        ip: async (_:any, { address }: { address: string }, { dataSources }: { dataSources: any }) => {
          // Fetch WHOIS information for the given address
          const cacheKey = `ip-${address}`;
          const cachedData = await getCachedResponse(cacheKey); // 30 days
          if (cachedData) {
            // Return the cached response if it exists
            return { address, whois: cachedData };
          }


          const response = await dataSources.whoisAPI.getInformation(address);
          if (response.success && response.data) {
            // Assuming mapJsonToSchema function properly maps the API response to your schema
            const whois = mapJsonToSchema(response.data);
            await saveToCache(cacheKey, whois,30);
            return { address, whois };
          } else {
            return null;
          }
        },
        website: async (_:any, { url }: { url: string }, { dataSources }: { dataSources: any }) => {
          // Fetch WHOIS information for the given URL
            // Assuming mapJsonToSchema function properly maps the API response to your schema
          const cacheKey = `website-${url}`;
          const cachedData = await getCachedResponse(cacheKey);
          if (cachedData) {
            // Return the cached response if it exists
            return { url, whois: cachedData };
          }
          const response = await dataSources.whoisAPI.getInformation(url);
          if (response.success && response.data) {
            const whois = mapJsonToSchema(response.data);
            await saveToCache(cacheKey, whois,30); // 30 days
            return { url, whois };
          } else {
            return null;
          }
        },
      },
    };
