/*
 * Create a list that holds all of your cards
 */
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

function display(deckArray) {
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

const deckArray = buildDeckArray();
display(deckArray);

const openCardsList = [];

const moveCounter = 0;

const deckEl = document.querySelector(".deck");
deckEl.addEventListener("click", respondToTheClick);

function respondToTheClick(event) {
  if (event.target.nodeName == "LI") {
    const cardEl = event.target;
    if (isCardDisplayed(cardEl)) {
      return;
    }
    displayCard(cardEl);
    addCardToOpenCardsList(cardEl);
    setTimeout(openOrHideCards, 1500);
  }
}

// operations on a card Element

function isCardDisplayed(cardEl) {
  cardEl.classList.contains("show");
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

function openOrHideCards() {
  if (openCardsList.length == 2) {
    if (openCardsMatch()) {
      openCardsInOpenCardsList();
    } else {
      hideCardsInOpenCardsList();
    }
    removeCardsFromOpenCardsList();
  }
}

function addCardToOpenCardsList(cardEl) {
  openCardsList.push(cardEl);
}

function hideCardsInOpenCardsList() {
  console.log("hiding cards...");
  openCardsList.forEach(cardEl => {
    hideCard(cardEl);
  });
}

function removeCardsFromOpenCardsList() {
  openCardsList.splice(0, openCardsList.length);
}

function openCardsInOpenCardsList() {
  openCardsList.forEach(cardEl => {
    openCard(cardEl);
  });
}

function openCardsMatch() {
  return (
    openCardsList[0].firstChild.classList.value ==
    openCardsList[1].firstChild.classList.value
  );
}

// operation on move counter

function incrementMoves() {
  moveCounter += 1;
}
