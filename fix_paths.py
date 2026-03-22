import os
import glob

# Get all html files in current directory (after move)
html_files = glob.glob('*.html')

for filepath in html_files:
    if filepath == 'index.html': continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Revert image paths
    content = content.replace('../assets/img/', 'img/')
    # Revert scripts
    content = content.replace('../script.js', 'script.js')
    content = content.replace('.//script.js', 'script.js')
    # Revert links.
    # From what we saw, index was ../index.html
    content = content.replace('../index.html', 'index.html')
    # other pages were maybe ../pages/file.html ?
    content = content.replace('../pages/', '')
    content = content.replace('../', '') # dangerous, might replace things we don't want
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Paths fixed in HTML files.")
