import axios from 'axios';
import { WhoisResponse } from '../whois-api.js';
const RAPID_URL: string = process.env.RAPID_URL || 'https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation';
const RAPID_API_KEY: string = process.env.RAPID_API_KEY || '19203890a0mshca2208a05d2faebp1672cbjsn9f8b57686452';
const RAPID_API_HOST: string = process.env.RAPID_API_HOST || 'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com';

  // Example usage: request info for "sendrank.com"
/*
reqRapidWhois('sendrank.com')
  .then((data) => {
    console.log(data);
  });
*/
  export async function reqRapidWhois(address: string): Promise<WhoisResponse> {
    const options = {
      method: 'GET',
      url: RAPID_URL,
      params: { domai: address, format: 'json', apikey: '873dbe322aea47f89dcf729dcc8f60e8' },
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      }
    };
  
    try {
      const response = await axios.request(options);
      if (response.status === 200) {
        const raw_data = response.data;
        const data;
        try {
          data = JSON.parse(raw_data);
        } catch (error) {
          return { success: false, error: "Invalid JSON data received from API" };
        }
        if (data && data.Registrar) {
          return { success: true, data };
        } else {
          return { success: false, error: "No whois information found for the domain" };
        }
      } else {
        return { success: false, error: "Unexpected response status code: " + response.status };
      }
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };