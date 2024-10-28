let boxes = document.querySelectorAll(".box");
const bg = document.querySelector(".bg");
const btnStart_Game = document.querySelector("#start-game");
const btnPlay_Again = document.querySelector("#play-again");
const btnLeave_Room = document.querySelector("#leave-room");
const statusMessage = document.querySelector("#status-message");
const btnLog_Out = document.querySelector(".logout-button");
const resultMessage = document.querySelector("#result");

let roomObj = null;

let socket;

/* ------------------------------------- SOCKET METHODS ------------------------------------*/
function findGame() {
  socket = io("/game");

  //On connection
  socket.on("connect", () => {
    console.log(`You connect with id:  + ${socket.id}`);

    //Send a join match request
    socket.emit("find-match");

    //Handle a wait match event
    socket.on("wait-match", () => {
      statusMessage.innerHTML = `<h2>Waiting for another player to join...</h2>`;
      statusMessage.classList.add("show");
    });

    // Handle a start match event
    let countdownInterval;
    socket.on("start-match", (roomObjSent) => {
      roomObj = roomObjSent;
      console.log(roomObj);
      console.log("Start match run!!!");
      statusMessage.innerHTML = `<h2>Waiting for another player to join...</h2>`;
      resetBoard();

      let countdown = 3;

      // Show the status message
      statusMessage.classList.add("show");

      countdownInterval = setInterval(() => {
        // Update the status message with the countdown
        statusMessage.innerHTML = `<h2>Game starts in ${countdown}</h2>`;
        countdown--; // Decrease the countdown

        // When countdown reaches 0, clear the interval and start the game
        if (countdown < 0) {
          clearInterval(countdownInterval);
          console.log(roomObj);
          statusMessage.innerHTML = `<h2>You are: ${
            roomObj.symbols[socket.id]
          }!</h2>`;
          createBoard();
        }
      }, 1000);
    });

    //Handle player moves
    socket.on("receiveMove", (symbol, index, roomObjSent) => {
      roomObj = roomObjSent;
      updateUserTurn(symbol, index);
      changeTurn();
    });

    //Handle rematch request
    socket.on("receive-rematch-request", (username) => {
      statusMessage.innerHTML = `<h2>${username} request a rematch!</h2>`;
      //Change the function of "Play Again" button
      btnPlay_Again.removeEventListener("click", requestRematch);
      btnPlay_Again.addEventListener("click", acceptRematch);
    });

    //Opponent leave the room after game finished aka refuse rematch
    socket.on("opponent-leave-room", () => {
      statusMessage.innerHTML = `<h2>Opponent left the room!</h2>`;
      btnPlay_Again.style.display = "none"; //Hide the play again button
      roomObj = null;
      socket.disconnect();
    });

    //Opponent disconnect when the game started and not done
    socket.on("opponent-disconnect", () => {
      if (countdownInterval) clearInterval(countdownInterval);
      statusMessage.innerHTML = `<h2>Opponent disconnected! You win!</h2>`;
      btnLeave_Room.style.display = "block"; //Show the leave room option;
      roomObj = null;
      socket.disconnect();
    });

    //Receive win message
    socket.on("winner", (winIndexArr, roomObjSent) => {
      roomObj = roomObjSent;
      console.log("Winner socket run!");
      updateGameResultUI(winIndexArr, "win");
    });

    //Receive lose message
    socket.on("loser", (winIndexArr, roomObjSent) => {
      roomObj = roomObjSent;
      console.log("Loser socket run!");
      updateGameResultUI(winIndexArr, "lose");
    });

    //Receive draw message
    socket.on("draw", (roomObjSent) => {
      roomObj = roomObjSent;
      updateGameResultUI(null, "draw");
    });

    //Start a game when in another game
    socket.on("already-in-room", () => {
      alert("You are already in a match!");
      resetUI();
    });
  });

  btnStart_Game.style.display = "none";
}

/* --------------------    BUTTON EVENTS  ------------------------     */
btnStart_Game.addEventListener("click", findGame);
btnPlay_Again.addEventListener("click", requestRematch);
btnLog_Out.addEventListener("click", logout);
btnLeave_Room.addEventListener("click", leaveRoom);

function requestRematch() {
  //Hide the Play Again button after clicked
  btnPlay_Again.style.display = "none";
  statusMessage.innerHTML = "<h2>Waiting for opponent...</h2>";
  // Get the username from the DOM
  const username = document.querySelector(".username").innerText;

  //Send rematch request
  socket.emit("rematch-request");
}

//Send an accept-rematch request
function acceptRematch() {
  socket.emit("accept-rematch");
}

// Log-out
async function logout() {
  const response = await fetch("/auth/logout", {
    method: "POST", // Use POST for logout
  });

  const data = await response.json(); // Parse JSON response
  window.location.href = data.redirect; // Redirect to the specified URL
}

//Send a cancel a.k.a disconnect socket
function leaveRoom() {
  socket.disconnect();
  resetUI();
}

/* ----------------------------- GAME UI ---------------------- */

function updateGameResultUI(winIndexArr, status) {
  if (status === "win" || status === "lose")
    resultMessage.innerHTML = `You ${status}!`;
  if (status === "draw") resultMessage.innerHTML = `Draw!`;
  btnPlay_Again.style.display = "block";
  btnLeave_Room.style.display = "block";
  if (winIndexArr) {
    for (let index of winIndexArr) {
      boxes[index].style.backgroundColor = "#08D9D6";
    }
  }
}

//Change Turn
function changeTurn() {
  console.log(roomObj.turn);
  if (roomObj.turn === "O") {
    bg.style.left = "85px";
  } else {
    bg.style.left = "0";
  }
}

// Separate event handler for making a move
function handleBoxClick(e, index) {
  // Check if the game is over || the box is already filled || player's turn
  if (roomObj) {
    if (
      roomObj.isGameOver ||
      e.innerHTML !== "" ||
      roomObj.symbols[socket.id] !== roomObj.turn
    ) {
      return; // Exit early if the game is over or the box has already been played
    }
  }
  // Make a valid move
  socket.emit("makeMove", roomObj.symbols[socket.id], index);
}

// Create the board
function createBoard() {
  boxes.forEach((e, index) => {
    e.innerHTML = ""; // Reset the box content

    // Assign the move event to each box
    e.addEventListener("click", () => handleBoxClick(e, index));
  });
}

// Reset the board
function resetBoard() {
  resetGrid();
  bg.style.left = "0";
  document.querySelector("#result").innerHTML = "";

  // Reset play again function
  btnPlay_Again.removeEventListener("click", acceptRematch);
  btnPlay_Again.addEventListener("click", requestRematch);
  btnPlay_Again.style.display = "none";
  btnLeave_Room.style.display = "none";
}

//Delete the board and re-create it
function resetGrid() {
  const grid = document.querySelector(".main-grid");

  // Clear the content inside main-grid
  grid.innerHTML = "";

  // Re-add the 9 .box.align elements
  for (let i = 0; i < 9; i++) {
    const box = document.createElement("div");
    box.classList.add("box", "align");
    grid.appendChild(box);
  }

  //Update the boxes element
  boxes = document.querySelectorAll(".box");
}

//Reset the whole UI
function resetUI() {
  resetBoard();
  statusMessage.classList.remove("show");
  btnLeave_Room.style.display = "none";
  btnPlay_Again.style.display = "none";
  btnStart_Game.style.display = "block";
}

//Update UI after one of the player make a turn
function updateUserTurn(symbol, index) {
  boxes[index].innerHTML = symbol;
}
