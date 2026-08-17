#!/usr/bin/env python3
"""Cross-reference every asset URL referenced in the codebase against real files."""
import os, re, sys

ROOT = 'C:/old-macdonald-had-a-school'
PUBLIC = os.path.join(ROOT, 'public')

# Collect all asset URLs from CSS, TS, TSX files
url_pattern = re.compile(r'url\(\s*[\'"]?(/[^\'")]+)[\'"]?\s*\)')
import_pattern = re.compile(r'src=["\'](/[^"\']+)["\']')
path_pattern = re.compile(r'["\'](/design-assets/[^\s\'"]+["\']?)')

urls_found = set()

for root_dir, dirs, files in os.walk(os.path.join(ROOT, 'app')):
    if '.next' in root_dir: continue
    for f in files:
        if not any(f.endswith(ext) for ext in ('.css', '.ts', '.tsx')):
            continue
        fp = os.path.join(root_dir, f)
        try:
            with open(fp, 'r', encoding='utf-8', errors='ignore') as fh:
                content = fh.read()
                for m in url_pattern.finditer(content):
                    urls_found.add(m.group(1))
                for m in import_pattern.finditer(content):
                    u = m.group(1)
                    if '/design-assets/' in u or '/brand-kit-icon-sheets/' in u or '/scenes/' in u or '/staff_and_students/' in u:
                        urls_found.add(u)
                for m in path_pattern.finditer(content):
                    p = m.group(1).rstrip('"\'')
                    if p.startswith('/'):
                        urls_found.add(p)
        except Exception:
            pass

# Also check data/ and components/
for extra_dir in ['data', 'components']:
    d = os.path.join(ROOT, extra_dir)
    if not os.path.isdir(d): continue
    for root_dir, dirs, files in os.walk(d):
        if '.next' in root_dir: continue
        for f in files:
            if not any(f.endswith(ext) for ext in ('.ts', '.tsx', '.mjs', '.mdx')):
                continue
            fp = os.path.join(root_dir, f)
            try:
                with open(fp, 'r', encoding='utf-8', errors='ignore') as fh:
                    content = fh.read()
                    for m in url_pattern.finditer(content):
                        urls_found.add(m.group(1))
                    for m in import_pattern.finditer(content):
                        u = m.group(1)
                        if '/design-assets/' in u or '/brand-kit-icon-sheets/' in u or '/scenes/' in u or '/staff_and_students/' in u:
                            urls_found.add(u)
            except Exception:
                pass

# Also collect from next.config.ts for remotePatterns/imageSizes etc
nc = os.path.join(ROOT, 'next.config.ts')
if os.path.exists(nc):
    with open(nc) as fh:
        for m in url_pattern.finditer(fh.read()):
            urls_found.add(m.group(1))

print(f"Found {len(urls_found)} unique asset URLs across codebase\n")

# Check which exist
missing = []
present = []
only_referenced_in_css_only_assets = []  # Used in CSS but may be used via background-image (these are fine)

for url in sorted(urls_found):
    filepath = os.path.join(PUBLIC, url.lstrip('/'))
    if os.path.isfile(filepath):
        present.append((url, filepath))
    else:
        missing.append((url, filepath))

print("=" * 80)
print(f"PRESENT: {len(present)} files exist on disk")
print("MISSING: {} files do NOT exist on disk".format(len(missing)))
print("=" * 80)

if missing:
    print("\n--- MISSING ASSETS ---\n")
    for url, fp in missing:
        print(f"  {url}")
else:
    print("\n✅ ALL referenced assets exist on disk.\n")

# Check for assets on disk that are NOT referenced in code
all_disk_files = set()
for root_dir, dirs, files in os.walk(PUBLIC):
    for f in files:
        rel = os.path.relpath(os.path.join(root_dir, f), PUBLIC)
        url_path = '/' + rel
        if url_path.endswith(('.webp', '.png', '.jpg', '.jpeg', '.svg', '.ttf', '.woff', '.woff2')):
            all_disk_files.add(url_path)

unreferenced = all_disk_files - urls_found
print(f"\n{'='*80}")
print(f"UNREFERENCED ASSETS ON DISK: {len(unreferenced)}")
print("These are served to clients but never referenced in the code.")
print("They add to bundle size without providing value.\n")

if unreferenced:
    # Group by parent directory
    from collections import defaultdict
    by_parent = defaultdict(list)
    for url in sorted(unreferenced):
        parent = os.path.dirname(url)
        by_parent[parent].append(url)

    for parent in sorted(by_parent.keys()):
        files = by_parent[parent]
        total_size = sum(
            os.path.getsize(os.path.join(PUBLIC, f.lstrip('/'))) 
            for f in files if os.path.isfile(os.path.join(PUBLIC, f.lstrip('/')))
        )
        print(f"\n  {parent}/ ({len(files)} files, ~{total_size/1024:.0f} KB)")
        for f in files[:10]:
            fp = os.path.join(PUBLIC, f.lstrip('/'))
            if os.path.isfile(fp):
                sz = os.path.getsize(fp)
                print(f"    {f.lstrip('/'):<80} {sz:>7} bytes")
            else:
                print(f"    {f.lstrip('/'):<80} (symlink/broken?)")
        if len(files) > 10:
            print(f"    ... +{len(files)-10} more")
