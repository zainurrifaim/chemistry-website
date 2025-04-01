// game.js - Periodic Table Sorting Game

// JSON data location - adjust path as needed
const ELEMENTS_JSON_PATHS = [
    '../../json/all-elements.json'
];

// Sorting options
const SORTING_OPTIONS = {
    "AtomicRadius": {
        display: "Atomic Radius",
        unit: "pm",
        direction: "smallest to largest"
    },
    "Electronegativity": {
        display: "Electronegativity",
        unit: "Pauling scale",
        direction: "lowest to highest"
    },
    "IonizationEnergy": {
        display: "Ionization Energy",
        unit: "eV",
        direction: "lowest to highest"
    },
    "ElectronAffinity": {
        display: "Electron Affinity",
        unit: "eV",
        direction: "lowest to highest"
    }
};

// Game variables
let elementsData = [];
let selectedElements = [];
let timeLeft = 300;
let timerInterval;
let gameState = 'ready';
let currentSortingProperty = 'AtomicRadius';

// Touch variables
let touchStartX = 0;
let touchStartY = 0;
let draggedBox = null;
let draggedBoxInitialParent = null;

// DOM Elements
const initialContainer = document.getElementById('initial-container');
const answerContainer = document.getElementById('answer-container');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');
const submitButton = document.getElementById('submit-btn');
const resultElement = document.getElementById('result');
const slots = document.querySelectorAll('.slot');
const sortingSelect = document.getElementById('sorting-select');
const propertyInfo = document.getElementById('property-info');

// ================== CORE FUNCTIONS ================== //

// Try multiple possible paths for the JSON file
async function loadElementsData() {
    // First try to load from any of the possible paths
    for (const path of ELEMENTS_JSON_PATHS) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const data = await response.json();
                elementsData = processElementsData(data);
                return; // Success - exit the function
            }
        } catch (error) {
            console.log(`Failed to load from ${path}, trying next...`);
        }
    }
    
    // If all paths fail, use fallback data
    console.warn('Using fallback element data');
    elementsData = getFallbackElements();
}

function processElementsData(data) {
    if (!data?.Table?.Row) return getFallbackElements();
    
    const columns = data.Table.Columns.Column;
    return data.Table.Row.map(row => {
        const element = {};
        row.Cell.forEach((value, index) => {
            element[columns[index]] = value;
        });
        return element;
    }).filter(e => e.AtomicNumber && e.AtomicNumber <= 36);
}

function getFallbackElements() {
    return [
        {
            AtomicNumber: "1", Symbol: "H", Name: "Hydrogen",
            CPKHexColor: "FFFFFF", AtomicRadius: "120",
            Electronegativity: "2.20", IonizationEnergy: "13.598",
            ElectronAffinity: "0.754", OxidationStates: "+1, -1",
            StandardState: "Gas", MeltingPoint: "13.81",
            BoilingPoint: "20.28", Density: "0.00008988",
            GroupBlock: "Nonmetal", YearDiscovered: "1766"
        },
        {
            AtomicNumber: "2", Symbol: "He", Name: "Helium",
            CPKHexColor: "D9FFFF", AtomicRadius: "140",
            Electronegativity: null, IonizationEnergy: "24.587",
            ElectronAffinity: "0", OxidationStates: "0",
            StandardState: "Gas", MeltingPoint: "0.95",
            BoilingPoint: "4.22", Density: "0.0001785",
            GroupBlock: "Noble gas", YearDiscovered: "1868"
        },
        // Add more elements as needed...
    ].slice(0, 36); // Limit to first 36 elements
}

// ================== GAME SETUP FUNCTIONS ================== //

function setupSlots() {
    slots.forEach(slot => {
        slot.innerHTML = '';
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
        slot.addEventListener('drop', drop);
        
        // Add touch event listeners
        slot.addEventListener('touchmove', handleTouchMove, { passive: false });
        slot.addEventListener('touchend', handleTouchEnd);
    });

    initialContainer.addEventListener('dragover', dragOver);
    initialContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const atomicNumber = e.dataTransfer.getData('text/plain');
        const draggedBox = document.querySelector(`[data-atomic-number="${atomicNumber}"]`);
        if (draggedBox && !initialContainer.contains(draggedBox)) {
            initialContainer.appendChild(draggedBox);
            updateSubmitButton();
        }
    });
    
    // Add touch event listeners for initial container
    initialContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    initialContainer.addEventListener('touchend', handleTouchEnd);
}

function initSortingOptions() {
    if (!sortingSelect) return;
    
    sortingSelect.innerHTML = '';
    Object.entries(SORTING_OPTIONS).forEach(([value, {display, direction}]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = `${display} (${direction})`;
        if (value === currentSortingProperty) option.selected = true;
        sortingSelect.appendChild(option);
    });
    
    sortingSelect.addEventListener('change', (e) => {
        currentSortingProperty = e.target.value;
        updateGameInstructions();
        if (propertyInfo) {
            propertyInfo.textContent = SORTING_OPTIONS[currentSortingProperty].unit;
        }
    });
}

function updateGameInstructions() {
    const instructionElement = document.getElementById('game-instruction');
    if (instructionElement) {
        const {display, direction} = SORTING_OPTIONS[currentSortingProperty];
        instructionElement.textContent = `Drag and drop elements in order by ${display} (${direction})`;
    }
}

// ================== GAME LOGIC FUNCTIONS ================== //

async function startGame() {
    if (elementsData.length === 0) await loadElementsData();
    
    gameState = 'playing';
    selectedElements = generateRandomElements();
    timeLeft = 300;
    timerElement.textContent = timeLeft;
    scoreElement.textContent = '0';
    resultElement.textContent = '';
    
    createElementBoxes();
    setupSlots();
    
    startButton.textContent = 'Restart';
    submitButton.classList.remove('active');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) endGame('timeout');
    }, 1000);
}

function generateRandomElements() {
    const shuffled = [...elementsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

function createElementBoxes() {
    initialContainer.innerHTML = '';
    selectedElements.forEach(element => {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = element.Symbol;
        box.style.backgroundColor = `#${element.CPKHexColor}`;
        box.style.color = getContrastColor(element.CPKHexColor);
        box.setAttribute('draggable', true);
        box.setAttribute('data-atomic-number', element.AtomicNumber);
        box.title = getElementTooltip(element);
        
        box.addEventListener('dragstart', dragStart);
        box.addEventListener('dragend', dragEnd);
        
        // Add touch event listeners
        box.addEventListener('touchstart', handleTouchStart, { passive: false });
        box.addEventListener('touchmove', handleTouchMove, { passive: false });
        box.addEventListener('touchend', handleTouchEnd);
        
        initialContainer.appendChild(box);
    });
}

function getContrastColor(hexColor) {
    if (!hexColor || hexColor.length !== 6) return '#000';
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000' : '#fff';
}

function getElementTooltip(element) {
    const prop = SORTING_OPTIONS[currentSortingProperty];
    return `${element.Name} (${element.Symbol})
Atomic Number: ${element.AtomicNumber}
${prop.display}: ${element[currentSortingProperty] || 'N/A'} ${prop.unit}`;
}

function checkAnswer() {
    const boxes = answerContainer.querySelectorAll('.box');
    if (boxes.length !== 5) return false;
    
    const elements = Array.from(boxes).map(box => 
        elementsData.find(e => e.AtomicNumber === box.dataset.atomicNumber)
    );
    
    for (let i = 1; i < elements.length; i++) {
        const current = parseFloat(elements[i][currentSortingProperty] || 0);
        const prev = parseFloat(elements[i-1][currentSortingProperty] || 0);
        if (current < prev) return false;
    }
    return true;
}

function updateSubmitButton() {
    const canSubmit = answerContainer.querySelectorAll('.box').length === 5 && gameState === 'playing';
    submitButton.classList.toggle('active', canSubmit);
    submitButton.disabled = !canSubmit;
}

function endGame(reason) {
    clearInterval(timerInterval);
    gameState = ['won', 'lost'].includes(reason) ? reason : 'ready';
    
    switch(reason) {
        case 'timeout':
            resultElement.textContent = "Time's up! Score: 0";
            scoreElement.textContent = '0';
            break;
        case 'correct':
            const score = Math.floor(timeLeft * 2.5);
            resultElement.innerHTML = `<span class="score-text">Correct! Score: ${score}</span>`;
            scoreElement.textContent = score;
            break;
        case 'incorrect':
            resultElement.textContent = 'Wrong order! Try again.';
            break;
    }
    
    submitButton.classList.remove('active');
}

// ================== DRAG AND DROP HANDLERS ================== //

function dragStart(e) {
    if (gameState !== 'playing') return;
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.atomicNumber);
}

function dragEnd() {
    this.classList.remove('dragging');
}

function dragOver(e) {
    if (gameState !== 'playing') return;
    e.preventDefault();
}

function dragEnter(e) {
    if (gameState !== 'playing') return;
    e.preventDefault();
    this.classList.add('drag-over');
}

function dragLeave() {
    this.classList.remove('drag-over');
}

function drop(e) {
    if (gameState !== 'playing') return;
    e.preventDefault();
    
    const atomicNumber = e.dataTransfer.getData('text/plain');
    const draggedBox = document.querySelector(`[data-atomic-number="${atomicNumber}"]`);
    const target = this;
    
    if (target.classList.contains('slot')) {
        const existingBox = target.querySelector('.box');
        if (existingBox) {
            draggedBox.parentElement.appendChild(existingBox);
        }
        target.appendChild(draggedBox);
    }
    
    target.classList.remove('drag-over');
    updateSubmitButton();
}

// ================== TOUCH EVENT HANDLERS ================== //

function handleTouchStart(e) {
    if (gameState !== 'playing') return;
    e.preventDefault();
    
    draggedBox = this;
    draggedBoxInitialParent = this.parentElement;

    // Store original styles and parent
    const rect = draggedBox.getBoundingClientRect();
    draggedBox.dataset.originalParent = draggedBoxInitialParent;
    draggedBox.dataset.originalIndex = Array.from(draggedBoxInitialParent.children).indexOf(draggedBox);
    
    // Move element to body for viewport-relative positioning
    document.body.appendChild(draggedBox);
    
    // Calculate touch offset relative to element
    const touch = e.touches[0];
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    // Store dimensions and offsets
    draggedBox.dataset.offsetX = offsetX;
    draggedBox.dataset.offsetY = offsetY;
    draggedBox.dataset.originalWidth = rect.width;
    draggedBox.dataset.originalHeight = rect.height;

    // Apply optimized dragging styles
    draggedBox.style.position = 'fixed';
    draggedBox.style.width = `${rect.width}px`;
    draggedBox.style.height = `${rect.height}px`;
    draggedBox.style.left = `${rect.left}px`;
    draggedBox.style.top = `${rect.top}px`;
    draggedBox.style.zIndex = '1000';
    draggedBox.style.transform = 'translateZ(0)'; // Enable GPU acceleration
    draggedBox.style.transition = 'none'; // Disable CSS transitions
}

function handleTouchMove(e) {
    if (!draggedBox || gameState !== 'playing') return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const x = touch.clientX - parseFloat(draggedBox.dataset.offsetX);
    const y = touch.clientY - parseFloat(draggedBox.dataset.offsetY);

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
        draggedBox.style.left = `${x}px`;
        draggedBox.style.top = `${y}px`;
    });

    // Get current position for hit testing
    const centerX = touch.clientX;
    const centerY = touch.clientY;

    // Reset highlights
    slots.forEach(s => s.classList.remove('drag-over'));
    initialContainer.classList.remove('drag-over');

    // Find drop target using document.elementFromPoint
    const target = document.elementFromPoint(centerX, centerY);
    const slot = target?.closest('.slot');
    const container = target?.closest('#initial-container');

    // Highlight valid drop targets
    if (slot) {
        slot.classList.add('drag-over');
    } else if (container) {
        container.classList.add('drag-over');
    }
}

function handleTouchEnd(e) {
    if (!draggedBox || gameState !== 'playing') return;
    e.preventDefault();

    // Get final touch position
    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    // Find all potential drop targets
    const answerContainer = document.getElementById('answer-container');
    const targets = document.elementsFromPoint(x, y);
    
    // Prioritize drop targets in this order:
    const slot = targets.find(t => t.classList?.contains('slot'));
    const initial = targets.find(t => t === initialContainer);
    const answer = targets.find(t => t === answerContainer);

    // Reset styles first
    draggedBox.style.cssText = '';
    draggedBox.classList.remove('dragging');

    // Determine new parent with priority: slot > answer container > initial container
    let newParent;
    if (slot) {
        newParent = slot;
    } else if (answer) {
        // If dropping directly on answer container (not slot), find nearest slot
        const nearestSlot = Array.from(answerContainer.querySelectorAll('.slot'))
            .find(s => {
                const rect = s.getBoundingClientRect();
                return x >= rect.left && x <= rect.right &&
                       y >= rect.top && y <= rect.bottom;
            });
        newParent = nearestSlot || draggedBoxInitialParent;
    } else {
        newParent = initial || draggedBoxInitialParent;
    }

    // Validate parent element
    if (!(newParent instanceof HTMLElement)) {
        console.warn('Invalid drop target, reverting to original parent');
        newParent = draggedBoxInitialParent;
    }

    // Handle existing element in slot
    if (newParent.classList?.contains('slot') && newParent.children.length > 0) {
        const existing = newParent.children[0];
        existing.remove();
        draggedBoxInitialParent.appendChild(existing);
    }

    // Move element to new parent
    newParent.appendChild(draggedBox);

    // Cleanup
    document.querySelectorAll('.slot, #initial-container, #answer-container')
        .forEach(el => el.classList.remove('drag-over'));
    
    updateSubmitButton();
    draggedBox = null;
    draggedBoxInitialParent = null;
}

// ================== INITIALIZATION ================== //

async function initializeGame() {
    try {
        await loadElementsData();
        setupSlots();
        initSortingOptions();
        updateGameInstructions();
        
        startButton.addEventListener('click', startGame);
        submitButton.addEventListener('click', () => {
            if (!submitButton.classList.contains('active')) return;
            endGame(checkAnswer() ? 'correct' : 'incorrect');
        });
        
        if (propertyInfo) {
            propertyInfo.textContent = SORTING_OPTIONS[currentSortingProperty].unit;
        }
    } catch (error) {
        console.error('Game initialization failed:', error);
    }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', initializeGame);