import os

# ── New school details from the official calendar image ──
REPLACEMENTS = [
    # Address corrections (old variants → correct address)
    ('Punarbas-8, "Ka Gau"', 'Punarbas-8, Prithvibasti'),
    ('Punarbas-8, \\"Ka Gau\\"', 'Punarbas-8, Prithvibasti'),
    ("Punarbas-8, 'Ka Gau'", 'Punarbas-8, Prithvibasti'),
    ('Punarbas-2, Motibasti', 'Punarbas-8, Prithvibasti'),
    ('Punarbas-9, Sitabasti', 'Punarbas-8, Prithvibasti'),
    ('Punarbas-9, Seetabasti', 'Punarbas-8, Prithvibasti'),
    ('पुनर्वास-९, सिताबस्ती', 'पुनर्वास-८, पृथ्वीबस्ती'),
    ('पुनर्वास-९, सीताबस्ती', 'पुनर्वास-८, पृथ्वीबस्ती'),
    ('पुनर्बास-२, मोटीबस्ती', 'पुनर्वास-८, पृथ्वीबस्ती'),
    ('पुनर्बास-८', 'पुनर्वास-८'),
    ('Sitabasti', 'Prithvibasti'),
    ('Seetabasti', 'Prithvibasti'),
    # ESTB year
    ('Established in 2073 BS', 'Established in 2066 BS'),
    ('Established 2073 BS', 'Established 2066 BS'),
    ('established_year_bs || \'2073\'', 'established_year_bs || \'2066\''),
    ('established_year_bs || "2073"', 'established_year_bs || "2066"'),
    ("'2037'", "'2066'"),
    ('"2037"', '"2066"'),
    ("'2073'", "'2066'"),
    ('"2073"', '"2066"'),
    ('२०३७', '२०६६'),
    ('year_ad: \'1980\'', 'year_ad: \'2009\''),
    # Phone numbers
    ('+977-099-420XXX', '099422015'),
    ('+977-99-XXXXXX', '099422015'),
    ('+९७७-९९-XXXXXX', '०९९४२२०१५'),
    # Email
    ('info@sjss.edu.np', 'alankarpublicschool@gmail.com'),
    ('admin@sjsss.edu.np', 'alankarpublicschool@gmail.com'),
    # EMIS / school code
    ('EMIS-00000', '720120015'),
    ('720120015', '720120015'),  # keep as is
    # Estd year in seed
    ("established_year_bs', value: '2037'", "established_year_bs', value: '2066'"),
    ("established_year_bs', value: '2073'", "established_year_bs', value: '2066'"),
    # Estd year label
    ("'2037 BS'", "'2066 BS'"),
    ('"2037 BS"', '"2066 BS"'),
    ("'2073 BS'", "'2066 BS'"),
    ('"2073 BS"', '"2066 BS"'),
    ('Est. 2037', 'Est. 2066'),
    ('Est. 2073', 'Est. 2066'),
    ('Estd: 2037 BS', 'Estd: 2066 BS'),
    ('Estd: 2073 BS', 'Estd: 2066 BS'),
    ('Estd. 2073 BS', 'Estd. 2066 BS'),
    ('Estd. 2037 BS', 'Estd. 2066 BS'),
    ('वि.सं. २०३७', 'वि.सं. २०६६'),
    ('२०३७ BS', '२०६६ BS'),
    ('२०७३ BS', '२०६६ BS'),
]

TARGET_EXTENSIONS = ('.ts', '.tsx', '.js', '.jsx', '.json', '.css')
SKIP_DIRS = {'node_modules', '.next', '.git'}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content
        for old, new in REPLACEMENTS:
            new_content = new_content.replace(old, new)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated: {filepath}')
    except Exception as e:
        print(f'ERROR {filepath}: {e}')

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for fname in files:
        if any(fname.endswith(ext) for ext in TARGET_EXTENSIONS):
            process_file(os.path.join(root, fname))

print('Done!')
