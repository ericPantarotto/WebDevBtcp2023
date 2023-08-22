//NOTE: Selecting items with jQuery

// $("document").ready(function () {
//   $("h1").css("color", "red");
// });

$("h1");
$("h1.title"); //h1 with class title
$("#header title"); //h1 nested in a div with id #header

//querySelectorAll
$("button");

//NOTE: manipulating sytles with jQuery
// $("h1").css("color", "red");
console.log($("h1").css("font-size"));
console.log($("h1").css("color"));
// $("h1").css("font-size", "5rem");
$("h1").addClass("big-title margin-50");
// $("h1").removeClass("big-title");
console.log($("h1").hasClass("big-title margin-50"));

//NOTE: manipulating text with jQuery
$("h1").text("Bye");
$("button").html("<em>Don't Click!</em>");

//NOTE: manipulating attributes with jQuery
// console.log($("img").attr("src"));
console.log($("a").attr("href"));
$("a").attr("href", "https://www.yahoo.com");
console.log($("h1").attr("class"));

//NOTE: Add event listerners  with jQuery
$("h1").click(() => {
  $("h1").css("color", "purple");
});

$("button").click(() => {
  $("h1").css("color", "blue");
});

$("input").keydown(function (e) {
  console.log(e.key);
});

$("body").keydown((e) => {
  $("h1").text(e.key);
});

$("h1").on("mouseover", () => {
  $("h1").css("color", "green");
});

//NOTE: Adding and Removing Elements with jQuery
// $("h1").before("<button>New</button>");
// $("h1").after("<button>New</button>");
$("h1").prepend("<button>New</button>");
$("h1").append("<button>New</button>");

// $("button").remove();

//NOTE:Website Animations with jQuery
$("button").click(() => {
  //   $("h1").hide();
  //   $("h1").toggle();
  //   $("h1").fadeOut();
  $("h1").fadeToggle();
});

$("h2").click(() => {
  $("h1").fadeIn();
});

$("h3.slide-up").click(() => {
  $("h1").slideUp();
});
$("h3.slide-down").click(() => {
  $("h1").slideDown();
});
$("h3.slide-toggle").click(() => {
  $("h1").slideToggle();
});

$("h3.animate").click(() => {
  $("h1").animate({
    margin: "15%",
    opacity: "0.5",
    fontSize: "1rem",
  });
});

$("h3.chained").click(() => {
  $("h1").slideUp().slideDown().animate({
    margin: "15%",
    opacity: "0.5",
    fontSize: "1rem",
  });
});
