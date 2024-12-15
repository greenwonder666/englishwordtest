// 單字測驗資料
const vocabularyBank = [
    {
        word: "breakfast",
        options: ["早餐", "午餐", "晚餐", "點心"],
        correct: 0
    },
    {
        word: "student",
        options: ["老師", "學生", "醫生", "警察"],
        correct: 1
    },
    {
        word: "weather",
        options: ["天氣", "季節", "時間", "日期"],
        correct: 0
    },
    {
        word: "family",
        options: ["朋友", "同學", "家庭", "鄰居"],
        correct: 2
    },
    {
        word: "hospital",
        options: ["學校", "公園", "商店", "醫院"],
        correct: 3
    },
    {
        word: "telephone",
        options: ["電話", "電視", "收音機", "相機"],
        correct: 0
    },
    {
        word: "birthday",
        options: ["假日", "生日", "節日", "週末"],
        correct: 1
    },
    {
        word: "restaurant",
        options: ["超市", "書店", "餐廳", "郵局"],
        correct: 2
    },
    {
        word: "afternoon",
        options: ["早上", "中午", "下午", "晚上"],
        correct: 2
    },
    {
        word: "teacher",
        options: ["老師", "學生", "校長", "職員"],
        correct: 0
    },
    {
        word: "book",
        options: ["書", "筆", "紙", "桌"],
        correct: 0
    },
    {
        word: "pen",
        options: ["筆", "鉛筆", "鋼筆", "文具"],
        correct: 0
    },
    {
        word: "paper",
        options: ["紙", "筆記本", "文件", "資料"],
        correct: 0
    },
    {
        word: "desk",
        options: ["桌", "椅子", "書櫃", "黑板"],
        correct: 0
    },
    {
        word: "chair",
        options: ["椅子", "桌子", "床", "沙發"],
        correct: 0
    },
    {
        word: "bed",
        options: ["床", "椅子", "桌子", "沙發"],
        correct: 0
    },
    {
        word: "sofa",
        options: ["沙發", "椅子", "桌子", "床"],
        correct: 0
    },
    {
        word: "table",
        options: ["桌子", "椅子", "床", "沙發"],
        correct: 0
    },
    {
        word: "window",
        options: ["窗戶", "門", "牆", "地板"],
        correct: 0
    },
    {
        word: "door",
        options: ["門", "窗戶", "牆", "地板"],
        correct: 0
    },
    {
        word: "wall",
        options: ["牆", "門", "窗戶", "地板"],
        correct: 0
    },
    {
        word: "floor",
        options: ["地板", "牆", "門", "窗戶"],
        correct: 0
    }
];

// 從題庫中隨機選取題目
function getRandomQuestions(count) {
    let currentIndex = vocabularyBank.length;
    let randomIndex;

    // Fisher-Yates 洗牌算法
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [vocabularyBank[currentIndex], vocabularyBank[randomIndex]] = 
        [vocabularyBank[randomIndex], vocabularyBank[currentIndex]];
    }

    return vocabularyBank.slice(0, count);
}

// 初始化測驗資料
const quizData = getRandomQuestions(20);

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft;
let userAnswers = []; // 儲存使用者的答案

// 語音合成
const synth = window.speechSynthesis;

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

function startTimer() {
    timeLeft = 15;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 5) {
        document.getElementById('timer').style.color = '#e74c3c';
    } else {
        document.getElementById('timer').style.color = '#2c3e50';
    }
}

function handleTimeout() {
    userAnswers.push({
        word: quizData[currentQuestion].word,
        userAnswer: null,
        correctAnswer: quizData[currentQuestion].options[quizData[currentQuestion].correct],
        isCorrect: false,
        timeOut: true
    });
    showFeedback(false, true);
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        showFinalScore();
        return;
    }

    clearInterval(timer);
    const currentQuiz = quizData[currentQuestion];
    
    document.getElementById('word').textContent = currentQuiz.word;
    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';
    
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option-btn';
        button.addEventListener('click', () => checkAnswer(index));
        optionsElement.appendChild(button);
    });

    document.getElementById('feedback').className = 'hidden';
    document.getElementById('progress').textContent = `題目 ${currentQuestion + 1} / ${quizData.length}`;
    startTimer();
}

function checkAnswer(selectedIndex) {
    clearInterval(timer);
    const currentQuiz = quizData[currentQuestion];
    const isCorrect = selectedIndex === currentQuiz.correct;
    
    userAnswers.push({
        word: currentQuiz.word,
        userAnswer: currentQuiz.options[selectedIndex],
        correctAnswer: currentQuiz.options[currentQuiz.correct],
        isCorrect: isCorrect,
        timeOut: false
    });

    if (isCorrect) {
        score += 10;
        document.getElementById('score').textContent = score;
    }
    
    // 顯示正確或錯誤的視覺反饋
    const buttons = document.querySelectorAll('.option-btn');
    buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    buttons[currentQuiz.correct].classList.add('correct');
    
    showFeedback(isCorrect, false);
    
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

function showFeedback(isCorrect, isTimeout) {
    const feedback = document.getElementById('feedback');
    if (isTimeout) {
        feedback.textContent = `時間到！正確答案是：${quizData[currentQuestion].options[quizData[currentQuestion].correct]}`;
        feedback.className = 'timeout';
    } else {
        feedback.textContent = isCorrect ? 
            '答對了！ +10分' : 
            `答錯了！正確答案是：${quizData[currentQuestion].options[quizData[currentQuestion].correct]}`;
        feedback.className = isCorrect ? 'correct' : 'wrong';
    }
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function showFinalScore() {
    const quizContainer = document.getElementById('quiz-container');
    let answersHtml = userAnswers.map((answer, index) => `
        <div class="answer-item ${answer.isCorrect ? 'correct' : 'wrong'}">
            <span class="question-number">第 ${index + 1} 題</span>
            <span class="word">${answer.word}</span>
            ${answer.timeOut ? 
                `<span class="timeout">未作答</span>` :
                `<span class="user-answer">你的答案：${answer.userAnswer}</span>`
            }
            <span class="correct-answer">正確答案：${answer.correctAnswer}</span>
            <span class="result">${answer.isCorrect ? '✓' : '✗'}</span>
        </div>
    `).join('');

    quizContainer.innerHTML = `
        <h2>測驗完成！</h2>
        <p class="final-score">總分：${score} / 200</p>
        <div class="answers-review">
            <h3>答題紀錄：</h3>
            ${answersHtml}
        </div>
        <button onclick="location.reload()" class="restart-btn">重新開始</button>
    `;
}

// 設置發音按鈕事件
document.getElementById('speak-btn').addEventListener('click', () => {
    const word = document.getElementById('word').textContent;
    speak(word);
});

// 開始測驗
loadQuestion();
