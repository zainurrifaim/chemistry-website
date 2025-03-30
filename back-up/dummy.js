document.addEventListener('DOMContentLoaded', () => {
    const elementGrid = {
        // Period 1
        1: {row: 1, col: 1},   // Hydrogen
        2: {row: 1, col: 18},  // Helium
        
        // Period 2
        3: {row: 2, col: 1},   // Lithium
        4: {row: 2, col: 2},   // Beryllium
        5: {row: 2, col: 13},  // Boron
        6: {row: 2, col: 14},  // Carbon
        7: {row: 2, col: 15},  // Nitrogen
        8: {row: 2, col: 16},  // Oxygen
        9: {row: 2, col: 17},  // Fluorine
        10: {row: 2, col: 18}, // Neon
        
        // Period 3
        11: {row: 3, col: 1},  // Sodium
        12: {row: 3, col: 2},  // Magnesium
        13: {row: 3, col: 13}, // Aluminum
        14: {row: 3, col: 14}, // Silicon
        15: {row: 3, col: 15}, // Phosphorus
        16: {row: 3, col: 16}, // Sulfur
        17: {row: 3, col: 17}, // Chlorine
        18: {row: 3, col: 18}, // Argon
        
        // Period 4
        19: {row: 4, col: 1},  // Potassium
        20: {row: 4, col: 2},  // Calcium
        21: {row: 4, col: 3},  // Scandium
        22: {row: 4, col: 4},  // Titanium
        23: {row: 4, col: 5},  // Vanadium
        24: {row: 4, col: 6},  // Chromium
        25: {row: 4, col: 7},  // Manganese
        26: {row: 4, col: 8},  // Iron
        27: {row: 4, col: 9},  // Cobalt
        28: {row: 4, col: 10}, // Nickel
        29: {row: 4, col: 11}, // Copper
        30: {row: 4, col: 12}, // Zinc
        31: {row: 4, col: 13}, // Gallium
        32: {row: 4, col: 14}, // Germanium
        33: {row: 4, col: 15}, // Arsenic
        34: {row: 4, col: 16}, // Selenium
        35: {row: 4, col: 17}, // Bromine
        36: {row: 4, col: 18}, // Krypton
        
        // Period 5
        37: {row: 5, col: 1},  // Rubidium
        38: {row: 5, col: 2},  // Strontium
        39: {row: 5, col: 3},  // Yttrium
        40: {row: 5, col: 4},  // Zirconium
        41: {row: 5, col: 5},  // Niobium
        42: {row: 5, col: 6},  // Molybdenum
        43: {row: 5, col: 7},  // Technetium
        44: {row: 5, col: 8},  // Ruthenium
        45: {row: 5, col: 9},  // Rhodium
        46: {row: 5, col: 10}, // Palladium
        47: {row: 5, col: 11}, // Silver
        48: {row: 5, col: 12}, // Cadmium
        49: {row: 5, col: 13}, // Indium
        50: {row: 5, col: 14}, // Tin
        51: {row: 5, col: 15}, // Antimony
        52: {row: 5, col: 16}, // Tellurium
        53: {row: 5, col: 17}, // Iodine
        54: {row: 5, col: 18}, // Xenon
        
        // Period 6
        55: {row: 6, col: 1},  // Cesium
        56: {row: 6, col: 2},  // Barium
        // Lanthanides
        57: {row: 9, col: 3},  // Lanthanum
        58: {row: 9, col: 4},  // Cerium
        59: {row: 9, col: 5},  // Praseodymium
        60: {row: 9, col: 6},  // Neodymium
        61: {row: 9, col: 7},  // Promethium
        62: {row: 9, col: 8},  // Samarium
        63: {row: 9, col: 9},  // Europium
        64: {row: 9, col: 10}, // Gadolinium
        65: {row: 9, col: 11}, // Terbium
        66: {row: 9, col: 12}, // Dysprosium
        67: {row: 9, col: 13}, // Holmium
        68: {row: 9, col: 14}, // Erbium
        69: {row: 9, col: 15}, // Thulium
        70: {row: 9, col: 16}, // Ytterbium
        71: {row: 9, col: 17}, // Lutetium
        // Transition metals
        72: {row: 6, col: 4},  // Hafnium
        73: {row: 6, col: 5},  // Tantalum
        74: {row: 6, col: 6},  // Tungsten
        75: {row: 6, col: 7},  // Rhenium
        76: {row: 6, col: 8},  // Osmium
        77: {row: 6, col: 9},  // Iridium
        78: {row: 6, col: 10}, // Platinum
        79: {row: 6, col: 11}, // Gold
        80: {row: 6, col: 12}, // Mercury
        81: {row: 6, col: 13}, // Thallium
        82: {row: 6, col: 14}, // Lead
        83: {row: 6, col: 15}, // Bismuth
        84: {row: 6, col: 16}, // Polonium
        85: {row: 6, col: 17}, // Astatine
        86: {row: 6, col: 18}, // Radon
        
        // Period 7
        87: {row: 7, col: 1},  // Francium
        88: {row: 7, col: 2},  // Radium
        // Actinides
        89: {row: 10, col: 3},  // Actinium
        90: {row: 10, col: 4},  // Thorium
        91: {row: 10, col: 5},  // Protactinium
        92: {row: 10, col: 6},  // Uranium
        93: {row: 10, col: 7},  // Neptunium
        94: {row: 10, col: 8},  // Plutonium
        95: {row: 10, col: 9},  // Americium
        96: {row: 10, col: 10}, // Curium
        97: {row: 10, col: 11}, // Berkelium
        98: {row: 10, col: 12}, // Californium
        99: {row: 10, col: 13}, // Einsteinium
        100: {row: 10, col: 14}, // Fermium
        101: {row: 10, col: 15}, // Mendelevium
        102: {row: 10, col: 16}, // Nobelium
        103: {row: 10, col: 17}, // Lawrencium
        // Transition metals
        104: {row: 7, col: 4}, // Rutherfordium
        105: {row: 7, col: 5}, // Dubnium
        106: {row: 7, col: 6}, // Seaborgium
        107: {row: 7, col: 7}, // Bohrium
        108: {row: 7, col: 8}, // Hassium
        109: {row: 7, col: 9}, // Meitnerium
        110: {row: 7, col: 10}, // Darmstadtium
        111: {row: 7, col: 11}, // Roentgenium
        112: {row: 7, col: 12}, // Copernicium
        113: {row: 7, col: 13}, // Nihonium
        114: {row: 7, col: 14}, // Flerovium
        115: {row: 7, col: 15}, // Moscovium
        116: {row: 7, col: 16}, // Livermorium
        117: {row: 7, col: 17}, // Tennessine
        118: {row: 7, col: 18}  // Oganesson
    };

    let allElements = [];
    const tableContainer = document.createElement('div');
    tableContainer.className = 'periodic-table';

    // Fetch and process element data
    fetch('../json/all-elements.json')
        .then(response => response.json())
        .then(data => {
            const columns = data.Table.Columns.Column;
            allElements = data.Table.Row.map(row => {
                const element = {};
                row.Cell.forEach((value, index) => {
                    element[columns[index]] = value;
                });
                return element;
            });

            createPeriodicTable(allElements);
            setupControls();
        });

    function createPeriodicTable(elements) {
        tableContainer.innerHTML = '';
        
        elements.forEach(element => {
            const tile = document.createElement('div');
            tile.className = 'element-tile';
            tile.style.gridRow = elementGrid[element.AtomicNumber]?.row || 'auto';
            tile.style.gridColumn = elementGrid[element.AtomicNumber]?.col || 'auto';
            tile.style.backgroundColor = `#${element.CPKHexColor || 'ddd'}`;
            tile.dataset.group = element.GroupBlock; // Add group data attribute
            
            tile.innerHTML = `
                <div class="atomic-number">${element.AtomicNumber}</div>
                <div class="symbol">${element.Symbol}</div>
                <div class="name">${element.Name}</div>
                <div class="atomic-mass">${element.AtomicMass}</div>
            `;

            tile.addEventListener('click', () => showElementDetails(element));
            tableContainer.appendChild(tile);
        });

        document.body.appendChild(tableContainer);
    }

    // [Keep your existing showElementDetails and createDetailRow functions here...]

    function showElementDetails(element) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="modal-header" style="background-color:#${element.CPKHexColor}">
                    <h2>${element.Name} (${element.Symbol})</h2>
                    <p>Atomic Number: ${element.AtomicNumber}</p>
                </div>
                <div class="modal-body">
                    ${createDetailRow('Atomic Mass', element.AtomicMass, 'u')}
                    ${createDetailRow('Electron Configuration', element.ElectronConfiguration)}
                    ${createDetailRow('Electronegativity', element.Electronegativity)}
                    ${createDetailRow('Atomic Radius', element.AtomicRadius, 'pm')}
                    ${createDetailRow('Ionization Energy', element.IonizationEnergy, 'eV')}
                    ${createDetailRow('Electron Affinity', element.ElectronAffinity, 'eV')}
                    ${createDetailRow('Oxidation States', element.OxidationStates)}
                    ${createDetailRow('Standard State', element.StandardState)}
                    ${createDetailRow('Melting Point', element.MeltingPoint, 'K')}
                    ${createDetailRow('Boiling Point', element.BoilingPoint, 'K')}
                    ${createDetailRow('Density', element.Density, 'g/cm³')}
                    ${createDetailRow('Group Block', element.GroupBlock)}
                    ${createDetailRow('Year Discovered', element.YearDiscovered)}
                </div>
            </div>
        `;

        modal.querySelector('.close').addEventListener('click', () => modal.remove());
        document.body.appendChild(modal);
    }

    function createDetailRow(label, value, unit = '') {
        if (!value || value.trim() === '') return '';
        return `
            <div class="detail-row">
                <span class="detail-label">${label}:</span>
                <span class="detail-value">${value} ${unit}</span>
            </div>
        `;
    }

    function setupControls() {
        const groups = [...new Set(allElements.map(e => e.GroupBlock))];
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'controls';
        
        // Search input
        controlsContainer.innerHTML = `
            <div class="search-box">
                <input type="text" placeholder="Search elements..." class="search-input">
            </div>
            <div class="filter-options">
                <label class="filter-option active" data-filter="all">
                    <input type="radio" name="element-filter" checked> All Elements
                </label>
                ${groups.map(group => `
                    <label class="filter-option" data-filter="${group}">
                        <input type="radio" name="element-filter"> ${group}
                    </label>
                `).join('')}
            </div>
        `;
        
        // Event listeners
        controlsContainer.querySelector('.search-input').addEventListener('input', updateDisplay);
        controlsContainer.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.filter-option').forEach(opt => 
                    opt.classList.remove('active'));
                this.classList.add('active');
                updateDisplay();
            });
        });
        
        document.body.prepend(controlsContainer);
    }

    function updateDisplay() {
        const searchTerm = document.querySelector('.search-input').value.toLowerCase();
        const selectedFilter = document.querySelector('.filter-option.active').dataset.filter;
        
        document.querySelectorAll('.element-tile').forEach(tile => {
            // Reset all tiles first
            tile.style.opacity = '1';
            tile.style.filter = 'none';
            tile.style.display = 'grid';
            
            // Apply group filter
            if (selectedFilter !== 'all' && tile.dataset.group !== selectedFilter) {
                tile.style.opacity = '0.3';
                tile.style.filter = 'grayscale(70%)';
            }
            
            // Apply search filter
            if (searchTerm) {
                const name = tile.querySelector('.name').textContent.toLowerCase();
                const symbol = tile.querySelector('.symbol').textContent.toLowerCase();
                if (!name.includes(searchTerm) && !symbol.includes(searchTerm)) {
                    tile.style.display = 'none';
                }
            }
        });
    }
});