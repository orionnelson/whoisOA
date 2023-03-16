import subprocess

def domain_nslookup(domain: str):
    return subprocess.run(['nslookup', domain], capture_output=True, text=True)

def domain_whoislookup(domain: str):
    return subprocess.run(['whois', domain], capture_output=True, text=True)

def extract_ips(nsresult: list):
    ns_important = [line for line in nsresult.stdout.split("answer",1)[-1].splitlines() if "Address:" in line]
        # Get the ip address from the Address: line
    ips = [line.split(":",1)[-1].strip() for line in ns_important]
    return ips