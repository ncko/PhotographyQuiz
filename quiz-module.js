"use strict";
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