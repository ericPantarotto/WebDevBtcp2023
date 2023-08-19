var randomNumber1 = Math.ceil(Math.random() * 6);
var randomNumber2 = Math.ceil(Math.random() * 6);

document
  .querySelector(".dice")
  .lastElementChild.setAttribute(
    "src",
    "./images/dice" + randomNumber1 + ".png"
  );

document
  .querySelectorAll(".dice")[1]
  .lastElementChild.setAttribute(
    "src",
    "./images/dice" + randomNumber2 + ".png"
  );
if (randomNumber1 == randomNumber2) {
    document.getElementsByTagName("h1")[0].textContent = "Draw!";
} else if (randomNumber1 > randomNumber2) {
    document.getElementsByTagName("h1")[0].textContent = "⚽ Player 1 wins";
} else {
    document.getElementsByTagName("h1")[0].textContent = "Player 2 wins ⚽";   
}