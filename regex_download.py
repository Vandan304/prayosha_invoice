import requests
import re
import os
from PIL import Image
from rembg import remove
import io

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

def extract_and_download(url, regex_pattern, output_path):
    print(f"Scraping: {url}")
    try:
        html = requests.get(url, headers=headers).text
        matches = re.findall(regex_pattern, html)
        if matches:
            img_url = matches[0]
            if img_url.startswith('//'):
                img_url = 'https:' + img_url
            print(f"Found image URL: {img_url}")
            
            img_data = requests.get(img_url, headers=headers).content
            print(f"Downloaded. Removing background...")
            output_img = remove(img_data)
            
            img = Image.open(io.BytesIO(output_img))
            img.save(output_path, 'PNG')
            print(f"Successfully saved {output_path}")
        else:
            print("No matching images found for Regex rules.")
    except Exception as e:
        print(f"Failed: {str(e)}")

print("--- PSM ---")
extract_and_download('https://shoppershine.com/product/pramukh-swami-popgrip/', r'https://shoppershine\.com/wp-[a-zA-Z0-9_\-\./]+(?i:\.jpg|\.png)', 'client/src/assets/images/psm.png')

print("--- APM ---")
extract_and_download('https://www.hinduismtoday.com/magazine/educational-insight-akshar-purushottam-school-of-vedanta/', r'https://www\.hinduismtoday\.com/wp-[a-zA-Z0-9_\-\./]+(?i:\.jpg|\.png)', 'client/src/assets/images/apm.png')
