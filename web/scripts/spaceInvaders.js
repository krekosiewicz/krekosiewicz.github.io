export function initGame(config) {
    const gameContainer = document.querySelector('.spaceInvadersContainer');
    const startMessage = document.getElementById('startMessage');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');

    let state = {
        playerPosition: config.containerWidth / 2 - config.playerSize / 2,
        bullets: [],
        enemies: [],
        score: 0,
        highScore: 0,
        gameActive: false,
        gameInterval: null
    };

    const updateScore = (state) => {
        scoreDisplay.textContent = state.score;
        highScoreDisplay.textContent = state.highScore;
    };

    const movePlayer = (state, direction) => {
        let newPlayerPosition = state.playerPosition;
        if (direction === 'left' && newPlayerPosition > 0) {
            newPlayerPosition -= config.playerSpeed;
        } else if (direction === 'right' && newPlayerPosition < config.containerWidth - config.playerSize) {
            newPlayerPosition += config.playerSpeed;
        }
        return { ...state, playerPosition: newPlayerPosition };
    };

    const shoot = (state) => {
        const bullet = {
            left: state.playerPosition + config.playerSize / 2 - config.bulletSize.width / 2,
            bottom: 70
        };
        return { ...state, bullets: [...state.bullets, bullet] };
    };

    const createEnemy = (state) => {
        const enemy = {
            left: Math.random() * (config.containerWidth - config.enemySize),
            top: 0
        };
        return { ...state, enemies: [...state.enemies, enemy] };
    };

    const updateBullets = (bullets) => {
        return bullets.map(bullet => ({ ...bullet, bottom: bullet.bottom + config.bulletSpeed }))
            .filter(bullet => bullet.bottom <= config.containerHeight);
    };

    const updateEnemies = (enemies) => {
        return enemies.map(enemy => ({ ...enemy, top: enemy.top + config.enemySpeed }))
            .filter(enemy => enemy.top <= config.containerHeight);
    };

    const checkCollision = (bullet, enemy) => {
        const bulletRect = { left: bullet.left, right: bullet.left + config.bulletSize.width, top: bullet.bottom, bottom: bullet.bottom + config.bulletSize.height };
        const enemyRect = { left: enemy.left, right: enemy.left + config.enemySize, top: enemy.top, bottom: enemy.top + config.enemySize };
        return bulletRect.left < enemyRect.right && bulletRect.right > enemyRect.left && bulletRect.top < enemyRect.bottom && bulletRect.bottom > enemyRect.top;
    };

    const handleCollisions = (state) => {
        let newBullets = [...state.bullets];
        let newEnemies = [...state.enemies];
        let newScore = state.score;

        for (let bullet of state.bullets) {
            for (let enemy of state.enemies) {
                if (checkCollision(bullet, enemy)) {
                    newBullets = newBullets.filter(b => b !== bullet);
                    newEnemies = newEnemies.filter(e => e !== enemy);
                    newScore += 10;
                }
            }
        }

        return { ...state, bullets: newBullets, enemies: newEnemies, score: newScore, highScore: Math.max(state.highScore, newScore) };
    };

    const checkGameOver = (state) => {
        for (let enemy of state.enemies) {
            if (enemy.top >= config.containerHeight - config.enemySize) {
                return true;
            }
        }
        return false;
    };

    const draw = (state) => {
        gameContainer.innerHTML = '';
        const player = document.createElement('div');
        player.className = 'player';
        player.style.width = `${config.playerSize}px`;
        player.style.height = `${config.playerSize}px`;
        player.style.left = `${state.playerPosition}px`;
        gameContainer.appendChild(player);

        state.bullets.forEach(bullet => {
            const bulletElem = document.createElement('div');
            bulletElem.className = 'bullet';
            bulletElem.style.width = `${config.bulletSize.width}px`;
            bulletElem.style.height = `${config.bulletSize.height}px`;
            bulletElem.style.left = `${bullet.left}px`;
            bulletElem.style.bottom = `${bullet.bottom}px`;
            gameContainer.appendChild(bulletElem);
        });

        state.enemies.forEach(enemy => {
            const enemyElem = document.createElement('div');
            enemyElem.className = 'enemy';
            enemyElem.style.width = `${config.enemySize}px`;
            enemyElem.style.height = `${config.enemySize}px`;
            enemyElem.style.left = `${enemy.left}px`;
            enemyElem.style.top = `${enemy.top}px`;
            gameContainer.appendChild(enemyElem);
        });

        updateScore(state);
    };

    const gameLoop = () => {
        let newState = { ...state };
        newState.bullets = updateBullets(state.bullets);
        newState.enemies = updateEnemies(state.enemies);
        newState = handleCollisions(newState);
        if (checkGameOver(newState)) {
            alert('Game Over! Press space to start again.');
            clearInterval(state.gameInterval);
            state = { ...state, gameActive: false, bullets: [], enemies: [], score: 0 };
            startMessage.style.display = 'flex';
        } else {
            state = newState;
            draw(state);
        }
    };

    document.addEventListener('keydown', (event) => {
        if (state.gameActive) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                state = movePlayer(state, event.key === 'ArrowLeft' ? 'left' : 'right');
            }
            if (event.key === ' ') {
                state = shoot(state);
            }
        } else if (event.key === ' ' && !state.gameActive) {
            state = { ...state, gameActive: true, gameInterval: setInterval(gameLoop, 1000 / 60) };
            startMessage.style.display = 'none';
        }
    });

    startMessage.style.display = 'flex'; // Initial message display
    draw(state); // Initial draw
}
