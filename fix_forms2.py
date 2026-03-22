import re
import os

files = ['frontend/pages/precios.html', 'frontend/pages/colaboradores.html']
form_html = '''        <div id="recaptcha-widget" style="width:100%;max-width:320px;min-width:180px;display:flex;justify-content:center;"></div>
      </div>
      <p id="recaptcha-loading" style="display:none; text-align:center; font-size:12px; color:gray; margin-bottom:10px;">
        Por favor resuelve el captcha para enviar tu mensaje...
      </p>
      <form class="ia-chat-input">
        <input type="text" placeholder="Escribe tu pregunta..." />
        <button type="submit">→</button>
      </form>'''

for fn in files:
    with open(fn, 'r') as f:
        content = f.read()
    
    if '<form class="ia-chat-input">' in content:
        print(f"Skipping {fn} as form is already there")
        continue

    pattern = r'(<div id="recaptcha-widget"[^>]*></div>\s*</div>)'
    
    if re.search(pattern, content):
        new_content = re.sub(pattern, form_html, content)
        with open(fn, 'w') as f:
            f.write(new_content)
        print(f"Fixed {fn}")
    else:
        print(f"Pattern not found in {fn}")
