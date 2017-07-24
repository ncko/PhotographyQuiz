"use strict";
(function($){
  
  $(function(){
    
    $('.js-start-btn').on('click', startQuiz);
    
    $('.js-quiz-form').submit( event => {
      event.preventDefault();
      submitAnswer();
    } );
    
    $('.js-next-question-btn').on('click', nextQuestion);
    
    $('.js-view-score-btn').on('click', showResults);
    
    $('.js-try-again-btn').on('click', tryAgain);
    
  });




  /*
   *  QUIZ is a module that handles the quiz logic
   */
  const QUIZ = (function() {

    let questions = null;
    let score = null;
    let currentQuestionIndex = null;
    let userAnswers = null



    /*
     * start the quiz with a clean slate
     */
    function initializeQuiz( newQuestions ) {
        questions = newQuestions;
        score = 0;
        currentQuestionIndex = 0;
        userAnswers = [];
    }


    /*
     * Return an object with the current question's text
     * and possible answers
     */
    function getCurrentQuestion() {
        // return undefined if there are no more questions
        if (!questions[currentQuestionIndex]) return;

        // return a clone of the currentQuestion object
        // so users can't change it
        return {
            questionText: questions[currentQuestionIndex].questionText,
            answers: questions[currentQuestionIndex].answers
        };
    }


    /*
     * return the total number of correct answers
     */
    function getScore() {
        return score;
    }


    /*
     * Return the order of the current question relative to
     * the total number of questions
     */
    function getProgress() {
        return currentQuestionIndex + 1;
    }


    /*
     * Return the total number of questions in the quiz
     */
    function getTotalNumberOfQuestions() {
        return questions.length;
    }


    /*
     *  Take an answer
     *  - record the user's answer to userAnswers[]
     *  - increment the score if it is correct
     *  - move the current state to the next question (users can't skip questions)
     *  - return a bool indicating if the answer is correct
     */
    function submitAnswer(answer) {
        // if they don't give an answer, do nothing
        // 0 is a valid answer, so if(!answer) doesn't work
        if (answer === undefined) return;
        
        let currentQuestion = questions[currentQuestionIndex];
        let answerIsCorrect = (answer === currentQuestion.correctAnswer);
      
        // keep a record of the user's answers
        userAnswers.push({
          userAnswer: currentQuestion.answers[answer],
          correctAnswer: currentQuestion.answers[currentQuestion.correctAnswer],
          correct: answerIsCorrect
        });
      
        if (answerIsCorrect) score++;
        currentQuestionIndex++;
        return answerIsCorrect;
    }
    
    
    /*
     *  return the previous question's userAnswer record
     */
     function getPreviousAnswer() {
       let previousAnswer = userAnswers[ currentQuestionIndex-1 ];
       return {
         userAnswer: previousAnswer.userAnswer,
         correctAnswer: previousAnswer.correctAnswer,
         correct: previousAnswer.correct
       };
     }


    return {
        init: initializeQuiz,
        getCurrentQuestion: getCurrentQuestion,
        submitAnswer: submitAnswer,
        getScore: getScore,
        getProgress: getProgress,
        getTotalNumberOfQuestions: getTotalNumberOfQuestions,
        getPreviousAnswer: getPreviousAnswer
    };

  })();
  
  const QUESTIONS = [

        {
            questionText: "The ISO or Gain setting adjusts what feature of the camera?",
            answers: [ "The size of the aperture",
                       "The sensitivity of the sensor",
                       "The zooming speed",
                       "The focus assist" ],
            correctAnswer: 1
        },

        {
            questionText: "More ISO or Gain introduces what into the image?",
            answers: [ "Image noise (graininess)",
                       "Lens flares",
                       "Color contrast",
                       "Warmth" ],
            correctAnswer: 0
        },

        {
            questionText: "Depth of Field refers to what?",
            answers: [ "The distance between the closest and furthest object in focus",
                       "The angle of view between the left and right extremes of your image at a given focal length",
                       "The amount of refraction of light over long distances",
                       "The range of saturation of color within an image" ],
            correctAnswer: 0
        },

        {
            questionText: "The 3 elements of the exposure triangle are",
            answers: [ "ISO (or Gain), Aperture and Shutter speed",
                       "ISO, White Balance and Aperture",
                       "Aperture, White Balance and Shutterspeed",
                       "ISO, Aperture, and Focal Length" ],
            correctAnswer: 0
        },

        {
            questionText: "Which of the following f-stops cause the brightest image?",
            answers: [ "f/1.8",
                       "f/3.5",
                       "f/5.6",
                       "f/11" ],
            correctAnswer: 0
        },

        {
            questionText: "Which of the following f-stops creates the most shallow depth of field?",
            answers: [ "f/1.8",
                       "f/3.5",
                       "f/5.6",
                       "f/11" ],
            correctAnswer: 0
        },

        {
            questionText: "Adjusting your shutter speed to be slower affects the image in which way?",
            answers: [ "Brighter image with more motion blur",
                       "Brighter image with less motion blur",
                       "Darker image with more motion blur",
                       "Darker image with less motion blur" ],
            correctAnswer: 0
        },

        {
            questionText: "Which of the following accurately describes the rule of thirds?",
            answers: [ "The rule of thirds divides the image into a 3x3 grid and prescribes placing a subject in the intersections of the grid, placing the horizon on the top or bottom third of the image, or allowing linear features in the image to flow from section to section.",
                       "The rule of thirds means always having consideration for the foreground, middle-ground and background of an image.",
                       "The rule of thirds refers shooting a subject with 3 primary focus lengths, typically 35mm, 50mm and 80mm.",
                       "The rule of thirds refers to a composition style that groups subjects within an image into groups of three." ],
            correctAnswer: 0
        },

        {
            questionText: "On some cameras, the aperture setting is called",
            answers: [ "The Iris",
                       "The Gain",
                       "The Cornea",
                       "The Pupil" ],
            correctAnswer: 0
        },

        {
            questionText: "Lead space refers to:",
            answers: [ "The room in front of a subject facing to the left or right of the image",
                       "The space between you and the tripod",
                       "The amount of room above a subjects head",
                       "The amount of space between the leading subject and the background subject" ],
            correctAnswer: 0
        }
    ];
  



  /*
   *  - initialize the quiz module
   *  - make sure the scoreboard is accurate
   *  - hide the start section
   *  - show the first question
   */
  function startQuiz() {
    // initialize quiz 
    QUIZ.init( QUESTIONS );
    
    // populate the first question
    nextQuestion();
    
    // make sure the scoreboard is accurate
    updateScore();
    
    // hide the start section
    $('.js-start-section').hide();
    
    // show the quiz section
    $('.js-quiz-section').show();
  }
  
  /*
   *  - if the user has chosen an answered
   *    - submit the answer to the quiz module
   *    - update the scoreboard
   *    - show the user feedback on their answer
   */
  function submitAnswer(){
    let questionIsAnswered = checkAnswer();
    
    if (questionIsAnswered) {
      updateScore();
      showFeedback();
    }
  }
  
  /*  - grab the answer from the DOM and clear radio buttons
   *  - If the user has selected an answer 
   *    - submit it to the quiz module
   *    - return true
   *  - else
   *    - return undefined/false
   */
  function checkAnswer(){
    let selectedRadioButton = $('.js-quiz-form').find('input:radio:checked');
    let selectedAnswer = selectedRadioButton.val();
    
    // if they haven't answered, then do nothing
    if (!selectedAnswer) return;
    
    // get the selected answer and clear the radio buttons
    selectedAnswer = parseInt( selectedAnswer );
    selectedRadioButton.prop('checked', false);
    
    QUIZ.submitAnswer( selectedAnswer );
    
    return true;
  }
  
  /*
   *  tell the user what their current score is
   */
  function updateScore(){
    let currentScore = QUIZ.getScore();
    let currentIncorrect = QUIZ.getProgress() - (currentScore + 1);
    $('.js-score__correct').text(`${currentScore} Correct`);
    $('.js-score__incorrect').text(`${currentIncorrect} Incorrect`);
  }
  
  /*
   *  If the given answer was correct
   *  - Update the feedback heading 
   *  - give the feedback heading a class of .success
   *  - Show the user their answer with a class of .success
   *  else
   *  - Update the feedback heading 
   *  - give the feedback heading a class of .fail
   *  - show the user their answer with a class of .fail
   *  - show the user the correct answer with a class of .success
   *  Show the "next question" if there is a next question
   *  Show the "view score" button otherwise
   */
  function showFeedback(){
    $('.js-quiz-form').hide();
    
    let answerIsCorrect = QUIZ.getPreviousAnswer().correct;
    let feedbackHeading = $('.js-feedback').find('h3');
    let yourAnswerHeading = $('.js-your-answer__heading');
    let yourAnswerText = $('.js-your-answer__answer');
    let userAnswer = QUIZ.getPreviousAnswer()
    let correctAnswerHeading = $('.js-correct-answer__heading');
    let correctAnswerText = $('.js-correct-answer__answer');
    
    if (answerIsCorrect) {
      feedbackHeading.text( 'You got it!' );
      feedbackHeading.removeClass('fail').addClass('success');
      
      yourAnswerHeading.removeClass('fail').addClass('success').show();
      yourAnswerText.text( QUIZ.getPreviousAnswer().userAnswer ).show();
      
      correctAnswerHeading.hide();
      correctAnswerText.hide();
    } else {
      feedbackHeading.text( 'Ouch. Wrong answer.' );
      feedbackHeading.removeClass('success').addClass('fail');
      
      yourAnswerHeading.removeClass('success').addClass('fail').show();
      yourAnswerText.text( QUIZ.getPreviousAnswer().userAnswer ).show();
      
      correctAnswerHeading.show();
      correctAnswerText.text( QUIZ.getPreviousAnswer().correctAnswer ).show();
    }
  

    // if there is a next question
    if (QUIZ.getCurrentQuestion()) {
      // show the next question button
      $('.js-next-question-btn').show();
    } else { // if there is no next question
      // show the view score button
      $('.js-view-score-btn').show();
    }
    
    $('.js-feedback').show();
  }
  
  /*
   *  - Update the progress heading
   *  - show the quiz form
   *  - populate the form with the current question
   *  - hide feedback div
   *  - show submit button
   *  - hide the next-question button 
   */
  function nextQuestion() {
    let progress = QUIZ.getProgress();
    let totalQuestions = QUIZ.getTotalNumberOfQuestions();
    
    // tell the user what question they're on 
    $('.js-progress').text(`Question ${progress} of ${totalQuestions}`);
    
    // hide the feedback section
    $('.js-quiz-form').show();
    $('.js-feedback').hide();
    
    // populate the form with the next question
    populateQuestion( QUIZ.getCurrentQuestion() );
    
    // show the submit button
    $('.js-submit-answer-btn').show();
    
    // hide next question button
    $('.js-next-question-btn').hide();
  }
  
  /*
   * - hide the quiz section
   * - show the score with a class of .success, .warning or .fail
   * - show the score section
   */
  function showResults() {
    // hide the quiz section
    $('.js-quiz-section').hide();
    
    // chose .success, .warning or .fail to put on the results heading
    let scorePercentage = QUIZ.getScore() / QUIZ.getTotalNumberOfQuestions();
    let resultsClass = '';
    
    if (scorePercentage >= 0.8) {
      resultsClass = 'success';
    } else if (scorePercentage > 0.5) {
      resultsClass = 'warning';
    } else {
      resultsClass = 'fail';
    }
    
    // populate the score section with the results
    let score = QUIZ.getScore();
    let totalQuestions = QUIZ.getTotalNumberOfQuestions();
    
    $('.js-view-score-section').find('h2').addClass(resultsClass).text(`${score}/${totalQuestions}`);
    
    $('.js-results').text(`You got ${score} correct out of ${totalQuestions} questions. Would you like to try again?`);
    
    // show the score section
    $('.js-view-score-section').show();
  }
  
  /*
   *  - hide the view score section
   *  - hide the view score button
   *  - remove .success/.warning/.fail classes from the results heading 
   *  - restart the quiz
   */
  function tryAgain() {
    // hide view score section
    $('.js-view-score-section').hide();
    $('.js-view-score-btn').hide();
    
    // make sure the score has all of it's color classes removed
    $('.js-view-score-section').find('h2')
    .removeClass('warning')
    .removeClass('success')
    .removeClass('fail');
    
    // start the quiz
    startQuiz();
  }
  
  /*
   *  populate the form with the given question
   */
  function populateQuestion(question) {
    let form = $('.js-quiz-form');

    form.find('h3').text(question.questionText);
    
    form.find('label').each( (index, element) => {
      $(element).text( question.answers[index] );
    } );
  }
  
})(jQuery);