import os
import re

def update_urls(directory):
    floria_new_url = 'https://floria-backend-252448748566.us-central1.run.app'
    sunny_new_url = 'https://sunny-backend-252448748566.us-central1.run.app'

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html') or file.endswith('.js'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                original_content = content
                
                # Replace old FlorIA URLs
                content = re.sub(r'https://mi-portafolio-personal-shmbrxxiia-ue\.a\.run\.app', floria_new_url, content)
                content = re.sub(r'https://mi-portafolio-personal-252448748566\.us-east1\.run\.app', floria_new_url, content)
                
                # We can also update localhost:8080 to point directly to floria in prod, but the ternary already does local vs prod.
                # Just replacing the prod strings is safest for now.
                
                # For Sunny, it seems in nature-sunshine-demo3.html or similar:
                # `http://localhost:4000/api/sunny/message` or `http://localhost:4000`
                content = re.sub(r'http://localhost:4000', sunny_new_url, content)

                if content != original_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated URLs in: {path}")

if __name__ == '__main__':
    update_urls('frontend')
