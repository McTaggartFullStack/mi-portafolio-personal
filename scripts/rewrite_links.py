import os
import re
import glob
import shutil

def process_file(filepath, is_index):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if is_index:
        def href_repl(m):
            link = m.group(1)
            # Skip full urls, hashes, mailto, tel, root, and files already moved
            if not link.startswith(('http', '#', 'mailto:', 'tel:', '/', 'pages/', 'assets/')) and link.endswith('.html'):
                return f'href="pages/{link}"'
            return m.group(0)
        
        content = re.sub(r'href="([^"]+)"', href_repl, content)
        
        # Rewrite img/
        content = re.sub(r'src="(img/[^"]+)"', r'src="assets/\1"', content)
        content = re.sub(r"url\('?(img/[^']+)'?\)", r"url('assets/\1')", content)
        content = re.sub(r'url\("?(img/[^"]+)"?\)', r'url("assets/\1")', content)

    else:
        def href_repl2(m):
            link = m.group(1)
            if link == 'index.html':
                return 'href="../index.html"'
            elif not link.startswith(('http', '#', 'mailto:', 'tel:', '/', '../')) and link.endswith('.html'):
                # Sibling pages, they are in the same folder now
                return m.group(0)
            return m.group(0)
        
        content = re.sub(r'href="([^"]+)"', href_repl2, content)

        # Rewrite img/ -> ../assets/img/
        content = re.sub(r'src="(img/[^"]+)"', r'src="../assets/\1"', content)
        content = re.sub(r"url\('?(img/[^']+)'?\)", r"url('../assets/\1')", content)
        content = re.sub(r'url\("?(img/[^"]+)"?\)', r'url("../assets/\1")', content)
        
        # script.js is in frontend/ so from pages/ it's ../script.js
        content = re.sub(r'src="script\.js"', r'src="../script.js"', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Starting to process...")

if os.path.exists('frontend/index.html'):
    process_file('frontend/index.html', True)

if os.path.exists('frontend/script.js'):
    with open('frontend/script.js', 'r', encoding='utf-8') as f:
       c = f.read()
    c = re.sub(r'(["\'])img/', r'\1assets/img/', c)
    with open('frontend/script.js', 'w', encoding='utf-8') as f:
       f.write(c)

for page in glob.glob('frontend/pages/*.html'):
    process_file(page, False)

print("Done.")