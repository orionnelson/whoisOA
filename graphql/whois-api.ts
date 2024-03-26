
import { RESTDataSource } from '@apollo/datasource-rest';
//import {reqRapidWhois} from './producer/rapidApi.js';
import { reqWhois } from './producer/lnetApi.js';
//import {getWhoisData} from './producer/sysApi.js'
export interface WhoisData {
  [key: string]: string;
}
export interface WhoisResponse {
  success: boolean;
  data?: WhoisData;
  error?: string;
}
export class WhoisAPI extends RESTDataSource {

// combine both data sources into one json object and return it
async getInformation(address: string): Promise<WhoisResponse> {
  //const response = await getWhoisData(address);
  console.log(`Fetching WHOIS information for address: ${address}`);
  //if (response.success && response.data) {
  // Use the retrieved whois data
    // Wait for the response from the RapidapiAPI
    const lApiResponse = await reqWhois(address);
    console.log(`data loaded: ${lApiResponse.data} `);
    if (lApiResponse.success && lApiResponse.data) {
      // Combine the data from both sources
      return { success: true, data: lApiResponse.data };
    } else {
      // Handle the error from the RapidAPI call
      return { success: false, error: lApiResponse.error };
    }
}
}