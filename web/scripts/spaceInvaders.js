// OOP
class Player {
    constructor(gameContainer, config) {
        this.gameContainer = gameContainer;
        this.config = config;
        this.element = document.createElement('div');
        this.element.className = 'player';
        this.element.style.width = `${config.playerSize}px`;
        this.element.style.height = `${config.playerSize}px`;
        this.gameContainer.appendChild(this.element);
        this.position = config.containerWidth / 2 - config.playerSize / 2;
        this.updatePosition();
    }

    move(direction) {
        if (direction === 'left' && this.position > 0) {
            this.position -= this.config.playerSpeed;
        } else if (direction === 'right' && this.position < this.config.containerWidth - this.config.playerSize) {
            this.position += this.config.playerSpeed;
        }
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.position}px`;
    }

    getBoundingBox() {
        return this.element.getBoundingClientRect();
    }
}

class Bullet {
    constructor(gameContainer, playerPosition, config) {
        this.gameContainer = gameContainer;
        this.config = config;
        this.element = document.createElement('div');
        this.element.className = 'bullet';
        this.element.style.width = `${config.bulletSize.width}px`;
        this.element.style.height = `${config.bulletSize.height}px`;
        this.element.style.left = `${playerPosition + config.playerSize / 2 - config.bulletSize.width / 2}px`;
        this.element.style.bottom = '70px';
        this.gameContainer.appendChild(this.element);
        this.position = { left: parseInt(this.element.style.left), bottom: 70 };
    }

    update() {
        this.position.bottom += this.config.bulletSpeed;
        if (this.position.bottom > this.config.containerHeight) {
            this.element.remove();
            return false;
        }
        this.element.style.bottom = `${this.position.bottom}px`;
        return true;
    }

    getBoundingBox() {
        return this.element.getBoundingClientRect();
    }

    remove() {
        this.element.remove();
    }
}

class Enemy {
    constructor(gameContainer, config) {
        this.gameContainer = gameContainer;
        this.config = config;
        this.element = document.createElement('div');
        this.element.className = 'enemy';
        this.element.style.width = `${config.enemySize}px`;
        this.element.style.height = `${config.enemySize}px`;
        this.element.style.left = `${Math.random() * (config.containerWidth - config.enemySize)}px`;
        this.element.style.top = '0px';
        this.gameContainer.appendChild(this.element);
        this.position = { left: parseInt(this.element.style.left), top: 0 };
    }

    update() {
        this.position.top += this.config.enemySpeed;
        if (this.position.top > this.config.containerHeight - this.config.enemySize) {
            this.element.remove();
            return false;
        }
        this.element.style.top = `${this.position.top}px`;
        return true;
    }

    getBoundingBox() {
        return this.element.getBoundingClientRect();
    }

    remove() {
        this.element.remove();
    }
}

class Game {
    constructor(config) {
        this.gameContainer = document.querySelector('.spaceInvadersContainer');
        this.startMessage = document.getElementById('startMessage');
        this.scoreDisplay = document.getElementById('score');
        this.highScoreDisplay = document.getElementById('highScore');
        this.config = config;
        this.player = new Player(this.gameContainer, config);
        this.bullets = [];
        this.enemies = [];
        this.score = 0;
        this.highScore = 0;
        this.gameActive = false;
        this.gameInterval = null;
        this.enemySpawnInterval = null;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.startMessage.style.display = 'flex'; // Initial message display
    }

    handleKeyDown(event) {
        if (this.gameActive) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                this.player.move(event.key === 'ArrowLeft' ? 'left' : 'right');
            }
            if (event.key === ' ') {
                this.bullets.push(new Bullet(this.gameContainer, this.player.position, this.config));
            }
        } else if (event.key === ' ' && !this.gameActive) {
            this.startGame();
        }
    }

    startGame() {
        this.score = 0;
        this.updateScore();
        this.bullets = [];
        this.enemies = [];
        this.gameContainer.innerHTML = ''; // Clear previous game elements
        this.gameContainer.appendChild(this.player.element); // Re-add player
        this.player.updatePosition(); // Reset player position
        this.gameActive = true;
        this.gameInterval = setInterval(this.gameLoop.bind(this), 1000 / 60);
        this.enemySpawnInterval = setInterval(() => {
            this.enemies.push(new Enemy(this.gameContainer, this.config));
        }, 2000);
        this.startMessage.style.display = 'none';
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
        this.highScoreDisplay.textContent = this.highScore;
    }

    gameLoop() {
        this.bullets = this.bullets.filter(bullet => bullet.update());
        this.enemies = this.enemies.filter(enemy => enemy.update());

        this.handleCollisions();

        if (this.checkGameOver()) {
            alert('Game Over! Press space to start again.');
            clearInterval(this.gameInterval);
            clearInterval(this.enemySpawnInterval);
            this.gameActive = false;
            this.startMessage.style.display = 'flex';
        }

        this.updateScore();
    }

    handleCollisions() {
        this.bullets.forEach(bullet => {
            this.enemies.forEach(enemy => {
                if (this.checkCollision(bullet, enemy)) {
                    bullet.remove();
                    enemy.remove();
                    this.bullets = this.bullets.filter(b => b !== bullet);
                    this.enemies = this.enemies.filter(e => e !== enemy);
                    this.score += 10;
                    this.highScore = Math.max(this.highScore, this.score);
                }
            });
        });

        // Check for collisions between enemies and the player
        this.enemies.forEach(enemy => {
            if (this.checkCollision(enemy, this.player)) {
                this.gameOver();
            }
        });
    }

    checkCollision(obj1, obj2) {
        const rect1 = obj1.getBoundingBox();
        const rect2 = obj2.getBoundingBox();
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }

    checkGameOver() {
        return this.enemies.some(enemy => enemy.position.top >= this.config.containerHeight - this.config.enemySize);
    }

    gameOver() {
        alert('Game Over! Press space to start again.');
        clearInterval(this.gameInterval);
        clearInterval(this.enemySpawnInterval);
        this.gameActive = false;
        this.startMessage.style.display = 'flex';
    }
}

export function initGame(config) {
    new Game(config);
}






// export function initGame(config) {
//     const gameContainer = document.querySelector('.spaceInvadersContainer');
//     const startMessage = document.getElementById('startMessage');
//     let player = document.querySelector('.player');
//     const scoreDisplay = document.getElementById('score');
//     const highScoreDisplay = document.getElementById('highScore');
//
//     const { containerWidth, containerHeight, playerSize, bulletSize, enemySize, playerSpeed, bulletSpeed, enemySpeed } = config;
//
//     let playerPosition = containerWidth / 2 - playerSize / 2;
//     let score = 0;
//     let highScore = 0;
//     let gameActive = false;
//     let gameInterval;
//
//     function updateScore() {
//         scoreDisplay.textContent = score;
//         highScoreDisplay.textContent = highScore;
//     }
//
//     function movePlayer(event) {
//         if (event.key === 'ArrowLeft' && playerPosition > 0) {
//             playerPosition -= playerSpeed;
//         } else if (event.key === 'ArrowRight' && playerPosition < containerWidth - playerSize) {
//             playerPosition += playerSpeed;
//         }
//         player.style.left = `${playerPosition}px`;
//     }
//
//     function shoot() {
//         const bullet = document.createElement('div');
//         bullet.classList.add('bullet');
//         bullet.style.width = `${bulletSize.width}px`;
//         bullet.style.height = `${bulletSize.height}px`;
//         bullet.style.left = `${playerPosition + playerSize / 2 - bulletSize.width / 2}px`;
//         bullet.style.bottom = '70px';
//         gameContainer.appendChild(bullet);
//
//         const bulletInterval = setInterval(() => {
//             const bulletPosition = parseInt(bullet.style.bottom);
//             if (bulletPosition > containerHeight) {
//                 bullet.remove();
//                 clearInterval(bulletInterval);
//             } else {
//                 bullet.style.bottom = `${bulletPosition + bulletSpeed}px`;
//                 checkCollision(bullet, bulletInterval);
//             }
//         }, 20);
//     }
//
//     function createEnemy() {
//         const enemy = document.createElement('div');
//         enemy.classList.add('enemy');
//         enemy.style.width = `${enemySize}px`;
//         enemy.style.height = `${enemySize}px`;
//         enemy.style.left = `${Math.random() * (containerWidth - enemySize)}px`;
//         enemy.style.top = '0px';
//         gameContainer.appendChild(enemy);
//
//         const enemyInterval = setInterval(() => {
//             const enemyPosition = parseInt(enemy.style.top);
//             if (enemyPosition > containerHeight - enemySize) {
//                 enemy.remove();
//                 clearInterval(enemyInterval);
//                 gameOver();
//             } else if (checkEnemyCollisionWithPlayer(enemy)) {
//                 enemy.remove();
//                 clearInterval(enemyInterval);
//                 gameOver();
//             } else {
//                 enemy.style.top = `${enemyPosition + enemySpeed}px`;
//             }
//         }, 20);
//
//         enemy.dataset.interval = enemyInterval;
//     }
//
//     function checkCollision(bullet, bulletInterval) {
//         const enemies = document.querySelectorAll('.enemy');
//
//         enemies.forEach(enemy => {
//             const bulletRect = bullet.getBoundingClientRect();
//             const enemyRect = enemy.getBoundingClientRect();
//             if (
//                 bulletRect.left < enemyRect.left + enemyRect.width &&
//                 bulletRect.left + bulletRect.width > enemyRect.left &&
//                 bulletRect.top < enemyRect.top + enemyRect.height &&
//                 bulletRect.top + bulletRect.height > enemyRect.top
//             ) {
//                 bullet.remove();
//                 enemy.remove();
//                 clearInterval(bulletInterval);
//                 clearInterval(enemy.dataset.interval);
//                 score += 10;
//                 highScore = Math.max(highScore, score);
//                 updateScore();
//             }
//         });
//     }
//
//     function checkEnemyCollisionWithPlayer(enemy) {
//         const playerRect = player.getBoundingClientRect();
//         const enemyRect = enemy.getBoundingClientRect();
//
//         return (
//             playerRect.left < enemyRect.left + enemyRect.width &&
//             playerRect.left + playerRect.width > enemyRect.left &&
//             playerRect.top < enemyRect.top + enemyRect.height &&
//             playerRect.top + playerRect.height > enemyRect.top
//         );
//     }
//
//     function clearGameBoard() {
//         const enemies = document.querySelectorAll('.enemy');
//         const bullets = document.querySelectorAll('.bullet');
//         enemies.forEach(enemy => {
//             clearInterval(enemy.dataset.interval);
//             enemy.remove();
//         });
//         bullets.forEach(bullet => bullet.remove());
//     }
//
//     function gameOver() {
//         clearInterval(gameInterval);
//         gameActive = false;
//         clearGameBoard();
//         startMessage.style.display = 'flex';
//         alert('Game Over! Press space to start again.');
//     }
//
//     function startGame() {
//         score = 0;
//         updateScore();
//         gameContainer.innerHTML = '<div class="player"></div>';
//         player = document.querySelector('.player');
//         player.style.width = `${playerSize}px`;
//         player.style.height = `${playerSize}px`;
//         playerPosition = containerWidth / 2 - playerSize / 2;
//         player.style.left = `${playerPosition}px`;
//         gameActive = true;
//         gameInterval = setInterval(createEnemy, 2000);
//         startMessage.style.display = 'none';
//     }
//
//     document.addEventListener('keydown', (event) => {
//         if (gameActive) {
//             if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
//                 movePlayer(event);
//             }
//             if (event.key === ' ') {
//                 shoot();
//             }
//         } else if (event.key === ' ' && !gameActive) {
//             startGame();
//         }
//     });
//
//     updateScore();  // Initialize the score display
// }
