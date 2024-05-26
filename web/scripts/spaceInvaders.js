export function initGame() {
    const gameContainer = document.querySelector('.game-container');
    const player = document.querySelector('.player');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');

    const playerSpeed = 10;
    const bulletSpeed = 5;
    const enemySpeed = 2;

    let playerPosition = gameContainer.clientWidth / 2 - player.clientWidth / 2;
    let score = 0;
    let highScore = 0;

    function updateScore() {
        scoreDisplay.textContent = score;
        highScoreDisplay.textContent = highScore;
    }

    function movePlayer(event) {
        if (event.key === 'ArrowLeft' && playerPosition > 0) {
            playerPosition -= playerSpeed;
        } else if (event.key === 'ArrowRight' && playerPosition < gameContainer.clientWidth - player.clientWidth) {
            playerPosition += playerSpeed;
        }
        player.style.left = `${playerPosition}px`;
    }

    function shoot() {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.left = `${playerPosition + player.clientWidth / 2 - 2.5}px`;
        bullet.style.bottom = '70px';
        gameContainer.appendChild(bullet);

        const bulletInterval = setInterval(() => {
            const bulletPosition = parseInt(bullet.style.bottom);
            if (bulletPosition > gameContainer.clientHeight) {
                bullet.remove();
                clearInterval(bulletInterval);
            } else {
                bullet.style.bottom = `${bulletPosition + bulletSpeed}px`;
                checkCollision(bullet);
            }
        }, 20);
    }

    function createEnemy() {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = `${Math.random() * (gameContainer.clientWidth - 40)}px`;
        enemy.style.top = '0px';
        gameContainer.appendChild(enemy);

        const enemyInterval = setInterval(() => {
            const enemyPosition = parseInt(enemy.style.top);
            if (enemyPosition > gameContainer.clientHeight) {
                enemy.remove();
                clearInterval(enemyInterval);
            } else {
                enemy.style.top = `${enemyPosition + enemySpeed}px`;
            }
        }, 20);
    }

    function checkCollision(bullet) {
        const bullets = document.querySelectorAll('.bullet');
        const enemies = document.querySelectorAll('.enemy');

        bullets.forEach(bullet => {
            const bulletRect = bullet.getBoundingClientRect();
            enemies.forEach(enemy => {
                const enemyRect = enemy.getBoundingClientRect();
                if (
                    bulletRect.left < enemyRect.left + enemyRect.width &&
                    bulletRect.left + bulletRect.width > enemyRect.left &&
                    bulletRect.top < enemyRect.top + enemyRect.height &&
                    bulletRect.top + bulletRect.height > enemyRect.top
                ) {
                    bullet.remove();
                    enemy.remove();
                    score += 10;
                    highScore = Math.max(highScore, score);
                    updateScore();
                }
            });
        });
    }

    document.addEventListener('keydown', (event) => {
        movePlayer(event);
        if (event.key === ' ') {
            shoot();
        }
    });

    setInterval(createEnemy, 2000);
}
