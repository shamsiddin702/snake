const canvas = document.getElementById("snakeGame");
        const ctx = canvas.getContext("2d");
        const scoreElement = document.getElementById("score");
        const speedSelect = document.getElementById("speedLevel");
        const gameOverScreen = document.getElementById("game-over");
        const finalScoreText = document.getElementById("final-score");

        const box = 20;
        let score, snake, food, d, nextD, gameLoop;
        const fruits = ["🍎", "🍐", "🍊", "🍋", "🍓", "🍒"];
        let currentFruit;

        function startGame() {
            if(gameLoop) clearInterval(gameLoop);
            gameOverScreen.style.display = "none";
            
            score = 0;
            scoreElement.innerText = score;
            d = "RIGHT";
            nextD = "RIGHT";
            
            snake = [
                {x: 10 * box, y: 10 * box},
                {x: 9 * box, y: 10 * box},
                {x: 8 * box, y: 10 * box}
            ];

            spawnFood();
            const ms = parseInt(speedSelect.value);
            gameLoop = setInterval(update, ms);
        }

        function spawnFood() {
            currentFruit = fruits[Math.floor(Math.random() * fruits.length)];
            food = {
                x: Math.floor(Math.random() * 19) * box,
                y: Math.floor(Math.random() * 19) * box
            };
            // Ovqat ilonchaning ustiga tushib qolmasligini tekshirish
            for(let part of snake) {
                if(part.x === food.x && part.y === food.y) spawnFood();
            }
        }

        document.addEventListener("keydown", (e) => {
            const key = e.keyCode;
            if(key == 37 && d != "RIGHT") nextD = "LEFT";
            else if(key == 38 && d != "DOWN") nextD = "UP";
            else if(key == 39 && d != "LEFT") nextD = "RIGHT";
            else if(key == 40 && d != "UP") nextD = "DOWN";
        });

        function update() {
            d = nextD;
            let headX = snake[0].x;
            let headY = snake[0].y;

            if(d == "LEFT") headX -= box;
            if(d == "UP") headY -= box;
            if(d == "RIGHT") headX += box;
            if(d == "DOWN") headY += box;

            // DEVORGA TEGISHNI TEKSHIRISH
            if(headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height || collision({x: headX, y: headY}, snake)) {
                endGame();
                return;
            }

            const newHead = {x: headX, y: headY};

            if(headX == food.x && headY == food.y) {
                score++;
                scoreElement.innerText = score;
                spawnFood();
            } else {
                snake.pop();
            }

            snake.unshift(newHead);
            draw();
        }

        function collision(head, array) {
            for(let i = 0; i < array.length; i++) {
                if(head.x == array[i].x && head.y == array[i].y) return true;
            }
            return false;
        }

        function draw() {
            // Shaxmat foni
            for(let i=0; i<20; i++) {
                for(let j=0; j<20; j++) {
                    ctx.fillStyle = (i+j) % 2 == 0 ? "#AAD751" : "#A2D149";
                    ctx.fillRect(i*box, j*box, box, box);
                }
            }

            // Iloncha
            snake.forEach((part, i) => {
                ctx.fillStyle = (i === 0) ? "#4674E9" : "#578AFA";
                ctx.beginPath();
                ctx.roundRect(part.x + 1, part.y + 1, box - 2, box - 2, 6);
                ctx.fill();

                if(i === 0) { // Ko'zlar
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc(part.x + 6, part.y + 7, 3, 0, Math.PI*2);
                    ctx.arc(part.x + 14, part.y + 7, 3, 0, Math.PI*2);
                    ctx.fill();
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.arc(part.x + 6, part.y + 7, 1.5, 0, Math.PI*2);
                    ctx.arc(part.x + 14, part.y + 7, 1.5, 0, Math.PI*2);
                    ctx.fill();
                }
            });

            // Meva
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(currentFruit, food.x + box/2, food.y + box/2 + 2);
        }

        function endGame() {
            clearInterval(gameLoop);
            finalScoreText.innerText = "Sizning natijangiz: " + score;
            gameOverScreen.style.display = "flex";
        }