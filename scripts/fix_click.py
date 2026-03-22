import os

def fix_click(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        old_logic = "const isCircle = e.target.classList.contains('ia-circle-icon');\n        const isLogo = e.target.tagName === 'IMG' && e.target.closest('.ia-circle-icon');\n        const isBtn = e.target === iaBtn;\n        if (!iaBtn.classList.contains('expanded') && (isCircle || isLogo || isBtn)) {"
            
        new_logic = """// Relaxed click detection
        const isExpandingClick = e.target.closest('#ia-assistant-btn') && !e.target.closest('.ia-chat-content');
        if (!iaBtn.classList.contains('expanded') && isExpandingClick) {"""
            
        content = content.replace(old_logic, new_logic)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed logic in {filepath}")
    except Exception as e:
        print(f"Failed to fix {filepath}: {str(e)}")

fix_click('frontend/pages/precios.html')
fix_click('frontend/pages/colaboradores.html')
fix_click('frontend/index.html')
