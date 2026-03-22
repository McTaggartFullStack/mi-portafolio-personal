
with open("/Users/tecnouser/Desktop/mi portafolio personal/saas-landing.html", "r") as f:
    content = f.read()

footers = content.count("</footer>")
print(f"Number of footers: {footers}")

if footers > 1:
    parts = content.split("</footer>")
    print(f"Length of part 1: {len(parts[0])}")
    print(f"Length of part 2: {len(parts[1])}")
    # Print start of part 2
    print(f"Start of part 2: {parts[1][:200]}")

print(f"Total length: {len(content)}")
