import os
import glob

inicio_dir = "frontend/assets/img/inicio"

# Get all moved file names
moved_files = []
for item in os.listdir(inicio_dir):
    item_path = os.path.join(inicio_dir, item)
    if os.path.isfile(item_path) and item != ".DS_Store":
        moved_files.append(item)

print(f"Found {len(moved_files)} files in inicio/")

# Update HTML and JS files
target_files = glob.glob("frontend/**/*.html", recursive=True)
target_files.append("frontend/script.js")

for file_path in target_files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        orig_content = content
        for filename in moved_files:
            # Replaces assets/img/filename with assets/img/inicio/filename
            content = content.replace(f"assets/img/{filename}", f"assets/img/inicio/{filename}")
            # Replaces ../assets/img/filename with ../assets/img/inicio/filename
            content = content.replace(f"../assets/img/{filename}", f"../assets/img/inicio/{filename}")
            # Replaces img/filename with img/inicio/filename (just in case they have it hardcoded or previously broken)
            content = content.replace(f"img/{filename}", f"img/inicio/{filename}")
            
        if orig_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {file_path}")

print("Update completed.")
