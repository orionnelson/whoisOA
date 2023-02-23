import React from 'react'
import {useQuery, gql} from '@apollo/client'
import { Link } from 'react-router-dom';

export function Home() {

// Stupid Caps Notation 
const QUERY_LIST_OF_COUNTRIES = gql`
{
countries{
  name
  capital
  emoji
}
}`;
  // Information about the query
  const {data, loading, error} = useQuery(QUERY_LIST_OF_COUNTRIES)
  return (
    <div className="home">Home
    <h1> List of Countries</h1>
    <Link to={"/search"}> Search for Country </Link>
    <div className="listOfCountries">
      {loading && <h3>Data is loading...</h3>}
      {error && <h3>{error.message}</h3>}
      {data && data.countries && data.countries.map((country: any, key: any) => {
        return (
        <div key={key} className="country">
          <h2>
            {country.name}
          </h2>
          <h4>
            {country.capital} {country.emoji}
          </h4>
          </div>
          );
})};
    </div>
    </div>
  );
}

export default Home