import os
import glob
import shutil

img_dir = "frontend/assets/img"
inicio_dir = os.path.join(img_dir, "inicio")

# Create inicio dir if it doesn't exist
if not os.path.exists(inicio_dir):
    os.makedirs(inicio_dir)

# Move all files from img_dir to inicio_dir
moved_files = []
for item in os.listdir(img_dir):
    item_path = os.path.join(img_dir, item)
    if os.path.isfile(item_path) and item != ".DS_Store":
        # Move file
        target_path = os.path.join(inicio_dir, item)
        shutil.move(item_path, target_path)
        moved_files.append(item)

print(f"Moved {len(moved_files)} files to inicio/")

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
            # Replaces img/filename with img/inicio/filename (legacy or hardcoded)
            content = content.replace(f"img/{filename}", f"img/inicio/{filename}")
            
        if orig_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {file_path}")

print("Update completed.")