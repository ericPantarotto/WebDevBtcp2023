//Detect button press
document.querySelectorAll("button").forEach((element) => {
  element.addEventListener("click", function () {
    var buttonInnerHTML = element.innerHTML;
    makeSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);
  });
});

//Detect key press
document.addEventListener("keydown", function (event) {
  console.log(event);

  makeSound(event.key);

  buttonAnimation(event.key);
});

function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  activeButton.classList.add("pressed");

  setTimeout(() => {
    activeButton.classList.remove("pressed")
  }, 200);
}

function makeSound(key) {
  var audio;
  switch (key) {
    case "w":
      audio = new Audio("./sounds/tom-1.mp3");
      break;
    case "a":
      audio = new Audio("./sounds/tom-2.mp3");
      break;
    case "s":
      audio = new Audio("./sounds/tom-3.mp3");
      break;
    case "d":
      audio = new Audio("./sounds/tom-4.mp3");
      break;
    case "j":
      audio = new Audio("./sounds/crash.mp3");
      break;
    case "k":
      audio = new Audio("./sounds/kick-bass.mp3");
      break;
    case "l":
      audio = new Audio("./sounds/snare.mp3");
      break;

    default:
      console.log(key + " doesn't play anything!");
      break;
  }
  //   if (audio != null) {
  //     audio.play();
  //     }
  audio != null ? audio.play() : null;
}

// document.querySelector("button").addEventListener("click", function () {
//   alert("got clicked!");
// });

// function handleClick() {
//   alert("got clicked!");
// }

// document.querySelectorAll("button").forEach((element) => {
//   element.addEventListener("click", function () {

//     var buttonInnerHTML = element.innerHTML;
//     console.log(buttonInnerHTML);
//     var audio;
//     switch (buttonInnerHTML) {
//       case "w":
//         audio = new Audio("./sounds/tom-1.mp3");
//         break;
//       case "a":
//         audio = new Audio("./sounds/tom-2.mp3");
//         break;
//       case "s":
//         audio = new Audio("./sounds/tom-3.mp3");
//         break;
//       case "d":
//         audio = new Audio("./sounds/tom-4.mp3");
//         break;
//       case "j":
//         audio = new Audio("./sounds/crash.mp3");
//         break;
//       case "k":
//         audio = new Audio("./sounds/kick-bass.mp3");
//         break;
//       case "l":
//         audio = new Audio("./sounds/snare.mp3");
//         break;

//       default:
//         console.log(buttonInnerHTML);
//         break;
//     }
//     audio.play();
//   });
// });

// document.querySelectorAll("button").forEach((element) => {
//   element.addEventListener("click", function () {
//     var audio = new Audio("./sounds/crash.mp3");
//     audio.play();
//       console.log(element);
//       this.style.color = "white";
//   });
// });

// for (let index = 0; index < document.querySelectorAll(".drum").length; index++) {
//   document.querySelectorAll("button")[index].addEventListener("click", function () {
//     alert("got clicked!");
//   });
// }
