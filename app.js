// app.js
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
    const seedEvents = {};
    
    // --- Application state ---
    let selectedBoss = 'Gladius';
    let currentSelections = { boss: 'Gladius', earth: 'None' };
    let userChurches = [];
    let userRises = [];
    let seedData = [];
    let currentPossible = [];
    let locationMeta = [];
    let seedStructures = {};

    // --- Classification maps ---
    const fieldBosses = {
        'Grafted Scion': 'Weak', 'Black Knife Assassin': 'Weak', 'Red Wolf': 'Weak',
        'Ancient Hero of Zamor': 'Weak', 'Leonine Misbegotten': 'Weak', 'Elder Lion': 'Weak',
        'Golden Hippo': 'Weak', 'Demi-Human Queen': 'Weak', 'Miranda Blossom': 'Weak',
        'Royal Revenant': 'Weak', "Knight's Cavalry": 'Weak', 'Flying Dragon': 'Strong',
        'Ulcerated Tree Spirit': 'Strong', 'Erdtree Avatar': 'Strong', 'Bell Bearing Hunter': 'Strong',
        'Ancestor Spirit': 'Strong', 'Tree Sentinel': 'Strong', 'Magma Wyrm': 'Strong',
        'Royal Carian Knight': 'Strong', 'Death Rite Bird': 'Strong', 'Black Blade Kindred': 'Strong',
        'Draconic Tree Sentinel': 'Strong'
    };
    const evergaolBosses = {
        'Omen': 'Weak', 'Grave Warden Duelist': 'Weak', 'Bloodhound Knight': 'Weak',
        'Stoneskin Lords': 'Weak', 'Nox Warriors': 'Weak', 'Beastly Brigade': 'Weak',
        'Beastmen of Farum Azula': 'Weak', 'Crystalians': 'Weak', 'Banished Knights': 'Weak',
        'Dragonkin Soldier': 'Strong', 'Godskin Noble': 'Strong', 'Godskin Apostle': 'Strong',
        'Crucible Knight': 'Strong', 'Ancient Dragon': 'Strong', 'Godskin Duo': 'Strong',
        'Death Rite Bird': 'Strong'
    };

    // --- Constants for boss folders & icons ---
    const bossFolders = {
        Gladius: '1_Gladius', Adel: '2_Adel', Gnoster: '3_Gnoster', Maris: '4_Maris',
        Libra: '5_Libra', Fulghor: '6_Fulghor', Caligo: '7_Caligo', Heolstor: '8_Heolstor'
    };
    const bossIconFiles = {
        Gladius: 'Gladius, Beast of Night.png', Adel: 'Adel, Baron of Night.png',
        Gnoster: 'Gnoster, Wisdom of Night.png', Maris: 'Maris, Fathom of Night.png',
        Libra: 'Libra, Creature of Night.png', Fulghor: 'Fulghor, Champion of Nightglow.png',
        Caligo: 'Caligo, Miasma of Night.png', Heolstor: 'Heolstor, The Nightlord.png'
    };

    // --- Map coordinates for each Shifting Earth ---
    const mapLocations = {
        None: [
            { id: '1_Northeast of Saintsbridge', x: 53.12, y: 23.44 },
            { id: '2_West of Warmasters Shack', x: 22.83, y: 36.46 },
            { id: '3_Below Summonwater Hawk', x: 65.75, y: 37.50 },
            { id: '4_Third Church', x: 75.12, y: 36.46 },
            { id: '5_Above Stormhill Tunnel Entrance', x: 36.46, y: 40.62 },
            { id: '6_Stormhill South of Gate', x: 23.79, y: 57.29 },
            { id: '7_Minor Erdtree', x: 76.73, y: 59.38 },
            { id: '8_East of Cavalry Bridge', x: 55.21, y: 64.58 },
            { id: '9_Far Southwest', x: 23.79, y: 71.88 },
            { id: '10_Lake', x: 45.83, y: 70.83 },
            { id: '11_Southeast of Lake', x: 57.29, y: 80.73 }
        ],
        Mountains: [
            { id: '1_Northeast of Saintsbridge', x: 53.12, y: 23.44 },
            { id: '3_Below Summonwater Hawk', x: 65.75, y: 37.50 },
            { id: '4_Third Church', x: 75.12, y: 36.46 },
            { id: '6_Stormhill South of Gate', x: 23.79, y: 57.29 },
            { id: '7_Minor Erdtree', x: 76.73, y: 59.38 },
            { id: '8_East of Cavalry Bridge', x: 55.21, y: 64.58 },
            { id: '9_Far Southwest', x: 23.79, y: 71.88 },
            { id: '10_Lake', x: 45.83, y: 70.83 },
            { id: '11_Southeast of Lake', x: 57.29, y: 80.73 }
        ],
        Crater: [
            { id: '2_West of Warmasters Shack', x: 22.83, y: 36.46 },
            { id: '3_Below Summonwater Hawk', x: 65.75, y: 37.50 },
            { id: '4_Third Church', x: 75.12, y: 36.46 },
            { id: '6_Stormhill South of Gate', x: 23.79, y: 57.29 },
            { id: '7_Minor Erdtree', x: 76.73, y: 59.38 },
            { id: '8_East of Cavalry Bridge', x: 55.21, y: 64.58 },
            { id: '9_Far Southwest', x: 23.79, y: 71.88 },
            { id: '10_Lake', x: 45.83, y: 70.83 },
            { id: '11_Southeast of Lake', x: 57.29, y: 80.73 }
        ],
        'Rotted Woods': [
            { id: '1_Northeast of Saintsbridge', x: 53.12, y: 23.44 },
            { id: '2_West of Warmasters Shack', x: 22.83, y: 36.46 },
            { id: '3_Below Summonwater Hawk', x: 65.75, y: 37.50 },
            { id: '4_Third Church', x: 75.12, y: 36.46 },
            { id: '5_Above Stormhill Tunnel Entrance', x: 36.46, y: 40.62 },
            { id: '6_Stormhill South of Gate', x: 23.79, y: 57.29 },
            { id: '9_Far Southwest', x: 23.79, y: 71.88 },
            { id: '10_Lake', x: 45.83, y: 70.83 }
        ],
        Noklateo: [
            { id: '1_Northeast of Saintsbridge', x: 53.12, y: 23.44 },
            { id: '2_West of Warmasters Shack', x: 22.83, y: 36.46 },
            { id: '3_Below Summonwater Hawk', x: 65.75, y: 37.50 },
            { id: '4_Third Church', x: 75.12, y: 36.46 },
            { id: '5_Above Stormhill Tunnel Entrance', x: 36.46, y: 40.62 },
            { id: '7_Minor Erdtree', x: 76.73, y: 59.38 },
            { id: '8_East of Cavalry Bridge', x: 55.21, y: 64.58 },
            { id: '11_Southeast of Lake', x: 57.29, y: 80.73 }
        ]
    };
    const staticStructuresByEarth = {
        Mountains: [
            { areaName: 'Mountains Minor Boss 1', iconFile: 'Minor Field Boss.png', label: 'Demi-Human Swordmaster' },
            { areaName: 'Mountains Minor Boss 2', iconFile: 'Minor Field Boss.png', label: 'Giant Crows' },
            { areaName: 'Mountains Minor Boss 3', iconFile: 'Minor Field Boss.png', label: 'Demi-Human Swordmaster' },
            { areaName: 'Mountains Minor Boss 4', iconFile: 'Minor Field Boss.png', label: 'Flying Dragon' },
            { areaName: 'Mountains Minor Boss 5', iconFile: 'Minor Field Boss.png', label: 'Snowfield Trolls' },
            { areaName: 'Mountains Major Boss 1', iconFile: 'Major Field Boss.png', label: 'Mountaintop Ice Dragon' },
            { areaName: 'Mountains Major Boss 2', iconFile: 'Major Field Boss.png', label: 'Mountaintop Ice Dragon' },
            { areaName: 'Mountains Major Boss 3', iconFile: 'Major Field Boss.png', label: 'Mountaintop Ice Dragon' },
            { areaName: 'Mountains Major Boss 4', iconFile: 'Major Field Boss.png', label: 'Mountaintop Ice Dragon' },
            { areaName: 'Mountains Ruins', iconFile: 'Ruins.png', label: 'Albinauric Archers' },
        ],
        Crater: [
            { areaName: 'Crater Minor Boss 1', iconFile: 'Minor Field Boss.png', label: 'Red Wolf' },
            { areaName: 'Crater Minor Boss 2', iconFile: 'Minor Field Boss.png', label: 'Demi-Human Queen' },
            { areaName: 'Crater Minor Boss 3', iconFile: 'Minor Field Boss.png', label: 'Fire Prelates' },
            { areaName: 'Crater Minor Boss 4', iconFile: 'Minor Field Boss.png', label: 'Flying Dragon' },
            { areaName: 'Crater Minor Boss 5', iconFile: 'Minor Field Boss.png', label: 'Demi-Human Queen' },
            { areaName: 'Crater Major Boss 1', iconFile: 'Major Field Boss.png', label: 'Valiant Gargoyle' },
            { areaName: 'Crater Major Boss 2', iconFile: 'Major Field Boss.png', label: 'Fallingstar Beast' },
            { areaName: 'Crater Major Boss 3', iconFile: 'Shifting Earth Boss.png', label: 'Magma Wyrm' },
            { areaName: 'Crater Church', iconFile: 'Church.png', label: '' },
        ],
        // Rotted Woods, Noklateo, None…
        "Rotted Woods": [
            { areaName: 'Woods Castle', iconFile: 'Fort.png', label: 'Lordsworn Captain' },
        ],
        Noklateo: [
            { areaName: 'Noklateo Minor Boss 1', iconFile: 'Minor Field Boss.png', label: 'Golden Hippopotamus' },
            { areaName: 'Noklateo Minor Boss 2', iconFile: 'Minor Field Boss.png', label: 'Black Knife Assassin' },
            { areaName: 'Noklateo Minor Boss 3', iconFile: 'Minor Field Boss.png', label: 'Royal Revenant' },
            { areaName: 'Noklateo Minor Boss 4', iconFile: 'Minor Field Boss.png', label: 'Headless Troll' },
            { areaName: 'Noklateo Minor Boss 5', iconFile: 'Minor Field Boss.png', label: 'Black Knife Assassin' },
            { areaName: 'Noklateo Major Boss 1', iconFile: 'Major Field Boss.png', label: 'Royal Carian Knight' },
            { areaName: 'Noklateo Major Boss 2', iconFile: 'Major Field Boss.png', label: 'Dragonkin Soldier' },
            { areaName: 'Noklateo Major Boss 3', iconFile: 'Major Field Boss.png', label: 'Flying Dragon' },
            { areaName: 'Noklateo Major Boss 4', iconFile: 'Shifting Earth Boss.png', label: 'Astel' },
        ],
    };
    

// helper to draw them
    function renderStaticStructures() {
        document.querySelectorAll('.static-icon, .static-label').forEach(el => el.remove());
        const list = staticStructuresByEarth[currentSelections.earth] || [];
        console.log('🗻 staticStructures for', currentSelections.earth, list);
        list.forEach(({ areaName, iconFile, label }) => {
            const meta = locationMeta.find(m => m.areaName === areaName);
            console.log('   ↳ looking up', areaName, '→', meta);
            if (!meta) return;
            // icon
            const icn = document.createElement('img');
            icn.src = `Icons/Locations/${iconFile}`;
            icn.className = 'overlay-icon';
            
            const typeKey = iconFile
            .replace(/\.[^/.]+$/, '')     // strip “.png”
            .toLowerCase()                // lowercase
            .replace(/\s+/g, '-')         // spaces → hyphens
            icn.classList.add(`icon-${typeKey}`);  // e.g. “icon-church”
            icn.style.left = `${meta.xPct}%`;
            icn.style.top  = `${meta.yPct}%`;
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

    function getCurrentMapLocations() {
        return mapLocations[currentSelections.earth] || mapLocations.None;
    }

    // --- Array equality (order‐agnostic) ---
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        return [...a].sort().every((v, i) => v === [...b].sort()[i]);
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

    // --- Load seed→structures table ---

Papa.parse('sheets/seedStructures.csv', {
  download: true,
  header: false,
  skipEmptyLines: true,
  complete(results) {
    const [types, names, ...rows] = results.data;

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
        return { areaType: c.areaType, areaName: c.areaName, structureType, enemyType };
      });
    });
  }
});



    // --- Church/Rise handler ---
    function handleMarkerClick(e) {
        e.preventDefault();
        const id = e.currentTarget.dataset.locationId;
        const isC = userChurches.includes(id), isR = userRises.includes(id);

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
        $$('.overlay-icon, .overlay-label').forEach(el => el.remove());
    }

    function renderSeedMap(seedID) {
        $$('.overlay-icon, .overlay-label').forEach(el => el.remove());
        const list = seedStructures[seedID] || [];
        list.forEach(({ areaType, areaName, structureType, enemyType }) => {
            const meta = locationMeta.find(m => m.areaName === areaName);
            if (!meta) return;
            if (!structureType || structureType === 'Small Camp') return;

            let iconFile;
            if (areaType === 'Field Boss' && areaName !== 'Castle Rooftop') {
                iconFile = (fieldBosses[structureType] === 'Strong' ? 'Major Field Boss.png' : 'Minor Field Boss.png');
            } else if (areaType === 'Evergaol') {
                iconFile = (evergaolBosses[structureType] === 'Strong' ? 'Strong Evergaol.png' : 'Evergaol.png');
            } else if (areaType === 'Rotted Woods' && structureType !== 'Putrid Ancestral Followers') {
                iconFile = 'Major Field Boss.png';
            } else {
                iconFile = `${structureType}.png`;
            }

            const icn = document.createElement('img');
            icn.src = `Icons/Locations/${iconFile}`;
            icn.className = 'overlay-icon';
            const normalizedStructureType = structureType.toLowerCase().replace(/\s/g, '-');
            if (areaType === 'Field Boss' || areaType === 'Evergaol') {
                icn.classList.add(`icon-${areaType.toLowerCase().replace(/\s/g, '-')}`);
            } else {
                icn.classList.add(`icon-${normalizedStructureType}`);
            }
            icn.style.left = `${meta.xPct}%`;
            icn.style.top = `${meta.yPct}%`;
            icn.onerror = () => icn.remove();
            mapOverlay.appendChild(icn);

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
        });
    }

    // --- Filter seeds & (re)render map overlays ---
    function updatePossibleSeeds() {
        const bosses = Object.keys(bossFolders);
        const bi = bosses.indexOf(currentSelections.boss);
        const start = bi * 40, end = start + 40;

        currentPossible = seedData.filter(s => {
            const n = parseInt(s.id, 10);
            if (n < start || n >= end) return false;
            const m = n - start;
            switch (currentSelections.earth) {
                case 'None': if (m >= 20) return false; break;
                case 'Mountains': if (m < 20 || m >= 25) return false; break;
                case 'Crater': if (m < 25 || m >= 30) return false; break;
                case 'Rotted Woods': if (m < 30 || m >= 35) return false; break;
                case 'Noklateo': if (m < 35 || m >= 40) return false; break;
            }
            return userChurches.every(c => s.churchLocations.includes(c)) &&
                userRises.every(r => s.riseLocations.includes(r));
        });

        seedDisplay.textContent =
            `${currentPossible.length} possible seed${currentPossible.length === 1 ? `: ${currentPossible[0].id}` : 's'}`;
        seedDisplay.classList.remove('hidden');
        viewSeedButton.classList.toggle('hidden', currentPossible.length !== 1);

        if (currentPossible.length === 1) {
            renderSeedMap(currentPossible[0].id);
            renderStaticStructures();
            showSpecialEvent(currentPossible[0].id);

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
            resetMarkersBtn.classList.remove('hidden');
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
        // remove old
        mapOverlay.querySelectorAll('.boss-overlay').forEach(el => el.remove());
        const imgFile = bossIconFiles[currentSelections.boss];
        if (!imgFile) return;
        const el = document.createElement('img');
        el.src = `Icons/Boss Icons/${imgFile}`;
        el.className = 'boss-overlay';
        mapOverlay.appendChild(el);
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


    // --- UI flow ---
    window.confirmSelections = () => {
        currentSelections.boss = selectedBoss;
        currentSelections.earth = earthSelect.value;
        selectionPanel.classList.add('hidden');
        backButton.classList.remove('hidden');
        displayMap(currentSelections.earth);
    };
    window.showSelections = () => {
        selectionPanel.classList.remove('hidden');
        backButton.classList.add('hidden');
        resetMarkersBtn.classList.add('hidden');
        imageWrapper.classList.add('hidden');
        errorMessage.classList.add('hidden');
        seedDisplay.classList.add('hidden');
        container.classList.remove('fullscreen-map');
        earthSelect.value = currentSelections.earth;
        resetMarkers();
    };
    window.resetMarkers = resetMarkers;

    // viewSeedButton.addEventListener('click', () => {
    //     if (currentPossible.length === 1) {
    //         const sid = currentPossible[0].id.padStart(3, '0');
    //         const fld = bossFolders[currentSelections.boss];
    //         seedImage.src = `Bosses/${fld}/${sid}.jpg`;
    //         seedImage.classList.remove('hidden');
    //     }
    // });

    $('#mapContainer').addEventListener('dblclick', e => {
        if (['mapImage', 'imageWrapper', 'mapOverlay'].includes(e.target.id)) {
            container.classList.toggle('fullscreen-map');
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && container.classList.contains('fullscreen-map')) {
            container.classList.remove('fullscreen-map');
        }
    });

    // --- bootstrap ---
    initBossGrid();

  // ── DEBUG ──
//   const DEBUG_SEED = 33;

//   if (typeof DEBUG_SEED !== 'undefined') {
//     const seedNum   = DEBUG_SEED;
//     const seedID    = seedNum.toString();             // for renderSeedMap lookup
//     const paddedID  = seedNum.toString().padStart(3, '0'); // for seedImage filename

//     // 1) compute boss & earth exactly as updatePossibleSeeds does:
//     const bosses = Object.keys(bossFolders);
//     const bi     = Math.min(Math.floor(seedNum / 40), bosses.length - 1);
//     const boss   = bosses[bi];
//     const m      = seedNum - bi * 40;
//     let earth;
//     if      (m < 20) earth = 'None';
//     else if (m < 25) earth = 'Mountains';
//     else if (m < 30) earth = 'Crater';
//     else if (m < 35) earth = 'Rotted Woods';
//     else             earth = 'Noklateo';

//     // 2) apply to your selection state & UI
//     currentSelections.boss  = boss;
//     currentSelections.earth = earth;
//     $$('.boss-option.selected').forEach(el => el.classList.remove('selected'));
//     document
//       .querySelector(`.boss-option[data-boss="${boss}"]`)
//       ?.classList.add('selected');
//     earthSelect.value       = earth;
//     selectionPanel.classList.add('hidden');
//     backButton.classList.remove('hidden');

//     // 3) load the map
//     displayMap(earth);

//     // 4) once the map + raw markers are in place, draw both dynamic & static overlays
//     mapImage.addEventListener('load', function _dbg() {
//       mapImage.removeEventListener('load', _dbg);
//       // dynamic icons & labels for that seed
//       renderSeedMap(seedID);
//       // static structures for that earth
//       renderStaticStructures();
//       // hide the plain map‐markers
//       $$('.map-marker').forEach(m => m.classList.add('hidden'));
//     });
//   }

});
