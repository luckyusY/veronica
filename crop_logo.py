from PIL import Image
import numpy as np

img = Image.open('public/logo.png').convert('RGBA')
data = np.array(img)

alpha = data[:,:,3]
rows = np.any(alpha > 10, axis=1)
cols = np.any(alpha > 10, axis=0)
rmin, rmax = np.where(rows)[0][[0, -1]]
cmin, cmax = np.where(cols)[0][[0, -1]]

pad = 24
rmin = max(0, rmin - pad)
rmax = min(data.shape[0], rmax + pad)
cmin = max(0, cmin - pad)
cmax = min(data.shape[1], cmax + pad)

cropped = img.crop((cmin, rmin, cmax, rmax))

w, h = cropped.size
size = max(w, h)
square = Image.new('RGBA', (size, size), (0, 0, 0, 0))
square.paste(cropped, ((size - w) // 2, (size - h) // 2))
square.save('public/logo.png')
print(f'Done: {img.size} -> {square.size}')
