$(document).ready(function() {
  // event listeners
  $("#remaining-time").hide();
  $("#start").on("click", trivia.startGame);
  $(document).on("click", ".option", trivia.guessChecker);
});

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId: "",

  // questions options and answers data
  questions: {
    q1: "The quantum mechanical model describes electrons as:",
    q2:
      "Heisenberg’s Uncertainty Principle states that the ___ and ___ of an electron cannot be known simultaneously.",
    q3: "There are ___ types of quantum numbers.",
    q4: "The principle quantum number is related to:",
    q5:
      "The different types of subshells and corresponding number of orbitals is:",
    q6: "The magnetic quantum number describes the:",
    q7:
      "The peak wavelengths of radiation of a red-hot and a yellow-hot object are 630 nm and 570 nm respectively. If the red-hot object's temperature is 5000 K, the other's temperature is"
  },
  options: {
    q1: [
      "Particles",
      "Waves",
      "Particles with wave-like properties",
      "Small, hard spheres"
    ],
    q2: [
      "Position, mass",
      "Position, charge",
      "Momentum, speed",
      "Position, momentum"
    ],
    q3: ["2", "4", "11", "6"],
    q4: [
      "The shape of the orbital",
      "The spatial orientation of the orbital",
      "The average distance of the most electron-dense regions from the nucleus",
      "The number of electrons"
    ],
    q5: [
      "S:1, p:3, d:5, f:7",
      "S:2, p:6, d:10, f:14",
      "N:1, l:0, m:0",
      "S:7, p:5, d:3, f:1"
    ],
    q6: [
      "Shape of the orbital",
      "Spatial orientation of the orbital",
      "Average distance of the most electron-dens regions from the nucleus",
      "Number of electrons"
    ],
    q7: ["4000 K", "4500 K", "5000 K", "5500 K"]
  },
  answers: {
    q1: "Particles with wave-like properties",
    q2: "Position, momentum",
    q3: "4",
    q4:
      "The average distance of the most electron-dense regions from the nucleus",
    q5: "S:1, p:3, d:5, f:7",
    q6: "Spatial orientation of the orbital",
    q7: "4500 K"
  },
  // trivia methods
  // method to initialize game
  startGame: function() {
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);

    // show game section
    $("#game").show();

    //  empty last results
    $("#results").html("");

    // show timer
    $("#timer").text(trivia.timer);

    // remove start button
    $("#start").hide();

    $("#remaining-time").show();

    // ask first question
    trivia.nextQuestion();
  },
  // method to loop through and display questions and options
  nextQuestion: function() {
    // timer of 15 seconds per question (session)
    trivia.timer = 20;
    $("#timer").removeClass("danger-zone");
    $("#timer").text(trivia.timer);

    // to prevent timer speed up
    if (!trivia.timerOn) {
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }

    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $("#question").text(questionContent);

    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];

    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key) {
      $("#options").append(
        $('<button class="option btn btn-info btn-lg">' + key + "</button>")
      );
    });
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning: function() {
    // if timer still has time left and there are still questions left to ask
    if (
      trivia.timer > -1 &&
      trivia.currentSet < Object.keys(trivia.questions).length
    ) {
      $("#timer").text(trivia.timer);
      trivia.timer--;
      if (trivia.timer === 4) {
        $("#timer").addClass("danger-zone");
      }
    }
    // the time has run out and increment unanswered, run result
    else if (trivia.timer === -1) {
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $("#results").html(
        "<h3>Out of time! The answer was " +
          Object.values(trivia.answers)[trivia.currentSet] +
          "</h3>"
      );
    }
    // if all the questions have been shown end the game, show results
    else if (trivia.currentSet === Object.keys(trivia.questions).length) {
      // adds results of game (correct, incorrect, unanswered) to the page
      $("#results").html(
        "<h3>Thank you for playing!</h3>" +
          "<p>Correct: " +
          trivia.correct +
          "</p>" +
          "<p>Incorrect: " +
          trivia.incorrect +
          "</p>" +
          "<p>Unaswered: " +
          trivia.unanswered +
          "</p>" +
          "<p>Please play again!</p>"
      );

      // hide game sction
      $("#game").hide();

      // show start button to begin a new game
      $("#start").show();
    }
  },
  // method to evaluate the option clicked
  guessChecker: function() {
    // timer ID for gameResult setTimeout
    var resultId;

    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

    // if the text of the option picked matches the answer of the current question, increment correct
    if ($(this).text() === currentAnswer) {
      // turn button green for correct
      $(this)
        .addClass("btn-success")
        .removeClass("btn-info");

      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $("#results").html("<h3>Correct Answer!</h3>");
    }
    // else the user picked the wrong option, increment incorrect
    else {
      // turn button clicked red for incorrect
      $(this)
        .addClass("btn-danger")
        .removeClass("btn-info");

      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $("#results").html(
        "<h3>Better luck next time! " + currentAnswer + "</h3>"
      );
    }
  },
  // method to remove previous question results and options
  guessResult: function() {
    // increment to next question set
    trivia.currentSet++;

    // remove the options and results
    $(".option").remove();
    $("#results h3").remove();

    // begin next question
    trivia.nextQuestion();
  }
};
