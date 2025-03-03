let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let spansContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let ansContainer = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsCont = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let optionsContainer = document.querySelector(".options");
let langName = document.querySelector(".current span");
let chooseLang = document.querySelector(".select .current");
let options = document.querySelectorAll(".option");
let lang = document.querySelector(".lang");
let start = document.querySelector(".lang .start-but");
let choose = document.querySelector(".lang .choose-but");

// Set Choosing language

chooseLang.addEventListener("click", (event) => {
  if (event.target.classList.contains("show")) {
    lang.classList.add("show-list");
  }
  if (event.target.classList.contains("hide")) {
    lang.classList.remove("show-list");
  }
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    // Add selected class or remove
    if (!option.classList.contains("selected")) {
      options.forEach((option) => option.classList.remove("selected"));
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  });
  // Choose button
  choose.addEventListener("click", () => {
    if (option.classList.contains("selected")) {
      langName.innerHTML = option.dataset.lang;
      lang.classList.remove("show-list");
    }
  });
});

// Start button
start.addEventListener("click", () => {
  getQuestions(langName.innerHTML);
  lang.remove();
});

// Set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownIntervel;

function getQuestions(language) {
  let myData = fetch(`html_questions_${language}.json`);

  myData
    .then((response) => {
      let myJsonData = response.json();
      return myJsonData;
    })
    .then((questions) => {
      let qCount = questions.length;

      // Creat bullets count
      createBullets(qCount);

      // Add data
      addData(questions[currentIndex], qCount);

      // Start countdown
      countdown(6, qCount);

      // Click on submit
      submitButton.onclick = () => {
        // Get right answer
        let answers = document.getElementsByName("question");
        answers.forEach((answer) => {
          if (answer.checked) {
            if (
              answer.dataset.answer === questions[currentIndex].right_answer
            ) {
              rightAnswers++;
            }
          }
        });

        // Increase index
        currentIndex++;

        // Remove old question
        quizArea.innerHTML = "";
        ansContainer.innerHTML = "";

        // Add next question
        addData(questions[currentIndex], qCount);

        // Start countdown
        clearInterval(countdownIntervel);
        countdown(6, qCount);

        // Handle bullets class
        handleBullets();

        // Show results
        showResults(qCount);
      };
    });
}

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create spans
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");

    if (i === 0) {
      span.className = "on";
    }

    // Append bullets to spans container
    spansContainer.appendChild(span);
  }
}

function addData(obj, count) {
  if (currentIndex < count) {
    // Creat question
    let question = document.createElement("h2");

    // Create question text
    let questionText = document.createTextNode(obj.title);

    // Append text
    question.appendChild(questionText);

    // Append h2 to quizarea
    quizArea.appendChild(question);

    let shuffledArray = shuffleAnswers(obj);
    // Create the answers
    for (i = 1; i <= 4; i++) {
      // Create answer div
      let answer = document.createElement("div");
      answer.className = "answer";

      // Create input
      let input = document.createElement("input");
      input.type = "Radio";
      input.name = "question";
      input.id = `answer_${shuffledArray[i]}`;
      input.dataset.answer = obj[`answer_${shuffledArray[i]}`];

      // Create first options selected
      if (i === 1) {
        input.checked = true;
      }

      // Create label
      let label = document.createElement("label");
      label.htmlFor = `answer_${shuffledArray[i]}`;
      label.innerText = obj[`answer_${shuffledArray[i]}`];

      // Append answer, input, label
      answer.appendChild(input);
      answer.appendChild(label);
      ansContainer.appendChild(answer);
    }
  }
}

function shuffleAnswers(answers) {
  let shuffledArr = [],
    count = 1;
  for (let key in answers) {
    if (key.startsWith("answer")) {
      shuffledArr.push(count++);
    }
  }
  // Shuffle the keys array using Fisher-Yates algorithm
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }

  return shuffledArr;
}

function handleBullets() {
  [...document.querySelectorAll(".bullets .spans span")].forEach(
    (span, index) => {
      if (currentIndex === index) {
        span.classList = "on";
      }
    }
  );
}

function showResults(count) {
  if (currentIndex === count) {
    quizArea.remove();
    ansContainer.remove();
    submitButton.remove();
    bullets.remove();

    let results =
      rightAnswers > count / 2 && rightAnswers < count
        ? `<span class="good">Good</span>, ${rightAnswers} From ${count}`
        : rightAnswers === count
        ? `<span class="perfect">Perfect</span>, All answers are right`
        : `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;

    resultsCont.innerHTML = results;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownIntervel = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;

      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownIntervel);
        submitButton.click();
      }
    }, 1000);
  }
}
