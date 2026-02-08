
import os

file_path = 'script.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Logic to replace
marker = '// --- Dark Mode Logic ---'
if marker in content:
    # Split content at marker
    parts = content.split(marker)
    pre_logic = parts[0]
    
    # New Logic
    new_logic = '''// --- Dark Mode Logic ---
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const themeToggleDarkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
const themeToggleLightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');

function updateIcons(isDark) {
    // Desktop Icons
    if (themeToggleDarkIcon && themeToggleLightIcon) {
        if (isDark) {
            themeToggleDarkIcon.classList.add('hidden');
            themeToggleLightIcon.classList.remove('hidden');
        } else {
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleLightIcon.classList.add('hidden');
        }
    }
    // Mobile Icons
    if (themeToggleDarkIconMobile && themeToggleLightIconMobile) {
        if (isDark) {
            themeToggleDarkIconMobile.classList.add('hidden');
            themeToggleLightIconMobile.classList.remove('hidden');
        } else {
            themeToggleDarkIconMobile.classList.remove('hidden');
            themeToggleLightIconMobile.classList.add('hidden');
        }
    }
}

// Initial check
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    updateIcons(true);
} else {
    document.documentElement.classList.remove('dark');
    updateIcons(false);
}

function toggleTheme() {
    // toggle icons
    let isDarkNow = document.documentElement.classList.contains('dark');
    
    if (isDarkNow) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        updateIcons(false);
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        updateIcons(true);
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}
if (themeToggleBtnMobile) {
    themeToggleBtnMobile.addEventListener('click', toggleTheme);
}
'''
    
    final_content = pre_logic + new_logic
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Updated script.js with dual-button dark mode logic.")

else:
    print("Could not find Dark Mode Logic marker.")
