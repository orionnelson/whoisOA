import geoip2.database
import pickle as pkl

DEBUG = False


def pickle_load(file):
    try:
        return pkl.load(open(file, "rb"))
    except:
        return None
    

def get_city_info(ip):
    with geoip2.database.Reader('/app/GeoIP/GeoLite2-City.mmdb') as reader:
                response = reader.city(ip)
    return response

def get_asn_info(ip): 
    with geoip2.database.Reader('/app/GeoIP/GeoLite2-ASN.mmdb') as reader:
                response = reader.asn(ip)
    return response

def get_city():
        return pickle_load("city.pkl")

def get_asn():
        return pickle_load("asn.pkl")

class GeoIP:
    def __init__(self,ip):
        self.ip = ip
        self.city = None
        self.country_code = None
        self.country = None
        self.flag_url = None
        self.location = None
        self.state = None
        self.postal_code = None
        self.state_code = None
        self.asn_number = None
        self.asn_name = None
        self.asn_subnet = None
        self.load()

    def load(self):
        try:
            if not DEBUG:
                response = get_city_info(self.ip)
            else:
                response = get_city()
                print(str(response).replace("\{","\n\{"))
            if response.city is not None:
                self.country_code = response.country.iso_code
                self.country = response.country.name
                self.flag_url = "https://countryflagsapi.com/svg/%s" % self.country_code.lower()
                self.city = response.city.name
                self.location = response.raw.get("location")
                state_index = response.raw.get("subdivisions")[-1]
                print(str(response.raw.get("subdivisions")[-1]['names']['en']))
                self.state = state_index['names']['en']
                self.postal_code = response.postal.code
                self.state_code = state_index['iso_code']
                self.subnet = str(response.traits.network)
        except Exception as e:
            print(e)
            print("Failed to open City Database")

        try:
            if not DEBUG:
                response = get_asn_info(self.ip)
            else:
                response = get_asn()

            if response.autonomous_system_number is not None:
                self.asn_number = response.autonomous_system_number
                self.asn_name = response.autonomous_system_organization
                self.asn_subnet =str(response.network)
        except Exception as e:
            print(e)
            print("Failed to open ASN Database")

    def to_dict(self):
        return self.__dict__

    def format_json(self):
        return {
                "ip": self.ip,
                "city": self.city,
                "country_code": self.country_code,
                "country": self.country,
                "flag_url": self.flag_url,
                "location": self.location,
                "state": self.state,
                "postal_code": self.postal_code,
                "state_code": self.state_code,
                "asn_number": self.asn_number,
                "asn_name": self.asn_name,
                "asn_subnet": self.asn_subnet
            }


if __name__ == "__main__":
    DEBUG = True
    geo = GeoIP("216.128.176.132")
    #print all geoip fields and values for the IP address
    json = geo.format_json()
    print(json)
    #print(list(geo.__dict__.items()))