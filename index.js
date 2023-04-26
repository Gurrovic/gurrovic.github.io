const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const snakeLink = document.getElementById("snake-link");
const introSection = document.getElementById("sections");
const gameSection = document.getElementById("gameContainer");
const clockwiseButton = document.getElementById("clockwise-button");
const counterclockwiseButton = document.getElementById("counterclockwise-button");
const startButton = document.getElementById("startBtn");
const highScoreBtn = document.getElementById("highScoreBtn")
const clearHighscoreBtn = document.getElementById("clearHighscoreBtn")
const leftButton = document.getElementById("leftButton");
const upButton = document.getElementById("upButton");
const rightButton = document.getElementById("rightButton");
const downButton = document.getElementById("downButton");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "blue";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let timeoutVar;
let lastInputTime = 0;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
window.addEventListener("keyup", handleKeyUp);

function handleKeyUp(event) {
  if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {    
    upButton.src = "assets/keyboard_key_up.png"
    downButton.src = "assets/keyboard_key_down.png"
    rightButton.src = "assets/keyboard_key_right.png"
    leftButton.src = "assets/keyboard_key_left.png"
  }
}

resetBtn.addEventListener("click", resetGame);
startButton.addEventListener("click", () => {
    startButton.style.display = "none"
    resetBtn.disabled = false;
    gameStart()
});

snakeLink.addEventListener("click", () => {
    introSection.style.display = "none";
    gameSection.style.display = "block";    
  });

  clockwiseButton.addEventListener("click", function() {
    changeDirectionClockwise();
  });
  
  counterclockwiseButton.addEventListener("click", function() {
    changeDirectionCounterClockwise();
  });


highScoreBtn.addEventListener("click", function() {
  displayHighScores();
  });

clearHighscoreBtn.addEventListener("click", function() {
  clearHighscores();
  });

function gameStart(){
    running= true;
    scoreText.textContent = score.toString().padStart(2, '0');
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if(running){
        timeoutVar = setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function createFood() {
    function randomFood(min, max) {
      const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
      return randNum;
    }
  
    let foodCollidesWithSnake = true;
    while (foodCollidesWithSnake) {
      foodX = randomFood(0, gameWidth - unitSize);
      foodY = randomFood(0, gameHeight - unitSize);
  
      foodCollidesWithSnake = false;
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === foodX && snake[i].y === foodY) {
          foodCollidesWithSnake = true;
          break;
        }
      }
    }
  }
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score += 1;
        scoreText.textContent = score.toString().padStart(2, '0');
        createFood();
    }
    else{
        snake.pop();
    }     
};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const now = Date.now();
    const timeSinceLastInput = now - lastInputTime;
    if (timeSinceLastInput < 75) {
        return; // exit the function without changing direction
    }
    lastInputTime = now;

    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            leftButton.src = "assets/keyboard_key_left_red.png" 
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            upButton.src = "assets/keyboard_key_up_red.png"                     
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            rightButton.src = "assets/keyboard_key_right_red.png" 
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            downButton.src = "assets/keyboard_key_down_red.png" 
            break;
    }
};

function changeDirectionClockwise() {
    switch (true) {
      case (yVelocity === -unitSize):
        xVelocity = unitSize;
        yVelocity = 0;
        break;
      case (xVelocity === unitSize):
        xVelocity = 0;
        yVelocity = unitSize;
        break;
      case (yVelocity === unitSize):
        xVelocity = -unitSize;
        yVelocity = 0;
        break;
      case (xVelocity === -unitSize):
        xVelocity = 0;
        yVelocity = -unitSize;
        break;
    }
  }
  
  function changeDirectionCounterClockwise() {
    switch (true) {
      case (yVelocity === -unitSize):
        xVelocity = -unitSize;
        yVelocity = 0;
        break;
      case (xVelocity === -unitSize):
        xVelocity = 0;
        yVelocity = unitSize;
        break;
      case (yVelocity === unitSize):
        xVelocity = unitSize;
        yVelocity = 0;
        break;
      case (xVelocity === unitSize):
        xVelocity = 0;
        yVelocity = -unitSize;
        break;
    }
  }
  
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
                running = false;
                break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};
function displayGameOver(){
    ctx.clearRect(0, 0, gameWidth, gameHeight); // clear the canvas
    ctx.font = "50px MV Boli";    
    ctx.textAlign = "center";

    // Create a gradient
    var gradient = ctx.createLinearGradient(0, 0, gameWidth, 0)
    gradient.addColorStop(0, "#FFDAB9");
    gradient.addColorStop(0.25, "#FFA07A");
    gradient.addColorStop(0.5, "#FF6347");
    gradient.addColorStop(0.75, "#FF0000");
    gradient.addColorStop(1, "#800000");
    ctx.fillStyle= gradient;
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);

    running = false;
    snake = [];
    apple = {x:0, y:0};
    
    setTimeout(function() {
      var name = prompt("Enter your name to save your highscore:");
      if (!name) {
          return;
      }      
      var date = new Date().toISOString().substr(0, 10);

      var scoreData = {
          name: name,
          score: score,
          date: date
      };

      var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
      highScores.push(scoreData);
      localStorage.setItem('highScores', JSON.stringify(highScores));
  }, 3000);
};
function resetGame(){
    prepareNewGame();
    gameStart();
};

function prepareNewGame(){
  score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    clearTimeout(timeoutVar);
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
}

function getHighScores() {
    let highScores = localStorage.getItem("highScores");
    if (highScores) {
      return JSON.parse(highScores);
    } else {
      return [];
    }
  }

function displayHighScores() {
  startButton.style.display = "none";
  resetBtn.disabled = true;
  clearHighscoreBtn.disabled = true; 

  // Get the high scores from local storage
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  // Sort the high scores in descending order
  highScores.sort((a, b) => b.score - a.score);

  // Build a string to display the high scores
  let highScoresString = "High Scores\n";
  highScores.forEach((score, index) => {
    highScoresString += `${index + 1}. ${score.name}: ${score.score} points - ${score.date}\n`;
  });

  // Set up the animation variables
  let y = gameHeight;
  let dy = -1; // move up by 1 pixel per frame
  let lines = highScoresString.split("\n");
  let currentLineIndex = 0;
  const lineHeight = 25; // assuming a line height of 25 pixels
  const lastLineHeight = lines.length * lineHeight;

  // Start the animation loop
  function animate() {
    ctx.clearRect(0, 0, gameWidth, gameHeight); // clear the canvas
    ctx.fillStyle = "black";
    ctx.font = "20px MV Boli";
    ctx.textAlign = "left";

    // Draw the lines of text that are currently visible on the canvas
    let currentY = y;
    for (let i = currentLineIndex; i < lines.length; i++) {
      let line = lines[i];
      ctx.fillText(line, 20, currentY);
      currentY += 25;
    }

    // Move the text up by dy pixels per frame
    y += dy;  


    // If all the lines have been displayed, stop the animation
    if (y <= -lastLineHeight) {
      // Stop the animation
      cancelAnimationFrame(animationId);   
    
      // Show the start button
      startButton.style.display = "block";
      // Reenable buttons      
      clearHighscoreBtn.disabled = false; 
    
      return;
    }

    // Request the next frame of animation if not all lines have been displayed yet
    if (currentLineIndex < lines.length - 1) {
      animationId = requestAnimationFrame(animate);
    }
  }

  // Start the animation loop
  let animationId = requestAnimationFrame(animate);
  prepareNewGame();
}

function clearHighscores() {
  startBtn.style.display = "none";
  // Clear the high scores from local storage
  localStorage.removeItem("highScores");

  // Display "HIGH SCORES CLEARED" on the canvas
  ctx.clearRect(0, 0, gameWidth, gameHeight); // clear the canvas
  ctx.fillStyle = "black";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("HIGH SCORES CLEARED", gameWidth / 2, gameHeight / 2);
  

  // Show the start button after 3 seconds
  setTimeout(() => {
    ctx.clearRect(0, 0, gameWidth, gameHeight); // clear the canvas
    startBtn.style.display = "block";    
  }, 3000);
  prepareNewGame();
}