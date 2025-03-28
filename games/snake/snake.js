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
const pauseBtn = document.getElementById('pause-btn');
const highScoreDisplay = document.getElementById('high-score');
const levelProgressDisplay = document.getElementById('level-progress');
const BORDER_SIZE = 10; // Thickness of the border

// Game constants
let GRID_OFFSET_X = 0;
let GRID_OFFSET_Y = 0;
const GRID_PADDING = 5;
let GRID_SIZE = 30;
let GRID_COLS, GRID_ROWS;
const HINT_COOLDOWN = 10000; // 10 seconds in ms

// Chemistry data with correct ratios (Sorted from Easy to Hard)
const compounds = [
    // **Easy: Simple 1:1 Salts**
    { name: "Sodium Chloride", formula: "NaCl",
      cation: {symbol: "Na", charge: "⁺"}, anion: {symbol: "Cl", charge: "⁻"}, ratio: [1,1] },
    { name: "Potassium Bromide", formula: "KBr",
      cation: {symbol: "K", charge: "⁺"}, anion: {symbol: "Br", charge: "⁻"}, ratio: [1,1] },
    { name: "Lithium Fluoride", formula: "LiF",
      cation: {symbol: "Li", charge: "⁺"}, anion: {symbol: "F", charge: "⁻"}, ratio: [1,1] },
      
    // **Medium: 2:1 or 1:2 Charge Balancing**
    { name: "Calcium Chloride", formula: "CaCl₂",
      cation: {symbol: "Ca", charge: "²⁺"}, anion: {symbol: "Cl", charge: "⁻"}, ratio: [1,2] },
    { name: "Magnesium Oxide", formula: "MgO",
      cation: {symbol: "Mg", charge: "²⁺"}, anion: {symbol: "O", charge: "²⁻"}, ratio: [1,1] },
    { name: "Barium Sulfate", formula: "BaSO₄",
      cation: {symbol: "Ba", charge: "²⁺"}, anion: {symbol: "SO₄", charge: "²⁻"}, ratio: [1,1] },
      
    // **Harder: Polyatomic Ions**
    { name: "Ammonium Nitrate", formula: "NH₄NO₃",
      cation: {symbol: "NH₄", charge: "⁺"}, anion: {symbol: "NO₃", charge: "⁻"}, ratio: [1,1] },
    { name: "Aluminum Sulfate", formula: "Al₂(SO₄)₃",
      cation: {symbol: "Al", charge: "³⁺"}, anion: {symbol: "SO₄", charge: "²⁻"}, ratio: [2,3] },
    { name: "Iron(III) Phosphate", formula: "FePO₄",
      cation: {symbol: "Fe", charge: "³⁺"}, anion: {symbol: "PO₄", charge: "³⁻"}, ratio: [1,1] },
      
    // **Difficult: Transition Metals & Rare Ions**
    { name: "Iron(III) Oxide", formula: "Fe₂O₃",
      cation: {symbol: "Fe", charge: "³⁺"}, anion: {symbol: "O", charge: "²⁻"}, ratio: [2,3] },
    { name: "Copper(II) Sulfate", formula: "CuSO₄",
      cation: {symbol: "Cu", charge: "²⁺"}, anion: {symbol: "SO₄", charge: "²⁻"}, ratio: [1,1] },
    { name: "Potassium Dichromate", formula: "K₂Cr₂O₇",
      cation: {symbol: "K", charge: "⁺"}, anion: {symbol: "Cr₂O₇", charge: "²⁻"}, ratio: [2,1] },
    { name: "Sodium Dichromate", formula: "Na₂Cr₂O₇",
      cation: {symbol: "Na", charge: "⁺"}, anion: {symbol: "Cr₂O₇", charge: "²⁻"}, ratio: [2,1] },
    { name: "Potassium Permanganate", formula: "KMnO₄",
      cation: {symbol: "K", charge: "⁺"}, anion: {symbol: "MnO₄", charge: "⁻"}, ratio: [1,1] }
];

const cations = [
    {symbol: "Na", charge: "⁺"},   // Sodium
    {symbol: "K", charge: "⁺"},    // Potassium
    {symbol: "Li", charge: "⁺"},   // Lithium
    {symbol: "NH₄", charge: "⁺"},  // Ammonium
    {symbol: "Ca", charge: "²⁺"},  // Calcium
    {symbol: "Mg", charge: "²⁺"},  // Magnesium
    {symbol: "Ba", charge: "²⁺"},  // Barium
    {symbol: "Al", charge: "³⁺"},  // Aluminum
    {symbol: "Fe", charge: "³⁺"},  // Iron (III)
    {symbol: "Cu", charge: "³⁺"}   // Copper (II)
];

const anions = [
    {symbol: "Cl", charge: "⁻"},    // Chloride
    {symbol: "Br", charge: "⁻"},    // Bromide
    {symbol: "F", charge: "⁻"},     // Fluoride
    {symbol: "O", charge: "²⁻"},    // Oxide
    {symbol: "SO₄", charge: "²⁻"},  // Sulfate
    {symbol: "NO₃", charge: "⁻"},   // Nitrate
    {symbol: "PO₄", charge: "³-"},  // Phosphate
    {symbol: "Cr₂O₇", charge: "²⁻"},// Dichromate
    {symbol: "MnO₄", charge: "⁻"}   // Permanganate
];

// Game state
let snake = [];
let direction = 'right';
let nextDirection = 'right';
let food = [];
let score = 100;
let gameOver = false;
let isPaused = false;
let currentCompoundIndex = 0;
let currentCompound = compounds[currentCompoundIndex];
let requiredCations = currentCompound.ratio[0];
let requiredAnions = currentCompound.ratio[1];
let collectedCations = 0;
let collectedAnions = 0;
let gameSpeed = 150;
let gameLoopId;
let lastTimestamp = 0;
let lastHintTime = 0;
let highScore = localStorage.getItem('chemistrySnakeHighScore') || 0;
let particles = [];
// Touch control variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const minSwipeDistance = 50; // Increased minimum distance for better reliability

// Get canvas position relative to viewport
function getCanvasPosition() {
    const rect = canvas.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
    };
}

// Touch event handlers
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const canvasPos = getCanvasPosition();
    touchStartX = touch.clientX - canvasPos.left;
    touchStartY = touch.clientY - canvasPos.top;
}

function handleTouchMove(e) {
    e.preventDefault();
}

function handleTouchEnd(e) {
    e.preventDefault();
    
    if (gameOver || isPaused) return;
    
    const touch = e.changedTouches[0];
    const canvasPos = getCanvasPosition();
    touchEndX = touch.clientX - canvasPos.left;
    touchEndY = touch.clientY - canvasPos.top;
    
    handleSwipe();
}

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    // Check if the swipe was long enough
    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
        return; // Too short to be a swipe
    }
    
    // Determine primary swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0 && direction !== 'left') {
            nextDirection = 'right';
        } else if (dx < 0 && direction !== 'right') {
            nextDirection = 'left';
        }
    } else {
        // Vertical swipe
        if (dy > 0 && direction !== 'up') {
            nextDirection = 'down';
        } else if (dy < 0 && direction !== 'down') {
            nextDirection = 'up';
        }
    }
}

// Initialize game grid based on current canvas size
function initGrid() {
    // Calculate available space after padding and border
    const availableWidth = canvas.width - (GRID_PADDING * 2) - (BORDER_SIZE * 2);
    const availableHeight = canvas.height - (GRID_PADDING * 2) - (BORDER_SIZE * 2);
    
    // Calculate columns/rows that fit
    GRID_COLS = Math.floor(availableWidth / GRID_SIZE);
    GRID_ROWS = Math.floor(availableHeight / GRID_SIZE);
    
    // Ensure minimum grid size
    if (GRID_COLS < 10 || GRID_ROWS < 10) {
        GRID_SIZE = Math.min(availableWidth / 10, availableHeight / 10);
        GRID_COLS = Math.floor(availableWidth / GRID_SIZE);
        GRID_ROWS = Math.floor(availableHeight / GRID_SIZE);
    }
    
    // Calculate centering offsets (including border)
    GRID_OFFSET_X = (canvas.width - (GRID_COLS * GRID_SIZE)) / 2;
    GRID_OFFSET_Y = (canvas.height - (GRID_ROWS * GRID_SIZE)) / 2;
}

function isPositionEmpty(x, y) {
    return !snake.some(seg => seg.x === x && seg.y === y) && 
           !food.some(f => f.x === x && f.y === y);
}

function getRandomPosition() {
    let x, y;
    do {
        x = Math.floor(Math.random() * GRID_COLS);
        y = Math.floor(Math.random() * GRID_ROWS);
    } while (!isPositionEmpty(x, y));
    return {x, y};
}

// Resize canvas to fill available space
function resizeCanvas() {
    const board = document.querySelector('.game-board');
    canvas.width = board.clientWidth;
    canvas.height = board.clientHeight;
    
    // Reset grid size to base value before recalculating
    GRID_SIZE = 30;
    initGrid();
    
    if (snake.length > 0) {
        draw();
    }
}

// Initialize game
function initGame() {
    cancelAnimationFrame(gameLoopId);
    
    // Load high score from storage
    highScore = localStorage.getItem('chemistrySnakeHighScore') || 0;
    if (highScoreDisplay) highScoreDisplay.textContent = highScore;
    
    snake = [];
    for (let i = 3; i >= 0; i--) {
        snake.push({x: i, y: 0});
    }
    
    direction = 'right';
    nextDirection = 'right';
    score = 100;
    gameOver = false;
    isPaused = false;
    currentCompoundIndex = 0;
    currentCompound = compounds[currentCompoundIndex];
    requiredCations = currentCompound.ratio[0];
    requiredAnions = currentCompound.ratio[1];
    collectedCations = 0;
    collectedAnions = 0;
    gameSpeed = 150;
    particles = [];
    
    initGrid();
    generateFood();
    updateDisplay();
    
    pauseBtn.textContent = "Pause";
    gameLoopId = requestAnimationFrame(gameLoop);
}

function generateFood() {
    food = [];
    
    // Generate required cations
    for (let i = 0; i < Math.max(3, requiredCations * 2); i++) {
        const pos = getRandomPosition();
        food.push({
            ...currentCompound.cation,
            x: pos.x,
            y: pos.y,
            type: 'cation'
        });
    }
    
    // Generate required anions
    for (let i = 0; i < Math.max(3, requiredAnions * 2); i++) {
        const pos = getRandomPosition();
        food.push({
            ...currentCompound.anion,
            x: pos.x,
            y: pos.y,
            type: 'anion'
        });
    }
    
    // Add random ions
    const randomIonCount = 5;
    for (let i = 0; i < randomIonCount; i++) {
        const ionType = Math.random() < 0.5 ? 'cation' : 'anion';
        const pool = ionType === 'cation' ? cations : anions;
        const randomIon = pool[Math.floor(Math.random() * pool.length)];
        
        if (!(randomIon.symbol === currentCompound.cation.symbol && randomIon.charge === currentCompound.cation.charge) &&
            !(randomIon.symbol === currentCompound.anion.symbol && randomIon.charge === currentCompound.anion.charge)) {
            const pos = getRandomPosition();
            food.push({
                ...randomIon,
                x: pos.x,
                y: pos.y,
                type: ionType
            });
        }
    }
}

function updateDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    levelDisplay.textContent = `Level: ${currentCompoundIndex + 1}`;
    compoundNameDisplay.textContent = currentCompound.name;
    compoundFormulaDisplay.textContent = currentCompound.formula;
    cationReqDisplay.textContent = `${currentCompound.cation.symbol}${currentCompound.cation.charge}: ${collectedCations}/${requiredCations}`;
    anionReqDisplay.textContent = `${currentCompound.anion.symbol}${currentCompound.anion.charge}: ${collectedAnions}/${requiredAnions}`;
    
    // Update high score and level progress displays
    if (highScoreDisplay) highScoreDisplay.textContent = `High Score: ${highScore}`;
    if (levelProgressDisplay) {
        levelProgressDisplay.textContent = `${currentCompoundIndex + 1}/${compounds.length}`;
    }
}

function createParticles(x, y, type) {
    const color = type === 'cation' ? 'rgba(230, 57, 70, 0.8)' : 'rgba(74, 144, 226, 0.8)';
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: GRID_OFFSET_X + x * GRID_SIZE + GRID_SIZE/2,
            y: GRID_OFFSET_Y + y * GRID_SIZE + GRID_SIZE/2,
            size: Math.random() * 4 + 2,
            color: color,
            life: 30,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6
        });
    }
}

function updateParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
    });
}

function gameLoop(timestamp) {
    if (gameOver || isPaused) return;
    
    if (!lastTimestamp || timestamp - lastTimestamp >= gameSpeed) {
        lastTimestamp = timestamp;
        updateParticles();
        moveSnake();
        checkCollisions();
        draw();
    }
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

function moveSnake() {
    direction = nextDirection;
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
    
    snake.unshift(head);
    const ateFood = checkFoodCollision();
    if (!ateFood) {
        snake.pop();
    }
}

function checkFoodCollision() {
    const head = snake[0];
    const foodIndex = food.findIndex(f => f.x === head.x && f.y === head.y);
    
    if (foodIndex !== -1) {
        const ion = food[foodIndex];
        const isCorrectCation = ion.symbol === currentCompound.cation.symbol && 
                              ion.charge === currentCompound.cation.charge;
        const isCorrectAnion = ion.symbol === currentCompound.anion.symbol && 
                             ion.charge === currentCompound.anion.charge;
        
        if (isCorrectCation || isCorrectAnion) {
            createParticles(head.x, head.y, ion.type);
        }
        
        if (isCorrectCation) {
            collectedCations++;
            if (collectedCations > requiredCations) {
                // Penalty for collecting more than needed
                score = Math.max(0, score - 10);
            } else {
                score += 10 * (Math.abs(parseInt(ion.charge)) || 1);
            }
            snake.push({...snake[snake.length-1]});
        } 
        else if (isCorrectAnion) {
            collectedAnions++;
            if (collectedAnions > requiredAnions) {
                // Penalty for collecting more than needed
                score = Math.max(0, score - 10);
            } else {
                score += 10 * (Math.abs(parseInt(ion.charge)) || 1);
            }
            snake.push({...snake[snake.length-1]});
        } 
        else {
            const penalty = 15 * (Math.abs(parseInt(ion.charge)) || 1);
            score = Math.max(0, score - penalty);
            
            if (snake.length > 4) {
                snake.pop();
            }
            
            if (score <= 0) {
                gameOver = true;
                drawGameOver();
            }
        }
        
        food.splice(foodIndex, 1);
        
        if (collectedCations >= requiredCations && collectedAnions >= requiredAnions) {
            nextLevel();
        }
        
        updateDisplay();
        return true;
    }
    return false;
}

function nextLevel() {
    currentCompoundIndex = (currentCompoundIndex + 1) % compounds.length;
    currentCompound = compounds[currentCompoundIndex];
    requiredCations = currentCompound.ratio[0];
    requiredAnions = currentCompound.ratio[1];
    collectedCations = 0;
    collectedAnions = 0;
    gameSpeed = Math.max(50, gameSpeed * 0.95);
    
    generateFood();
    updateDisplay();
    draw(); // Immediate transition without countdown
}

function checkCollisions() {
    const head = snake[0];
    
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            drawGameOver();
            return;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    drawSnake();
    drawParticles();
    
    if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', canvas.width/2, canvas.height/2);
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function drawGrid() {
    // Clear the canvas with dark background
    ctx.fillStyle = '#e6e8e8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the orange border AROUND the grid (outside)
    ctx.strokeStyle = '#061329';
    ctx.lineWidth = BORDER_SIZE;
    ctx.strokeRect(
        GRID_OFFSET_X - BORDER_SIZE/2,
        GRID_OFFSET_Y - BORDER_SIZE/2,
        GRID_COLS * GRID_SIZE + BORDER_SIZE,
        GRID_ROWS * GRID_SIZE + BORDER_SIZE
    );
    
    // Set grid line style
    ctx.strokeStyle = '#90a1af';
    ctx.lineWidth = 1;
    
    // Draw vertical grid lines
    for (let x = 0; x <= GRID_COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(
            GRID_OFFSET_X + x * GRID_SIZE,
            GRID_OFFSET_Y
        );
        ctx.lineTo(
            GRID_OFFSET_X + x * GRID_SIZE,
            GRID_OFFSET_Y + GRID_ROWS * GRID_SIZE
        );
        ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= GRID_ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(
            GRID_OFFSET_X,
            GRID_OFFSET_Y + y * GRID_SIZE
        );
        ctx.lineTo(
            GRID_OFFSET_X + GRID_COLS * GRID_SIZE,
            GRID_OFFSET_Y + y * GRID_SIZE
        );
        ctx.stroke();
    }
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        
        if (i === 0) {
            ctx.fillStyle = '#db243b';
        } else {
            const intensity = 200 - Math.min(150, i * 2);
            ctx.fillStyle = `rgb(0, ${intensity}, 200)`;
        }
        
        ctx.fillRect(
            GRID_OFFSET_X + segment.x * GRID_SIZE + 1,
            GRID_OFFSET_Y + segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
        
        ctx.strokeStyle = '#0d0e0e';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            GRID_OFFSET_X + segment.x * GRID_SIZE + 1,
            GRID_OFFSET_Y + segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    }
}

function drawFood() {
    const centerOffset = GRID_SIZE / 2;
    
    for (let i = 0; i < food.length; i++) {
        const ion = food[i];
        const padding = 1;
        const cornerRadius = 1;
        const x = GRID_OFFSET_X + ion.x * GRID_SIZE + padding;
        const y = GRID_OFFSET_Y + ion.y * GRID_SIZE + padding;
        const width = GRID_SIZE - padding * 2;
        const height = GRID_SIZE - padding * 2;
        
        const glow = ctx.createRadialGradient(
            x + width/2, y + height/2, 0,
            x + width/2, y + height/2, width/1.5
        );
        
        if (ion.type === 'cation') {
            glow.addColorStop(0, '#fe2a05');
            glow.addColorStop(1, 'rgba(230, 57, 70, 0)');
        } else {
            glow.addColorStop(0, '#40beb3');
            glow.addColorStop(1, 'rgba(74, 144, 226, 0)');
        }
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(
            x + width/2, y + height/2,
            width/1.5, 0, Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = ion.type === 'cation' ? '#db243b' : '#3c808b';
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
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `${GRID_SIZE/3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            `${ion.symbol}${ion.charge}`,
            GRID_OFFSET_X + ion.x * GRID_SIZE + centerOffset,
            GRID_OFFSET_Y + ion.y * GRID_SIZE + centerOffset
        );
        
        ctx.shadowColor = 'transparent';
    }
}

function drawGameOver() {
    const isNewHighScore = score > highScore;
    if (isNewHighScore) {
        highScore = score;
        localStorage.setItem('chemistrySnakeHighScore', highScore);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (isNewHighScore) {
        ctx.fillText('NEW HIGH SCORE!', canvas.width/2, canvas.height/2 - 120);
    }
    
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 60);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2);
    ctx.fillText(`High Score: ${highScore}`, canvas.width/2, canvas.height/2 + 40);
    ctx.fillText(`Compound: ${currentCompound.formula}`, canvas.width/2, canvas.height/2 + 80);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFA000';
    ctx.fillText('Press RESTART to play again', canvas.width/2, canvas.height/2 + 140);
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    if (!isPaused && !gameOver) {
        lastTimestamp = 0; // Reset timestamp to avoid jump after pause
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function showHint() {
    const now = Date.now();
    if (now - lastHintTime < HINT_COOLDOWN) {
        const remaining = Math.ceil((HINT_COOLDOWN - (now - lastHintTime)) / 1000);
        alert(`Please wait ${remaining} more seconds before using hint again.`);
        return;
    }
    
    lastHintTime = now;
    alert(`Collect ${requiredCations} ${currentCompound.cation.symbol}${currentCompound.cation.charge} and ${requiredAnions} ${currentCompound.anion.symbol}${currentCompound.anion.charge} to make ${currentCompound.formula}`);
}

// Event listeners and initialization
if (restartBtn && pauseBtn && hintBtn) {
    restartBtn.addEventListener('click', initGame);
    pauseBtn.addEventListener('click', togglePause);
    hintBtn.addEventListener('click', showHint);
    
    // Accessibility
    restartBtn.setAttribute('aria-label', 'Restart game');
    pauseBtn.setAttribute('aria-label', 'Pause game');
    hintBtn.setAttribute('aria-label', 'Get hint about current compound');
} else {
    console.error("Could not find all required buttons");
}

canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

document.addEventListener('keydown', e => {
    if (gameOver || isPaused) return;
    
    switch(e.key) {
        case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
        case ' ': togglePause(); break; // Spacebar to pause
    }
});

window.addEventListener('resize', resizeCanvas);

// Start the game
resizeCanvas();
initGame();