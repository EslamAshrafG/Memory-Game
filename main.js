"use strict";
const cards = Array.from(document.querySelectorAll(".icon-card"));
const tries = document.querySelector(".n_tries");
const cardsMain = document.querySelector(".game-window");
const cardsContainer = cardsMain.querySelector(".container");
const messageWindow = document.querySelector(".message-window");
const messageText = document.querySelector(".message-window .message");
const closeMsgBtn = document.querySelector(".close-window");
const recordsDiv = document.querySelector(".record");
const triesRecord = recordsDiv.querySelector(".tries_record");
const timeRecord = recordsDiv.querySelector(".time_record");
const NUMBER_OF_TRIES = 20;
const NUMBER_OF_CARDS = 10;
let timerSeconds = 0;
const stateRecord = {
  bestTime: 0,
  bestTries: 0,
};
let numberOfTries;
let checkedCards = [];
let showedCards = 0;
// console.log(cards, tries, cardsMain);

function initShowAllCards() {
  cards.forEach((card) => card.classList.add("correct"));
  setTimeout(
    () => cards.forEach((card) => card.classList.remove("correct")),
    10000
  );
}

function getRecord() {}

function updateRecord() {}

function displayRecord() {
  triesRecord.textContent = stateRecord.bestTries;
  timeRecord.textContent = stateRecord.bestTime;
}

function toggleMessageWindow() {
  messageWindow.classList.toggle("show_window");
}

function makeWinWindow() {
  messageWindow.style.cssText = `
      background-color: cyan;
      color: black;
  `;
}

function makeloseWindow() {
  messageWindow.style.cssText = `
    background-color: crimson;
    color: white;
  `;
}

function showMessage(win = true) {
  const msg = win
    ? `✔️ Winner! You choosed All identical cards 😊`
    : `❌ Loser! You don't have any tries left. Try again to train your bad Memory👎🏻.`;
  if (win) makeWinWindow();
  if (!win) makeloseWindow();

  messageText.textContent = msg;
  toggleMessageWindow();
}

function displayTries() {
  tries.textContent = numberOfTries;
}

function checkEqualCards(card1, card2) {
  return card1.isEqualNode(card2);
}

function showSelectedCard(ele) {
  ele.classList.add("checked");
}

function hideSelectedCard(ele) {
  ele.classList.remove("checked");
}

function shuffleCards() {
  cardsContainer.innerHTML = "";
  cards.sort((a, b) => 0.5 - Math.random());
  cards.forEach((card) => {
    cardsContainer.appendChild(card);
    card.classList.remove("correct");
    card.classList.remove("checked");
  });
}

function init() {
  numberOfTries = NUMBER_OF_TRIES;
  showedCards = 0;
  timer = 0;
  displayTries();
  shuffleCards();
  initShowAllCards();
}

const timer = function () {
  setInterval(() => {
    timerSeconds++;
    console.log(timerSeconds);
  }, 1000);
};

init();

// Start time record
setTimeout(() => {
  timer();
}, 10000);

closeMsgBtn.addEventListener("click", () => {
  toggleMessageWindow();
});

cardsContainer.addEventListener("click", function (e) {
  // Select Clicked card
  const card = e.target.closest(".icon-card");

  // Guard condition to make this works only with valid and unchecked card
  if (
    !card ||
    card.classList.contains("checked") ||
    card.classList.contains("correct") ||
    !numberOfTries
  )
    return;

  // Show it's content
  showSelectedCard(card);

  // Add the card to be compared to another one
  checkedCards.push(card);

  // Check if both clicked cards are identical
  if (
    checkedCards.length === 2 &&
    checkEqualCards(checkedCards[0], checkedCards[1])
  ) {
    showedCards++;

    // Check if all cards were showed
    if (showedCards === NUMBER_OF_CARDS) {
      // show win message
      showMessage();

      // Update state record
      stateRecord.bestTries = NUMBER_OF_TRIES - numberOfTries;
      stateRecord.bestTime = timerSeconds;
      clearInterval(timer);
      displayRecord();

      // reset the game
      setTimeout(() => {
        init();
      }, 5000);
    }

    // Just remove class "checked" to prevent adding it to checked array and cause a bug
    checkedCards.forEach((card) => {
      hideSelectedCard(card);

      // Add a class to show this card
      card.classList.add("correct");
    });

    // Make sure to empty the checked array
    checkedCards = [];
  }

  if (
    checkedCards.length === 2 &&
    !checkEqualCards(checkedCards[0], checkedCards[1])
  ) {
    // Hanlde tries
    numberOfTries--;
    displayTries();

    if (numberOfTries === 0) {
      showMessage(false);
      setTimeout(() => {
        init();
      }, 5000);
    }

    // Show both cards to help player and then hide them
    checkedCards.forEach((card) => {
      showSelectedCard(card);
      setTimeout(() => hideSelectedCard(card), 1000);
    });

    // Make sure to empty the checked array
    checkedCards = [];
  }

  // Make sure to empty the checked array
  if (checkedCards.length >= 2) {
    checkedCards = [];
  }
});
