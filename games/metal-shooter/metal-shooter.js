const Game = (() => {
    // Canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let canvasWidth = 800;
    let canvasHeight = 600;

    // Game state
    let gameStart = false;
    let frameCount = 0;
    let ship;
    let missilePool = { ready: [], active: [] };
    let aliens = [];
    let bomb = { active: false, x: 0, y: 0, radius: 0, maxRadius: 100 };
    let stars = [];
    let currentWave = 0;
    let waveData = [];
    let score = 0;

    // Key state tracking
    const keys = {
        w: false, a: false, s: false, d: false,
        f: false, shift: false, ' ': false
    };

    // Sprite definitions
    const sprites = {
        ship: { width: 30, height: 40, color: '#00f' },
        missile: { width: 4, height: 12, color: '#f00' },
        alien: { width: 25, height: 25, color: '#0f0' },
        bomb: { color: '#00ffff' }
    };

    // Game objects
    class Ship {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = canvasWidth/2;
            this.y = canvasHeight - 60;
            this.missiles = 50;
            this.bombs = 1;
            this.shield = 100;
            this.speed = 5;
            this.isAlive = true;
        }
    }

    class Missile {
        constructor() {
            this.active = false;
        }
        
        fire(x, y) {
            this.x = x;
            this.y = y;
            this.active = true;
        }
    }

    class Alien {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * (canvasWidth - 30);
            this.y = -30;
            this.speed = waveData[currentWave].speed;
            this.active = true;
        }

        update() {
            this.y += this.speed;
        }
    }

    // Initialize game
    function init() {
        // Setup canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '2px solid white';
        document.body.appendChild(canvas);

        // Setup game objects
        ship = new Ship();
        createWaves();
        initObjectPools();
        createStars();

        // Event listeners
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Start game loop
        gameLoop();
    }

    function createWaves() {
        waveData = [
            { aliens: 10, spacing: 30, speed: 2 },
            { aliens: 15, spacing: 25, speed: 2.5 },
            { aliens: 20, spacing: 20, speed: 3 }
        ];
    }

    function initObjectPools() {
        // Missiles
        for(let i = 0; i < 50; i++) {
            missilePool.ready.push(new Missile());
        }

        // Aliens
        for(let i = 0; i < 50; i++) {
            aliens.push(new Alien());
        }
    }

    function createStars() {
        for(let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.2
            });
        }
    }

    // Input handling
    function handleKeyDown(e) {
        const key = e.key.toLowerCase();
        if(keys.hasOwnProperty(key)) keys[key] = true;
        if(key === 's' && !gameStart) startGame();
    }

    function handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if(keys.hasOwnProperty(key)) keys[key] = false;
    }

    // Game logic
    function startGame() {
        gameStart = true;
        ship.reset();
        currentWave = 0;
        score = 0;
    }

    function updateShip() {
        if(!ship.isAlive) return;

        // Movement
        if(keys.w) ship.y -= ship.speed;
        if(keys.s) ship.y += ship.speed;
        if(keys.a) ship.x -= ship.speed;
        if(keys.d) ship.x += ship.speed;

        // Boundaries
        ship.x = Math.max(0, Math.min(canvasWidth - sprites.ship.width, ship.x));
        ship.y = Math.max(0, Math.min(canvasHeight - sprites.ship.height, ship.y));

        // Firing
        if(keys[' '] && missilePool.ready.length > 0) {
            const missile = missilePool.ready.pop();
            missile.fire(ship.x + sprites.ship.width/2, ship.y);
            missilePool.active.push(missile);
            ship.missiles--;
        }

        // Deploy bomb
        if(keys.f && ship.bombs > 0 && !bomb.active) {
            bomb.active = true;
            bomb.x = ship.x + sprites.ship.width/2;
            bomb.y = ship.y + sprites.ship.height/2;
            bomb.radius = 0;
            ship.bombs--;
        }
    }

    function updateMissiles() {
        missilePool.active.forEach(missile => {
            missile.y -= 8;
            if(missile.y < -sprites.missile.height) {
                missilePool.ready.push(missile);
                missile.active = false;
            }
        });
        missilePool.active = missilePool.active.filter(m => m.active);
    }

    function updateBomb() {
        if(bomb.active) {
            bomb.radius += 5;
            if(bomb.radius >= bomb.maxRadius) {
                bomb.active = false;
                checkBombCollisions();
            }
        }
    }

    function updateAliens() {
        // Spawn new aliens
        if(frameCount % waveData[currentWave].spacing === 0 && 
           aliens.filter(a => a.active).length < waveData[currentWave].aliens) {
            const alien = aliens.find(a => !a.active);
            if(alien) alien.reset();
        }

        // Update existing aliens
        aliens.forEach(alien => {
            if(alien.active) {
                alien.update();
                if(alien.y > canvasHeight) alien.active = false;
            }
        });
    }

    function checkCollisions() {
        // Missile-Alien collisions
        missilePool.active.forEach(missile => {
            aliens.forEach(alien => {
                if(alien.active && distance(missile.x, missile.y, alien.x, alien.y) < 20) {
                    alien.active = false;
                    missile.active = false;
                    score += 100;
                }
            });
        });

        // Ship-Alien collisions
        aliens.forEach(alien => {
            if(alien.active && distance(ship.x, ship.y, alien.x, alien.y) < 30) {
                if(keys.shift && ship.shield > 0) {
                    ship.shield -= 20;
                } else {
                    ship.isAlive = false;
                }
            }
        });
    }

    function checkBombCollisions() {
        aliens.forEach(alien => {
            if(alien.active && distance(bomb.x, bomb.y, alien.x, alien.y) < bomb.radius) {
                alien.active = false;
                score += 50;
            }
        });
    }

    function distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    // Rendering
    function drawShip() {
        ctx.fillStyle = sprites.ship.color;
        ctx.fillRect(ship.x, ship.y, sprites.ship.width, sprites.ship.height);
    }

    function drawMissiles() {
        ctx.fillStyle = sprites.missile.color;
        missilePool.active.forEach(missile => {
            ctx.fillRect(missile.x, missile.y, sprites.missile.width, sprites.missile.height);
        });
    }

    function drawAliens() {
        ctx.fillStyle = sprites.alien.color;
        aliens.forEach(alien => {
            if(alien.active) {
                ctx.fillRect(alien.x, alien.y, sprites.alien.width, sprites.alien.height);
            }
        });
    }

    function drawBomb() {
        if(bomb.active) {
            ctx.strokeStyle = sprites.bomb.color;
            ctx.beginPath();
            ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    function drawStars() {
        ctx.fillStyle = '#fff';
        stars.forEach(star => {
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    function updateUI() {
        document.getElementById('missileCount').textContent = ship.missiles;
        document.getElementById('bombCount').textContent = ship.bombs;
        document.getElementById('shield').textContent = ship.shield;
        document.getElementById('score').textContent = score;
    }

    function gameLoop() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        frameCount++;

        if(gameStart && ship.isAlive) {
            updateShip();
            updateMissiles();
            updateBomb();
            updateAliens();
            checkCollisions();
            
            drawMissiles();
            drawAliens();
            drawBomb();
            drawShip();
            updateUI();
        } else if(!ship.isAlive) {
            drawGameOver();
        } else {
            drawStartScreen();
        }

        drawStars();
        requestAnimationFrame(gameLoop);
    }

    function drawStartScreen() {
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS S TO START', canvasWidth/2, canvasHeight/2);
    }

    function drawGameOver() {
        ctx.fillStyle = '#f00';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvasWidth/2, canvasHeight/2);
    }

    return { init };
})();

window.addEventListener('load', Game.init);