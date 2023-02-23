
import { RESTDataSource } from '@apollo/datasource-rest';
import {reqRapidWhois} from './producer/rapidApi.js'
import {getWhoisData} from './producer/sysApi.js'
export interface WhoisData {
  [key: string]: string;
}
export interface WhoisResponse {
  success: boolean;
  data?: WhoisData;
  error?: string;
}
class WhoisAPI extends RESTDataSource {
// combine both data sources into one json object and return it
async getInformation(address: string): Promise<WhoisResponse> {
  const response = await getWhoisData(address);
  if (response.success && response.data) {
    // Use the retrieved whois data
    const whoisData = response.data;

    // Wait for the response from the RapidapiAPI
    const rapidApiResponse = await reqRapidWhois(address);
    if (rapidApiResponse.success && rapidApiResponse.data) {
      // Combine the data from both sources
      const combinedData = { ...whoisData, ...rapidApiResponse.data };
      return { success: true, data: combinedData };
    } else {
      // Handle the error from the RapidAPI call
      return { success: false, error: rapidApiResponse.error };
    }
  } else {
    // Handle the error from the sysApi call
    return { success: false, error: response.error };
  }
}
}