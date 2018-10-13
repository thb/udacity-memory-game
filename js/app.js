// variables

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

let deckOfCards = buildDeckArray();

let openCardsList = [];

let movesCounter = 0;

const TWO_STARS_THRESHOLD = 15;
const ONE_STARS_THRESHOLD = 25;

// main function

function start() {
  // respond to card click
  const deckEl = document.querySelector(".deck");
  deckEl.addEventListener("click", respondToTheClick);

  // display all cards of the deck
  displayAllCardsOfDeck(deckOfCards);

  // respond to restart click
  const restartEl = document.querySelector(".restart");
  restartEl.addEventListener("click", respondToRestartClick);
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
  resetGrid();
  resetMovesCounter();
}

function resetGrid() {
  deckOfCards = buildDeckArray();
  openCardsList = [];
  const deckEl = document.querySelector(".deck");
  while (deckEl.children[0]) {
    deckEl.children[0].remove();
  }
  displayAllCardsOfDeck(deckOfCards);
}

function resetMovesCounter() {
  movesCounter = 0;
  refreshMovesCount();
  const ulEl = document.querySelector(".stars");
  // remove all the stars
  while (ulEl.children[0]) {
    ulEl.children[0].remove();
  }
  // recreate 3 stars
  for (i = 1; i <= 3; i++) {
    const liEl = document.createElement("li");
    const iEl = document.createElement("i");
    iEl.classList.add("fa", "fa-star");
    liEl.appendChild(iEl);
    ulEl.appendChild(liEl);
  }
}

// win the game

function checkAllCardsOpen() {
  const nopen = document.querySelectorAll(".open").length;
  if (nopen === CARD_TYPES.length * 2) {
    showCongratsScreen();
  }
}

function showCongratsScreen() {
  const deckEl = document.querySelector(".deck");
  const congratsEl = document.querySelector(".congrats");
  const nmovesEl = document.querySelector(".nmoves");
  const nstarsEl = document.querySelector(".nstars");

  nmovesEl.innerText = movesCounter;
  nstarsEl.innerText = document.querySelector(".stars").children.length;

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
