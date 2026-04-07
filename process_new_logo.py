from PIL import Image
import numpy as np
import sys

def process(input_path, output_path):
    # Open image
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # 1. Remove white background
    # Consider pixels white if r, g, b are all > 240
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    white_mask = (r > 240) & (g > 240) & (b > 240)
    data[white_mask, 3] = 0 # set alpha to 0 for white pixels

    # 2. Crop to content
    alpha = data[:,:,3]
    rows = np.any(alpha > 10, axis=1)
    cols = np.any(alpha > 10, axis=0)
    
    if not np.any(rows) or not np.any(cols):
        print("Image is entirely transparent or empty after background removal!")
        sys.exit(1)
        
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    pad = 12
    rmin = max(0, rmin - pad)
    rmax = min(data.shape[0], rmax + pad)
    cmin = max(0, cmin - pad)
    cmax = min(data.shape[1], cmax + pad)

    img = Image.fromarray(data)
    cropped = img.crop((cmin, rmin, cmax, rmax))

    # 3. Save
    cropped.save(output_path)
    print(f"Processed: {input_path} -> {output_path} | Size constraint: {cropped.size}")

if __name__ == "__main__":
    import os
    src = r"C:\Users\HP\.gemini\antigravity\brain\d25fdfe8-3901-426b-b76e-9d4700d2762d\media__1775583986461.png"
    dest = r"public\logo.png"
    process(src, dest)
