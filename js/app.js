// constants

const CARD_TYPES = [
  "diamond",
  "paper-plane-o",
  "anchor",
  "bolt",
  "cube",
  "leaf",
  "bicycle",
  "bomb"
];
const TWO_STARS_THRESHOLD = 15;
const ONE_STARS_THRESHOLD = 25;

// game variables

let deckOfCards, openCardsList, movesCounter, timerInSeconds, runTimer;

// main function

function start() {
  // init game variables
  deckOfCards = buildDeckArray();
  openCardsList = [];
  movesCounter = 0;
  timerInSeconds = 0;
  runTimer = true;

  // display all cards of the deck
  displayAllCardsOfDeck(deckOfCards);

  // listen to card click (event delegation)
  const deckEl = document.querySelector(".deck");
  deckEl.addEventListener("click", respondToTheClick);

  // listen to restart click
  const restartEl = document.querySelector(".restart");
  restartEl.addEventListener("click", respondToRestartClick);

  // update timer
  setInterval(updateTimer, 1000);
}

// operations on deck

/*
 * Create a list that holds all of your cards
 */
function buildDeckArray() {
  const deckArray = [];

  CARD_TYPES.forEach(card_type => {
    deckArray.push(card_type);
    deckArray.push(card_type);
  });

  return shuffle(deckArray);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayAllCardsOfDeck(deckArray) {
  const deckEl = document.querySelector(".deck");
  deckArray.forEach(card => {
    const cardEl = document.createElement("li");
    cardEl.className = "card";
    const iEl = document.createElement("i");
    iEl.classList.add("fa", `fa-${card}`);
    cardEl.appendChild(iEl);
    deckEl.appendChild(cardEl);
  });
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function respondToTheClick(event) {
  if (event.target.nodeName == "LI") {
    const cardEl = event.target;
    // do nothing if
    //  - card is already displayed or open
    //  - open cards list already has a pair
    //  - the card is already in open cards list
    if (
      isCardDisplayedOrOpen(cardEl) ||
      openCardsHasAPair() ||
      alreadyInOpenCardsList(cardEl)
    ) {
      return;
    }
    displayCard(cardEl);
    addCardToOpenCardsList(cardEl);
    if (openCardsHasAPair()) {
      if (openCardsMatch()) {
        openCardsInOpenCardsList();
      } else {
        setTimeout(hideCardsInOpenCardsList, 1000);
      }
      incrementMoves();
      if (checkAllCardsOpen()) {
        showCongratsScreen();
      }
    }
  }
}

// operations on a card Element

function isCardDisplayedOrOpen(cardEl) {
  return cardEl.classList.contains("show") || cardEl.classList.contains("open");
}

function displayCard(cardEl) {
  cardEl.classList.add("show");
}
function hideCard(cardEl) {
  cardEl.classList.remove("show");
}
function openCard(cardEl) {
  cardEl.classList.add("open");
}

// operations on the openCardsList

function alreadyInOpenCardsList(cardEl) {
  return openCardsList.includes(cardEl);
}

function openCardsHasAPair() {
  return openCardsList.length == 2;
}

function addCardToOpenCardsList(cardEl) {
  if (openCardsList.length < 2) {
    openCardsList.push(cardEl);
  }
}

function hideCardsInOpenCardsList() {
  openCardsList.forEach(cardEl => {
    hideCard(cardEl);
  });
  removeCardsFromOpenCardsList();
}

function openCardsInOpenCardsList() {
  openCardsList.forEach(cardEl => {
    openCard(cardEl);
  });
  removeCardsFromOpenCardsList();
}

function removeCardsFromOpenCardsList() {
  openCardsList.splice(0, openCardsList.length);
}

function openCardsMatch() {
  return (
    openCardsList[0].firstChild.classList.value ==
    openCardsList[1].firstChild.classList.value
  );
}

// operations on moves counter

function incrementMoves() {
  movesCounter++;
  refreshMovesCount();
  checkRemoveStar();
}

// 3 stars : less than 10 moves
// 2 stars : less than 20 moves
// 1 star : 20 moves and above

function checkRemoveStar() {
  const ulEl = document.querySelector(".stars");
  if (
    movesCounter == TWO_STARS_THRESHOLD ||
    movesCounter == ONE_STARS_THRESHOLD
  ) {
    ulEl.children[0].remove();
  }
}

function refreshMovesCount() {
  const movesEl = document.querySelector(".moves");
  movesEl.innerText = movesCounter;
}

// restart functionnality

function respondToRestartClick() {
  restart();
}

function restart() {
  removeCardsFromGrid();
  rebuildThreeStars();
  displayZeroToTimer();
  start();
}

function removeCardsFromGrid() {
  const deckEl = document.querySelector(".deck");
  while (deckEl.children[0]) {
    deckEl.children[0].remove();
  }
}

// removes remaining stars
function rebuildThreeStars() {
  const ulEl = document.querySelector(".stars");
  // count remaining stars
  const remainingStarsCount = ulEl.children.length;
  // recreate stars to have 3 stars back
  for (i = 1; i <= 3 - remainingStarsCount; i++) {
    const liEl = document.createElement("li");
    const iEl = document.createElement("i");
    iEl.classList.add("fa", "fa-star");
    liEl.appendChild(iEl);
    ulEl.appendChild(liEl);
  }
}

function displayZeroToTimer() {
  const timerEl = document.querySelector(".timer");
  timerEl.innerText = "00:00";
}

// win the game

function checkAllCardsOpen() {
  const nopen = document.querySelectorAll(".open").length;
  if (nopen === CARD_TYPES.length * 2) {
    showCongratsScreen();
  }
}

function showCongratsScreen() {
  runTimer = false;
  const deckEl = document.querySelector(".deck");
  const congratsEl = document.querySelector(".congrats");
  const nmovesEl = document.querySelector(".nmoves");
  const nstarsEl = document.querySelector(".nstars");
  const timeEl = document.querySelector(".time");

  nmovesEl.innerText = movesCounter;
  nstarsEl.innerText = document.querySelector(".stars").children.length;
  timeEl.innerText = document.querySelector(".timer").innerText;
  // toggle displays
  deckEl.style.display = "none";
  congratsEl.style.display = "block";

  const startAgainBtn = document.querySelector(".startagain");
  startAgainBtn.addEventListener("click", respondToStartAgainBtnClick);
}

function respondToStartAgainBtnClick() {
  console.log("start again click");
  const deckEl = document.querySelector(".deck");
  deckEl.style.display = "flex";

  const congratsEl = document.querySelector(".congrats");
  congratsEl.style.display = "none";

  restart();
}

// timer

function updateTimer() {
  if (runTimer) {
    timerInSeconds++;
    let minutes = Math.floor(timerInSeconds / 60);
    let seconds = timerInSeconds % 60;
    let formattedMinutes = ("0" + minutes).slice(-2);
    let formattedSeconds = ("0" + seconds).slice(-2);
    timerEl = document.querySelector(".timer");
    timerEl.innerText = `${formattedMinutes}:${formattedSeconds}`;
  }
}

// utility methods

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// start game
start();
