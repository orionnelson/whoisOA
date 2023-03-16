
import sys
from whois_utils import sanitize_input, open_whois_pipe, matches_whois, dump_json, format_snake, dictTuple
SPECIAL_WHOIS_ENTRIES = ["name_server","domain_status"]
BANNED_RESPONSES = ["redacted", "ask the registrar", "not authorized", "transmission of mass", "you may use this data only","not available","private"] 
# Path: dsource/whois.exe
def whois (name :str):
    output = ""
    if sanitize_input(name):
       output = str(open_whois_pipe(name).stdout)
    return output

#allen = whois("allenfort.ca")

# Takes in a list of lines and only returns important lines
def process_whois_content(content: str):
      banned = BANNED_RESPONSES
      dictionary = {}
      #Returns lines not in with banned word matching [a-zA-Z ]*: .*
      lines = [line.replace("_"," ") for line in list(set(content.splitlines())) if not any(word in line.lower() for word in banned) and line.strip() != "" and matches_whois(line)]
      # Creates Dictionary Replacing split by : with key and value
      # List Tuple Comprehension: Replaces spaces with snake_case and lowercases or replace CamelCase with snake_case
      tupleEntries = [(" ".join(format_snake(line.split(":",1)[0]).split())," ".join(str(line.split(":",1)[-1].strip()).split())) for line in lines if len(line.split(":",1)[-1]) > 1]
      dict_Entries = dictTuple(tupleEntries,SPECIAL_WHOIS_ENTRIES)
      #Dict Key Formatting: Replaces spaces with snake_case and lowercases or replace CamelCase with snake_case
      #dict_Entries = {" ".join(format_snake(line.split(":",1)[0]).split()):" ".join(str(line.split(":",1)[-1].strip()).split()) for line in lines if len(line.split(":",1)[-1]) > 1}
      return dict_Entries
    
def get_whois_json_content(address: str):
    content = whois(address)
    #print(content)
    if content:
        #print(content)
        dict_allen = process_whois_content(content)
       # print(dict_allen)
        dict_allen_json = dump_json(dict_allen)
        return dict_allen_json if dict_allen_json else None, dict_allen if dict_allen else None  
    else:
        raise Exception("No content found or Invalid input")
    
if __name__ == '__main__':
    input_value = str(sys.argv[1])
    try:
        output_json, output_dict = get_whois_json_content(input_value)
        print(output_json)
    except Exception as e:
        print(e)
        print("Failed NS Lookup of Domain")