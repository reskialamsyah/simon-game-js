// Define an array of colors that the buttons can have
let buttonColors = ["red", "blue", "green", "yellow"];

// Arrays to store the game pattern (sequence of colors) and the user’s input pattern
let gamePattern = [];
let userClickedPattern = [];

// Track the current level of the game and whether the game has started
let level = 0;
let gameStarted = false;

/* 
  This function generates the next color in the sequence, updates the level, 
  and visually and audibly cues the user about the new color. 
*/
function nextSequence() {
  // Reset the user's pattern for the current level
  userClickedPattern = [];

  // Increment the game level and update the title with the current level
  level++;
  $("#level-title").text("Level " + level);

  // Randomly select one of the button colors
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomNumber];

  // Add the randomly chosen color to the game sequence
  gamePattern.push(randomChosenColor);

  // Animate the button for the randomly chosen color (fade out and back in)
  $("#" + randomChosenColor)
    .fadeOut(100)
    .fadeIn(100);

  // Play the corresponding sound for the chosen color
  playSound(randomChosenColor);
}

/* 
  This function checks the user's input at each step (after they click a button). 
  If the user's pattern matches the game's pattern so far, it will continue. 
  If not, the game ends, and the user is notified.
*/
function checkAnswer(currentLevel) {
  // Check if the user's input matches the game's pattern at the current level
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    // If the user has finished their sequence and it matches the game pattern
    if (userClickedPattern.length === gamePattern.length) {
      // Call the next sequence after a short delay
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    // If the user's input is wrong, flash the "game over" effect
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    // Play the "wrong" sound when the user makes a mistake
    playSound("wrong");

    // Reset the game to allow the user to start over
    startOver();
  }
}

/* 
  This function resets the game when the user makes a mistake. 
  It clears the game pattern, resets the level, and updates the title to prompt the user to restart.
*/
function startOver() {
  gamePattern = []; // Reset the game pattern
  gameStarted = false; // Set the gameStarted flag back to false
  level = 0; // Reset the level back to 0

  // Update the title to show the game is over and prompt for a restart
  $("#level-title").text("Game Over! Press S to start again");
}

/* 
  This function plays a sound based on the color passed to it.
  Each color has a corresponding sound file located in the "./sounds/" directory.
*/
function playSound(name) {
  let buttonAudio = new Audio("./sounds/" + name + ".mp3"); // Load the audio file
  buttonAudio.play(); // Play the sound
}

/* 
  This function adds a "pressed" animation to a button when clicked. 
  It highlights the button briefly to give visual feedback to the user.
*/
function animatePress(currentColor) {
  $("." + currentColor).addClass("pressed"); // Add the "pressed" class to the button
  setTimeout(function () {
    $("." + currentColor).removeClass("pressed"); // Remove the "pressed" class after 150ms
  }, 150);
}

/* 
  This is an event listener for the buttons (with class "btn"). 
  When a button is clicked, it records the user’s chosen color, plays the sound, 
  animates the button, and checks if the user's input is correct.
*/
$(".btn").on("click", function () {
  let userChosenColor = $(this).attr("id"); // Get the ID (color) of the button clicked

  // Add the user's chosen color to their input pattern
  userClickedPattern.push(userChosenColor);

  // Play the sound associated with the chosen color
  playSound(userChosenColor);

  // Animate the button press
  animatePress(userChosenColor);

  // Check if the user's input is correct by comparing it to the game pattern
  checkAnswer(userClickedPattern.length - 1);
});

/* 
  This event listener detects when a key is pressed. 
  If the game hasn't started and the "S" key is pressed, it starts the game 
  by calling the `nextSequence` function to begin the first level.
*/
$(document).on("keydown", function (e) {
  // If the game has not started and the "S" or "s" key is pressed, start the game
  if ((!gameStarted && e.key === "s") || e.key === "S") {
    $("#level-title").text("Level " + level); // Update the title to show the current level
    nextSequence(); // Start the game by generating the first sequence
    gameStarted = true; // Set the gameStarted flag to true
  }
});
