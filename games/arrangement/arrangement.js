// ChemEdu Interactive Game Core Logic - Revised for new JSON format

// Game Configuration
const CONFIG = {
    difficulties: {
      easy: { elements: 10, time: 120, hints: 3 },
      medium: { elements: 30, time: 90, hints: 1 },
      hard: { elements: 118, time: 60, hints: 0 }
    },
    elementDataURL: 'elements.json',
    scoring: {
      correct: 100,
      incorrect: -50,
      timeBonus: 2
    },
    // NEW: Added property mappings for the new JSON structure
    propertyMappings: {
      atomicRadius: 'atomic_radius', // Note: Not in original JSON, would need to be added
      atomicMass: 'atomic_mass',
      boil: 'boil',
      density: 'density',
      electronegativity: 'electronegativity_pauling',
      ionizationEnergy: 'ionization_energies.0' // First ionization energy
    }
  };
  
  // Game State
  let gameState = {
    currentMode: 'easy',
    selectedElements: [],
    score: 0,
    timeLeft: 0,
    timerId: null,
    currentCategory: 'atomicMass', // Changed default to existing property
    arrangementOrder: [],
    // NEW: Track original element data
    fullElementData: []
  };
  
  // DOM Elements
  const dom = {
    elementPool: document.getElementById('element-pool'),
    arrangementZone: document.getElementById('arrangement-zone'),
    scoreDisplay: document.getElementById('score'),
    timerDisplay: document.getElementById('time'),
    startButton: document.getElementById('start-game'),
    // NEW: Added property selector
    propertySelect: document.getElementById('property-select')
  };
  
  // Initialize Game
  async function initGame() {
    try {
      const data = await loadElementData();
      gameState.fullElementData = data.elements; // Store full dataset
      gameState.selectedElements = selectElements(data.elements);
      renderElementTiles();
      setupDragAndDrop();
      setupAccessibility();
      // NEW: Initialize property selector
      setupPropertySelector();
    } catch (error) {
      console.error('Error initializing game:', error);
      showError("Failed to load element data. Please try again later.");
    }
  }
  
  // NEW: Load and parse element data with error handling
  async function loadElementData() {
    const response = await fetch(CONFIG.elementDataURL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  }
  
  // Updated Element Selection Logic
  function selectElements(elements) {
    const count = CONFIG.difficulties[gameState.currentMode].elements;
    // Filter out elements missing the current property
    const availableElements = elements.filter(el => {
      const prop = CONFIG.propertyMappings[gameState.currentCategory];
      return getNestedProperty(el, prop) !== null;
    });
    
    return availableElements
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }
  
  // NEW: Helper to handle nested properties (e.g. ionization_energies.0)
  function getNestedProperty(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }
  
  // Updated Render Element Tiles
  function renderElementTiles() {
    dom.elementPool.innerHTML = '';
    gameState.selectedElements.forEach(element => {
      const tile = document.createElement('div');
      tile.className = `element-tile ${element.category.toLowerCase().replace(/\s+/g, '-')}`;
      tile.innerHTML = `
        <div class="atomic-number">${element.number}</div>
        <div class="symbol">${element.symbol}</div>
      `;
      tile.draggable = true;
      tile.dataset.symbol = element.symbol;
      tile.dataset.number = element.number;
      // Enhanced tooltip with more data
      tile.dataset.tooltip = `
        ${element.name} (${element.symbol})
        Atomic Number: ${element.number}
        Atomic Mass: ${element.atomic_mass}
        Category: ${element.category}
        ${gameState.currentCategory}: ${getNestedProperty(element, 
          CONFIG.propertyMappings[gameState.currentCategory])}
      `;
      dom.elementPool.appendChild(tile);
    });
  }
  
  // NEW: Setup property selector dropdown
  function setupPropertySelector() {
    Object.entries(CONFIG.propertyMappings).forEach(([key, val]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key.replace(/([A-Z])/g, ' $1').trim(); // camelCase to words
      dom.propertySelect.appendChild(option);
    });
    
    dom.propertySelect.addEventListener('change', (e) => {
      gameState.currentCategory = e.target.value;
      resetGame();
    });
  }
  
  // Updated Drop Validation
  function handleDrop(event) {
    const draggedElement = event.relatedTarget;
    const correctOrder = getExpectedOrder(gameState.currentCategory);
    
    if (validatePlacement(draggedElement, correctOrder)) {
      handleCorrectPlacement(draggedElement);
    } else {
      handleIncorrectPlacement(draggedElement);
    }
  }
  
  // Updated Validation Logic
  function validatePlacement(element, expectedOrder) {
    const currentSymbol = element.dataset.symbol;
    const currentPosition = gameState.arrangementOrder.length;
    return expectedOrder[currentPosition] === currentSymbol;
  }
  
  // NEW: Get expected order based on current property
  function getExpectedOrder(property) {
    const propPath = CONFIG.propertyMappings[property];
    return [...gameState.selectedElements]
      .sort((a, b) => {
        const valA = getNestedProperty(a, propPath);
        const valB = getNestedProperty(b, propPath);
        return valA - valB;
      })
      .map(el => el.symbol);
  }
  
  // NEW: Reset game when changing properties
  function resetGame() {
    clearInterval(gameState.timerId);
    gameState.selectedElements = selectElements(gameState.fullElementData);
    gameState.arrangementOrder = [];
    gameState.score = 0;
    updateScoreDisplay();
    renderElementTiles();
  }
  
  // Game Logic Handlers
  function handleCorrectPlacement(element) {
    element.classList.add('correct');
    gameState.score += CONFIG.scoring.correct;
    updateScoreDisplay();
    gameState.arrangementOrder.push(element.dataset.symbol);
    checkGameCompletion();
  }
  
  function handleIncorrectPlacement(element) {
    element.classList.add('incorrect');
    gameState.score += CONFIG.scoring.incorrect;
    updateScoreDisplay();
    setTimeout(() => element.classList.remove('incorrect'), 1000);
  }
  
  // Game Flow Control
  function startGame() {
    gameState.timeLeft = CONFIG.difficulties[gameState.currentMode].time;
    gameState.timerId = setInterval(updateTimer, 1000);
    dom.startButton.disabled = true;
  }
  
  function checkGameCompletion() {
    if (gameState.arrangementOrder.length === gameState.selectedElements.length) {
      endGame(true);
    }
  }
  
  function endGame(success) {
    clearInterval(gameState.timerId);
    showResults(success);
  }
  
  // UI Updates
  function updateScoreDisplay() {
    dom.scoreDisplay.textContent = gameState.score;
  }
  
  function updateTimer() {
    gameState.timeLeft--;
    dom.timerDisplay.textContent = gameState.timeLeft;
    
    if (gameState.timeLeft <= 0) {
      endGame(false);
    }
  }
  
  // Accessibility Features :cite[4]:cite[7]
  function setupAccessibility() {
    document.addEventListener('keydown', handleKeyboardNavigation);
    document.querySelectorAll('.element-tile').forEach(tile => {
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', `${tile.dataset.tooltip}`);
    });
  }
  
  function handleKeyboardNavigation(event) {
    // Implement keyboard controls
  }
  
  // Initialize on Load
  document.addEventListener('DOMContentLoaded', initGame);
  dom.startButton.addEventListener('click', startGame);