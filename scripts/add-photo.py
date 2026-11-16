#!/usr/bin/env python3
# Add a photo to the site: strip every piece of metadata (EXIF, GPS, camera), turn it the
# right way up, resize it for the web, save it in src/assets/photos/ and list it in
# src/data/photos.json, which the photos page reads. Code Apache-2.0.
#
# Needs Python 3 with Pillow; iPhone .heic files also need pillow-heif:
#   pip install pillow pillow-heif
#
# Usage:
#   python3 scripts/add-photo.py PHOTO --name short-name --alt "what is in the picture" \
#       [--caption "a line for the photos page"] [--credit "who took or supplied it"] \
#       [--date 2026-11-12] [--crop LEFT,TOP,RIGHT,BOTTOM] [--tag summit]
#
# --crop is in pixels of the photo after it is turned the right way up (use it to cut out
# anyone who has not agreed to appear). Run it again with the same --name to replace a photo.
import argparse, json, os, sys
from datetime import date

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit('Pillow is missing: pip install pillow pillow-heif')
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pass  # only needed for .heic

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTOS = os.path.join(ROOT, 'src', 'assets', 'photos')
LIST = os.path.join(ROOT, 'src', 'data', 'photos.json')

p = argparse.ArgumentParser(description='Add a photo to the site, without its metadata.')
p.add_argument('photo')
p.add_argument('--name', required=True, help='short name, letters, digits and hyphens: becomes NAME.jpg')
p.add_argument('--alt', required=True, help='what is in the picture, for people who cannot see it')
p.add_argument('--caption', default='')
p.add_argument('--credit', default='')
p.add_argument('--date', default='', help='when it was taken, YYYY-MM-DD, if known')
p.add_argument('--crop', default='', help='LEFT,TOP,RIGHT,BOTTOM in pixels')
p.add_argument('--tag', action='append', default=[], help='for example summit, kitchen, work (repeatable)')
p.add_argument('--size', type=int, default=1600, help='longest side in pixels (default 1600)')
a = p.parse_args()

if not a.name.replace('-', '').isalnum() or a.name.lower() != a.name:
    sys.exit('--name: use lower-case letters, digits and hyphens only')
if '—' in a.alt + a.caption + a.credit:
    sys.exit('No em dashes, please: use a colon or a comma.')

im = ImageOps.exif_transpose(Image.open(a.photo)).convert('RGB')
if a.crop:
    l, t, r, b = (int(v) for v in a.crop.split(','))
    im = im.crop((l, t, r, b))
im.thumbnail((a.size, a.size))
os.makedirs(PHOTOS, exist_ok=True)
out = os.path.join(PHOTOS, a.name + '.jpg')
# A new image built from the pixels only: nothing from the original file's metadata comes along.
clean = Image.new('RGB', im.size)
clean.paste(im)
clean.save(out, 'JPEG', quality=84, optimize=True, progressive=True)

data = json.load(open(LIST)) if os.path.exists(LIST) else {'photos': []}
entry = {'file': f'/assets/photos/{a.name}.jpg', 'alt': a.alt, 'caption': a.caption, 'credit': a.credit,
         'date': a.date, 'width': clean.width, 'height': clean.height, 'tags': a.tag, 'added': date.today().isoformat()}
data['photos'] = [x for x in data['photos'] if x['file'] != entry['file']] + [entry]
with open(LIST, 'w') as f:
    json.dump(data, f, indent=1, ensure_ascii=False)
    f.write('\n')
print(f'saved {os.path.relpath(out, ROOT)} ({clean.width}x{clean.height}, {os.path.getsize(out)//1024} KB, no metadata); listed in src/data/photos.json')
