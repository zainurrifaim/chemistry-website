document.addEventListener('DOMContentLoaded', () => {
    // Element positioning grid (keep your existing grid definition)
    const elementGrid = {
        // Period 1
        1: {row: 2, col: 2},   // Hydrogen (Group 1)
        2: {row: 2, col: 19},  // Helium (Group 18)
        
        // Period 2
        3: {row: 3, col: 2},   // Lithium (Group 1)
        4: {row: 3, col: 3},   // Beryllium (Group 2)
        5: {row: 3, col: 14},  // Boron (Group 13)
        6: {row: 3, col: 15},  // Carbon (Group 14)
        7: {row: 3, col: 16},  // Nitrogen (Group 15)
        8: {row: 3, col: 17},  // Oxygen (Group 16)
        9: {row: 3, col: 18},  // Fluorine (Group 17)
        10: {row: 3, col: 19}, // Neon (Group 18)
        
        // Period 3
        11: {row: 4, col: 2},  // Sodium (Group 1)
        12: {row: 4, col: 3},  // Magnesium (Group 2)
        13: {row: 4, col: 14}, // Aluminum (Group 13)
        14: {row: 4, col: 15}, // Silicon (Group 14)
        15: {row: 4, col: 16}, // Phosphorus (Group 15)
        16: {row: 4, col: 17}, // Sulfur (Group 16)
        17: {row: 4, col: 18}, // Chlorine (Group 17)
        18: {row: 4, col: 19}, // Argon (Group 18)
        
        // Period 4
        19: {row: 5, col: 2},  // Potassium (Group 1)
        20: {row: 5, col: 3},  // Calcium (Group 2)
        21: {row: 5, col: 4},  // Scandium (Group 3)
        22: {row: 5, col: 5},  // Titanium (Group 4)
        23: {row: 5, col: 6},  // Vanadium (Group 5)
        24: {row: 5, col: 7},  // Chromium (Group 6)
        25: {row: 5, col: 8},  // Manganese (Group 7)
        26: {row: 5, col: 9},  // Iron (Group 8)
        27: {row: 5, col: 10}, // Cobalt (Group 9)
        28: {row: 5, col: 11}, // Nickel (Group 10)
        29: {row: 5, col: 12}, // Copper (Group 11)
        30: {row: 5, col: 13}, // Zinc (Group 12)
        31: {row: 5, col: 14}, // Gallium (Group 13)
        32: {row: 5, col: 15}, // Germanium (Group 14)
        33: {row: 5, col: 16}, // Arsenic (Group 15)
        34: {row: 5, col: 17}, // Selenium (Group 16)
        35: {row: 5, col: 18}, // Bromine (Group 17)
        36: {row: 5, col: 19}, // Krypton (Group 18)
        
        // Period 5
        37: {row: 6, col: 2},  // Rubidium (Group 1)
        38: {row: 6, col: 3},  // Strontium (Group 2)
        39: {row: 6, col: 4},  // Yttrium (Group 3)
        40: {row: 6, col: 5},  // Zirconium (Group 4)
        41: {row: 6, col: 6},  // Niobium (Group 5)
        42: {row: 6, col: 7},  // Molybdenum (Group 6)
        43: {row: 6, col: 8},  // Technetium (Group 7)
        44: {row: 6, col: 9},  // Ruthenium (Group 8)
        45: {row: 6, col: 10}, // Rhodium (Group 9)
        46: {row: 6, col: 11}, // Palladium (Group 10)
        47: {row: 6, col: 12}, // Silver (Group 11)
        48: {row: 6, col: 13}, // Cadmium (Group 12)
        49: {row: 6, col: 14}, // Indium (Group 13)
        50: {row: 6, col: 15}, // Tin (Group 14)
        51: {row: 6, col: 16}, // Antimony (Group 15)
        52: {row: 6, col: 17}, // Tellurium (Group 16)
        53: {row: 6, col: 18}, // Iodine (Group 17)
        54: {row: 6, col: 19}, // Xenon (Group 18)
        
        // Period 6
        55: {row: 7, col: 2},  // Cesium (Group 1)
        56: {row: 7, col: 3},  // Barium (Group 2)
        // Lanthanides
        57: {row: 10, col: 4},  // Lanthanum (Group 3)
        58: {row: 10, col: 5},  // Cerium
        59: {row: 10, col: 6},  // Praseodymium
        60: {row: 10, col: 7},  // Neodymium
        61: {row: 10, col: 8},  // Promethium
        62: {row: 10, col: 9},  // Samarium
        63: {row: 10, col: 10}, // Europium
        64: {row: 10, col: 11}, // Gadolinium
        65: {row: 10, col: 12}, // Terbium
        66: {row: 10, col: 13}, // Dysprosium
        67: {row: 10, col: 14}, // Holmium
        68: {row: 10, col: 15}, // Erbium
        69: {row: 10, col: 16}, // Thulium
        70: {row: 10, col: 17}, // Ytterbium
        71: {row: 10, col: 18}, // Lutetium
        // Transition metals
        72: {row: 7, col: 5},  // Hafnium (Group 4)
        73: {row: 7, col: 6},  // Tantalum (Group 5)
        74: {row: 7, col: 7},  // Tungsten (Group 6)
        75: {row: 7, col: 8},  // Rhenium (Group 7)
        76: {row: 7, col: 9},  // Osmium (Group 8)
        77: {row: 7, col: 10}, // Iridium (Group 9)
        78: {row: 7, col: 11}, // Platinum (Group 10)
        79: {row: 7, col: 12}, // Gold (Group 11)
        80: {row: 7, col: 13}, // Mercury (Group 12)
        81: {row: 7, col: 14}, // Thallium (Group 13)
        82: {row: 7, col: 15}, // Lead (Group 14)
        83: {row: 7, col: 16}, // Bismuth (Group 15)
        84: {row: 7, col: 17}, // Polonium (Group 16)
        85: {row: 7, col: 18}, // Astatine (Group 17)
        86: {row: 7, col: 19}, // Radon (Group 18)
        
        // Period 7
        87: {row: 8, col: 2},  // Francium (Group 1)
        88: {row: 8, col: 3},  // Radium (Group 2)
        // Actinides
        89: {row: 11, col: 4},  // Actinium (Group 3)
        90: {row: 11, col: 5},  // Thorium
        91: {row: 11, col: 6},  // Protactinium
        92: {row: 11, col: 7},  // Uranium
        93: {row: 11, col: 8},  // Neptunium
        94: {row: 11, col: 9},  // Plutonium
        95: {row: 11, col: 10}, // Americium
        96: {row: 11, col: 11}, // Curium
        97: {row: 11, col: 12}, // Berkelium
        98: {row: 11, col: 13}, // Californium
        99: {row: 11, col: 14}, // Einsteinium
        100: {row: 11, col: 15}, // Fermium
        101: {row: 11, col: 16}, // Mendelevium
        102: {row: 11, col: 17}, // Nobelium
        103: {row: 11, col: 18}, // Lawrencium
        // Transition metals
        104: {row: 8, col: 5}, // Rutherfordium (Group 4)
        105: {row: 8, col: 6}, // Dubnium (Group 5)
        106: {row: 8, col: 7}, // Seaborgium (Group 6)
        107: {row: 8, col: 8}, // Bohrium (Group 7)
        108: {row: 8, col: 9}, // Hassium (Group 8)
        109: {row: 8, col: 10}, // Meitnerium (Group 9)
        110: {row: 8, col: 11}, // Darmstadtium (Group 10)
        111: {row: 8, col: 12}, // Roentgenium (Group 11)
        112: {row: 8, col: 13}, // Copernicium (Group 12)
        113: {row: 8, col: 14}, // Nihonium (Group 13)
        114: {row: 8, col: 15}, // Flerovium (Group 14)
        115: {row: 8, col: 16}, // Moscovium (Group 15)
        116: {row: 8, col: 17}, // Livermorium (Group 16)
        117: {row: 8, col: 18}, // Tennessine (Group 17)
        118: {row: 8, col: 19}  // Oganesson (Group 18)
    };

    let allElements = [];
    const mainContainer = document.querySelector('.periodic-container');
    const tableWrapper = document.querySelector('.periodic-table-wrapper');
    const controlsContainer = document.querySelector('.periodic-controls');

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

            setupControls();
            createPeriodicTable(allElements);
        });

        function createPeriodicTable(elements) {
            tableWrapper.innerHTML = '';
            
            const table = document.createElement('div');
            table.className = 'periodic-table';
            
            // Add Group Headers (1-18)
            for(let group = 1; group <= 18; group++) {
                const header = document.createElement('div');
                header.className = 'group-header';
                header.style.gridRow = '1';
                header.style.gridColumn = group + 1; // Columns 2-19
                header.textContent = group;
                table.appendChild(header);
            }
        
            // Add Period Numbers (1-7)
            for(let period = 1; period <= 7; period++) {
                const number = document.createElement('div');
                number.className = 'period-number';
                number.style.gridRow = period + 1; // Rows 2-8
                number.style.gridColumn = '1';
                number.textContent = period;
                table.appendChild(number);
            }
        
            // Add Elements
            elements.forEach(element => {
                const tile = document.createElement('div');
                tile.className = 'element-tile';
                // Use original grid positions WITHOUT +1 offset
                tile.style.gridRow = elementGrid[element.AtomicNumber].row;
                tile.style.gridColumn = elementGrid[element.AtomicNumber].col;
                tile.style.backgroundColor = `#${element.CPKHexColor || 'ddd'}`;
                tile.dataset.group = element.GroupBlock;
                
                tile.innerHTML = `
                    <div class="atomic-number">${element.AtomicNumber}</div>
                    <div class="symbol">${element.Symbol}</div>
                    <div class="name">${element.Name}</div>
                    <div class="atomic-mass">${element.AtomicMass}</div>
                `;
        
                tile.addEventListener('click', () => showElementDetails(element));
                table.appendChild(tile);
            });
            
            tableWrapper.appendChild(table);
        }


    function setupControls() {
        const groups = [...new Set(allElements.map(e => e.GroupBlock))];
        
        controlsContainer.innerHTML = `
    <div class="search-filter-container">
        <!-- Search Section -->
        <div class="search-section">
        <input type="text" placeholder="Search elements..." class="search-input">
        </div>

    <!-- Divider -->
        <div class="filter-divider"></div>

    <!-- Filter Section -->
        <div class="filter-section">
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
        </div>
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
    
        // Close when clicking the X button
        modal.querySelector('.close').addEventListener('click', () => modal.remove());
    
        // Close when clicking outside the modal content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    
        // Add escape key listener
        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        });
    
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
});

