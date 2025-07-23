// app.js
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM references ---
    const container = document.querySelector('.container');
    const bossGrid = document.getElementById('bossGrid');
    const earthSelect = document.getElementById('earthSelect');
    const selectionPanel = document.getElementById('selectionPanel');
    const backButton = document.getElementById('backButton');
    const imageWrapper = document.getElementById('imageWrapper');
    const mapImage = document.getElementById('mapImage');
    const mapOverlay = document.getElementById('mapOverlay');
    const errorMessage = document.getElementById('errorMessage');
    const resetMarkersBtn = document.getElementById('resetMarkersButton');
    const seedDisplay = document.getElementById('seedDisplay');
    const viewSeedButton = document.getElementById('viewSeedButton');
    const seedImage = document.getElementById('seedImage');

    // --- Application state ---
    let selectedBoss = 'Gladius';
    let currentSelections = {
        boss: 'Gladius',
        earth: 'None'
    };
    let userChurches = [];
    let userRises = [];
    let seedData = [];
    let currentPossible = [];
    let locationMeta = []; // from locations.csv
    let seedStructures = {}; // from seedStructures.csv

    // --- Classification maps ---
    const fieldBosses = {
        'Grafted Scion': 'Weak',
        'Black Knife Assassin': 'Weak',
        'Red Wolf': 'Weak',
        'Ancient Hero of Zamor': 'Weak',
        'Leonine Misbegotten': 'Weak',
        'Elder Lion': 'Weak',
        'Golden Hippo': 'Weak',
        'Demi-Human Queen': 'Weak',
        'Miranda Blossom': 'Weak',
        'Royal Revenant': 'Weak',
        "Knight's Cavalry": 'Weak',
        'Flying Dragon': 'Strong',
        'Ulcerated Tree Spirit': 'Strong',
        'Erdtree Avatar': 'Strong',
        'Bell Bearing Hunter': 'Strong',
        'Ancestor Spirit': 'Strong',
        'Tree Sentinel': 'Strong',
        'Magma Wyrm': 'Strong',
        'Royal Carian Knight': 'Strong',
        'Death Rite Bird': 'Strong',
        'Black Blade Kindred': 'Strong',
        'Draconic Tree Sentinel': 'Strong'
    };
    const evergaolBosses = {
        'Omen': 'Weak',
        'Grave Warden Duelist': 'Weak',
        'Bloodhound Knight': 'Weak',
        'Stoneskin Lords': 'Weak',
        'Nox Warriors': 'Weak',
        'Beastly Brigade': 'Weak',
        'Beastmen of Farum Azula': 'Weak',
        'Crystalians': 'Weak',
        'Banished Knights': 'Weak',
        'Dragonkin Soldier': 'Strong',
        'Godskin Noble': 'Strong',
        'Godskin Apostle': 'Strong',
        'Crucible Knight': 'Strong',
        'Ancient Dragon': 'Strong',
        'Godskin Duo': 'Strong',
        'Death Rite Bird': 'Strong'
    };

    // --- Constants for boss folders & icons ---
    const bossFolders = {
        Gladius: '1_Gladius',
        Adel: '2_Adel',
        Gnoster: '3_Gnoster',
        Maris: '4_Maris',
        Libra: '5_Libra',
        Fulghor: '6_Fulghor',
        Caligo: '7_Caligo',
        Heolstor: '8_Heolstor'
    };
    const bossIconFiles = {
        Gladius: 'Gladius, Beast of Night.png',
        Adel: 'Adel, Baron of Night.png',
        Gnoster: 'Gnoster, Wisdom of Night.png',
        Maris: 'Maris, Fathom of Night.png',
        Libra: 'Libra, Creature of Night.png',
        Fulghor: 'Fulghor, Champion of Nightglow.png',
        Caligo: 'Caligo, Miasma of Night.png',
        Heolstor: 'Heolstor, The Nightlord.png'
    };


    // --- Map coordinates for each Shifting Earth ---
    const mapLocationsNone = [{
            id: '1_Northeast of Saintsbridge',
            x: 53.12,
            y: 23.44
        },
        {
            id: '2_West of Warmasters Shack',
            x: 22.83,
            y: 36.46
        },
        {
            id: '3_Below Summonwater Hawk',
            x: 65.75,
            y: 37.50
        },
        {
            id: '4_Third Church',
            x: 75.12,
            y: 36.46
        },
        {
            id: '5_Above Stormhill Tunnel Entrance',
            x: 36.46,
            y: 40.62
        },
        {
            id: '6_Stormhill South of Gate',
            x: 23.79,
            y: 57.29
        },
        {
            id: '7_Minor Erdtree',
            x: 76.73,
            y: 59.38
        },
        {
            id: '8_East of Cavalry Bridge',
            x: 55.21,
            y: 64.58
        },
        {
            id: '9_Far Southwest',
            x: 23.79,
            y: 71.88
        },
        {
            id: '10_Lake',
            x: 45.83,
            y: 70.83
        },
        {
            id: '11_Southeast of Lake',
            x: 57.29,
            y: 80.73
        }
    ];
    const mapLocationsMountains = [{
            id: '1_Northeast of Saintsbridge',
            x: 53.12,
            y: 23.44
        },
        {
            id: '3_Below Summonwater Hawk',
            x: 65.75,
            y: 37.50
        },
        {
            id: '4_Third Church',
            x: 75.12,
            y: 36.46
        },
        {
            id: '6_Stormhill South of Gate',
            x: 23.79,
            y: 57.29
        },
        {
            id: '7_Minor Erdtree',
            x: 76.73,
            y: 59.38
        },
        {
            id: '8_East of Cavalry Bridge',
            x: 55.21,
            y: 64.58
        },
        {
            id: '9_Far Southwest',
            x: 23.79,
            y: 71.88
        },
        {
            id: '10_Lake',
            x: 45.83,
            y: 70.83
        },
        {
            id: '11_Southeast of Lake',
            x: 57.29,
            y: 80.73
        }
    ];
    const mapLocationsCrater = [{
            id: '2_West of Warmasters Shack',
            x: 22.83,
            y: 36.46
        },
        {
            id: '3_Below Summonwater Hawk',
            x: 65.75,
            y: 37.50
        },
        {
            id: '4_Third Church',
            x: 75.12,
            y: 36.46
        },
        {
            id: '6_Stormhill South of Gate',
            x: 23.79,
            y: 57.29
        },
        {
            id: '7_Minor Erdtree',
            x: 76.73,
            y: 59.38
        },
        {
            id: '8_East of Cavalry Bridge',
            x: 55.21,
            y: 64.58
        },
        {
            id: '9_Far Southwest',
            x: 23.79,
            y: 71.88
        },
        {
            id: '10_Lake',
            x: 45.83,
            y: 70.83
        },
        {
            id: '11_Southeast of Lake',
            x: 57.29,
            y: 80.73
        }
    ];
    const mapLocationsWoods = [{
            id: '1_Northeast of Saintsbridge',
            x: 53.12,
            y: 23.44
        },
        {
            id: '2_West of Warmasters Shack',
            x: 22.83,
            y: 36.46
        },
        {
            id: '3_Below Summonwater Hawk',
            x: 65.75,
            y: 37.50
        },
        {
            id: '4_Third Church',
            x: 75.12,
            y: 36.46
        },
        {
            id: '5_Above Stormhill Tunnel Entrance',
            x: 36.46,
            y: 40.62
        },
        {
            id: '6_Stormhill South of Gate',
            x: 23.79,
            y: 57.29
        },
        {
            id: '9_Far Southwest',
            x: 23.79,
            y: 71.88
        },
        {
            id: '10_Lake',
            x: 45.83,
            y: 70.83
        },
    ];
    const mapLocationsNoklateo = [{
            id: '1_Northeast of Saintsbridge',
            x: 53.12,
            y: 23.44
        },
        {
            id: '2_West of Warmasters Shack',
            x: 22.83,
            y: 36.46
        },
        {
            id: '3_Below Summonwater Hawk',
            x: 65.75,
            y: 37.50
        },
        {
            id: '4_Third Church',
            x: 75.12,
            y: 36.46
        },
        {
            id: '5_Above Stormhill Tunnel Entrance',
            x: 36.46,
            y: 40.62
        },
        {
            id: '7_Minor Erdtree',
            x: 76.73,
            y: 59.38
        },
        {
            id: '8_East of Cavalry Bridge',
            x: 55.21,
            y: 64.58
        },
        {
            id: '11_Southeast of Lake',
            x: 57.29,
            y: 80.73
        }
    ];


    function getCurrentMapLocations() {
        switch (currentSelections.earth) {
            case 'Mountains':
                return mapLocationsMountains;
            case 'Crater':
                return mapLocationsCrater;
            case 'Rotted Woods':
                return mapLocationsWoods;
            case 'Noklateo':
                return mapLocationsNoklateo;
            default:
                return mapLocationsNone;
        }
    }

    // --- Array equality (order‐agnostic) ---
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        a = [...a].sort();
        b = [...b].sort();
        return a.every((v, i) => v === b[i]);
    }

    // --- Init boss icon grid ---
    function initBossGrid() {
        bossGrid.innerHTML = '';
        for (const boss of Object.keys(bossFolders)) {
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
                document.querySelectorAll('.boss-option.selected')
                    .forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedBoss = boss;
            });

            bossGrid.appendChild(div);
        }
    }

    // --- Load locations metadata ---
    Papa.parse('sheets/locations.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete(results) {
            locationMeta = results.data.map(r => ({
                areaName: r['Area Name'].trim(),
                areaType: r['Area Type'].trim(),
                xPct: parseFloat(r['Relative Position'].split(',')[0]),
                yPct: parseFloat(r['Relative Position'].split(',')[1])
            }));
        }
    });

    // --- Load seed→structures table ---
    Papa.parse('sheets/seedStructures.csv', {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete(results) {
            const rows = results.data;
            const types = rows[0],
                names = rows[1];
            const cols = names.slice(1).map((nm, i) => ({
                areaType: types[i + 1].trim(),
                areaName: nm.trim(),
                col: i + 1
            }));
            for (let i = 2; i < rows.length; i++) {
                const row = rows[i],
                    id = row[0].trim();
                seedStructures[id] = cols.map(c => {
                    const raw = row[c.col].trim();
                    const [structureType = '', enemyType = ''] = raw.split(' - ').map(s => s.trim());
                    return {
                        areaType: c.areaType,
                        areaName: c.areaName,
                        structureType,
                        enemyType
                    };
                });

            }
        }
    });

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
        updatePossibleSeeds();
    }

    function createMarkers() {
        mapOverlay.innerHTML = '';
        getCurrentMapLocations().forEach(loc => {
            const m = document.createElement('div');
            m.className = 'map-marker'; // start hidden
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

        // clear any church/rise classes
        document.querySelectorAll('.map-marker').forEach(m => {
            m.classList.remove('church', 'rise');
            // un-hide them so you can select again
            m.classList.remove('hidden');
        });

        seedDisplay.classList.add('hidden');
        viewSeedButton.classList.add('hidden');

        // also clear any old structure icons
        document.querySelectorAll('.overlay-icon')
            .forEach(e => e.remove());
    }

function renderSeedMap(seedID) {
        // 1) clear any old icons & labels
        document.querySelectorAll('.overlay-icon, .overlay-label')
            .forEach(el => el.remove());

        const list = seedStructures[seedID] || [];
        list.forEach(({
            areaType,
            areaName,
            structureType,
            enemyType
        }) => {

            // 3) find the coords for this area
            const meta = locationMeta.find(m => m.areaName === areaName);
            if (!meta) return;

            // 4) pick the correct icon file
            let iconFile;
            // IMPORTANT: If 'Small Camp' should truly skip icon creation, keep this line:
            if (structureType === 'Small Camp') return; // skip Small Camp icons

            if (areaType === 'Field Boss') {
                const cls = fieldBosses[structureType] || 'Weak';
                iconFile = cls === 'Strong' ?
                    'Major Field Boss.png' :
                    'Minor Field Boss.png';
            } else if (areaType === 'Evergaol') { // Renamed from 'Evergaol' to 'Gaol' in CSS
                const cls = evergaolBosses[structureType] || 'Weak';
                iconFile = cls === 'Strong' ?
                    'Strong Evergaol.png' :
                    'Evergaol.png';
            } else {
                iconFile = `${structureType}.png`;
            }

            // 5) place the icon
            const icn = document.createElement('img');
            icn.src = `Icons/Locations/${iconFile}`;
            icn.className = 'overlay-icon'; // Base class

            // --- ADD THIS LINE: Add a specific class based on structureType ---
            // Normalize structureType to be a valid CSS class name (e.g., "Small Camp" -> "small-camp")
            const normalizedStructureType = structureType.toLowerCase().replace(/\s/g, '-');
            if (areaType === 'Field Boss' || areaType === 'Evergaol') {
                icn.classList.add(`icon-${areaType.toLowerCase().replace(/\s/g, '-')}`); // Add a common boss class  
            }
            else {
                icn.classList.add(`icon-${normalizedStructureType}`); // Add specific class
            }

            icn.style.left = `${meta.xPct}%`;
            icn.style.top = `${meta.yPct}%`;
            // if the image 404s, quietly remove it
            icn.onerror = () => icn.remove();
            mapOverlay.appendChild(icn);

            // 6) place the label
            // --- MODIFIED LINE: Apply the new universal labeling rule ---
            let labelText = enemyType || structureType;

            if (structureType.includes('Church') && !structureType.includes('Great Church')) { // Check if structureType contains "Church"
                labelText = ''; // Clear labelText to prevent label creation
            }

            if (structureType.includes('Township')){
                labelText = ''; // Clear labelText to prevent label creation
            }

            if (labelText) {
                const lbl = document.createElement('div');
                lbl.className = 'overlay-label'; // Base class
                lbl.style.left = `${meta.xPct}%`;
                // drop it slightly below the icon
                lbl.style.top = `${meta.yPct + 4}%`;
                lbl.textContent = labelText;
                mapOverlay.appendChild(lbl);
            }
        });
    }


    // --- Filter seeds & (re)render map overlays ---
    function updatePossibleSeeds() {
        // 1) Filter by boss + shifting earth
        const bosses = Object.keys(bossFolders);
        const bi = bosses.indexOf(currentSelections.boss);
        const start = bi * 40;
        const end = start + 40;

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
            // 2) Match the user’s church/rise picks
            return userChurches.every(c => s.churchLocations.includes(c)) &&
                userRises.every(r => s.riseLocations.includes(r));
        });

        // 3) Update the display text and “View Seed” button
        seedDisplay.textContent =
            `${currentPossible.length} possible seed${currentPossible.length === 1 ? `: ${currentPossible[0].id}` : 's'}`;
        seedDisplay.classList.remove('hidden');
        viewSeedButton.classList.toggle('hidden', currentPossible.length !== 1);

        // 4) If exactly one seed, render its structures and hide markers


        if (currentPossible.length === 1) {
            console.log(`🛠️  Found exactly one seed: ${currentPossible[0].id}`);
            renderSeedMap(currentPossible[0].id);
            document.querySelectorAll('.map-marker')
                .forEach(m => m.classList.add('hidden'));
        } else {
            // otherwise keep the markers visible so the user can fine-tune
            document.querySelectorAll('.map-marker')
                .forEach(m => m.classList.remove('hidden'));
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
    // === displayMap
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
            createMarkers(); // now markers exist but remain hidden
            // ← NOTE: we no longer call resetMarkers() here
        };
        loader.onerror = () => {
            errorMessage.textContent = `Map not found: ${path}`;
            errorMessage.classList.remove('hidden');
        };
        loader.src = path;
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

    viewSeedButton.addEventListener('click', () => {
        if (currentPossible.length === 1) {
            const sid = currentPossible[0].id.padStart(3, '0');
            const fld = bossFolders[currentSelections.boss];
            seedImage.src = `Bosses/${fld}/${sid}.jpg`;
            seedImage.classList.remove('hidden');
        }
    });

    document.getElementById('mapContainer').addEventListener('dblclick', e => {
        if (['mapImage', 'imageWrapper', 'mapOverlay'].includes(e.target.id)) {
            container.classList.toggle('fullscreen-map');
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && container.classList.contains('fullscreen-map')) {
            container.classList.remove('fullscreen-map');
        }
    });

    mapOverlay.addEventListener('click', e => {
        const icon = e.target.closest('.overlay-icon');
        if (areaName && pos) { // Ensure both are defined before logging
    console.log(`🔍 Debug (delegated) — areaName="${areaName}", pos=(${pos.x}, ${pos.y})`);
}
    });




    // --- bootstrap ---
    initBossGrid();

      // ─── DEBUG: Auto-load seed 1 on startup ───────────────────────────────────────
  // 1) Kick off the map display for “None” (or whatever earth you want)
//   displayMap(currentSelections.earth);

//   // 2) When the <img> actually loads, draw seed 1 and hide markers
//   mapImage.addEventListener('load', () => {
//     // Hide the “Change Selection” UI, if you like:
//     selectionPanel.classList.add('hidden');
//     backButton.classList.add('hidden');
//     resetMarkersBtn.classList.remove('hidden');

//     // Draw seed 1’s overlays:
//     renderSeedMap('3');

//     // Hide all the little church/rise markers:
//     document.querySelectorAll('.map-marker')
//             .forEach(m => m.classList.add('hidden'));

//     // Show a debug message:
//     seedDisplay.textContent = '🔧 Debug: seed 1';
//     seedDisplay.classList.remove('hidden');
//   });

});