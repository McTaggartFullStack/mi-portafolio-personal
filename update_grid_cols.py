
import sys

file_path = 'index.html'

old_string = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16'
new_string = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

count = content.count(old_string)
print(f"Found {count} occurrences.")

if count > 0:
    new_content = content.replace(old_string, new_string)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced all occurrences.")
else:
    print("No occurrences found.")
