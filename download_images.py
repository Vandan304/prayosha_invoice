import requests
from bs4 import BeautifulSoup
from rembg import remove
from PIL import Image
import io
import os
import re

os.makedirs('client/src/assets/images', exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
}

def process_image(url, output_path):
    print(f"Downloading {url}...")
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    print("Removing background...")
    input_img = response.content
    try:
        output_img = remove(input_img)
        img = Image.open(io.BytesIO(output_img))
        img.save(output_path, 'PNG')
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Rembg failed, saving original: {e}")
        with open(output_path, 'wb') as f:
            f.write(input_img)

# PSM
try:
    print("Processing PSM...")
    res = requests.get('https://shoppershine.com/product/pramukh-swami-popgrip/', headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    img_tag = soup.select_one('.woocommerce-product-gallery__image img')
    if img_tag:
        process_image(img_tag['src'], 'client/src/assets/images/psm.png')
    else:
        print("PSM image tag not found")
except Exception as e:
    print("Error PSM:", e)

# MSM
try:
    print("Processing MSM...")
    res = requests.get('https://www.pngegg.com/en/png-sidey', headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    # pngegg main image
    img_tag = soup.select_one('img')
    # Find the largest image or specific class
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and ('png' in src or 'msm' in src.lower() or 'swami' in src.lower()):
            if src.startswith('//'):
                src = 'https:' + src
            elif src.startswith('/'):
                src = 'https://www.pngegg.com' + src
            process_image(src, 'client/src/assets/images/msm.png')
            break
except Exception as e:
    print("Error MSM:", e)

# APM
try:
    print("Processing APM...")
    res = requests.get('https://www.hinduismtoday.com/magazine/educational-insight-akshar-purushottam-school-of-vedanta/', headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    img_url = None
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and ('akshar' in src.lower() or 'purushottam' in src.lower() or 'swamini' in src.lower() or 'guru' in src.lower() or 'maharaj' in src.lower()):
            img_url = src
            break
    if not img_url:
        img_tag = soup.select_one('article img')
        if img_tag:
            img_url = img_tag.get('src')
            
    if img_url:
        process_image(img_url, 'client/src/assets/images/apm.png')
    else:
        print("APM image tag not found")
except Exception as e:
    print("Error APM:", e)
