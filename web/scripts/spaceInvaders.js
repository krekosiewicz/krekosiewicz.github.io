export function initGame(config) {
    const gameContainer = document.querySelector('.gameContainer');
    let player = document.querySelector('.player');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');

    const { containerWidth, containerHeight, playerSize, bulletSize, enemySize, playerSpeed, bulletSpeed, enemySpeed } = config;

    let playerPosition = containerWidth / 2 - playerSize / 2;
    let score = 0;
    let highScore = 0;
    let gameActive = false;
    let gameInterval;

    function updateScore() {
        scoreDisplay.textContent = score;
        highScoreDisplay.textContent = highScore;
    }

    function movePlayer(event) {
        if (event.key === 'ArrowLeft' && playerPosition > 0) {
            playerPosition -= playerSpeed;
        } else if (event.key === 'ArrowRight' && playerPosition < containerWidth - playerSize) {
            playerPosition += playerSpeed;
        }
        player.style.left = `${playerPosition}px`;
    }

    function shoot() {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.width = `${bulletSize.width}px`;
        bullet.style.height = `${bulletSize.height}px`;
        bullet.style.left = `${playerPosition + playerSize / 2 - bulletSize.width / 2}px`;
        bullet.style.bottom = '70px';
        gameContainer.appendChild(bullet);

        const bulletInterval = setInterval(() => {
            const bulletPosition = parseInt(bullet.style.bottom);
            if (bulletPosition > containerHeight) {
                bullet.remove();
                clearInterval(bulletInterval);
            } else {
                bullet.style.bottom = `${bulletPosition + bulletSpeed}px`;
                checkCollision(bullet, bulletInterval);
            }
        }, 20);
    }

    function createEnemy() {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.width = `${enemySize}px`;
        enemy.style.height = `${enemySize}px`;
        enemy.style.left = `${Math.random() * (containerWidth - enemySize)}px`;
        enemy.style.top = '0px';
        gameContainer.appendChild(enemy);

        const enemyInterval = setInterval(() => {
            const enemyPosition = parseInt(enemy.style.top);
            if (enemyPosition > containerHeight - enemySize) {
                enemy.remove();
                clearInterval(enemyInterval);
                gameOver();
            } else if (checkEnemyCollisionWithPlayer(enemy)) {
                enemy.remove();
                clearInterval(enemyInterval);
                gameOver();
            } else {
                enemy.style.top = `${enemyPosition + enemySpeed}px`;
            }
        }, 20);

        enemy.dataset.interval = enemyInterval;
    }

    function checkCollision(bullet, bulletInterval) {
        const enemies = document.querySelectorAll('.enemy');

        enemies.forEach(enemy => {
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();
            if (
                bulletRect.left < enemyRect.left + enemyRect.width &&
                bulletRect.left + bulletRect.width > enemyRect.left &&
                bulletRect.top < enemyRect.top + enemyRect.height &&
                bulletRect.top + bulletRect.height > enemyRect.top
            ) {
                bullet.remove();
                enemy.remove();
                clearInterval(bulletInterval);
                clearInterval(enemy.dataset.interval);
                score += 10;
                highScore = Math.max(highScore, score);
                updateScore();
            }
        });
    }

    function checkEnemyCollisionWithPlayer(enemy) {
        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        return (
            playerRect.left < enemyRect.left + enemyRect.width &&
            playerRect.left + playerRect.width > enemyRect.left &&
            playerRect.top < enemyRect.top + enemyRect.height &&
            playerRect.top + playerRect.height > enemyRect.top
        );
    }

    function clearGameBoard() {
        const enemies = document.querySelectorAll('.enemy');
        const bullets = document.querySelectorAll('.bullet');
        enemies.forEach(enemy => {
            clearInterval(enemy.dataset.interval);
            enemy.remove();
        });
        bullets.forEach(bullet => bullet.remove());
    }

    function gameOver() {
        clearInterval(gameInterval);
        gameActive = false;
        clearGameBoard();
        alert('Game Over! Press space to start again.');
    }

    function startGame() {
        score = 0;
        updateScore();
        gameContainer.innerHTML = '<div class="player"></div>';
        player = document.querySelector('.player');
        player.style.width = `${playerSize}px`;
        player.style.height = `${playerSize}px`;
        playerPosition = containerWidth / 2 - playerSize / 2;
        player.style.left = `${playerPosition}px`;
        gameActive = true;
        gameInterval = setInterval(createEnemy, 2000);
    }

    document.addEventListener('keydown', (event) => {
        if (gameActive) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                movePlayer(event);
            }
            if (event.key === ' ') {
                shoot();
            }
        } else if (event.key === ' ' && !gameActive) {
            startGame();
        }
    });

    updateScore();  // Initialize the score display
}
