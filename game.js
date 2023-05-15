const canvas = document.getElementById("game-canvas");

const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");

const flappyImg = new Image();
flappyImg.src = "./assets/flappy_dunk.png";


const flap_speed = -5;
const bird_width = 40;
const bird_height = 30;
const pip_width = 50;
const pip_gap = 125;

//bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAceleration = 0.1;

//pipe variables

let pipeX = 400;
let pipeY = canvas.height - 200;

//score and highscore variables

let scorediv = document.getElementById("score-display");
let score = 0;
let highscore = 0;


let scored = false;

document.body.onkeyup = function(e){
    if(e.keyCode == 32 || 'Space'){
        birdVelocity = flap_speed;
    }
}

document.getElementById("restart-button").onclick = function() {
    hideMenu();
    resetGame();
    loop();
}


function increaseScore() {
    if (birdX > pipeX + pip_width && (birdY < pipeY + pip_gap || 
        birdY + bird_height > pipeY + pip_gap)
        && !scored) {
        score++;
        scorediv.innerHTML = score;
        scored = true;
    }
    if (birdX < pipeX + pip_width) {
        scored = false;
    }
}

function collisionCheck () {
    const birdBox = {
        x: birdX,
        y: birdY,
        width: bird_width,
        height: bird_height
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - pip_gap + bird_height,
        width: pip_width,
        height: pipeY
    }

    const bottompipeBox = {
        x: pipeX,
        y: pipeY + pip_gap,
        width: pip_width,
        height: canvas.height - pipeY - pip_gap
    }

    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y ) {
            return true;
    }

    if (birdBox.x + birdBox.width > bottompipeBox.x &&
        birdBox.x < bottompipeBox.x + bottompipeBox.width &&
        birdBox.y + birdBox.height > bottompipeBox.y) {
            return true;
    }

    if (birdY < 0 || birdY + bird_height > canvas.height) {
        return true;
    }

    return false;
}

function hideMenu() {
    document.getElementById("end-menu").style.display = "none";
    gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu() {
    document.getElementById("end-menu").style.display = "block";
    gameContainer.classList.add("backdrop-blur");
    document.getElementById("end-score").innerHTML = score;


    if (highscore < score){
        highscore = score;
    }
    document.getElementById('best-score').innerHTML = highscore;
} 

function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAceleration = 0.1;
    pipeX = 400;
    pipeY = canvas.height - 200;
    score = 0;
    scorediv.innerHTML = score;
}

function endGame() {
    showEndMenu();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(flappyImg, birdX, birdY);


    ctx.fillStyle = "#333";
    ctx.fillRect(pipeX, -100, pip_width, pipeY);
    ctx.fillRect(pipeX, pipeY + pip_gap, pip_width, canvas.height - pipeY);
    
    if (collisionCheck()) {
        endGame();
        return;
    }


    pipeX -= 1.5; 
    
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - pip_gap) + pip_width;
    }
    

    birdVelocity += birdAceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop);
}

loop();