from rembg import remove
from PIL import Image
import io

def process(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        with open(input_path, 'rb') as i:
            input_data = i.read()
        output_data = remove(input_data)
        img = Image.open(io.BytesIO(output_data))
        img.save(output_path, 'PNG')
        print(f"Saved {output_path}")
    except Exception as e:
        print(f"Failed {input_path}: {e}")

process('PSM.jpg', 'client/src/assets/images/psm.png')
process('APM.jpg', 'client/src/assets/images/apm.png')
process('client/src/assets/images/msm.png', 'client/src/assets/images/msm.png') # reprocess just in case
print("Done!")
