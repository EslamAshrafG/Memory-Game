"use strict";
const cards = Array.from(document.querySelectorAll(".icon-card"));
const tries = document.querySelector(".n_tries");
const cardsMain = document.querySelector(".game-window");
const cardsContainer = cardsMain.querySelector(".container");
const messageWindow = document.querySelector(".message-window");
const messageText = document.querySelector(".message-window .message");
const closeMsgBtn = document.querySelector(".close-window");
let numberOfTries;
let checkedCards = [];
let showedCards = 0;
// console.log(cards, tries, cardsMain);

function initShowAllCards() {
  cards.forEach((card) => card.classList.add("correct"));
  setTimeout(
    () => cards.forEach((card) => card.classList.remove("correct")),
    3000
  );
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
  numberOfTries = 30;
  shuffleCards();
  initShowAllCards();
  displayTries();
}

init();

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
    if (showedCards === 10) {
      showMessage();
      numberOfTries = 30;
      setTimeout(() => {
        toggleMessageWindow();
        shuffleCards();
      }, 10000);
    }
    checkedCards.forEach((card) => {
      // Just remove class "checked" to prevent adding it to checked array and cause a bug
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
      // init();
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
