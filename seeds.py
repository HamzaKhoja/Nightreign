import pandas as pd

# Load the original CSV
df = pd.read_csv('Churches and Rises.csv')

# Extract the 11 location IDs from the first row (columns 3 onward)
loc_ids = df.iloc[0, 3:].tolist()

# Build rows for seeds.csv
rows = []
for _, row in df.iloc[1:].iterrows():
    seed_id = int(row['ID'])
    boss = row['Nightlord']
    earth = row['Shifting Earth']
    if pd.isna(boss) or pd.isna(earth):
        continue
    church = []
    rise = []
    for i, loc in enumerate(loc_ids):
        desc = str(row.iloc[3 + i])
        if 'Church' in desc:
            church.append(loc)
        if "Sorcerer's Rise" in desc:
            rise.append(loc)
    rows.append({
        'ID': seed_id,
        'churchLocations': ';'.join(church),
        'riseLocations': ';'.join(rise)
    })

# Create DataFrame and write out seeds.csv
seeds_df = pd.DataFrame(rows)
seeds_df.to_csv('seeds.csv', index=False)