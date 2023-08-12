const section = document.querySelector("section");
const clickCount = document.getElementById("click-count");
const bestScoreElement = document.getElementById("best-score");
let MOVES = 0;

function getData() {
  return [
    { imgSrc: "./images/banana.png", name: "banana" },
    { imgSrc: "./images/chocolate.png", name: "chocolate" },
    { imgSrc: "./images/coffee.png", name: "coffee" },
    { imgSrc: "./images/donut.png", name: "donut" },
    { imgSrc: "./images/icecream.png", name: "icecream" },
    { imgSrc: "./images/muffin.png", name: "muffin" },
    { imgSrc: "./images/pizza.png", name: "pizza" },
    { imgSrc: "./images/taco.png", name: "taco" },
    { imgSrc: "./images/banana.png", name: "banana" },
    { imgSrc: "./images/chocolate.png", name: "chocolate" },
    { imgSrc: "./images/coffee.png", name: "coffee" },
    { imgSrc: "./images/donut.png", name: "donut" },
    { imgSrc: "./images/icecream.png", name: "icecream" },
    { imgSrc: "./images/muffin.png", name: "muffin" },
    { imgSrc: "./images/pizza.png", name: "pizza" },
    { imgSrc: "./images/taco.png", name: "taco" },
  ];
}

section.style.pointerEvents = "none";

window.addEventListener("load", function () {
  const bestScore = getBestScore();
  if (bestScore !== null) {
    bestScoreElement.textContent = `Best Score: ${bestScore}`;
  }
});

function saveBestScore(score) {
  localStorage.setItem("memoryGameBestScore", score);
}

function getBestScore() {
  const bestScore = localStorage.getItem("memoryGameBestScore");
  return bestScore ? parseInt(bestScore) : null;
}

const startGame = document.querySelector(".start");
startGame.addEventListener("click", function () {
  section.style.pointerEvents = "all";
  startGame.disabled = true;
  restart();
});
startGame.addEventListener("click", function () {
  startGame.style.background = "green";
});

startGame.addEventListener("click", function () {
  startGame.style.background = "";
});

function randomize() {
  const cardData = getData();
  const randomized = [];
  while (cardData.length > 0) {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    const randomCard = cardData.splice(randomIndex, 1)[0];
    randomized.push(randomCard);
  }
  return randomized;
}

function restart() {
  MOVES = 0;
  clickCount.textContent = `MOVES: ${MOVES}`;
  const randomized = randomize();
  const cards = document.querySelectorAll(".card");
  for (let i = 0; i < randomized.length; i++) {
    cards[i].classList.remove("toggleCard", "flipped", "matched");
  }
  cardGenerator();
}

const resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", function () {
  restart();
});

function cardGenerator() {
  section.innerHTML = "";
  const cardData = randomize();

  for (let i = 0; i < cardData.length; i++) {
    const item = cardData[i];
    const card = document.createElement("div");
    const face = document.createElement("img");
    const back = document.createElement("div");
    card.classList = "card";
    face.classList = "face";
    back.classList = "back";

    face.src = item.imgSrc;
    card.setAttribute("name", item.name);

    section.append(card);
    card.append(face);
    card.append(back);

    card.addEventListener("click", function (e) {
      const clickedCard = e.target;

      if (
        clickedCard.classList.contains("matched") ||
        clickedCard.classList.contains("flipped")
      ) {
        return;
      }
      MOVES++;
      clickCount.textContent = `MOVES: ${MOVES}`;

      clickedCard.classList.toggle("toggleCard");
      checkCards(e);
    });
  }

  let timeoutId;

  function checkCards(e) {
    const clickedCard = e.target;
    clickedCard.classList.add("flipped");
    const flippedCards = document.querySelectorAll(".flipped");

    if (flippedCards.length >= 2) {
      const allCards = document.querySelectorAll(".card");
      for (let i = 0; i < allCards.length; i++) {
        allCards[i].style.pointerEvents = "none";
      }
    }

    if (flippedCards.length === 2) {
      if (
        flippedCards[0].getAttribute("name") ===
        flippedCards[1].getAttribute("name")
      ) {
        console.log("match");
        for (let i = 0; i < flippedCards.length; i++) {
          const card = flippedCards[i];
          card.classList.remove("flipped");
          card.style.pointerEvents = "none";
          card.classList.add("matched");
        }
        setTimeout(function () {
          const allCards = document.querySelectorAll(".card");
          for (let i = 0; i < allCards.length; i++) {
            allCards[i].style.pointerEvents = "auto";
          }

          const matchedCards = document.querySelectorAll(".matched");
          if (matchedCards.length === cardData.length) {
            const previousBestScore = getBestScore();
            if (previousBestScore === null || MOVES < previousBestScore) {
              saveBestScore(MOVES);
              bestScoreElement.textContent = `Best Score: ${MOVES}`;
            }
          }
        }, 1000);
      } else {
        console.log("wrong");
        for (let i = 0; i < flippedCards.length; i++) {
          const card = flippedCards[i];
          card.classList.remove("flipped");
          card.style.pointerEvents = "none";
          clearTimeout(timeoutId);
          setTimeout(function () {
            card.classList.remove("toggleCard");
          }, 1000);
        }
        setTimeout(function () {
          const allCards = document.querySelectorAll(".card");
          for (let i = 0; i < allCards.length; i++) {
            allCards[i].style.pointerEvents = "auto";
          }
        }, 1000);
      }
    }
  }
}

cardGenerator();
