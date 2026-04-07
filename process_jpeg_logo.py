from PIL import Image
import numpy as np

def process(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    # Remove white background
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    white_mask = (r > 240) & (g > 240) & (b > 240)
    data[white_mask, 3] = 0

    # Crop
    alpha = data[:,:,3]
    rows = np.any(alpha > 10, axis=1)
    cols = np.any(alpha > 10, axis=0)
    
    rmin, rmax = np.where(rows)[0][[0,-1]]
    cmin, cmax = np.where(cols)[0][[0,-1]]

    pad = 12
    rmin = max(0, rmin - pad)
    rmax = min(data.shape[0], rmax + pad)
    cmin = max(0, cmin - pad)
    cmax = min(data.shape[1], cmax + pad)

    img = Image.fromarray(data)
    cropped = img.crop((cmin, rmin, cmax, rmax))
    
    # Make square so it scales safely
    w, h = cropped.size
    size = max(w, h)
    square = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    square.paste(cropped, ((size - w) // 2, (size - h) // 2))
    
    square.save(output_path)
    print(f"Done: {w}x{h} -> {size}x{size}")

if __name__ == "__main__":
    process(r"assets\Veronica Adane.jpeg", r"public\logo.png")
