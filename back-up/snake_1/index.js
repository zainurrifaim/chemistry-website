// Game initialization
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const compoundNameDisplay = document.getElementById('compound-name');
const compoundFormulaDisplay = document.getElementById('compound-formula');
const cationReqDisplay = document.getElementById('cation-req');
const anionReqDisplay = document.getElementById('anion-req');
const restartBtn = document.getElementById('restart-btn');
const hintBtn = document.getElementById('hint-btn');

// Game constants
let GRID_SIZE = 30; // Will be adjusted based on screen size
let GRID_COLS, GRID_ROWS;

// Chemistry data with correct ratios (Sorted from Easy to Hard)
const compounds = [
    // **Easy: Simple 1:1 Salts**
    { name: "Sodium Chloride", formula: "NaCl",
      cation: {symbol: "Na", charge: "+"}, anion: {symbol: "Cl", charge: "-"}, ratio: [1,1] },
    { name: "Potassium Bromide", formula: "KBr",
      cation: {symbol: "K", charge: "+"}, anion: {symbol: "Br", charge: "-"}, ratio: [1,1] },
    { name: "Lithium Fluoride", formula: "LiF",
      cation: {symbol: "Li", charge: "+"}, anion: {symbol: "F", charge: "-"}, ratio: [1,1] },
      
    // **Medium: 2:1 or 1:2 Charge Balancing**
    { name: "Calcium Chloride", formula: "CaCl₂",
      cation: {symbol: "Ca", charge: "2+"}, anion: {symbol: "Cl", charge: "-"}, ratio: [1,2] },
    { name: "Magnesium Oxide", formula: "MgO",
      cation: {symbol: "Mg", charge: "2+"}, anion: {symbol: "O", charge: "2-"}, ratio: [1,1] },
    { name: "Barium Sulfate", formula: "BaSO₄",
      cation: {symbol: "Ba", charge: "2+"}, anion: {symbol: "SO₄", charge: "2-"}, ratio: [1,1] },
      
    // **Harder: Polyatomic Ions**
    { name: "Ammonium Nitrate", formula: "NH₄NO₃",
      cation: {symbol: "NH₄", charge: "+"}, anion: {symbol: "NO₃", charge: "-"}, ratio: [1,1] },
    { name: "Aluminum Sulfate", formula: "Al₂(SO₄)₃",
      cation: {symbol: "Al", charge: "3+"}, anion: {symbol: "SO₄", charge: "2-"}, ratio: [2,3] },
    { name: "Iron(III) Phosphate", formula: "FePO₄",
      cation: {symbol: "Fe", charge: "3+"}, anion: {symbol: "PO₄", charge: "3-"}, ratio: [1,1] },
      
    // **Difficult: Transition Metals & Rare Ions**
    { name: "Iron(III) Oxide", formula: "Fe₂O₃",
      cation: {symbol: "Fe", charge: "3+"}, anion: {symbol: "O", charge: "2-"}, ratio: [2,3] },
    { name: "Copper(II) Sulfate", formula: "CuSO₄",
      cation: {symbol: "Cu", charge: "2+"}, anion: {symbol: "SO₄", charge: "2-"}, ratio: [1,1] },
    { name: "Dichromate", formula: "K₂Cr₂O₇",
      cation: {symbol: "K", charge: "+"}, anion: {symbol: "Cr₂O₇", charge: "2-"}, ratio: [2,1] },
    { name: "Permanganate", formula: "KMnO₄",
      cation: {symbol: "K", charge: "+"}, anion: {symbol: "MnO₄", charge: "-"}, ratio: [1,1] }
];

const cations = [
    {symbol: "Na", charge: "+"},   // Sodium
    {symbol: "K", charge: "+"},    // Potassium
    {symbol: "Li", charge: "+"},   // Lithium
    {symbol: "NH₄", charge: "+"},  // Ammonium
    {symbol: "Ca", charge: "2+"},  // Calcium
    {symbol: "Mg", charge: "2+"},  // Magnesium
    {symbol: "Ba", charge: "2+"},  // Barium
    {symbol: "Al", charge: "3+"},  // Aluminum
    {symbol: "Fe", charge: "3+"},  // Iron (III)
    {symbol: "Cu", charge: "2+"}   // Copper (II)
];

const anions = [
    {symbol: "Cl", charge: "-"},    // Chloride
    {symbol: "Br", charge: "-"},    // Bromide
    {symbol: "F", charge: "-"},     // Fluoride
    {symbol: "O", charge: "2-"},    // Oxide
    {symbol: "SO₄", charge: "2-"},  // Sulfate
    {symbol: "NO₃", charge: "-"},   // Nitrate
    {symbol: "PO₄", charge: "3-"},  // Phosphate
    {symbol: "Cr₂O₇", charge: "2-"},// Dichromate
    {symbol: "MnO₄", charge: "-"}   // Permanganate
];


// Game state
let snake = [];
let direction = 'right';
let nextDirection = 'right';
let food = [];
let score = 100;
let gameOver = false;
let currentCompoundIndex = 0;
let currentCompound = compounds[currentCompoundIndex];
let requiredCations = currentCompound.ratio[0];
let requiredAnions = currentCompound.ratio[1];
let collectedCations = 0;
let collectedAnions = 0;
let gameSpeed = 150;
let gameLoopId;

// Initialize game grid based on current canvas size
function initGrid() {
    GRID_COLS = Math.floor(canvas.width / GRID_SIZE);
    GRID_ROWS = Math.floor(canvas.height / GRID_SIZE);
    
    // Adjust grid size if too small
    if (GRID_COLS < 10 || GRID_ROWS < 10) {
        GRID_SIZE = Math.min(canvas.width / 10, canvas.height / 10);
        GRID_COLS = Math.floor(canvas.width / GRID_SIZE);
        GRID_ROWS = Math.floor(canvas.height / GRID_SIZE);
    }
}

// Resize canvas to fill available space
function resizeCanvas() {
    const board = document.querySelector('.game-board');
    canvas.width = board.clientWidth;
    canvas.height = board.clientHeight;
    initGrid();
    
    if (snake.length > 0) {
        draw();
    }
}

// Initialize game
function initGame() {
    // Clear previous game loop
    cancelAnimationFrame(gameLoopId);
    
    // Reset game state
    snake = [];
    for (let i = 3; i >= 0; i--) {
        snake.push({x: i, y: 0});
    }
    
    direction = 'right';
    nextDirection = 'right';
    score = 100;
    gameOver = false;
    currentCompoundIndex = 0;
    currentCompound = compounds[currentCompoundIndex];
    requiredCations = currentCompound.ratio[0];
    requiredAnions = currentCompound.ratio[1];
    collectedCations = 0;
    collectedAnions = 0;
    gameSpeed = 150;
    
    // Initialize grid and generate food
    initGrid();
    generateFood();
    updateDisplay();
    
    // Start new game loop
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Generate food items - ensures enough ions are available
function generateFood() {
    food = [];
    
    // Generate required cations (multiple instances if needed)
    for (let i = 0; i < Math.max(3, requiredCations * 2); i++) {
        food.push({
            ...currentCompound.cation,
            x: Math.floor(Math.random() * GRID_COLS),
            y: Math.floor(Math.random() * GRID_ROWS),
            type: 'cation'
        });
    }
    
    // Generate required anions (multiple instances if needed)
    for (let i = 0; i < Math.max(3, requiredAnions * 2); i++) {
        food.push({
            ...currentCompound.anion,
            x: Math.floor(Math.random() * GRID_COLS),
            y: Math.floor(Math.random() * GRID_ROWS),
            type: 'anion'
        });
    }
    
    // Add some random ions
    const randomIonCount = 5;
    for (let i = 0; i < randomIonCount; i++) {
        const ionType = Math.random() < 0.5 ? 'cation' : 'anion';
        const pool = ionType === 'cation' ? cations : anions;
        const randomIon = pool[Math.floor(Math.random() * pool.length)];
        
        // Don't add duplicates of the current target ions
        if (!(randomIon.symbol === currentCompound.cation.symbol && randomIon.charge === currentCompound.cation.charge) &&
            !(randomIon.symbol === currentCompound.anion.symbol && randomIon.charge === currentCompound.anion.charge)) {
            food.push({
                ...randomIon,
                x: Math.floor(Math.random() * GRID_COLS),
                y: Math.floor(Math.random() * GRID_ROWS),
                type: ionType
            });
        }
    }
}

// Update all displays
function updateDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    levelDisplay.textContent = `Level: ${currentCompoundIndex + 1}`;
    compoundNameDisplay.textContent = currentCompound.name;
    compoundFormulaDisplay.textContent = currentCompound.formula;
    cationReqDisplay.textContent = `${currentCompound.cation.symbol}${currentCompound.cation.charge}: ${collectedCations}/${requiredCations}`;
    anionReqDisplay.textContent = `${currentCompound.anion.symbol}${currentCompound.anion.charge}: ${collectedAnions}/${requiredAnions}`;
}

// Main game loop
function gameLoop(timestamp) {
    if (gameOver) return;
    
    // Control game speed
    if (!lastTimestamp || timestamp - lastTimestamp >= gameSpeed) {
        lastTimestamp = timestamp;
        
        moveSnake();
        checkCollisions();
        draw();
    }
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Handle snake movement
function moveSnake() {
    direction = nextDirection;
    
    // Calculate new head position
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Wrap around edges
    if (head.x < 0) head.x = GRID_COLS - 1;
    if (head.x >= GRID_COLS) head.x = 0;
    if (head.y < 0) head.y = GRID_ROWS - 1;
    if (head.y >= GRID_ROWS) head.y = 0;
    
    // Add new head
    snake.unshift(head);
    
    // Check if food was eaten
    const ateFood = checkFoodCollision();
    if (!ateFood) {
        snake.pop(); // Remove tail if no food eaten
    }
}

// Check for food collisions
function checkFoodCollision() {
    const head = snake[0];
    
    for (let i = 0; i < food.length; i++) {
        if (head.x === food[i].x && head.y === food[i].y) {
            const isCorrectCation = food[i].symbol === currentCompound.cation.symbol && 
                                  food[i].charge === currentCompound.cation.charge;
            const isCorrectAnion = food[i].symbol === currentCompound.anion.symbol && 
                                 food[i].charge === currentCompound.anion.charge;
            
            if (isCorrectCation) {
                collectedCations++;
                score += 10 * (Math.abs(parseInt(food[i].charge)) || 1);
                // Grow snake
                snake.push({...snake[snake.length-1]});
            } 
            else if (isCorrectAnion) {
                collectedAnions++;
                score += 10 * (Math.abs(parseInt(food[i].charge)) || 1);
                // Grow snake
                snake.push({...snake[snake.length-1]});
            } 
            else {
                // Wrong ion penalty
                const penalty = 15 * (Math.abs(parseInt(food[i].charge)) || 1);
                score = Math.max(0, score - penalty);
                
                // Shrink snake if possible
                if (snake.length > 4) {
                    snake.pop();
                }
                
                if (score <= 0) {
                    gameOver = true;
                    drawGameOver();
                }
            }
            
            // Remove eaten food
            food.splice(i, 1);
            
            // Check if level is complete
            if (collectedCations >= requiredCations && collectedAnions >= requiredAnions) {
                nextLevel();
            }
            
            updateDisplay();
            return true;
        }
    }
    return false;
}

// Advance to next level
function nextLevel() {
    currentCompoundIndex = (currentCompoundIndex + 1) % compounds.length;
    currentCompound = compounds[currentCompoundIndex];
    requiredCations = currentCompound.ratio[0];
    requiredAnions = currentCompound.ratio[1];
    collectedCations = 0;
    collectedAnions = 0;
    
    // Increase speed slightly
    gameSpeed = Math.max(50, gameSpeed * 0.95);
    
    generateFood();
    updateDisplay();
    
    // Show level transition
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        `Level Complete! Next: ${currentCompound.name}`,
        canvas.width/2,
        canvas.height/2
    );
    
    setTimeout(() => {
        if (!gameOver) {
            draw();
        }
    }, 1500);
}

// Check for collisions
function checkCollisions() {
    const head = snake[0];
    
    // Check self-collision (skip first 4 segments)
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            drawGameOver();
            return;
        }
    }
}

// Draw game state
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Draw food
    drawFood();
    
    // Draw snake
    drawSnake();
}

// Draw grid
function drawGrid() {
    const light = 'rgba(255, 255, 255, 0.05)';
    const dark = 'rgba(0, 0, 0, 0.1)';
    
    for (let x = 0; x < GRID_COLS; x++) {
        for (let y = 0; y < GRID_ROWS; y++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? light : dark;
            ctx.fillRect(
                x * GRID_SIZE, 
                y * GRID_SIZE, 
                GRID_SIZE, 
                GRID_SIZE
            );
        }
    }
}

// Draw snake
function drawSnake() {
    // Draw body
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        
        // Head is different color
        if (i === 0) {
            ctx.fillStyle = '#e74c3c'; // Red head
        } else {
            // Gradient body
            const intensity = 200 - Math.min(150, i * 2);
            ctx.fillStyle = `rgb(46, ${intensity}, 113)`;
        }
        
        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
        
        // Segment border
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    }
}

// Update food drawing for dark theme:
function drawFood() {
    for (let i = 0; i < food.length; i++) {
        const ion = food[i];
        const padding = 4;
        const cornerRadius = 6;
        const x = ion.x * GRID_SIZE + padding;
        const y = ion.y * GRID_SIZE + padding;
        const width = GRID_SIZE - padding * 2;
        const height = GRID_SIZE - padding * 2;
        
        // Draw glowing background
        const glow = ctx.createRadialGradient(
            x + width/2, y + height/2, 0,
            x + width/2, y + height/2, width/1.5
        );
        
        if (ion.type === 'cation') {
            glow.addColorStop(0, 'rgba(74, 144, 226, 0.8)');
            glow.addColorStop(1, 'rgba(74, 144, 226, 0.1)');
        } else {
            glow.addColorStop(0, 'rgba(230, 57, 70, 0.8)');
            glow.addColorStop(1, 'rgba(230, 57, 70, 0.1)');
        }
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(
            x + width/2, y + height/2,
            width/1.5, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Draw ion container
        ctx.fillStyle = ion.type === 'cation' ? 'rgba(74, 144, 226, 0.9)' : 'rgba(230, 57, 70, 0.9)';
        ctx.beginPath();
        ctx.moveTo(x + cornerRadius, y);
        ctx.lineTo(x + width - cornerRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
        ctx.lineTo(x + width, y + height - cornerRadius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
        ctx.lineTo(x + cornerRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
        ctx.lineTo(x, y + cornerRadius);
        ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
        ctx.closePath();
        ctx.fill();
        
        // Add subtle shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;
        
        // Draw ion symbol
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `${GRID_SIZE/3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            `${ion.symbol}${ion.charge}`,
            ion.x * GRID_SIZE + GRID_SIZE/2,
            ion.y * GRID_SIZE + GRID_SIZE/2
        );
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
    }
  }

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 30);
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
    ctx.font = '20px Arial';
    ctx.fillText('Press Restart to play again', canvas.width/2, canvas.height/2 + 50);
}

// Handle keyboard input
document.addEventListener('keydown', e => {
    switch(e.key) {
        case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
    }
});

// Button event listeners
restartBtn.addEventListener('click', initGame);
hintBtn.addEventListener('click', () => {
    alert(`Collect ${requiredCations} ${currentCompound.cation.symbol}${currentCompound.cation.charge} and ${requiredAnions} ${currentCompound.anion.symbol}${currentCompound.anion.charge} to make ${currentCompound.formula}`);
});

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Start the game
resizeCanvas();
initGame();
let lastTimestamp = 0;