import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Old fragment 1: Orphaned recaptcha/form
    content = re.sub(r'<p id="recaptcha-loading" class="loading-dots"[^>]*>\s*Cargando captcha, por favor espera\.\.\.\s*</p>\s*<form class="ia-chat-input"[^>]*>\s*<input[^>]*/>\s*<button[^>]*>➤</button>\s*</form>\s*</div>\s*</div>', '', content)
    
    # Clean up empty multiple Asistente de IA comments
    content = re.sub(r'(<!-- Asistente de IA -->\s*){2,}', '<!-- Asistente de IA -->\n', content)

    # Some old scripts might have left an orphaned </div></div> above the footer? No, let's just make it precise.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned {filepath}")

clean_file('frontend/pages/precios.html')
clean_file('frontend/pages/colaboradores.html')
