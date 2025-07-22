// app.js
document.addEventListener('DOMContentLoaded', () => {
  // --- DOM references ---
  const container       = document.querySelector('.container');
  const bossGrid        = document.getElementById('bossGrid');
  const earthSelect     = document.getElementById('earthSelect');
  const selectionPanel  = document.getElementById('selectionPanel');
  const backButton      = document.getElementById('backButton');
  const imageWrapper    = document.getElementById('imageWrapper');
  const mapImage        = document.getElementById('mapImage');
  const mapOverlay      = document.getElementById('mapOverlay');
  const errorMessage    = document.getElementById('errorMessage');
  const resetMarkersBtn = document.getElementById('resetMarkersButton');
  const seedDisplay     = document.getElementById('seedDisplay');
  const viewSeedButton  = document.getElementById('viewSeedButton');
  const seedImage       = document.getElementById('seedImage');

  // --- Application state ---
  let selectedBoss      = 'Gladius';
  let currentSelections = { boss: 'Gladius', earth: 'None' };
  let userChurches      = [];
  let userRises         = [];
  let seedData          = [];
  let currentPossible   = [];

  // --- Constants ---
  const bossFolders = {
    Gladius: '1_Gladius',
    Adel:    '2_Adel',
    Gnoster: '3_Gnoster',
    Maris:   '4_Maris',
    Libra:   '5_Libra',
    Fulghor: '6_Fulghor',
    Caligo:  '7_Caligo',
    Heolstor:'8_Heolstor'
  };
  const bossIconFiles = {
    Gladius:  'Gladius, Beast of Night.png',
    Adel:     'Adel, Baron of Night.png',
    Gnoster:  'Gnoster, Wisdom of Night.png',
    Maris:    'Maris, Fathom of Night.png',
    Libra:    'Libra, Creature of Night.png',
    Fulghor:  'Fulghor, Champion of Nightglow.png',
    Caligo:   'Caligo, Miasma of Night.png',
    Heolstor: 'Heolstor, The Nightlord.png'
  };

  // --- Map coordinates for each Shifting Earth ---
  const mapLocationsNone = [
        { id: '1_Northeast of Saintsbridge',   x: 53.12, y: 23.44 },
        { id: '2_West of Warmasters Shack',     x: 22.83, y: 36.46 },
        { id: '3_Below Summonwater Hawk',       x: 65.75, y: 37.50 },
        { id: '4_Third Church',                 x: 75.12, y: 36.46 },
        { id: '5_Above Stormhill Tunnel Entrance', x: 36.46, y: 40.62 },
        { id: '6_Stormhill South of Gate',      x: 23.79, y: 57.29 },
        { id: '7_Minor Erdtree',                x: 76.73, y: 59.38 },
        { id: '8_East of Cavalry Bridge',       x: 55.21, y: 64.58 },
        { id: '9_Far Southwest',                x: 23.79, y: 71.88 },
        { id: '10_Lake',                        x: 45.83, y: 70.83 },
        { id: '11_Southeast of Lake',           x: 57.29, y: 80.73 }
    ];
    const mapLocationsMountains = [
        { id: '1_Northeast of Saintsbridge',   x: 53.12, y: 23.44 },
        { id: '3_Below Summonwater Hawk',       x: 65.75, y: 37.50 },
        { id: '4_Third Church',                 x: 75.12, y: 36.46 },
        { id: '6_Stormhill South of Gate',      x: 23.79, y: 57.29 },
        { id: '7_Minor Erdtree',                x: 76.73, y: 59.38 },
        { id: '8_East of Cavalry Bridge',       x: 55.21, y: 64.58 },
        { id: '9_Far Southwest',                x: 23.79, y: 71.88 },
        { id: '10_Lake',                        x: 45.83, y: 70.83 },
        { id: '11_Southeast of Lake',           x: 57.29, y: 80.73 }
    ];
    const mapLocationsCrater = [
        { id: '2_West of Warmasters Shack',     x: 22.83, y: 36.46 },
        { id: '3_Below Summonwater Hawk',       x: 65.75, y: 37.50 },
        { id: '4_Third Church',                 x: 75.12, y: 36.46 },
        { id: '6_Stormhill South of Gate',      x: 23.79, y: 57.29 },
        { id: '7_Minor Erdtree',                x: 76.73, y: 59.38 },
        { id: '8_East of Cavalry Bridge',       x: 55.21, y: 64.58 },
        { id: '9_Far Southwest',                x: 23.79, y: 71.88 },
        { id: '10_Lake',                        x: 45.83, y: 70.83 },
        { id: '11_Southeast of Lake',           x: 57.29, y: 80.73 }
    ];
    const mapLocationsWoods = [
        { id: '1_Northeast of Saintsbridge',   x: 53.12, y: 23.44 },
        { id: '2_West of Warmasters Shack',     x: 22.83, y: 36.46 },
        { id: '3_Below Summonwater Hawk',       x: 65.75, y: 37.50 },
        { id: '4_Third Church',                 x: 75.12, y: 36.46 },
        { id: '5_Above Stormhill Tunnel Entrance', x: 36.46, y: 40.62 },
        { id: '6_Stormhill South of Gate',      x: 23.79, y: 57.29 },
        { id: '9_Far Southwest',                x: 23.79, y: 71.88 },
        { id: '10_Lake',                        x: 45.83, y: 70.83 },
    ];
    const mapLocationsNoklateo = [
        { id: '1_Northeast of Saintsbridge',   x: 53.12, y: 23.44 },
        { id: '2_West of Warmasters Shack',     x: 22.83, y: 36.46 },
        { id: '3_Below Summonwater Hawk',       x: 65.75, y: 37.50 },
        { id: '4_Third Church',                 x: 75.12, y: 36.46 },
        { id: '5_Above Stormhill Tunnel Entrance', x: 36.46, y: 40.62 },
        { id: '7_Minor Erdtree',                x: 76.73, y: 59.38 },
        { id: '8_East of Cavalry Bridge',       x: 55.21, y: 64.58 },
        { id: '11_Southeast of Lake',           x: 57.29, y: 80.73 }
    ];

  function getCurrentMapLocations() {
    switch (currentSelections.earth) {
      case 'Mountains':    return mapLocationsMountains;
      case 'Crater':       return mapLocationsCrater;
      case 'Rotted Woods': return mapLocationsWoods;
      case 'Noklateo':     return mapLocationsNoklateo;
      default:             return mapLocationsNone;
    }
  }

  // --- Utility to compare arrays (ignore order) ---
  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    a = [...a].sort(); b = [...b].sort();
    return a.every((v, i) => v === b[i]);
  }

  // --- Initialize boss‐icon grid ---
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

      const filename = bossIconFiles[boss];
      const labelText = filename.replace(/\.[^/.]+$/, '');  // strips “.png”
      const lbl = document.createElement('span');
      lbl.textContent = labelText;
      div.appendChild(lbl);

      div.addEventListener('click', () => {
        document.querySelectorAll('.boss-option.selected')
                .forEach(el => el.classList.remove('selected'));
        div.classList.add('selected');
        selectedBoss = boss;
      });

      bossGrid.appendChild(div);
    }
  }

  // --- Marker event handlers ---
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
    } else { // right‐click
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
      m.style.top  = loc.y + '%';
      m.addEventListener('click', handleMarkerClick);
      m.addEventListener('contextmenu', handleMarkerClick);
      mapOverlay.appendChild(m);
    });
  }

  function resetMarkers() {
    userChurches = [];
    userRises = [];
    document.querySelectorAll('.map-marker')
            .forEach(m => m.classList.remove('church','rise'));
    seedDisplay.classList.add('hidden');
    viewSeedButton.classList.add('hidden');
    seedImage.classList.add('hidden');
  }

  // --- Load seeds.csv ---
  Papa.parse('sheets/seeds.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete(results) {
      seedData = results.data
        .filter(r => r.ID)
        .map(r => ({
          id: r.ID.trim(),
          churchLocations: r.churchLocations.split(';').map(s=>s.trim()).filter(Boolean),
          riseLocations:   r.riseLocations.split(';').map(s=>s.trim()).filter(Boolean)
        }));
    }
  });

  // --- Seed‐filtering logic ---
  function updatePossibleSeeds() {
    const bosses = Object.keys(bossFolders);
    const bi = bosses.indexOf(currentSelections.boss);
    const start = bi*40, end = start+40;

    currentPossible = seedData.filter(s => {
      const n = parseInt(s.id,10);
      if (n < start || n >= end) return false;
      const m = n - start;
      switch (currentSelections.earth) {
        case 'None':         if (m >= 20) return false; break;
        case 'Mountains':    if (m < 20 || m >= 25) return false; break;
        case 'Crater':       if (m < 25 || m >= 30) return false; break;
        case 'Rotted Woods': if (m < 30 || m >= 35) return false; break;
        case 'Noklateo':     if (m < 35 || m >= 40) return false; break;
      }
      return userChurches.every(c=>s.churchLocations.includes(c)) &&
             userRises.every(r=>s.riseLocations.includes(r));
    });

    seedDisplay.textContent = 
      `${currentPossible.length} possible seed${currentPossible.length===1?'':'s'}`;
    seedDisplay.classList.remove('hidden');
    viewSeedButton.classList.toggle('hidden', currentPossible.length !== 1);
    seedImage.classList.add('hidden');
  }

  // --- Map loading & UI flow ---
  function displayMap(earth) {
    errorMessage.classList.add('hidden');
    mapImage.src = '';
    imageWrapper.classList.add('hidden');
    resetMarkersBtn.classList.add('hidden');
    seedDisplay.classList.add('hidden');

    const loader = new Image();
    const path   = `Maps/${encodeURIComponent(earth)}.png`;
    loader.onload = () => {
      mapImage.src = path;
      imageWrapper.classList.remove('hidden');
      resetMarkersBtn.classList.remove('hidden');
      createMarkers();
      resetMarkers();
    };
    loader.onerror = () => {
      errorMessage.textContent = `Map not found: ${path}`;
      errorMessage.classList.remove('hidden');
    };
    loader.src = path;
  }

  window.confirmSelections = () => {
    currentSelections.boss  = selectedBoss;
    currentSelections.earth = earthSelect.value;
    selectionPanel.classList.add('hidden');
    backButton.classList.remove('hidden');
    displayMap(currentSelections.earth);
  };

  window.resetMarkers = resetMarkers;

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

  viewSeedButton.addEventListener('click', () => {
    if (currentPossible.length === 1) {
      const sid = currentPossible[0].id.padStart(3,'0');
      const fld = bossFolders[currentSelections.boss];
      seedImage.src = `Bosses/${fld}/${sid}.jpg`;
      seedImage.classList.remove('hidden');
    }
  });


  initBossGrid();
});
