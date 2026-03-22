import glob
import re

html_files = glob.glob('*.html')
for filepath in html_files:
    if filepath == 'index.html': 
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Revert image paths
    content = content.replace('../assets/img/', 'img/')
    # Revert script paths
    content = content.replace('../script.js', 'script.js')
    content = content.replace('.//script.js', 'script.js')
    # Revert links to index.html
    content = content.replace('../index.html', 'index.html')
    # Revert links to other pages (e.g. href="../pages/colaboradores.html", now just "colaboradores.html")
    # Actually wait! The links in docs/pages/precios.html to otros might be `../pages/colaboradores.html` or just `colaboradores.html` depending on how they wrote it.
    content = content.replace('../pages/', '')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Fixed {len(html_files)-1} files.")
