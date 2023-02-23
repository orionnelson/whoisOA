import axios from 'axios';
import { exec } from "child_process";

const RAPID_URL: string = process.env.RAPID_URL || 'https://zozor54-whois-lookup-v1.p.rapidapi.com/';
const RAPID_API_KEY: string = process.env.RAPID_API_KEY || '19203890a0mshca2208a05d2faebp1672cbjsn9f8b57686452';
const RAPID_API_HOST: string = process.env.RAPID_API_HOST || 'zozor54-whois-lookup-v1.p.rapidapi.com';


interface WhoisData {
  [key: string]: string;
}

interface WhoisResponse {
  success: boolean;
  data?: WhoisData;
  error?: string;
}


// Example usage: request info for "sendrank.com"
/*
requestIporDomain('sendrank.com')
  .then((data) => {
    console.log(data);
  });
*/
export async function requestIporDomain(address: string): Promise<WhoisResponse> {
  const options = {
    method: 'GET',
    url: RAPID_URL,
    params: { domain: address, format: 'json' },
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': RAPID_API_HOST
    }
  };

  try {
    const response = await axios.request(options);
    if (response.status === 200) {
      const raw_data = response.data;
      let data;
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
}
/*
async function main() {
  const domain = "example.com";
  const response = await getWhoisData(domain);
  if (response.success && response.data) {
    // Use the retrieved whois data
    console.log(response.data);
  } else {
    // Handle the error
    console.log(response.error);
  }
}*/
async function getWhoisData(domain: string): Promise<WhoisResponse> {
  const command = `whoisjson.exe ${domain}`;
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        resolve({ success: false, error: error?.message ?? stderr ?? "Unknown error" });
      } else {
        try {
          const data = JSON.parse(stdout);
          resolve({ success: true, data });
        } catch (e) {
          resolve({ success: false, error: "Invalid JSON output" });
        }
      }
    });
  });
}