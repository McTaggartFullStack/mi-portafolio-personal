import os
import re

with open('scripts/temp_chat.html', 'r', encoding='utf-8') as f:
    correct_chat = f.read()

# Replace the image path to match pages/ subfolder
correct_chat = correct_chat.replace('src="assets/img/principal/logoIA.webp"', 'src="../assets/img/principal/logoIA.webp"')
correct_chat = correct_chat.replace("src='assets/img/principal/logoIA.webp'", "src='../assets/img/principal/logoIA.webp'")

def fix_page(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the old CSS logic "/* Flotante IA */" inside <style>
    content = re.sub(r'/\* Flotante IA \*/.*?(?=</style>)', '', content, flags=re.DOTALL)
    content = re.sub(r'#ia-assistant-btn\s*\{.*?(?=</style>)', '', content, flags=re.DOTALL)
    
    # Let's cleanly strip from <!-- Asistente de IA --> or <!-- FlorIA Assistant --> up to the </script> just before WhatsApp
    # Actually, a more foolproof way is to remove the block that starts with <div id="ia-assistant-btn" to the matching end </div>
    # And then remove the script containing "document.getElementById('ia-assistant-btn');"
    
    content = re.sub(r'<!-- Asistente de IA -->', '', content)
    content = re.sub(r'<!-- FlorIA Assistant -->', '', content)

    content = re.sub(r'<div id="ia-assistant-btn".*?</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL) # the container and its nested divs
    content = re.sub(r'<div id="ia-assistant-btn".*?</div>\n\s*</div>', '', content, flags=re.DOTALL) # the container and its nested divs
    content = re.sub(r'<div id="ia-assistant-btn"[\s\S]*?iaChatMessages\.style\.gap = \'0\.3em\';[\s\S]*?</script>', '', content)
    
    # More aggressively remove the specific code block
    content = re.sub(r'<div id="ia-assistant-btn"[\s\S]*?ia-chat-input[\s\S]*?</form>\s*</div>\s*</div>', '', content)
    content = re.sub(r'<script>[\s\S]*?document.getElementById\(\'ia-assistant-btn\'\)[\s\S]*?</script>', '', content)

    # Let's remove ANY stray "div id=ia-assistant-btn..." and the script
    content = re.sub(r'<div id="ia-assistant-btn" title="Habla con FlorIA">[\s\S]*?</script>', '', content)

    # Clean the bottom dummy florIA script
    content = re.sub(r'<!-- Floria Integration -->[\s\S]*?</script>', '', content)

    # Add back the correct chat
    clean_added = f"<!-- Asistente de IA -->\n{correct_chat}\n"
    if '<!-- WhatsApp Float Button -->' in content:
        content = content.replace('<!-- WhatsApp Float Button -->', clean_added + '\n<!-- WhatsApp Float Button -->')
    else:
        content = content.replace('</body>', clean_added + '\n</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_page('frontend/pages/precios.html')
fix_page('frontend/pages/colaboradores.html')
