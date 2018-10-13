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

const deckOfCards = buildDeckArray();

const openCardsList = [];

let movesCount = 0;

// main function

function start() {
  const deckEl = document.querySelector(".deck");
  deckEl.addEventListener("click", respondToTheClick);
  displayAllCardsOfDeck(deckOfCards);
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
  addAStar();
  displayMovesCount();
}

function addAStar() {
  const ulEl = document.querySelector(".stars");
  const liEl = document.createElement("li");
  const iEl = document.createElement("i");
  iEl.classList.add("fa", "fa-star");
  liEl.appendChild(iEl);
  ulEl.appendChild(liEl);
}

function displayMovesCount() {
  const ulEl = document.querySelector(".stars");
  const count = ulEl.childElementCount;
  const spanEl = document.querySelector(".moves");
  spanEl.innerText = count;
}

function resetMovesCounter() {
  const ulEl = document.querySelector(".stars");
  while (ulEl.firstChild) {
    ulEl.removeChild(ulEl.firstChild);
  }
  displayMovesCount();
}

// restart functionnality

function restart() {
  const restartEl = document.querySelector(".restart");
  restartEl.addEventListener("click", respondToRestartClick);
  console.log("restart click");
}

function respondToRestartClick() {
  resetMovesCounter();
  resetGrid();
}

// win the game

function AllCardsMatch() {}

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
