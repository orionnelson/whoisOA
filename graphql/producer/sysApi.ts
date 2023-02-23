
import { exec } from "child_process";
import { WhoisResponse } from "../whois-api.js";
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
export async function getWhoisData(domain: string): Promise<WhoisResponse> {
    const command = `whoisjson.exe ${domain}`;
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          resolve({ success: false, error: error?.message ?? stderr ?? "Unknown error" });
        } else {
          try {
            const data : JSON = JSON.parse(stdout);
            resolve({ success: true, data });
          } catch (e) {
            resolve({ success: false, error: "Invalid JSON output" });
          }
        }
      });
    });
  }