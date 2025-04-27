import requests
import re

def get_google_maps_data(link: str):
    try:
        # Resolve short links
        if 'goo.gl' in link or 'maps.app.goo.gl' in link:
            response = requests.get(link, allow_redirects=True)
            link = response.url

        # Extract latitude/longitude
        match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', link)
        lat, lng = None, None
        if match:
            lat = float(match.group(1))
            lng = float(match.group(2))
        
        # Extract place name from URL
        name = None
        name_match = re.search(r'/place/([^/@]+)', link)
        if name_match:
            name = name_match.group(1).replace('+', ' ').replace('%C4%83', 'ă').replace('%C3%A2', 'â')

        # No address and city parsing yet
        city = None
        address = None

        return {
            'name': name,
            'address': address,
            'city': city,
            'latitude': lat,
            'longitude': lng
        }
    except Exception as e:
        print(f"Failed to extract Google Maps data: {e}")
        return None
