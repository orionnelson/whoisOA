import axios from 'axios';
import { WhoisResponse } from '../whois-api.js';

const L_API_URL: string = process.env.L_API_URL || 'http://54.144.106.14:5001'; // Random AWS Test API Don't Ask 

export async function reqWhois(address: string): Promise<WhoisResponse> {
    const options = {
        method: 'GET',
        url: `${L_API_URL}/${address}`
    };

    console.log(`[reqWhois] Requesting WHOIS data for: ${address}`);

    try {
        const response = await axios.request(options);
        console.log(`[reqWhois] Request options: ${JSON.stringify(options)}`);
        console.log(`[reqWhois] Response status: ${response.status}`);

        if (response.status !== 200) {
            console.error(`[reqWhois] Unexpected response status code: ${response.status}`);
            return { success: false, error: "Unexpected response status code: " + response.status };
        }

        let data;
        try {
            data = response.data;
            console.log(`[reqWhois] Data loaded: ${JSON.stringify(data, null, 2)} `);
            console.log(`[reqWhois] Parsed data successfully. Main Entries count: ${Object.keys(data).toString()} len: ${Object.keys(data).length}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
            console.error(`[reqWhois] Error parsing JSON response: ${error.message}`);
            return { success: false, error: "Invalid JSON data received from API" };
            }else{
              console.log('An unexpected error occurred:', error);
              return { success: false, error: '' };
            }
        }

        if (!data) {
            console.error(`[reqWhois] No whois information found for the domain.`);
            return { success: false, error: "No whois information found for the domain" };
        }
        console.log(`[reqWhois] Returned Successful Data.`)
        return { success: true, data };

    } catch (error) {
        if (error instanceof Error) {
        console.error(`[reqWhois] Error making request: ${error.message}`);
        return { success: false, error: error.message };
        }else{
            console.log('An unexpected error occurred:', error);
            return { success: false, error: '' };
        }
    }
}
