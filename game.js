const game = document.getElementById("game");

const player = document.getElementById("player");

const scoreText =
    document.getElementById("score");

const gameOverScreen =
    document.getElementById("game-over");

const finalScore =
    document.getElementById("final-score");


/* =========================
   GAME VARIABLES
========================= */

let score = 0;

let speed = 6;

let gameRunning = true;

let isJumping = false;

let obstacleTimer;


/* =========================
   JUMP SETTINGS
========================= */

const jumpHeight = 170;

const jumpTime = 650;


/* =========================
   JUMP
========================= */

function jump() {

    if (isJumping || !gameRunning) {
        return;
    }

    isJumping = true;

    const startTime =
        performance.now();


    function jumpAnimation(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / jumpTime,
                1
            );


        /*
           Smooth jump curve.
        */

        const height =
            Math.sin(
                progress * Math.PI
            ) * jumpHeight;


        /*
           ONLY move the player upward.
           Do NOT scale him.
        */

        player.style.transform =
            `translateY(${-height}px)`;


        if (progress < 1) {

            requestAnimationFrame(
                jumpAnimation
            );

        } else {

            player.style.transform =
                "translateY(0)";

            isJumping = false;
        }
    }


    requestAnimationFrame(
        jumpAnimation
    );
}


/* =========================
   SPACE KEY
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.code === "Space") {

            event.preventDefault();

            jump();
        }

    }
);


/* =========================
   CREATE OBSTACLE
========================= */

function createObstacle() {

    if (!gameRunning) {
        return;
    }


    const obstacle =
        document.createElement("div");


    obstacle.className =
        "obstacle";


    game.appendChild(obstacle);


    let position =
        game.clientWidth + 50;


    obstacle.style.left =
        position + "px";


    const movement =
        setInterval(function() {

            if (!gameRunning) {

                clearInterval(movement);

                obstacle.remove();

                return;
            }


            position -= speed;


            obstacle.style.left =
                position + "px";


            /* =========================
               COLLISION
            ========================= */

            const playerBox =
                player.getBoundingClientRect();


            const obstacleBox =
                obstacle.getBoundingClientRect();


            const hit =

                playerBox.right - 15 >
                    obstacleBox.left &&

                playerBox.left + 15 <
                    obstacleBox.right &&

                playerBox.bottom - 10 >
                    obstacleBox.top &&

                playerBox.top + 10 <
                    obstacleBox.bottom;


            if (hit) {

                gameOver();

                clearInterval(movement);

                return;
            }


            /* =========================
               OBSTACLE PASSED
            ========================= */

            if (position < -100) {

                clearInterval(movement);

                obstacle.remove();

                score++;


                scoreText.textContent =
                    "Score: " + score;


                if (score % 5 === 0) {

                    speed += 0.5;
                }
            }

        }, 16);
}


/* =========================
   START OBSTACLES
========================= */

function startObstacles() {

    setTimeout(function() {

        createObstacle();

    }, 1500);


    obstacleTimer =
        setInterval(function() {

            if (gameRunning) {

                createObstacle();
            }

        }, 2300);
}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    gameRunning = false;


    clearInterval(
        obstacleTimer
    );


    finalScore.textContent =
        "Score: " + score;


    gameOverScreen.style.display =
        "block";
}


/* =========================
   RESTART
========================= */

function restartGame() {

    location.reload();
}


/* =========================
   START GAME
========================= */

startObstacles();