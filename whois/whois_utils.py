import regex
import os
import subprocess
import json
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
WHOIS_PATH = os.path.join(DIR_PATH,'dsource' ,  'whois.exe')
REGEX_IP = r'^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$'
REGEX_URL = r'^(https?://)?([\da-z.-]+).([a-z.]{2,6})([/\w .-])/?$'
REGEX_WHOIS_ENTRY = r'[a-zA-Z ]*: .*'

def remove_control_characters(dictionary):
    """Removes all control characters from a dictionary"""
    control_chars = ''.join(map(chr, range(0, 32))) + ''.join(map(chr, range(127, 160)))
    table = str.maketrans(dict.fromkeys(control_chars))
    cleaned_dict = {}
    for key, value in dictionary.items():
        if isinstance(value, dict):
            cleaned_dict[key] = remove_control_characters(value)
        elif isinstance(value, str):
            cleaned_dict[key] = value.translate(table)
        else:
            cleaned_dict[key] = value
    return cleaned_dict

def matches_ip(string: str):
    return regex.match(REGEX_IP, string)
def matches_url(string: str):
    return regex.match(REGEX_URL, string)

def matches_whois(string: str):
    return regex.match(REGEX_WHOIS_ENTRY, string)

def dump_json(d_str: dict):
    cleaned_dict = remove_control_characters(d_str)
    dict_string = ""
    dict_string = json.dumps(cleaned_dict, sort_keys=True)
    return dict_string

def sanitize_input(input_str: str):
    print(input_str)
    # Regular expression to check if the input is a valid IP address or URL
    # Check if the input matches either the IP or URL regex
    if matches_ip(input_str) or matches_url(input_str):
        return input_str
    else:
        raise ValueError("Input must be a valid IP address or URL")


def format_snake(string: str):
    # Determint if 🐫 or upper and convert to 🐍
    string = string.strip()
    if " " in string:
        return space_to_snake_case(string)
    elif not string.islower():
        # CapsLock capsLock CAPSLOCK
        if string.isupper():
            #CAPSLOCK
            return string.lower()
        else:
            #capsLock or CapsLock -> caps_lock
            return camel_to_snake_case(string)
    else:
        # capslock
        return string

def space_to_snake_case(string: str):
    return string.replace(" ", "_").lower()

def camel_to_snake_case(string: str):
    return regex.sub(r'(?<!^)(?=[A-Z])', '_', string).lower()


def open_whois_pipe(name: str):
    result = subprocess.run([WHOIS_PATH,"-nobanner", name], capture_output=True, text=True)
    return result

def dictTuple(listTuple: list, important_keys: list):
    #(wanted,addlist)
    #(not_wanted,dictassignment)
    d = {}
    for key, value in listTuple:
        if key in important_keys:
            if key in d and isinstance(d[key], list):
                d[key].append(value)
            elif key in d and not isinstance(d[key], list):
                d[key] = [d[key], value]
            else:
                d[key] = value
        else:
            d[key] = value
    return d