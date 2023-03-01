from flask import Flask, request
from whois import process_whois_content
from whois_utils import dump_json, sanitize_input, matches_ip, matches_url
from geoloader import GeoIP
import json
app = Flask(__name__)

@app.route('/<domain>', methods=['GET'])
def whois(domain):
    # Route is either a domain or an ip address
    # If it is an ip address, we need to get the domain whois information for the ip and then geoip
    # If it is a domain, we need to get the whois information for the domain and then nslookup for ip and geoip
    import subprocess
    ips = []
    # Array For Capturing Whois Results
    default_save_string = "domain"
    whoisresults = {}
    try:
        domain = sanitize_input(domain)
    except Exception as e:
        #Sanitize input failed domain is not valid ip or domain
        return str(e), 500
    if matches_url(domain):
        nsresult = subprocess.run(['nslookup', domain], capture_output=True, text=True)
        # Look for the Address: line in the nslookup output
        if nsresult.returncode != 0:
            return str(nsresult.stderr), 500
        else:
            try:
                ns_important = [line for line in nsresult.stdout.split("answer",1)[-1].splitlines() if "Address:" in line]
                # Get the ip address from the Address: line
                ips = [line.split(":",1)[-1].strip() for line in ns_important]
            except Exception as e:
                return str(e), 500
        # Get the whois information for the ip address
    # Return Code is not 0, return the error
    else:
        default_save_string = "ipv4"

    result = subprocess.run(['whois', domain], capture_output=True, text=True)
    if result.returncode != 0:
        return str(result.stderr), 500
    else:
        output_dict = process_whois_content(str(result.stdout))
        # Add to the whois result dictionary the domain as a dictionary key
        if ips:
            output_dict['ips'] = ips
            # Get the geoip information for the ip address
            for ip in ips:
                try:
                    geoip = GeoIP(ip)
                    # Create a new GeoIP object for each ip and then call the
                    # get_geoip_json_content method to get the geoip information
                    if matches_ip(ip):
                        d_string = "ipv4"
                    else:
                        d_string = "ipv6"

                    whoisresults[d_string]=geoip.format_json()
                except Exception as e:
                    print(e)
        # Called on both Ip and Domain 
        if default_save_string == "ipv4":
            # Join output dict with geoip dict for ipv4
            output_dict = output_dict | GeoIP(domain).to_dict() 
        whoisresults[default_save_string] = output_dict
        return whoisresults, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)