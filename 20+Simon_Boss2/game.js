var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];

var userClickedPattern = [];

var started = false;
var level = 0;

$("body").keydown((e) => {
  // console.log(e.key);
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$("div.btn").click((event) => {
  //console.log($(this)); //REVIEW: window element
  var userChosenColour = event.currentTarget.id;
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);

  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  level++;
  $("h1").text("Level " + level);
  playSound(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
}

function playSound(name) {
  var audio = new Audio("./sounds/" + name + ".mp3");
  audio != null ? audio.play() : null;
}

function animatePress(currentColour) {
  var button = $("#" + currentColour);
  button.addClass("pressed");

  setTimeout(function () {
    button.removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    console.log("OK");
    if (currentLevel + 1 === gamePattern.length) {
      console.log("Sequence finished");

      setTimeout(() => {
        userClickedPattern = [];
        nextSequence();
      }, 1000);
    }
  } else {
    console.log("WRONG");
    playSound("wrong");
    $("body").addClass("game-over");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 100);

    $("#level-title").text("Game Over, Press Any Key to Restart");

    startOver();
  }
}

function startOver() {
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  level = 0;
}

// function nextSequence(callback) {
//   var randomNumber = Math.floor(Math.random() * 4);
//   var randomChosenColour = buttonColours[randomNumber];
//   gamePattern.push(randomChosenColour);

//   callback(randomChosenColour);
// }

// function doSth() {
//   nextSequence(function (element) {
//     console.log($("#" + element));
//     $("#" + element)
//       .fadeIn(100)
//       .fadeOut(100)
//       .fadeIn(100);

//     makeSound(element);
//   });
// }

// function makeSound(key) {
//   var audio;

//   audio = new Audio("./sounds/" + key + ".mp3");

//   audio != null ? audio.play() : null;
// }
