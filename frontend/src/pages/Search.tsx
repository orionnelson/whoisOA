import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const QUERY_SEARCH_COUNTRY = gql`
  query Query($url: String!) {
    website(url: $url) {
      url
      whois {
        creationDate
        domainName
        domainStatus
        expirationDate
        location {
          flagurl
          ip
          network
          org
          position {
            latitude
            longitude
          }
        }
        nameServers {
          name
        }
        registrant {
          address
          city
          country
          email
          name
          organization
          state
          zip
        }
        registrar {
          abuseContactEmail
          abuseContactPhone
          name
          url
          whoisServer
        }
        updatedDate
      }
    }
  }
`;

export function Search() {
  const [urlSearch, setUrlSearch] = useState("");
  const [searchCountry, { data, loading, error }] =
    useLazyQuery(QUERY_SEARCH_COUNTRY);

  interface WhoIS {
    creationDate?: string;
    domainName?: string;
    domainStatus?: string;
    expirationDate?: string;
    location?: {
      flagurl?: string;
      ip?: string;
      network?: string;
      org?: string;
      position?: {
        latitude?: string;
        longitude?: string;
      };
    };
    nameServers?: {
      name?: string;
    };
    registrant?: {
      address?: string;
      city?: string;
      country?: string;
      email?: string;
      name?: string;
      organization?: string;
      state?: string;
      zip?: string;
    };
    registrar?: {
      abuseContactEmail?: string;
      abuseContactPhone?: string;
      name?: string;
      url?: string;
      whoisServer?: string;
    };
    updatedDate?: string;
  }

  const typedData = data as {
    website: {
      url?: string;
      whois?: WhoIS;
    };
  };

  const countryDisplay =
    data && data.website ? (
      <div className="countryDisplay">
        <h1>Url: {data.website.url || ""}</h1>
        <h1>Creation Date: {data.website.whois.creationDate || ""}</h1>
        <h1>Domain Name: {data.website.whois.domainName || ""}</h1>
        <h1>Domain Status: {data.website.whois.domainStatus || ""}</h1>
        <h1>Expiration Date: {data.website.whois.expirationDate || ""}</h1>
        <h1>Flag: {data.website.whois.location.flagurl}</h1>
        <h1>IP: {data.website.whois.location.ip || ""}</h1>
        <h1>Network: {data.website.whois.location.network || ""}</h1>
        <h1>Organization: {data.website.whois.location.org}</h1>
        <h1>Latitude: {data.website.whois.location.position.latitude}</h1>
        <h1>Longitude: {data.website.whois.location.position.longitude}</h1>
        <h1>Name Server 1: {data.website.whois.nameServers[0].name}</h1>
        <h1>Name Server 2: {data.website.whois.nameServers[1].name}</h1>
        <h1>Registrant Name: {data.website.whois.registrant.name}</h1>
        <h1>Registrant Email: {data.website.whois.registrant.email}</h1>
        <h1>
          Registrant Organization: {data.website.whois.registrant.organization}
        </h1>
        <h1>Registrant Address: {data.website.whois.registrant.address}</h1>
        <h1>Registrant City: {data.website.whois.registrant.city}</h1>
        <h1>Registrant State: {data.website.whois.registrant.state}</h1>
        <h1>Registrant Zip: {data.website.whois.registrant.zip}</h1>
        <h1>Registrant Country: {data.website.whois.registrant.country}</h1>
        <h1>Registrar Name: {data.website.whois.registrar.name}</h1>
        <h1>Registrar URL: {data.website.whois.registrar.url}</h1>
        <h1>
          Registrar Abuse Contact Email:{" "}
          {data.website.whois.registrar.abuseContactEmail}
        </h1>
        <h1>
          Registrar Abuse Contact Phone:{" "}
          {data.website.whois.registrar.abuseContactPhone}
        </h1>
        <h1>
          Registrar Whois Server: {data.website.whois.registrar.whoisServer}
        </h1>
        <h1>Updated Date: {data.website.whois.updatedDate}</h1>
      </div>
    ) : (
      <div className="countryDisplay">
        <h3>https://www.example.com or https://www.example.org </h3>
      </div>
    );

  return (
    <div className="search">
      <div className="search-box">
        <input
          type="text"
          className="search-text"
          placeholder="Enter URL from List"
          onChange={(event: any) => {
            setUrlSearch(event.target.value || "");
          }}
        />
        <button
          onClick={() => {
            searchCountry({
              variables: { url: urlSearch },
            });
          }}
        >
          {
            <a className="search-btn">
              <i className="fas fa-search" aria-hidden="true"></i>
            </a>
          }
        </button>
      </div>

      <div className="searchCountry">
        {loading && <h3>Data is loading...</h3>}
        {error && (
          <div className="countryDisplay">
            <h3>{error.message}</h3>
          </div>
        )}
        {countryDisplay}
      </div>
    </div>
  );
}

export default Search;
