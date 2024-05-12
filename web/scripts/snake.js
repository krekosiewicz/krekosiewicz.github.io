document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('gameBoard');

    let state = {
        snake: [{ x: 8, y: 12 }],
        food: { x: 5, y: 10 },
        gridSize: 20,
        direction: 'right',
    };

    const draw = (state) => {
        board.innerHTML = ''; // Clear the board
        state.snake.forEach(segment => drawSegment(segment, 'snake'));
        drawSegment(state.food, 'food');
    };

    const drawSegment = (segment, className) => {
        const elem = document.createElement('div');
        elem.className = className;
        elem.style.gridColumnStart = segment.x;
        elem.style.gridRowStart = segment.y;
        board.appendChild(elem);
    };

    const moveSnake = (snake, direction) => {
        const head = { ...snake[0] };
        switch (direction) {
            case 'up': head.y -= 1; break;
            case 'down': head.y += 1; break;
            case 'left': head.x -= 1; break;
            case 'right': head.x += 1; break;
        }
        return [head, ...snake.slice(0, -1)];
    };

    const checkCollision = (head, snake) => {
        return head.x < 1 || head.x > state.gridSize || head.y < 1 || head.y > state.gridSize ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    };

    const randomPosition = () => ({
        x: Math.floor(Math.random() * state.gridSize) + 1,
        y: Math.floor(Math.random() * state.gridSize) + 1
    });

    const gameLoop = () => {
        const newSnake = moveSnake(state.snake, state.direction);
        const head = newSnake[0];
        let newFood = state.food;
        let newScore = state.score;

        if (head.x === state.food.x && head.y === state.food.y) {
            newFood = randomPosition();
            newSnake.push(state.snake[state.snake.length - 1]);
            newScore += 1;
        }

        if (checkCollision(head, newSnake)) {
            alert('Game Over!');
            state = { ...state, snake: [{ x: 8, y: 12 }], food: randomPosition(), score: 0 };
        } else {
            state = { ...state, snake: newSnake, food: newFood, score: newScore, highScore: Math.max(newScore, state.highScore) };
        }

        draw(state);
    };

    document.addEventListener('keydown', event => {
        const directionMap = { 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right' };
        if (directionMap[event.key] && ['up', 'down'].includes(state.direction) !== ['up', 'down'].includes(directionMap[event.key])) {
            state = { ...state, direction: directionMap[event.key] };
        }
        if (!state.gameInterval && event.key === ' ') {
            state.gameInterval = setInterval(gameLoop, 200);
        }
    });

    draw(state); // Initial draw
});
