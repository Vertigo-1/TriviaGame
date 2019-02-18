$(document).ready(function() {
  // event listeners
  $("#remaining-time").hide();
  $("#start").on("click", trivia.startGame);
  $(document).on("click", ".option", trivia.guessChecker);
});

//session:
var trivia = {
  incorrect: 0,
  unanswered: 0,
  correct: 0,
  currentSet: 0,
  timerOn: false,
  timerId: "",
  timer: 15,

  // questions, options and answers data:
  questions: {
    q1: "What must we do to make time travel possible?",
    q2: "The quantum mechanical model describes electrons as:",
    q3:
      "Heisenberg’s Uncertainty Principle states that the ___ and ___ of an electron cannot be known simultaneously.",
    q4: "There are ___ types of quantum numbers.",
    q5: "The principle quantum number is related to:",
    q6:
      "The different types of subshells and corresponding number of orbitals is:",
    q7: "The magnetic quantum number describes the:",
    q8:
      "The peak wavelengths of radiation of a red-hot and a yellow-hot object are 630 nm and 570 nm respectively. If the red-hot object's temperature is 5000 K, the other's temperature is"
  },
  options: {
    q1: [
      "We have to reach a speed of 100,000 km/h",
      "We have to crook the space-time",
      "We have to reach a speed of 200,000 km/h",
      "We have to reach a speed of 300,000 km/h",
      "We have to twist the space-time"
    ],
    q2: [
      "Particles",
      "Waves",
      "Particles with wave-like properties",
      "Small, hard spheres"
    ],
    q3: [
      "Position, mass",
      "Position, charge",
      "Momentum, speed",
      "Position, momentum"
    ],
    q4: ["2", "4", "11", "6"],
    q5: [
      "The shape of the orbital",
      "The spatial orientation of the orbital",
      "The average distance of the most electron-dense regions from the nucleus",
      "The number of electrons"
    ],
    q6: [
      "S:1, p:3, d:5, f:7",
      "S:2, p:6, d:10, f:14",
      "N:1, l:0, m:0",
      "S:7, p:5, d:3, f:1"
    ],
    q7: [
      "Shape of the orbital",
      "Spatial orientation of the orbital",
      "Average distance of the most electron-dens regions from the nucleus",
      "Number of electrons"
    ],
    q8: ["4000 K", "4500 K", "5000 K", "5500 K"]
  },
  answers: {
    q1: "We have to crook the space-time",
    q2: "Particles with wave-like properties",
    q3: "Position, momentum",
    q4: "4",
    q5:
      "The average distance of the most electron-dense regions from the nucleus",
    q6: "S:1, p:3, d:5, f:7",
    q7: "Spatial orientation of the orbital",
    q8: "4500 K"
  },

  startGame: function() {
    //what the startgame function, tied to the start button does when pressed:
    //resets stats and timer:
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);

    //shows game (questions, etc)
    $("#game").show();
    //shows results on option selection
    $("#results").html("");
    $("#timer").text(trivia.timer);
    //hides trivia info
    $("#TriviaInfo").hide();
    //hides start button
    $("#start").hide();
    //shows timer
    $("#remaining-time").show();
    trivia.nextQuestion();
  },
  // method to loop through and display questions and options
  nextQuestion: function() {
    // timer of 15 seconds per question (session)
    trivia.timer = 15;
    $("#timer").removeClass("danger-zone");
    $("#timer").text(trivia.timer);

    // to prevent timer speed up
    if (!trivia.timerOn) {
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $("#question").text(questionContent);

    var questionOptions = Object.values(trivia.options)[trivia.currentSet];

    $.each(questionOptions, function(index, key) {
      $("#options").append(
        $('<button class="option btn btn-info btn-lg">' + key + "</button>")
      );
    });
  },
  timerRunning: function() {
    if (
      trivia.timer > -1 &&
      trivia.currentSet < Object.keys(trivia.questions).length
    ) {
      $("#timer").text(trivia.timer);
      trivia.timer--;
      //activate danger zone when less then 5 seconds left
      if (trivia.timer === 4) {
        $("#timer").addClass("danger-zone");
      }
    } else if (trivia.timer === -1) {
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 3000);
      $("#results").html(
        "<h3>Out of time! The answer was: " +
          Object.values(trivia.answers)[trivia.currentSet] +
          "</h3>"
      );
    } else if (trivia.currentSet === Object.keys(trivia.questions).length) {
      $("#results").html(
        "<h2>Thank you for playing!</h2>" +
          "<p>Correct: " +
          trivia.correct +
          "</p>" +
          "<p>Incorrect: " +
          trivia.incorrect +
          "</p>" +
          "<p>Unaswered: " +
          trivia.unanswered +
          "</p>" +
          "<p>Hit 'Start Game' to try Again!</p>"
      );

      // hide game section
      $("#game").hide();

      // show start button to begin a new game
      $("#start").show();
    }
  },

  guessChecker: function() {
    var resultId;
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

    if ($(this).text() === currentAnswer) {
      $(this)
        .addClass("btn-success")
        .removeClass("btn-info");

      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 5000);
      $("#results").html("<h3>Correct!</h3>");
    } else {
      $(this)
        .addClass("btn-danger")
        .removeClass("btn-info");

      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 5000);
      $("#results").html(
        "<h3>Incorrect! The answer we were looking for was: " +
          currentAnswer +
          "</h3>"
      );
    }
  },

  guessResult: function() {
    trivia.currentSet++;
    $(".option").remove();
    $("#results h3").remove();
    trivia.nextQuestion();
  }
};
