// Javascript Document
(() => {
  console.log("Spot Alien Initiated. Good Luck Soldier!");

  // VARIABLES STACK
  let resetButton = document.querySelector("#reset-button");
  let startButton = document.querySelector("#start-button");
  let intro = document.querySelector("#intro");
  let gamePage = document.querySelector("#gamePage");
  let aliensInBlock = [
    "block1",
    "block2",
    "block3",
    "block4",
    "block5",
    "block6",
    "block7",
    "block8"
  ];
  let blocks = []; // array for all the 16 game blocks
  let firstClickedBlock = null;
  let countdowntimer = document.querySelector("#countdowntimer");
  let finalBug = document.querySelector("#finalBug");

  // FUNCTIONS STACK

  // GAME BLOCK STATUS in OBJECT
  // element is the game block; alien is the alien img shown as class
  // each game block will have two status: 1.default, 2.show alien image
  // also, the game block can be matched (aliens pair found, ignore click event), or open
  function GameBlock(element, alien) {
    this.element = element;
    this.alienShow = false;
    this.isMatched = false;
    this.element.addEventListener("click", this, false);

    // method to handle event and check if alien is show or matched, in that case ignore the event; else, slideUp and show alien.
    this.handleEvent = function(event) {
      switch (event.type) {
        case "click":
          if (this.alienShow || this.isMatched) {
            return;
          }
          this.alienShow = true;
          this.element.classList.add("sliderUp");
          checkGame(this);
      }
    };

    // method to reset game block
    this.reset = function() {
      this.alienShow = false;
      this.isMatched = false;
      this.element.classList.remove("sliderUp");
    };

    // method to apply when the alien pair is found and game block is matched and cannot respond to any event
    this.matched = function() {
      this.alienShow = true;
      this.isMatched = true;
    };

    // set alien in game blocks
    this.setAlien = function(alien) {
      this.element.children[0].children[1].classList.remove(this.alien);
      this.alien = alien;
      this.element.children[0].children[1].classList.add(alien);
    };

    this.setAlien(alien);
  }
  /* ------------------- */

  // setup game function, grab the 16 blocks in the DOM, and assign an alien to them.
  function setupGame() {
    // nodelist of all elements with .game-block class
    var game_block = document.querySelectorAll(".game-block");

    // get an array of random aliens
    var randomAliens = randomAlienInBlock();

    game_block = game_block.forEach((e, i) => {
      // random alien index
      var index = Math.floor(Math.random() * randomAliens.length);

      // at that index get an alien, remove it from the array, and since slice creates an array, we will need just the element, that's why [0]
      var alien = randomAliens.splice(index, 1)[0];

      // push that alien in the block
      blocks.push(new GameBlock(game_block[i], alien));
    });
  }
  /* ------------------- */

  // Assign random aliens to each game block
  function randomAlienInBlock() {
    // copy of the original array to avoid modifying it.
    var aliensInBlockCopy = aliensInBlock.slice();

    var randomAliens = [];

    // loop through aliens array
    for (var i = 0; i < 8; i++) {
      // get an index from 1 to aliens array copy, at this index remove (slice) item and add it to random aliens array, just the [0] element sliced, not the array.
      var index = Math.floor(Math.random() * aliensInBlockCopy.length);
      randomAliens.push(aliensInBlockCopy.splice(index, 1)[0]);
    }
    // return the double random alien array since 2*8 blocks
    return randomAliens.concat(randomAliens.slice());
  }
  /* ------------------- */

  // function to check game block status
  function checkGame(gameBlock) {
    // when clicking on first block assign a value, if not already there.
    if (firstClickedBlock === null) {
      firstClickedBlock = gameBlock;
      return;
    }
    // when first block has a value, compare it with gameBlock value, if they are the same call mathced method.
    if (firstClickedBlock.alien === gameBlock.alien) {
      firstClickedBlock.matched();
      gameBlock.matched();
    } else {
      // blocks value are different call reset method, and just showing block shortly (400ms)
      // FYI...repeat var to put them in this scope
      var a = firstClickedBlock;
      var b = gameBlock;
      setTimeout(() => {
        a.reset();
        b.reset();
        firstClickedBlock = null;
      }, 400);
    }
    firstClickedBlock = null;
  }
  /* ------------------- */

  // reset alien block when Mission Abort event. For each block assign again an alien type randomly
  function resetAliens() {
    var randomAliens = randomAlienInBlock();
    blocks.forEach(block => {
      var alien = randomAliens.splice(
        Math.floor(Math.random() * randomAliens.length),
        1
      )[0];
      block.setAlien(alien);
    });
  }
  /* ------------------- */

  // clear game function.  Reset each block
  function clearGame() {
    blocks.forEach(block => {
      block.reset();
    });
    // setTimeout to wait blocks to close.
    setTimeout(() => {
      resetAliens();
    }, 500);
  }
  /* ------------------- */

  // Timer setInterval function
  function countDown() {
    let timeleft = 20;
    let timer = setInterval(() => {
      timeleft--;
      countdowntimer.textContent = timeleft;

      if (timeleft <= 0) {
        clearInterval(timer);
        clearGame();
        finalBug.classList.remove("hidden");
        resetButton.classList.remove("hidden");
      }

      // function to use in array.every() to test if blocks.isMatched are all true, in case, there is a WINNING situation.
      function winTest(element) {
        return element.isMatched === true;
      }
      if (blocks.every(winTest)) {
        console.log("YOU WON!");
        clearInterval(timer);
        victory.classList.remove("hidden");
        resetButton.textContent = "Congratulation! Try Again Soldier!"
        resetButton.classList.remove("hidden");
      }

    }, 2000);
  }

  /* ------------------- */

  // Function to switch screen from Intro to Game
  function goToGame() {
    intro.classList.add("hidden");
    gamePage.classList.remove("hidden");
  }
  /* ------------------- */

  // EVENT LISTNERS STACK
  resetButton.addEventListener("click", () => window.location.reload());
  startButton.addEventListener("click", goToGame);
  startButton.addEventListener("click", countDown);
  /* ------------------- */

  // initialize game function
  setupGame();
  console.log(resetButton)
})();
