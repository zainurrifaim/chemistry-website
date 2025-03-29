// game.js
class ElementSorterGame {
  constructor() {
    this.gameState = {
      currentCategory: null,
      difficulty: 'easy',
      score: 0,
      timeRemaining: 0,
      elementsPool: [],
      correctOrder: [],
      draggedElement: null,
      timerId: null
    };

    this.domElements = {
      gameContainer: document.getElementById('game-container'),
      scoreDisplay: document.getElementById('score'),
      timerDisplay: document.getElementById('timer'),
      feedbackDisplay: document.getElementById('feedback'),
      categorySelect: document.getElementById('category-select'),
      difficultySelect: document.getElementById('difficulty-select'),
      elementsPool: document.getElementById('elements-pool'),
      dropZone: document.getElementById('drop-zone')
    };

    this.elementData = [];
    this.initialize();
  }

  async initialize() {
    await this.loadElementData();
    this.setupEventListeners();
    this.showCategorySelection();
  }

  async loadElementData() {
    try {
      const response = await fetch('../../json/elements.json');
      const data = await response.json();
      this.elementData = data.elements
        .filter(el => el.number <= 36) // Hydrogen to Krypton
        .map(el => ({
          ...el,
          atomicRadius: el.atomic_mass, // Example mapping - adjust based on actual JSON properties
          electronegativity: el.electronegativity_pauling,
          ionizationEnergy: el.ionization_energies[0],
          group: el.group,
          period: el.period
        }));
    } catch (error) {
      console.error('Error loading element data:', error);
    }
  }

  setupEventListeners() {
    // Desktop events
    this.domElements.elementsPool.addEventListener('dragstart', e => this.handleDragStart(e));
    this.domElements.dropZone.addEventListener('dragover', e => this.handleDragOver(e));
    this.domElements.dropZone.addEventListener('drop', e => this.handleDrop(e));

    // Mobile touch events
    this.domElements.elementsPool.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: false });
    this.domElements.dropZone.addEventListener('touchmove', e => this.handleTouchMove(e), { passive: false });
    this.domElements.dropZone.addEventListener('touchend', e => this.handleTouchEnd(e));

    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
  }

  // Game Logic
  startGame() {
    this.gameState.currentCategory = this.domElements.categorySelect.value;
    this.gameState.difficulty = this.domElements.difficultySelect.value;
    this.generateChallengeSet();
    this.renderGameInterface();
    this.startTimer();
  }

  generateChallengeSet() {
    const { elements, count } = this.getElementsBasedOnDifficulty();
    this.gameState.elementsPool = this.shuffleArray([...elements]);
    this.gameState.correctOrder = this.sortElements([...elements]);
    this.renderElementsPool();
  }

  getElementsBasedOnDifficulty() {
    const difficulties = {
      easy: { count: 5, groups: [1, 17] },
      medium: { count: 10, groups: [1, 2, 16, 17] },
      hard: { count: 15, groups: Array.from({ length: 18 }, (_, i) => i + 1) }
    };

    const config = difficulties[this.gameState.difficulty];
    const filtered = this.elementData.filter(el => config.groups.includes(el.group));
    return {
      elements: this.shuffleArray(filtered).slice(0, config.count),
      count: config.count
    };
  }

  sortElements(elements) {
    const category = this.gameState.currentCategory;
    return elements.sort((a, b) => {
      if (category === 'atomicRadius') return a.atomicRadius - b.atomicRadius;
      if (category === 'electronegativity') return a.electronegativity - b.electronegativity;
      if (category === 'ionizationEnergy') return a.ionizationEnergy - b.ionizationEnergy;
      if (category === 'group') return a.group - b.group || a.period - b.period;
      return a.period - b.period || a.group - b.group;
    });
  }

  // Drag & Drop Handlers
  handleDragStart(e) {
    if (!e.target.classList.contains('element-tile')) return;
    this.gameState.draggedElement = e.target;
    e.target.classList.add('dragging');
  }

  handleDragOver(e) {
    e.preventDefault();
    this.domElements.dropZone.classList.add('drag-over');
  }

  handleDrop(e) {
    e.preventDefault();
    this.domElements.dropZone.classList.remove('drag-over');
    
    if (this.gameState.draggedElement) {
      const clone = this.gameState.draggedElement.cloneNode(true);
      clone.draggable = true;
      clone.addEventListener('dragstart', e => this.handleDragStart(e));
      this.domElements.dropZone.appendChild(clone);
      this.validatePlacement();
    }
  }

  // Touch Handlers
  handleTouchStart(e) {
    const tile = e.target.closest('.element-tile');
    if (!tile) return;
    
    e.preventDefault();
    this.gameState.draggedElement = tile;
    tile.classList.add('dragging');
    this.gameState.touchOffset = {
      x: e.touches[0].clientX - tile.getBoundingClientRect().left,
      y: e.touches[0].clientY - tile.getBoundingClientRect().top
    };
  }

  handleTouchMove(e) {
    if (!this.gameState.draggedElement) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    this.gameState.draggedElement.style.position = 'absolute';
    this.gameState.draggedElement.style.left = `${touch.clientX - this.gameState.touchOffset.x}px`;
    this.gameState.draggedElement.style.top = `${touch.clientY - this.gameState.touchOffset.y}px`;
  }

  handleTouchEnd(e) {
    if (!this.gameState.draggedElement) return;
    
    const dropZoneRect = this.domElements.dropZone.getBoundingClientRect();
    const tileRect = this.gameState.draggedElement.getBoundingClientRect();
    
    if (this.isWithinDropZone(tileRect, dropZoneRect)) {
      const clone = this.gameState.draggedElement.cloneNode(true);
      this.domElements.dropZone.appendChild(clone);
      this.validatePlacement();
    }
    
    this.gameState.draggedElement.removeAttribute('style');
    this.gameState.draggedElement.classList.remove('dragging');
    this.gameState.draggedElement = null;
  }

  // Validation & Scoring
  validatePlacement() {
    const placedElements = Array.from(this.domElements.dropZone.children)
      .map(tile => this.elementData.find(el => el.symbol === tile.dataset.symbol));
    
    const accuracy = this.calculateAccuracy(placedElements);
    this.updateScore(accuracy);
    this.provideFeedback(accuracy);
    
    if (accuracy === 100) this.handleGameComplete();
  }

  calculateAccuracy(placed) {
    const correct = placed.reduce((acc, el, idx) => 
      acc + (el?.symbol === this.gameState.correctOrder[idx]?.symbol ? 1 : 0), 0);
    return (correct / this.gameState.correctOrder.length) * 100;
  }

  updateScore(accuracy) {
    const basePoints = { easy: 10, medium: 20, hard: 50 };
    this.gameState.score += Math.round(basePoints[this.gameState.difficulty] * (accuracy / 100));
    this.domElements.scoreDisplay.textContent = this.gameState.score;
  }

  // UI Updates
  renderElementsPool() {
    this.domElements.elementsPool.innerHTML = '';
    this.gameState.elementsPool.forEach(el => {
      const tile = this.createElementTile(el);
      this.domElements.elementsPool.appendChild(tile);
    });
  }

  createElementTile(element) {
    const tile = document.createElement('div');
    tile.className = 'element-tile';
    tile.draggable = true;
    tile.dataset.symbol = element.symbol;
    tile.innerHTML = `
      <div class="symbol">${element.symbol}</div>
      <div class="atomic-number">${element.number}</div>
    `;
    return tile;
  }

  provideFeedback(accuracy) {
    let message = '';
    if (accuracy === 100) {
      message = 'Perfect! Correct order!';
      this.domElements.feedbackDisplay.style.color = 'green';
    } else if (accuracy >= 80) {
      message = 'Good! Almost there!';
      this.domElements.feedbackDisplay.style.color = 'orange';
    } else {
      message = 'Keep trying!';
      this.domElements.feedbackDisplay.style.color = 'red';
    }
    this.domElements.feedbackDisplay.textContent = message;
  }

  // Timer System
  startTimer() {
    this.gameState.timeRemaining = this.calculateTimeLimit();
    this.updateTimerDisplay();
    
    this.gameState.timerId = setInterval(() => {
      this.gameState.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.gameState.timeRemaining <= 0) {
        this.handleTimeExpired();
      }
    }, 1000);
  }

  calculateTimeLimit() {
    const limits = { easy: 300, medium: 180, hard: 120 };
    return limits[this.gameState.difficulty];
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.gameState.timeRemaining / 60);
    const seconds = this.gameState.timeRemaining % 60;
    this.domElements.timerDisplay.textContent = 
      `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Game State Management
  handleGameComplete() {
    clearInterval(this.gameState.timerId);
    this.provideFeedback(100);
    setTimeout(() => alert(`Game Over! Final Score: ${this.gameState.score}`), 500);
  }

  handleTimeExpired() {
    clearInterval(this.gameState.timerId);
    this.provideFeedback(0);
    setTimeout(() => alert('Time Expired! Try again!'), 500);
  }

  resetGame() {
    clearInterval(this.gameState.timerId);
    this.gameState = {
      ...this.gameState,
      score: 0,
      timeRemaining: 0,
      elementsPool: [],
      correctOrder: [],
      draggedElement: null
    };
    this.domElements.scoreDisplay.textContent = '0';
    this.domElements.timerDisplay.textContent = '0:00';
    this.domElements.feedbackDisplay.textContent = '';
    this.domElements.dropZone.innerHTML = '';
    this.domElements.elementsPool.innerHTML = '';
  }

  // Utility Methods
  shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  isWithinDropZone(tileRect, zoneRect) {
    return (
      tileRect.left >= zoneRect.left &&
      tileRect.right <= zoneRect.right &&
      tileRect.top >= zoneRect.top &&
      tileRect.bottom <= zoneRect.bottom
    );
  }
}

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', () => new ElementSorterGame());