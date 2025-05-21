// Initialize variables for game speed and gravity
let move_speed = 3,
  gravity = 0.5;
let butterfly = document.querySelector(".butterfly");
let img = document.getElementById("butterfly-1");
let sound_point = new Audio("sounds effect/point.mp3");
let sound_die = new Audio("sounds effect/die.mp3");

// Get the properties of the butterfly element
let butterfly_props = butterfly.getBoundingClientRect();
let background = document.querySelector(".background");

// Initialize background position
let background_pos = 0;

// Get score elements
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

// Game state starts as "Start"
let game_state = "Start";
img.style.display = "none"; // Hide the butterfly image initially
message.classList.add("messageStyle"); // Add the message box style

// Event listener for starting the game when Enter is pressed
document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && game_state != "Play") {
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block";
    butterfly.style.top = "40vh";
    game_state = "Play";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    play();
  }
});

// Function to handle game mechanics
function play() {
  function move() {
    if (game_state != "Play") return; // Stop if game is not in "Play" state

    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      butterfly_props = butterfly.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          butterfly_props.left + butterfly_props.width - 10 >
            pipe_sprite_props.left && // Adjusting for collision sensor
          butterfly_props.left + 10 <
            pipe_sprite_props.left + pipe_sprite_props.width &&
          butterfly_props.top + butterfly_props.height - 10 >
            pipe_sprite_props.top &&
          butterfly_props.top + 10 <
            pipe_sprite_props.top + pipe_sprite_props.height
        ) {
          game_state = "End"; // Set the game state to "End"
          message.innerHTML =
            "Game Over".fontcolor("red") + "<br>Tekan Enter Untuk Restart";
          message.classList.add("messageStyle"); // Show game over message
          img.style.display = "none"; // Hide the butterfly
          sound_die.play(); // Play die sound
          return;
        } else {
          // Update score when the butterfly passes a tree
          if (
            pipe_sprite_props.right < butterfly_props.left &&
            pipe_sprite_props.right + move_speed >= butterfly_props.left &&
            element.increase_score == "1"
          ) {
            score_val.innerHTML = +score_val.innerHTML + 10; // Increment score
            sound_point.play(); // Play point sound

            // Increase game speed after score reaches 10
            if (score_val.innerHTML >= 10) {
              move_speed += 0.1; // Gradually increases speed
            }
          }
          element.style.left = pipe_sprite_props.left - move_speed + "px"; // Move the tree
        }
      }
    });

    // Scroll the background
    background_pos -= move_speed / 2;
    background.style.backgroundPositionX = background_pos + "px";

    requestAnimationFrame(move); // Continue the game loop
  }
  requestAnimationFrame(move);

  let butterfly_dy = 0;
  // Apply gravity to the butterfly
  function apply_gravity() {
    if (game_state != "Play") return;
    butterfly_dy = butterfly_dy + gravity;
    // Control the butterfly when the player presses the up arrow or space bar
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/butterfly-2.png"; // Switch to butterfly flap image
        butterfly_dy = -7.6; // Move butterfly upwards
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/butterfly.png"; // Switch to normal butterfly image
      }
    });

    // Check if the butterfly hits the top or bottom of the screen
    if (
      butterfly_props.top <= 0 ||
      butterfly_props.bottom >= background.getBoundingClientRect().bottom
    ) {
      game_state = "End"; // End the game
      message.style.left = "28vw";
      window.location.reload(); // Reload the game
      message.classList.remove("messageStyle");
      return;
    }

    // Update butterfly's position
    butterfly.style.top = butterfly_props.top + butterfly_dy + "px";
    butterfly_props = butterfly.getBoundingClientRect();
    requestAnimationFrame(apply_gravity); // Repeat the gravity effect
  }
  requestAnimationFrame(apply_gravity); // Start applying gravity

  let pipe_seperation = 0;
  let pipe_gap = 25; // Set distance between upper and lower trees

  function create_pipe() {
    if (game_state != "Play") return;

    if (pipe_seperation > 100) {
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      // Upper pipe (inverted tree)
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh"; // Adjust height
      pipe_sprite_inv.style.left = "100vw";
      pipe_sprite_inv.style.backgroundImage = "url('images/tree-2.png')"; // Inverted tree image
      pipe_sprite_inv.style.width = "80px"; // Adjust tree width
      pipe_sprite_inv.style.height = "400px"; // Set tree height
      pipe_sprite_inv.style.backgroundSize = "contain"; // Maintain aspect ratio
      pipe_sprite_inv.style.transform = "scaleY(-1)"; // Flip the tree upside down

      document.body.appendChild(pipe_sprite_inv); // Add upper tree to game

      // Lower tree (normal tree)
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.top = pipe_posi + pipe_gap + "vh"; // Position lower tree
      pipe_sprite.style.left = "100vw";
      pipe_sprite.style.backgroundImage = "url('images/tree.png')"; // Normal tree image
      pipe_sprite.style.width = "80px"; // Adjust tree width
      pipe_sprite.style.height = "400px"; // Set tree height
      pipe_sprite.style.backgroundSize = "contain"; // Maintain aspect ratio
      pipe_sprite.increase_score = "1";

      document.body.appendChild(pipe_sprite); // Add lower tree game
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe); // Keep generating trees
  }
  requestAnimationFrame(create_pipe); // Start tree generation
}
