
import re

file_path = 'index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. FIX DESKTOP NAVBAR & TOGGLE BUTTON
# Remove the old messed up button and broken link
# Pattern matches: <a ... href="#contacto">\n </a> \n <!-- Dark Mode Toggle --> <button ...> ... </button> \n Contacto \n </a>
# We can be aggressive since we know the specific structure.

# Let's find the messed up block.
start_marker = 'href="#planes">'
idx_start = content.find(start_marker)
if idx_start == -1:
    print("Could not find start marker")
    exit(1)

# Find the end of the messed up block: "</div>" which closes "flex items-baseline"
idx_end = content.find('</div>', idx_start)

# The content we want to replace is roughly from after "Planes</a>" to before "</div>"
# But "Planes" link is fine.
# We are looking for the next <a> after Planes which is Contacto.

link_start = content.find('<a ', idx_start + len(start_marker))
# This <a should be the one for Contacto (or what's left of it)

# We want to replace the mess with:
# <a class="..." href="#contacto">Contacto</a>
# <!-- Dark Mode Toggle -->
# <button ...> ... </button>

# Currently the content has:
# <a ... href="#contacto"> </a> <button ...> ... </button> Contacto </a>

# Let's recreate the button HTML with ID 'theme-toggle-desktop'
button_desktop = '''
       <!-- Dark Mode Toggle Desktop -->
       <button id="theme-toggle" type="button" class="ml-4 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 transition-colors">
        <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
        <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
       </button>
'''

# We need to construct the clean "Contacto" link first.
contacto_link = '''
       <a class="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors duration-300 font-medium" href="#contacto">
        Contacto
       </a>'''

# Regex to find the broken block. It starts with <a ... href="#contacto"> and ends with </div>
# But regex is risky with so much content.
# Let's perform a specific localized string replacement.
# Original broken string part (identifiable):
broken_part_start = '<a class="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors duration-300 font-medium" href="#contacto">\n      </a>'
# The rest is the button code and then "Contacto \n </a>"

if broken_part_start in content:
    # We found the exact broken start.
    # We need to remove from there until "       Contact\n       </a>"
    # Wait, the read_file showed:
    #        Contact
    #       </a>
    #      </div>
    
    # Let's define the replacement block
    replacement_block = contacto_link + button_desktop
    
    # Now to replace the broken chunk.
    # We can use regex to match from broken_part_start to the closing </a> of Contacto.
    pattern = re.compile(re.escape(broken_part_start) + r'.*?Contacto\s+</a>', re.DOTALL)
    content = pattern.sub(replacement_block, content)
else:
    print("Could not find exact broken part structure. Attempting softer match.")
    # Fallback: look for just href="#contacto">
    pass

# 2. ADD MOBILE TOGGLE BUTTON
# ID: theme-toggle-mobile
button_mobile = '''
      <!-- Dark Mode Toggle Mobile -->
      <button id="theme-toggle-mobile" type="button" class="mr-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 transition-colors">
        <svg id="theme-toggle-dark-icon-mobile" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
        <svg id="theme-toggle-light-icon-mobile" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
       </button>
'''
# Insert before <button ... id="mobile-menu-btn" ...>
marker_mobile = '<!-- Mobile menu button -->'
if marker_mobile in content:
    content = content.replace(marker_mobile, button_mobile + '\n      ' + marker_mobile)

# 3. FIX PROJECT BACKGROUND
# bg-gradient-to-b from-gray-50 to-white
content = content.replace('from-gray-50 to-white', 'from-gray-50 to-white dark:from-gray-900 dark:to-gray-800')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Navbar and Background fixes applied.")

