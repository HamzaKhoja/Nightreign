/*
TODO:
- [ ] Implement other Special Events (i.e. Meteor Strike)
- [ ] Add info on hover over icons
    - [ ] Add values for runes/hp for duos and trios
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM references ---
    const $ = sel => document.querySelector(sel);
    const $$ = sel => document.querySelectorAll(sel);

    const container = $('.container');
    const bossGrid = $('#bossGrid');
    const earthSelect = $('#earthSelect');
    const selectionPanel = $('#selectionPanel');
    const backButton = $('#backButton');
    const imageWrapper = $('#imageWrapper');
    const mapImage = $('#mapImage');
    const mapOverlay = $('#mapOverlay');
    const errorMessage = $('#errorMessage');
    const resetMarkersBtn = $('#resetMarkersButton');
    const seedDisplay = $('#seedDisplay');
    const viewSeedButton = $('#viewSeedButton');
    const leftInfo = $('#leftInfo');
    const seedEvents = {};
    const nightCircles = {};
    const nightBosses = {};
    const popup = document.getElementById('infoPopup');
    const content = document.getElementById('infoContent');
    const bossInfoMap = {};
    const nightfarerGrid = $('#nightfarerGrid');
    const playersRadios = document.getElementsByName('players');
    const seedSpawnPoint = {};
    const weaponsByName = {};

    // --- Application state ---
    let selectedBoss = 'Gladius';
    let userChurches = [];
    let userRises = [];
    let seedData = [];
    let currentPossible = [];
    let locationMeta = [];
    let seedStructures = {};
    let selectedNightfarer = 'Duchess';
    let currentSelections = {boss: 'Gladius',earth: 'None',nightfarer: 'Wylder',players: '1'};
    let weaponsData = [];


    // --- Classification maps ---
    const fieldBosses = {
        'Grafted Scion': 'Weak', 'Black Knife Assassin': 'Weak',
        'Red Wolf': 'Weak', 'Ancient Hero of Zamor': 'Weak',
        'Leonine Misbegotten': 'Weak', 'Elder Lion': 'Weak',
        'Golden Hippo': 'Weak', 'Demi-Human Queen': 'Weak',
        'Miranda Blossom': 'Weak', 'Royal Revenant': 'Weak',
        "Knight's Cavalry": 'Weak',
        'Flying Dragon': 'Strong', 'Ulcerated Tree Spirit': 'Strong',
        'Erdtree Avatar': 'Strong', 'Bell Bearing Hunter': 'Strong',
        'Ancestor Spirit': 'Strong', 'Tree Sentinel': 'Strong',
        'Magma Wyrm': 'Strong', 'Royal Carian Knight': 'Strong',
        'Death Rite Bird': 'Strong', 'Black Blade Kindred': 'Strong',
        'Draconic Tree Sentinel': 'Strong'
    };
    const evergaolBosses = {
        'Omen': 'Weak', 'Grave Warden Duelist': 'Weak',
        'Bloodhound Knight': 'Weak', 'Stoneskin Lords': 'Weak',
        'Nox Warriors': 'Weak', 'Beastly Brigade': 'Weak',
        'Beastmen of Farum Azula': 'Weak', 'Crystalians': 'Weak',
        'Banished Knights': 'Weak',
        'Dragonkin Soldier': 'Strong', 'Godskin Noble': 'Strong',
        'Godskin Apostle': 'Strong', 'Crucible Knight': 'Strong',
        'Ancient Dragon': 'Strong', 'Godskin Duo': 'Strong',
        'Death Rite Bird': 'Strong'
    };

    // --- Constants for boss folders & icons ---
    const bossFolders = {
        Gladius: '1_Gladius', Adel: '2_Adel',
        Gnoster: '3_Gnoster', Maris: '4_Maris',
        Libra: '5_Libra', Fulghor: '6_Fulghor',
        Caligo: '7_Caligo', Heolstor: '8_Heolstor'
    };
    const bossIconFiles = {
        Gladius: 'Gladius, Beast of Night.png', Adel: 'Adel, Baron of Night.png',
        Gnoster: 'Gnoster, Wisdom of Night.png', Maris: 'Maris, Fathom of Night.png',
        Libra: 'Libra, Creature of Night.png', Fulghor: 'Fulghor, Champion of Nightglow.png',
        Caligo: 'Caligo, Miasma of Night.png', Heolstor: 'Heolstor, The Nightlord.png'
    };
    const nightfarerIcons = {
        Duchess: 'Duchess.png', Executor: 'Executor.png',
        Guardian: 'Guardian.png', Ironeye: 'Ironeye.png',
        Raider: 'Raider.png', Recluse: 'Recluse.png',
        Revenant: 'Revenant.png', Wylder: 'Wylder.png'
    };

    const preferredWeapons = {
        Wylder: ['Greatsword'], Guardian: ['Halberd'],
        Ironeye: ['Bow'], Duchess: ['Dagger'], Executor: ['Katana'],
        Raider: ['Greataxe', 'Great Hammer', 'Colossal Weapon'], 
        Revenant: ['Sacred Seal'], Recluse: ['Glintstone Staff', 'Sacred Seal']
    }

    // --- Map coordinates for each Shifting Earth ---
    const mapLocations = {
        None: [
            'Northeast of Saintsbridge', 'West of Warmasters Shack',
            'Below Summonwater Hawk', 'Third Church',
            'Above Stormhill Tunnel Entrance', 'Stormhill South of Gate',
            'Minor Erdtree', 'East of Cavalry Bridge',
            'Far Southwest', 'Lake', 'Southeast of Lake'
        ],
        Mountains: [
            'Northeast of Saintsbridge', 'Below Summonwater Hawk',
            'Third Church', 'Stormhill South of Gate',
            'Minor Erdtree', 'East of Cavalry Bridge',
            'Far Southwest', 'Lake', 'Southeast of Lake'
        ],
        Crater: [
            'West of Warmasters Shack', 'Below Summonwater Hawk',
            'Third Church', 'Stormhill South of Gate',
            'Minor Erdtree', 'East of Cavalry Bridge',
            'Far Southwest', 'Lake', 'Southeast of Lake'
        ],
        'Rotted Woods': [
            'Northeast of Saintsbridge', 'West of Warmasters Shack',
            'Below Summonwater Hawk', 'Third Church',
            'Above Stormhill Tunnel Entrance', 'Stormhill South of Gate',
            'Far Southwest', 'Lake'
        ],
        Noklateo: [
            'Northeast of Saintsbridge', 'West of Warmasters Shack',
            'Below Summonwater Hawk', 'Third Church',
            'Above Stormhill Tunnel Entrance', 'Minor Erdtree',
            'East of Cavalry Bridge', 'Southeast of Lake'
        ]
    };

    const staticStructuresByEarth = {
        Mountains: [{
                areaName: 'Mountains Minor Boss 1',
                iconFile: 'Minor Field Boss.png',
                label: 'Demi-Human Swordmaster'
            },
            {
                areaName: 'Mountains Minor Boss 2',
                iconFile: 'Minor Field Boss.png',
                label: 'Giant Crows'
            },
            {
                areaName: 'Mountains Minor Boss 3',
                iconFile: 'Minor Field Boss.png',
                label: 'Demi-Human Swordmaster'
            },
            {
                areaName: 'Mountains Minor Boss 4',
                iconFile: 'Minor Field Boss.png',
                label: 'Flying Dragon'
            },
            {
                areaName: 'Mountains Minor Boss 5',
                iconFile: 'Minor Field Boss.png',
                label: 'Snowfield Trolls'
            },
            {
                areaName: 'Mountains Major Boss 1',
                iconFile: 'Major Field Boss.png',
                label: 'Mountaintop Ice Dragon'
            },
            {
                areaName: 'Mountains Major Boss 2',
                iconFile: 'Major Field Boss.png',
                label: 'Mountaintop Ice Dragon'
            },
            {
                areaName: 'Mountains Major Boss 3',
                iconFile: 'Major Field Boss.png',
                label: 'Mountaintop Ice Dragon'
            },
            {
                areaName: 'Mountains Major Boss 4',
                iconFile: 'Major Field Boss.png',
                label: 'Mountaintop Ice Dragon'
            },
            {
                areaName: 'Mountains Ruins',
                iconFile: 'Ruins.png',
                label: 'Albinauric Archers'
            },
        ],
        Crater: [{
                areaName: 'Crater Minor Boss 1',
                iconFile: 'Minor Field Boss.png',
                label: 'Red Wolf'
            },
            {
                areaName: 'Crater Minor Boss 2',
                iconFile: 'Minor Field Boss.png',
                label: 'Demi-Human Queen'
            },
            {
                areaName: 'Crater Minor Boss 3',
                iconFile: 'Minor Field Boss.png',
                label: 'Fire Prelates'
            },
            {
                areaName: 'Crater Minor Boss 4',
                iconFile: 'Minor Field Boss.png',
                label: 'Flying Dragon'
            },
            {
                areaName: 'Crater Minor Boss 5',
                iconFile: 'Minor Field Boss.png',
                label: 'Demi-Human Queen'
            },
            {
                areaName: 'Crater Major Boss 1',
                iconFile: 'Major Field Boss.png',
                label: 'Valiant Gargoyle'
            },
            {
                areaName: 'Crater Major Boss 2',
                iconFile: 'Major Field Boss.png',
                label: 'Fallingstar Beast'
            },
            {
                areaName: 'Crater Major Boss 3',
                iconFile: 'Shifting Earth Boss.png',
                label: 'Magma Wyrm'
            },
            {
                areaName: 'Crater Church',
                iconFile: 'Church.png',
                label: ''
            },
        ],
        // Rotted Woods, Noklateo, None…
        "Rotted Woods": [{
            areaName: 'Woods Castle',
            iconFile: 'Fort.png',
            label: 'Lordsworn Captain'
        }, ],
        Noklateo: [{
                areaName: 'Noklateo Minor Boss 1',
                iconFile: 'Minor Field Boss.png',
                label: 'Golden Hippopotamus'
            },
            {
                areaName: 'Noklateo Minor Boss 2',
                iconFile: 'Minor Field Boss.png',
                label: 'Black Knife Assassin'
            },
            {
                areaName: 'Noklateo Minor Boss 3',
                iconFile: 'Minor Field Boss.png',
                label: 'Royal Revenant'
            },
            {
                areaName: 'Noklateo Minor Boss 4',
                iconFile: 'Minor Field Boss.png',
                label: 'Headless Troll'
            },
            {
                areaName: 'Noklateo Minor Boss 5',
                iconFile: 'Minor Field Boss.png',
                label: 'Black Knife Assassin'
            },
            {
                areaName: 'Noklateo Major Boss 1',
                iconFile: 'Major Field Boss.png',
                label: 'Royal Carian Knight'
            },
            {
                areaName: 'Noklateo Major Boss 2',
                iconFile: 'Major Field Boss.png',
                label: 'Dragonkin Soldier'
            },
            {
                areaName: 'Noklateo Major Boss 3',
                iconFile: 'Major Field Boss.png',
                label: 'Flying Dragon'
            },
            {
                areaName: 'Noklateo Major Boss 4',
                iconFile: 'Shifting Earth Boss.png',
                label: 'Astel'
            },
        ],
    };

    const nightLordVariants = {
        Gnoster: [
            'Gnoster (Moth)',
            'Gnoster (Scorpion)'
        ],
        Heolstor: [
            'Heolstor the Nightlord Phase 1',
            'Heolstor the Nightlord Phase 2'
        ]
    };

    const gaolBossDuos = {
        'Demi-Human Queen & Demi-Human Swordmaster': ['Demi-Human Queen', 'Demi-Human Swordmaster'],
        'Crucible Knight & Golden Hippopotamus': ['Crucible Knight', 'Golden Hippopotamus'],
        'Godskin Duo': ['Godskin Noble', 'Godskin Apostle'],
        'Nameless King': ['Nameless King (Phase 1)', 'Nameless King (Phase 2)']
    };

    const nightBossDuos = {
        'Demi-Human Queen and Swordmaster': ['Demi-Human Queen', 'Demi-Human Swordmaster'],
        'Tree Sentinel and Royal Cavalrymen': ['Tree Sentinel'],
        'Draconic Tree Sentinel and Royal Cavalrymen': ['Draconic Tree Sentinel'],
        'Crucible Knight and Golden Hippopotamus': ['Crucible Knight', 'Golden Hippopotamus'],
    }

    const multiPhaseVariants = {
        ...nightLordVariants,
        ...gaolBossDuos,
        ...nightBossDuos
    };

    function _norm(s) {
        return String(s || '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[’'"]/g, '') // normalize quotes
            .trim();
    }

    function findRotBlessingMeta(variant) {
        const wantType = _norm('Rot Blessing');
        const wantName = _norm(variant);

        // exact normalized match first
        let m = locationMeta.find(
            r => _norm(r.areaType) === wantType && _norm(r.areaName) === wantName
        );
        if (m) return m;

        // fallback: allow partial contains (helps if Area Name has extra words)
        m = locationMeta.find(
            r => _norm(r.areaType) === wantType && _norm(r.areaName).includes(wantName)
        );
        return m || null;
    }

    // helper to draw them
    function renderStaticStructures() {
        document.querySelectorAll('.static-icon, .static-label').forEach(el => el.remove());
        const list = staticStructuresByEarth[currentSelections.earth] || [];
        console.log('🗻 staticStructures for', currentSelections.earth, list);

        list.forEach(({
            areaName,
            iconFile,
            label
        }) => {
            const meta = locationMeta.find(m => m.areaName === areaName);
            console.log('   ↳ looking up', areaName, '→', meta);
            if (!meta) return;

            // icon
            const icn = document.createElement('img');
            icn.src = `Icons/Locations/${iconFile}`;
            icn.className = 'overlay-icon';

            const typeKey = iconFile
                .replace(/\.[^/.]+$/, '') // strip ".png"
                .toLowerCase()
                .replace(/\s+/g, '-');
            icn.classList.add(`icon-${typeKey}`);
            icn.style.left = `${meta.xPct}%`;
            icn.style.top = `${meta.yPct}%`;

            // --- Find bossInfoMap key ---
            const searchName = (label || areaName).toLowerCase();
            let infoKeyMatch = Object.keys(bossInfoMap).find(k => {
                const parts = k.split(':'); // ["Boss Type", "Boss Name"]
                const bossType = parts[0].trim().toLowerCase();
                const bossName = (bossInfoMap[k].name || parts.slice(1).join(':')).toLowerCase();
                return bossType === 'static' && bossName === searchName;
            });

            // Determine popup content
            let popupHTML;

            if (infoKeyMatch) {
                popupHTML = singleSection(infoKeyMatch); // full table from bosses_info.csv
            } else {
                popupHTML = `<div style="padding:4px 8px;"><strong>${label || areaName}</strong></div>`;
            }

            attachInfoHover(icn, popupHTML);
            mapOverlay.appendChild(icn);

            // optional label
            if (label) {
                const lbl = document.createElement('div');
                lbl.className = 'overlay-label';
                lbl.style.left = `${meta.xPct}%`;
                lbl.style.top = `${meta.yPct + 4}%`;
                lbl.textContent = label;
                mapOverlay.appendChild(lbl);
            }
        });
    }


    function syncOverlayToImage() {
        const imgRect = mapImage.getBoundingClientRect();
        const wrapRect = imageWrapper.getBoundingClientRect();
        Object.assign(mapOverlay.style, {
            left: (imgRect.left - wrapRect.left) + 'px',
            top: (imgRect.top - wrapRect.top) + 'px',
            width: imgRect.width + 'px',
            height: imgRect.height + 'px',
            position: 'absolute'
        });
    }


    window.addEventListener('resize', syncOverlayToImage);
    new ResizeObserver(syncOverlayToImage).observe(mapImage);

    function getCurrentMapLocations() {
        return (mapLocations[currentSelections.earth] || []).map(name => {
            const meta = locationMeta.find(m => m.areaName === name);
            return meta && {
                id: name,
                x: meta.xPct,
                y: meta.yPct
            };
        }).filter(Boolean);
    }


    function normalizeAreaName(s) {
        return (s || '')
            .replace(/[’']/g, '') // drop curly/straight apostrophes
            .replace(/\s+/g, ' ') // collapse whitespace
            .trim()
            .toLowerCase();
    }

    function findMetaByAreaName(name) {
        const target = normalizeAreaName(name);
        return locationMeta.find(m => normalizeAreaName(m.areaName) === target) || null;
    }

    // --- Init boss icon grid ---
    function initBossGrid() {
        bossGrid.innerHTML = '';
        Object.keys(bossFolders).forEach(boss => {
            const div = document.createElement('div');
            div.className = 'boss-option' + (boss === selectedBoss ? ' selected' : '');
            div.dataset.boss = boss;

            const img = document.createElement('img');
            img.src = `Icons/Boss Icons/${bossIconFiles[boss]}`;
            img.alt = boss;
            div.appendChild(img);

            const label = bossIconFiles[boss].replace(/\.[^/.]+$/, '');
            const sp = document.createElement('span');
            sp.textContent = label;
            div.appendChild(sp);

            div.addEventListener('click', () => {
                $$('.boss-option.selected').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedBoss = boss;
            });

            bossGrid.appendChild(div);
        });
    }

    function initNightfarerGrid() {
        nightfarerGrid.innerHTML = '';
        Object.keys(nightfarerIcons).forEach(nf => {
            const div = document.createElement('div');
            div.className = 'boss-option' + (nf === selectedNightfarer ? ' selected' : '');
            div.dataset.nightfarer = nf;

            const img = document.createElement('img');
            img.src = `Icons/Nightfarers/${nightfarerIcons[nf]}`;
            img.alt = nf;
            div.appendChild(img);

            const sp = document.createElement('span');
            sp.textContent = nf;
            div.appendChild(sp);

            div.addEventListener('click', () => {
                $$('#nightfarerGrid .boss-option.selected').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedNightfarer = nf;
            });

            nightfarerGrid.appendChild(div);
        });
    }

    // --- Load locations metadata ---
    Papa.parse('sheets/locations.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete(results) {
            locationMeta = results.data.map(r => {
                const raw = r['Relative Position'];
                // remove any " characters, trim, then split on comma (ignoring spaces)
                const [xStr, yStr] = raw.replace(/"/g, '').trim().split(/\s*,\s*/);
                const xPct = Number(xStr);
                const yPct = Number(yStr);
                if (isNaN(xPct) || isNaN(yPct)) {
                    console.warn(`⚠️ could not parse coords for ${r['Area Name']}: "${raw}"`);
                }
                return {
                    areaName: r['Area Name'].trim(),
                    areaType: r['Area Type'].trim(),
                    xPct,
                    yPct
                };
            });
            console.log('✅ locationMeta parsed with clean floats:', locationMeta);
        }
    });


    Papa.parse('sheets/weapons.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete(results) {
            weaponsData = results.data.map(r => {
                const rec = {
                    cls: (r['Weapon Class'] || '').trim(),
                    name: (r['Weapon Name'] || '').trim(),
                    aff: (r['Attack Affinity'] || '').trim(),
                    ail: (r['Status Ailment'] || '').trim(),
                    eff: (r['Unique Weapon Effect'] || '').trim(),
                    atk: {
                        Physical: (r['Physical'] || '').trim(),
                        Magic: (r['Magic'] || '').trim(),
                        Fire: (r['Fire'] || '').trim(),
                        Lightning: (r['Lightning'] || '').trim(), // column label as given
                        Holy: (r['Holy'] || '').trim()
                    },
                    scal: {
                        STR: (r['Scaling STR'] || '').trim(),
                        DEX: (r['Scaling DEX'] || '').trim(),
                        INT: (r['Scaling INT'] || '').trim(),
                        FAI: (r['Scaling FAI'] || '').trim(),
                        ARC: (r['Scaling ARC'] || '').trim()
                    },
                    rarity: (r['Rarity'] || '').trim()
                };
                if (rec.cls && rec.name) weaponsByName[rec.name] = rec;
                return rec;
            }).filter(w => w.cls && w.name);
        }
    });


    // --- render weapons list for current nightfarer
    function renderPreferredWeapons() {
        const grid = document.querySelector('#weaponsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        const prefs = preferredWeapons[currentSelections.nightfarer] || [];
        if (!prefs.length || !weaponsData.length) return;

        const list = weaponsData.filter(w => prefs.includes(w.cls));

        list.forEach(w => {
            const item = document.createElement('div');
            item.className = 'weapon-tile';
            item.innerHTML = `
      <img src="Icons/Weapons/${w.name}.png" alt="${w.name}" onerror="this.style.display='none'">
      <span>${w.name}</span>
    `;
            grid.appendChild(item);

            // hover popup
            attachWeaponHover(item, buildWeaponPopupHTML(w.name));

        });
    }



    // --- Load seed→structures table ---

    Papa.parse('sheets/seedStructures.csv', {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete(results) {
            const [types, names, ...rows] = results.data;
            // figure out which indices hold the “Night 1 Circle” & “Night 2 Circle” columns
            const night1Idx = types.findIndex(t => t.trim() === 'Night 1 Circle');
            const night2Idx = types.findIndex(t => t.trim() === 'Night 2 Circle');
            const night1BossIdx = types.findIndex(t => t.trim() === 'Night 1 Boss');
            const night2BossIdx = types.findIndex(t => t.trim() === 'Night 2 Boss');
            const extraBossIdx = types.findIndex(t => t.trim() === 'Extra Night Boss');
            const spawnIdx = types.findIndex(t => t.trim() === 'Spawn Point');

            // find the Special Event column (case‑insensitive)
            const specialEventCol = types
                .map(n => n.trim().toLowerCase())
                .indexOf('special event');

            // build the area‑cols as before
            const cols = names.slice(1).map((nm, i) => ({
                areaType: types[i + 1].trim(),
                areaName: nm.trim(),
                col: i + 1
            }));

            rows.forEach(row => {
                const rawID = row[0].trim();
                const padID = rawID.padStart(3, '0');

                if (rawID) {
                    nightCircles[rawID] = {
                        night1: night1Idx >= 0 ? (row[night1Idx]?.trim() || '') : '',
                        night2: night2Idx >= 0 ? (row[night2Idx]?.trim() || '') : ''
                    };
                    nightBosses[rawID] = {
                        night1: night1BossIdx >= 0 ? row[night1BossIdx].trim() : '',
                        night2: night2BossIdx >= 0 ? row[night2BossIdx].trim() : '',
                        extra: extraBossIdx >= 0 ? row[extraBossIdx].trim() : ''
                    };
                    if (spawnIdx >= 0) {
                        seedSpawnPoint[rawID] = (row[spawnIdx] || '').trim();
                        seedSpawnPoint[padID] = seedSpawnPoint[rawID]; // allow zero-padded lookup too
                    };
                }

                // extract & normalize event
                let ev = 'None';
                if (specialEventCol >= 0) {
                    const r = row[specialEventCol].trim();
                    if (r !== '') ev = r;
                }

                // record it under both keys
                seedEvents[rawID] = ev;
                seedEvents[padID] = ev;

                // your existing structure mapping
                seedStructures[rawID] = cols.map(c => {
                    const raw = row[c.col].trim();
                    const [structureType = '', enemyType = ''] = raw
                        .split(' - ')
                        .map(s => s.trim());
                    return {
                        areaType: c.areaType,
                        areaName: c.areaName,
                        structureType,
                        enemyType
                    };
                });
            });
        }
    });

    function splitBossCombo(name) {
        if (!name) return [];
        const norm = name.replace(/\s*(?:&|and)\s*/ig, ' & ');
        return norm.split(' & ').map(s => s.trim()).filter(Boolean);
    }

    function expandBossNames(keyOrCombo) {
        const parts = splitBossCombo(keyOrCombo);
        const out = [];
        parts.forEach(p => {
            const variants = multiPhaseVariants[p] || [p];
            variants.forEach(v => out.push(v));
        });
        return out;
    }

    // Given a boss name (or combo) and a context type, return matching info keys
    function resolveBossKeys(nameOrCombo, contextType) {
        const names = expandBossNames(nameOrCombo); // concrete names
        return names.map(n => {
            const exact = `${contextType}:${n}`;
            if (bossInfoMap[exact]) return exact;
            // fallback: first entry with same name under any type
            const any = Object.keys(bossInfoMap).find(k => k.endsWith(':' + n));
            return any || exact; // may be missing if CSV lacks it
        });
    }

    function renderSpawnPoint(seedID) {
        const locName = seedSpawnPoint[seedID];
        if (!locName) return;

        const meta = findMetaByAreaName(locName);
        if (!meta) return;

        // Try to use an icon image; if it fails, swap to a small badge.
        const icn = document.createElement('img');
        icn.src = 'Icons/Locations/Spawnpoint.png'; // put your asset here
        icn.className = 'overlay-icon icon-spawn-point';
        icn.style.left = `${meta.xPct}%`;
        icn.style.top = `${meta.yPct}%`;

        icn.onerror = () => {
            // fallback: a tiny badge if the image isn't available
            const badge = document.createElement('div');
            badge.className = 'overlay-label';
            badge.style.left = `${meta.xPct}%`;
            badge.style.top = `${meta.yPct}%`;
            badge.textContent = 'Spawn';
            mapOverlay.appendChild(badge);
            icn.remove();
        };

        mapOverlay.appendChild(icn);



        // Hover popup
        attachInfoHover(icn, `<div style="padding:6px 8px;"><strong>Spawn Point</strong><br>${locName}</div>`);
    }



    // --- Church/Rise handler ---
    function handleMarkerClick(e) {
        e.preventDefault();
        const id = e.currentTarget.dataset.locationId;
        const isC = userChurches.includes(id),
            isR = userRises.includes(id);

        if (e.type === 'click') {
            if (isC) {
                userChurches = userChurches.filter(x => x !== id);
                e.currentTarget.classList.remove('church');
            } else {
                if (isR) {
                    userRises = userRises.filter(x => x !== id);
                    e.currentTarget.classList.remove('rise');
                }
                userChurches.push(id);
                e.currentTarget.classList.add('church');
            }
        } else {
            if (isR) {
                userRises = userRises.filter(x => x !== id);
                e.currentTarget.classList.remove('rise');
            } else {
                if (isC) {
                    userChurches = userChurches.filter(x => x !== id);
                    e.currentTarget.classList.remove('church');
                }
                userRises.push(id);
                e.currentTarget.classList.add('rise');
            }
        }
        document.getElementById('mapInstructions').classList.add('hidden');

        updatePossibleSeeds();
    }

    function createMarkers() {
        mapOverlay.innerHTML = '';
        getCurrentMapLocations().forEach(loc => {
            const m = document.createElement('div');
            m.className = 'map-marker';
            m.dataset.locationId = loc.id;
            m.style.left = loc.x + '%';
            m.style.top = loc.y + '%';
            m.addEventListener('click', handleMarkerClick);
            m.addEventListener('contextmenu', handleMarkerClick);
            mapOverlay.appendChild(m);
        });
    }

    // --- Reset everything ---
    function resetMarkers() {
        userChurches = [];
        userRises = [];

        // restore all markers
        $$('.map-marker').forEach(m =>
            m.classList.remove('church', 'rise', 'hidden')
        );

        seedDisplay.classList.add('hidden');
        viewSeedButton.classList.add('hidden');

        // remove every overlay-icon and overlay-label (static + dynamic)
        $$('.overlay-icon, .overlay-label, .boss-event-text, .circle-wrapper, .circle-label')
            .forEach(el => el.remove());
    }


    function renderSeedMap(seedID) {
        $$('.overlay-icon, .overlay-label').forEach(el => el.remove());
        const list = seedStructures[seedID] || [];

        list.forEach(({
            areaType,
            areaName,
            structureType,
            enemyType
        }) => {
            // --- Rot Blessing objective (areaName is empty in seedStructures) ---
            if (areaType === 'Rot Blessing') {
                const variant = (structureType || '').trim();
                if (!variant || /^empty$/i.test(variant)) return; // no objective for this seed

                const rbMeta = findRotBlessingMeta(variant);
                if (!rbMeta) {
                    console.warn('[Rot Blessing] coords not found for', variant);
                    return;
                }

                const icn = document.createElement('img');
                // use requested icon; try lowercase first, then fallback to capitalized if your files use that
                icn.src = 'Icons/Locations/objective.png';
                icn.onerror = () => {
                    icn.onerror = null;
                    icn.src = 'Icons/Locations/Objective.png';
                };
                icn.className = 'overlay-icon icon-objective';
                icn.style.left = `${rbMeta.xPct}%`;
                icn.style.top = `${rbMeta.yPct}%`;
                mapOverlay.appendChild(icn);



                attachInfoHover(icn, `<div style="padding:6px 8px;"><strong>Rot Blessing</strong><br>${variant}</div>`);
                return; // done with this row
            }
            // --- normal flow (everything else) ---
            const meta = locationMeta.find(m => m.areaName === areaName);
            if (!meta) return;
            if (!structureType || structureType === 'Small Camp') return;

            // Determine icon
            let iconFile;
            if (areaType === 'Field Boss' && areaName !== 'Castle Rooftop') {
                iconFile = (fieldBosses[structureType] === 'Strong' ?
                    'Major Field Boss.png' :
                    'Minor Field Boss.png');
            } else if (areaType === 'Evergaol') {
                iconFile = (evergaolBosses[structureType] === 'Strong' ?
                    'Strong Evergaol.png' :
                    'Evergaol.png');
            } else if (areaType === 'Rotted Woods' && structureType !== 'Putrid Ancestral Followers') {
                iconFile = 'Major Field Boss.png';
            } else {
                iconFile = `${structureType}.png`;
            }

            const icn = document.createElement('img');
            icn.src = `Icons/Locations/${iconFile}`;
            icn.className = 'overlay-icon';

            const normalizedStructureType = structureType.toLowerCase().replace(/\s/g, '-');
            if (['Field Boss', 'Evergaol', 'Rotted Woods'].includes(areaType)) {
                icn.classList.add(`icon-${areaType.toLowerCase().replace(/\s/g, '-')}`);
            } else {
                icn.classList.add(`icon-${normalizedStructureType}`);
            }

            icn.style.left = `${meta.xPct}%`;
            icn.style.top = `${meta.yPct}%`;
            icn.onerror = () => icn.remove();
            mapOverlay.appendChild(icn);

            // label (hide for certain structures)
            let labelText = enemyType || structureType;
            if (
                (structureType.includes('Church') && !structureType.includes('Great Church')) ||
                structureType === 'Putrid Ancestral Followers' ||
                structureType.includes('Township')
            ) labelText = '';

            if (labelText) {
                const lbl = document.createElement('div');
                lbl.className = 'overlay-label';
                lbl.style.left = `${meta.xPct}%`;
                lbl.style.top = `${meta.yPct + 4}%`;
                lbl.textContent = labelText;
                mapOverlay.appendChild(lbl);
            }

            // popups
            if (areaType === 'Field Boss' || areaType === 'Evergaol') {
                attachInfoHover(icn, buildPopupHTML(structureType || enemyType, areaType));
            }

            if (areaType === 'Rotted Woods' && structureType !== 'Putrid Ancestral Followers') {
                const infoKeyMatch = Object.keys(bossInfoMap).find(k => {
                    const [bt, ...rest] = k.split(':');
                    const bossType = (bt || '').trim().toLowerCase();
                    const bossName = rest.join(':').trim().toLowerCase();
                    return bossType === 'field' && bossName === structureType.trim().toLowerCase();
                });

                attachInfoHover(
                    icn,
                    infoKeyMatch ? singleSection(infoKeyMatch) :
                    `<div style="padding:4px 8px;"><strong>${structureType}</strong></div>`
                );
            }
        });
    }



    // --- Filter seeds & (re)render map overlays ---
    function updatePossibleSeeds() {
        const bosses = Object.keys(bossFolders);
        const bi = bosses.indexOf(currentSelections.boss);
        const start = bi * 40,
            end = start + 40;

        currentPossible = seedData.filter(s => {
            const n = parseInt(s.id, 10);
            if (n < start || n >= end) return false;
            const m = n - start;
            switch (currentSelections.earth) {
                case 'None':
                    if (m >= 20) return false;
                    break;
                case 'Mountains':
                    if (m < 20 || m >= 25) return false;
                    break;
                case 'Crater':
                    if (m < 25 || m >= 30) return false;
                    break;
                case 'Rotted Woods':
                    if (m < 30 || m >= 35) return false;
                    break;
                case 'Noklateo':
                    if (m < 35 || m >= 40) return false;
                    break;
            }
            return userChurches.every(c => s.churchLocations.includes(c)) &&
                userRises.every(r => s.riseLocations.includes(r));
        });

        seedDisplay.textContent =
            `${currentPossible.length} possible seed${currentPossible.length === 1 ? `: ${currentPossible[0].id}` : 's'}`;
        seedDisplay.classList.remove('hidden');
        // viewSeedButton.classList.toggle('hidden', currentPossible.length !== 1);

        if (currentPossible.length === 1) {
            renderSeedMap(currentPossible[0].id);
            renderStaticStructures();
            showSpecialEvent(currentPossible[0].id);
            showNightCircles(currentPossible[0].id);
            renderSpawnPoint(currentPossible[0].id);


            $$('.map-marker').forEach(m => m.classList.add('hidden'));
        } else {
            $$('.map-marker').forEach(m => m.classList.remove('hidden'));
        }
    }

    // --- Load church/rise seed patterns ---
    Papa.parse('sheets/seeds.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete(results) {
            seedData = results.data.filter(r => r.ID).map(r => ({
                id: r.ID.trim(),
                churchLocations: r.churchLocations.split(';').map(s => s.trim()),
                riseLocations: r.riseLocations.split(';').map(s => s.trim())
            }));
        }
    });

    // ── 1) Parse bosses_info.csv into a lookup map ────────────────────────────────
    Papa.parse('sheets/bosses_info.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete(results) {
            results.data.forEach(r => {
                const type = (r['Boss Type'] || '').trim(); // NEW
                const name = (r['Boss Name'] || '').trim();
                const key = `${type}:${name}`; // NEW

                bossInfoMap[key] = { // CHANGED
                    type, // NEW
                    name, // NEW (store raw name for display)
                    drops: (r['Runes'] || '').trim(),
                    hp: (r['HP'] || '').trim(),
                    resistances: {
                        Standard: (r['Standard'] || '').trim(),
                        Slash: (r['Slash'] || '').trim(),
                        Strike: (r['Strike'] || '').trim(),
                        Pierce: (r['Pierce'] || '').trim(),
                        Magic: (r['Magic'] || '').trim(),
                        Fire: (r['Fire'] || '').trim(),
                        Lightning: (r['Lightning'] || '').trim(),
                        Holy: (r['Holy'] || '').trim(),
                        Poison: (r['Poison'] || '').trim(),
                        'Scarlet Rot': (r['Scarlet Rot'] || '').trim(),
                        'Blood Loss': (r['Blood Loss'] || '').trim(),
                        Frostbite: (r['Frostbite'] || '').trim(),
                        Sleep: (r['Sleep'] || '').trim(),
                        Madness: (r['Madness'] || '').trim(),
                        'Death Blight': (r['Death Blight'] || '').trim()
                    }
                };
            });
        }
    });



    // --- Load and show map + markers ---
    function displayMap(earth) {
        errorMessage.classList.add('hidden');
        mapImage.src = '';
        imageWrapper.classList.add('hidden');
        resetMarkersBtn.classList.add('hidden');
        seedDisplay.classList.add('hidden');

        const loader = new Image();
        const path = `Maps/${encodeURIComponent(earth)}.png`;
        loader.onload = () => {
            mapImage.src = path;
            imageWrapper.classList.remove('hidden');
            if (leftInfo) leftInfo.classList.remove('hidden');
            resetMarkersBtn.classList.remove('hidden');

            syncOverlayToImage(); // <<< position overlay exactly over image

            createMarkers();
            showBossOverlay();
        };
        loader.onerror = () => {
            errorMessage.textContent = `Map not found: ${path}`;
            errorMessage.classList.remove('hidden');
        };
        loader.src = path;
    }




    function showBossOverlay() {
        // 1) clear any old overlay
        mapOverlay.querySelectorAll('.boss-overlay').forEach(el => el.remove());

        // 2) draw the big boss icon
        const base = currentSelections.boss; // e.g. "Gnoster" or "Heolstor"
        const imgFile = bossIconFiles[base];
        if (!imgFile) return;

        const el = document.createElement('img');
        el.src = `Icons/Boss Icons/${imgFile}`;
        el.className = 'boss-overlay';
        mapOverlay.appendChild(el);

        // 3) decide which CSV rows to show in the popup
        //    use our hard-coded list if it exists, otherwise just the base name
        const names = nightLordVariants[base] || [base];

        // 4) build HTML only for rows that really are Night Lords
        const html = names
            .filter(name => bossInfoMap[name]?.type === 'Night Lord')
            .map(name => buildPopupHTML(name))
            .join('<hr>');

        // 5) wire up the hover
        attachInfoHover(el, buildPopupHTML(currentSelections.boss, 'Night Lord'));

    }


    function showSpecialEvent(seedID) {
        // remove any old text
        mapOverlay.querySelectorAll('.boss-event-text').forEach(el => el.remove());
        // look up event (or “None”)
        const text = seedEvents[seedID] || 'None';
        const div = document.createElement('div');
        div.className = 'boss-event-text';
        div.textContent = 'Special Event: ' + text;
        mapOverlay.appendChild(div);
    }

    function splitBossCombo(name) {
        if (!name) return [];
        // Only match standalone "and" or "&", not part of other words
        const norm = name.replace(/\b(?:&|and)\b/gi, ' & ');
        if (norm.includes(' & ')) {
            return norm.split(' & ').map(s => s.trim()).filter(Boolean);
        }
        return [name.trim()];
    }


    // Expand a key or combo into final boss names, handling duos *and* phase variants
    function expandBossNames(keyOrCombo) {
        const parts = splitBossCombo(keyOrCombo);
        const out = [];
        parts.forEach(p => {
            const variants = multiPhaseVariants[p] || [p];
            variants.forEach(v => out.push(v));
        });
        return out;
    }

    function attachInfoHover(iconEl, html) {
        let hideTimeout;

        iconEl.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            content.innerHTML = html;
            popup.scrollTop = 0; // reset on show
            popup.classList.remove('hidden');

            const iconRect = iconEl.getBoundingClientRect();
            const popupRect = popup.getBoundingClientRect();

            let newLeft = iconRect.right + 8;
            let newTop = iconRect.top;

            // Check if the popup goes off the right side of the screen
            if (newLeft + popupRect.width > window.innerWidth) {
                newLeft = iconRect.left - popupRect.width - 8;
            }

            // Check if the popup goes off the left side of the screen
            if (newLeft < 0) {
                newLeft = 8; // A small margin from the left edge
            }

            // Check if the popup goes off the bottom of the screen
            if (newTop + popupRect.height > window.innerHeight) {
                newTop = window.innerHeight - popupRect.height - 8;
            }

            // Check if the popup goes off the top of the screen
            if (newTop < 0) {
                newTop = 8; // A small margin from the top edge
            }

            popup.style.left = `${newLeft}px`;
            popup.style.top = `${newTop}px`;
        });

        iconEl.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                popup.scrollTop = 0; // reset before hiding
                popup.classList.add('hidden');
            }, 200);
        });

        popup.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });

        popup.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                popup.scrollTop = 0; // reset before hiding
                popup.classList.add('hidden');
            }, 200);
        });
    }



    function showNightCircles(seedID) {
        // clean up old
        mapOverlay.querySelectorAll('.circle-wrapper, .circle-label').forEach(el => el.remove());

        const circles = nightCircles[seedID] || {};
        const bosses = nightBosses[seedID] || {};
        const evt = seedEvents[seedID] || '';

        // decide which night gets the extra boss
        const extraOnNight1 = evt.includes('Day 1 Extra Night Boss');
        const extraOnNight2 = evt.includes('Day 2 Extra Night Boss');

        ['night1', 'night2'].forEach(key => {
            const area = circles[key];
            if (!area) return;
            const meta = locationMeta.find(m => m.areaName === area);
            if (!meta) return;

            // wrapper
            const wrap = document.createElement('div');
            wrap.className = 'circle-wrapper';
            wrap.style.left = `${meta.xPct}%`;
            wrap.style.top = `${meta.yPct}%`;
            mapOverlay.appendChild(wrap);

            // icon
            const img = document.createElement('img');
            img.src = 'Icons/Locations/Storm.png';
            img.className = 'circle-icon';

            wrap.appendChild(img);

            // build label
            let text;
            if (key === 'night1') {
                text = `1. ${bosses.night1}`;
                if (extraOnNight1 && bosses.extra && bosses.extra !== 'None') {
                    text += ` & ${bosses.extra}`;
                }
            } else {
                text = `2. ${bosses.night2}`;
                if (extraOnNight2 && bosses.extra && bosses.extra !== 'None') {
                    text += ` & ${bosses.extra}`;
                }
            }

            const lbl = document.createElement('div');
            lbl.className = 'circle-label';
            lbl.textContent = text;
            lbl.style.left = `${meta.xPct}%`;
            lbl.style.top = `${meta.yPct}%`;
            mapOverlay.appendChild(lbl);

            // build the hover target name, including extra when applicable
            let hoverName = bosses[key];
            if ((key === 'night1' && extraOnNight1) || (key === 'night2' && extraOnNight2)) {
                if (bosses.extra && bosses.extra !== 'None') {
                    hoverName = `${bosses[key]} & ${bosses.extra}`;
                }
            }
            attachInfoHover(lbl, buildPopupHTML(hoverName, 'Night Boss'));

        });
    }

    // ── 2) Build the popup’s HTML from bossInfoMap ────────────────────────────────
    function singleSection(infoKey) {
        const info = bossInfoMap[infoKey] || {};
        const title = info.name || infoKey.split(':').slice(1).join(':');

        const R = info.resistances || {};
        const physTypes = ['Standard', 'Slash', 'Strike', 'Pierce'];
        const elemTypes = ['Magic', 'Fire', 'Lightning', 'Holy'];
        const statusTypes = ['Poison', 'Scarlet Rot', 'Blood Loss', 'Frostbite', 'Sleep', 'Madness'];
        const sepKeys = new Set(['Standard', 'Magic', 'Poison']);

        // Weak list: phys < -20, elem < 0
        const weakHTML = [
                ...physTypes.filter(k => parseFloat(R[k] || 0) <= -10),
                ...elemTypes.filter(k => parseFloat(R[k] || 0) < 0)
            ]
            .map(k => `<img class="res-icon" src="Icons/Resistance Icons/${k}.png" alt="${k}">`)
            .join('') || '—';

        // Strong list: only elementals, >= 20
        const strongHTML = elemTypes
            .filter(k => parseFloat(R[k] || 0) >= 20)
            .map(k => `<img class="res-icon" src="Icons/Resistance Icons/${k}.png" alt="${k}">`)
            .join('') || '—';

        let html = `
        <table>
        <thead><tr><th colspan="2"><h2>${title}</h2><br></th></tr></thead>
        <tbody>
            <tr><td>Runes Dropped</td><td>${info.drops || '—'}</td></tr>
            <tr><td>HP</td><td>${info.hp || '—'}</td></tr>
            <tr><td>Weak To</td><td>${weakHTML}</td></tr>
            <tr><td>Strong Against</td><td>${strongHTML}</td></tr>
        </tbody>
        </table>
        <br><h3 style="text-align:center;">Resistances</h3>
        <table><tbody>
    `;

        [...physTypes, ...elemTypes, ...statusTypes].forEach(key => {
            const val = R[key] || '—';
            const cls = sepKeys.has(key) ? ' class="sep-row"' : '';
            html += `
        <tr${cls}>
            <td><img class="res-icon" src="Icons/Resistance Icons/${key}.png" alt="${key}">${key}</td>
            <td>${val}</td>
        </tr>`;
        });

        html += `</tbody></table>`;
        return html;
    }


    function normalizeAilment(raw) {
        if (!raw) return '';
        const s = raw.trim().toLowerCase();
        if (s === '-' || s === 'none') return '';

        // normalize common variants → display name + icon file
        if (s.includes('bleed') || s.includes('blood')) return 'Blood Loss';
        if (s.includes('rot')) return 'Scarlet Rot';
        if (s.includes('frost')) return 'Frostbite';
        if (s.includes('sleep')) return 'Sleep';
        if (s.includes('mad')) return 'Madness';
        // not relevant → hide
        return '';
    }

    function getMetaForArea(areaName, structureType) {
        // Rot Blessing appears 3 times in locations.csv with different Area Types
        if (areaName === 'Rot Blessing') {
            // structureType here is the value from the seed row: Southwest/Northeast/West
            return locationMeta.find(m =>
                m.areaName.trim() === 'Rot Blessing' &&
                m.areaType.trim().toLowerCase() === (structureType || '').trim().toLowerCase()
            ) || null;
        }
        // default path (unique Area Name)
        return locationMeta.find(m => m.areaName === areaName) || null;
    }

    function buildPopupHTML(nameOrCombo, contextType) {
        const keys = resolveBossKeys(nameOrCombo, contextType);
        if (keys.length === 1) return singleSection(keys[0]);
        return `<div class="popup-sections">${keys.map(k => `<div class="popup-section">${singleSection(k)}</div>`).join('')}</div>`;
    }

    function buildWeaponPopupHTML(weaponName) {
        const w = weaponsByName[weaponName];
        if (!w) return `<div><strong>${weaponName}</strong><br><em>No data.</em></div>`;

        // Status (optional)
        // Status (optional) — hide if empty or "-"
        const normAil = normalizeAilment(w.ail);
        const statusHTML = normAil ?
            `<div class="weapon-status">
       <img src="Icons/Resistance Icons/${normAil}.png" alt="${normAil}" onerror="this.style.display='none'">
       <span>${normAil}</span>
     </div>` :
            '';


        // Attack rows: only non-zero/non-blank
        const atkOrder = ['Physical', 'Magic', 'Fire', 'Lightning', 'Holy'];
        const atkRows = atkOrder
            .filter(k => (w.atk[k] && w.atk[k] !== '0' && w.atk[k] !== '0.0'))
            .map(k => `<tr><td>${k}</td><td>${w.atk[k]}</td></tr>`)
            .join('');

        const atkTable = atkRows ?
            `<table class="weapon-mini"><tbody>${atkRows}</tbody></table>` :
            '';

        // Scalings: group by grade (S→E), show only non-empty
        const gradeOrder = ['S', 'A', 'B', 'C', 'D', 'E'];
        const byGrade = Object.entries(w.scal).reduce((acc, [stat, grade]) => {
            if (!grade) return acc;
            const g = grade.toUpperCase();
            if (!gradeOrder.includes(g)) return acc;
            (acc[g] ||= []).push(stat);
            return acc;
        }, {});
        const scalHTML = gradeOrder
            .filter(g => byGrade[g]?.length)
            .map(g => `<div class="scaling-line"><span class="grade">${g}</span> <span>${byGrade[g].join(', ')}</span></div>`)
            .join('');

        return `
    <div class="weapon-pop">
      <div class="weapon-pop-header">
        
        <div>
          <div class="weapon-pop-name">${w.name}</div>
          <div class="weapon-pop-class">${w.cls}</div>
        </div>
      </div>
      ${statusHTML}
      ${atkTable}
      ${scalHTML ? `<div class="scaling-wrap">${scalHTML}</div>` : ''}
    </div>
  `;
    }

    function attachWeaponHover(targetEl, html) {
        function position() {
            const iconRect = targetEl.getBoundingClientRect();
            let left = iconRect.right + 8;
            let top = iconRect.top;

            requestAnimationFrame(() => {
                const rect = popup.getBoundingClientRect();
                left = Math.min(Math.max(8, left), window.innerWidth - rect.width - 8);
                top = Math.min(Math.max(8, top), window.innerHeight - rect.height - 8);
                popup.style.left = `${left}px`;
                popup.style.top = `${top}px`;
            });
        }

        targetEl.addEventListener('mouseenter', () => {
            content.innerHTML = html;
            popup.scrollTop = 0;
            popup.classList.remove('hidden');
            position();
        });

        targetEl.addEventListener('mousemove', position);

        targetEl.addEventListener('mouseleave', () => {
            popup.classList.add('hidden');
        });
    }


    // --- UI flow ---
    window.confirmSelections = () => {
        currentSelections.boss = selectedBoss;
        currentSelections.earth = earthSelect.value;
        currentSelections.nightfarer = selectedNightfarer;
        currentSelections.players = [...playersRadios].find(r => r.checked).value;
        selectionPanel.classList.add('hidden');
        backButton.classList.remove('hidden');
        displayMap(currentSelections.earth);
        renderPreferredWeapons(); // <-- add this
        document.getElementById('mapInstructions').classList.remove('hidden');
    };
    window.showSelections = () => {
        selectionPanel.classList.remove('hidden');
        selectedNightfarer = currentSelections.nightfarer;
        initNightfarerGrid();
        [...playersRadios].forEach(r => r.checked = (r.value === currentSelections.players));
        backButton.classList.add('hidden');
        resetMarkersBtn.classList.add('hidden');
        imageWrapper.classList.add('hidden');
        errorMessage.classList.add('hidden');
        seedDisplay.classList.add('hidden');
        container.classList.remove('fullscreen-map');
        earthSelect.value = currentSelections.earth;
        document.getElementById('mapInstructions').classList.add('hidden');
        if (leftInfo) leftInfo.classList.add('hidden');
        resetMarkers();
    };
    window.resetMarkers = resetMarkers;



    initBossGrid();
    initNightfarerGrid();
    initBossGrid();

    // ── DEBUG ──
    const DEBUG_SEED = 310;
    if (typeof DEBUG_SEED !== 'undefined') {
        const seedNum = DEBUG_SEED;
        const seedID = seedNum.toString(); // for renderSeedMap lookup
        const paddedID = seedID.padStart(3, '0'); // if you ever need zero‑pad

        // 1) compute boss & earth exactly as updatePossibleSeeds does:
        const bossesArr = Object.keys(bossFolders);
        const bi = Math.min(Math.floor(seedNum / 40), bossesArr.length - 1);
        const boss = bossesArr[bi];
        const m = seedNum - bi * 40;
        let earth;
        if (m < 20) earth = 'None';
        else if (m < 25) earth = 'Mountains';
        else if (m < 30) earth = 'Crater';
        else if (m < 35) earth = 'Rotted Woods';
        else earth = 'Noklateo';

        // 2) apply to your selection state & UI
        currentSelections.boss = boss;
        currentSelections.earth = earth;
        $$('.boss-option.selected').forEach(el => el.classList.remove('selected'));
        document
            .querySelector(`.boss-option[data-boss="${boss}"]`)
            ?.classList.add('selected');
        earthSelect.value = earth;
        selectionPanel.classList.add('hidden');
        backButton.classList.remove('hidden');

        // 3) load the map
        displayMap(earth);

        // 4) once the map + raw markers are in place, draw all overlays
        mapImage.addEventListener('load', function _dbg() {
            mapImage.removeEventListener('load', _dbg);

            // dynamic icons & labels
            renderSeedMap(seedID);
            renderStaticStructures();
            showBossOverlay();
            showSpecialEvent(seedID);
            showNightCircles(seedID);
            renderSpawnPoint(seedID)

            // hide the plain map‑markers
            $$('.map-marker').forEach(m => m.classList.add('hidden'));
        });
    }


});

// Add to app.js (after DOMContentLoaded)
document.querySelectorAll('.info-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.info-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // hide all tables + the weapons grid
        document.querySelectorAll('#infoTables .info-table, #weaponsGrid')
            .forEach(el => el.classList.add('hidden'));

        const tab = btn.getAttribute('data-tab');
        if (tab === 'weapons') {
            document.getElementById('weaponsGrid').classList.remove('hidden');
            renderPreferredWeapons(); // ensure fresh render
        } else {
            document.getElementById(tab + 'Table').classList.remove('hidden');
        }
    });
});