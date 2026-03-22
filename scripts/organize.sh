#!/bin/bash
set -x

# 1. FRONTEND
echo "Organizing frontend..."
mkdir -p frontend/pages frontend/assets/img

# Move HTML files
for file in *.html; do
  if [ "$file" = "index.html" ]; then
    mv "index.html" frontend/
  else
    mv "$file" frontend/pages/
  fi
done

# Move assets
mv img/* frontend/assets/img/
rmdir img
mv script.js frontend/ || true

# Rewriting links (Using the python script we just created)
python3 rewrite_links.py

# 2. CONFIG / DEVOPS
echo "Organizing configs..."
mkdir -p devops
mv Dockerfile cloudbuild.yaml CNAME robots.txt sitemap.xml devops/ 2>/dev/null || true

# 3. SCRIPTS
echo "Organizing scripts..."
mkdir -p scripts
mv *.py scripts/ 2>/dev/null || true
mv test_sunny_api.sh scripts/ 2>/dev/null || true
mv *.sh scripts/ 2>/dev/null || true

# 4. BACKEND FOLDERS
echo "Organizing backend..."
mkdir -p backend/floria backend/sunny

# Floria files
mv server.js backend/floria/ 2>/dev/null || true
mv chat.log backend/floria/ 2>/dev/null || true

# Sunny files
mv server-sunny.js backend/sunny/ 2>/dev/null || true
mv ai backend/sunny/ 2>/dev/null || true
mv config backend/sunny/ 2>/dev/null || true
mv controllers backend/sunny/ 2>/dev/null || true
mv prompts backend/sunny/ 2>/dev/null || true
mv routes backend/sunny/ 2>/dev/null || true
mv services backend/sunny/ 2>/dev/null || true
mv sunny backend/sunny/aux_routes 2>/dev/null || true
mv ARCHITECTURE_AUDIT.js backend/sunny/ 2>/dev/null || true
mv EXAMPLE_REQUESTS.js backend/sunny/ 2>/dev/null || true

# Docs
mkdir -p docs
mv *.md docs/ 2>/dev/null || true

# Update package.json scripts
sed -i.bak 's|"start": "node server.js"|"start": "node backend/floria/server.js"|g' package.json
sed -i.bak 's|"start:sunny": "node server-sunny.js"|"start:sunny": "node backend/sunny/server-sunny.js"|g' package.json
sed -i.bak 's|"dev:sunny": "nodemon server-sunny.js"|"dev:sunny": "nodemon backend/sunny/server-sunny.js"|g' package.json
rm package.json.bak 2>/dev/null || true

# Update server.js serving static folder
sed -i.bak "s|express\.static(process\.cwd())|express.static(path.join(process.cwd(), 'frontend'))|g" backend/floria/server.js
sed -i.bak "s|path\.resolve(process\.cwd(), 'index\.html')|path.resolve(process.cwd(), 'frontend', 'index.html')|g" backend/floria/server.js
rm backend/floria/server.js.bak 2>/dev/null || true

# Update Dockerfile CMD
sed -i.bak 's|CMD \["node", "server.js"\]|CMD ["node", "backend/floria/server.js"]|g' devops/Dockerfile
rm devops/Dockerfile.bak 2>/dev/null || true

echo "Done organizing!"