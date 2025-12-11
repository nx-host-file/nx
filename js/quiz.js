document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const quizTitleEl = document.getElementById('quizTitle');
    const questionEl = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const progressTextEl = document.getElementById('progressText');
    const progressBarEl = document.getElementById('progressBar');
    const scoreCardEl = document.getElementById('score-card');
    const quizViewEl = document.getElementById('quiz-view');
    const currentScoreEl = document.getElementById('currentScore');
    const totalScoreEl = document.getElementById('totalScore');
    const scoreMessageEl = document.getElementById('scoreMessage');
    const playAgainBtn = document.getElementById('playAgain');

    // --- Preload Sound Effects for better performance ---
    const trueSound = new Audio('sound/true.mp3');
    const falseSound = new Audio('sound/false.mp3');
    trueSound.load();
    falseSound.load();

    // --- Quiz State ---
    let allQuestions = [];
    let currentQuizQuestions = [];
    let questionCounter = 0;
    let currentScore = 0;
    let totalScore = parseInt(localStorage.getItem('totalQuizScore')) || 0;
    let quizLength = 10;
    let isAnswered = false; // Prevents multiple clicks

    // --- Configuration ---
    const urlParams = new URLSearchParams(window.location.search);
    const quizLevel = urlParams.get('level') || 'easy';
    const config = {
        easy: { title: 'সহজ কুইজ', file: 'json/1.json' },
        hard: { title: 'কঠিন কুইজ', file: 'json/2.json' }
    };
    const currentConfig = config[quizLevel];

    // --- Main Functions ---
    async function loadQuestions() {
        try {
            const response = await fetch(currentConfig.file);
            if (!response.ok) throw new Error('Network response failed');
            allQuestions = await response.json();
            if (allQuestions.length === 0) throw new Error('JSON file is empty.');
            startQuiz();
        } catch (error) {
            questionEl.textContent = 'দুঃখিত, প্রশ্ন লোড করা যায়নি। Live Server চালু আছে কিনা এবং JSON ফাইলটি সঠিক আছে কিনা তা পরীক্ষা করুন।';
            console.error('Quiz Error:', error);
        }
    }

    function startQuiz() {
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        quizLength = Math.min(10, shuffled.length);
        currentQuizQuestions = shuffled.slice(0, quizLength);
        questionCounter = 0;
        currentScore = 0;
        scoreCardEl.style.display = 'none';
        quizViewEl.style.display = 'block';
        displayNextQuestion();
    }

    function displayNextQuestion() {
        isAnswered = false; // Allow answering for the new question
        quizViewEl.classList.remove('answered');
        
        if (questionCounter < quizLength) {
            updateProgress();
            const questionData = currentQuizQuestions[questionCounter];
            questionEl.textContent = questionData.question;
            optionsContainer.innerHTML = '';
            
            questionData.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.className = 'option-btn'; // Use className for better performance
                button.onclick = () => selectAnswer(button, option, questionData.answer);
                optionsContainer.appendChild(button);
            });
            questionCounter++;
        } else {
            showFinalScore();
        }
    }

    function selectAnswer(selectedButton, selectedOption, correctAnswer) {
        if (isAnswered) return; // If already answered, do nothing
        isAnswered = true; // Mark as answered
        quizViewEl.classList.add('answered'); // Add class to disable other buttons via CSS

        if (selectedOption === correctAnswer) {
            selectedButton.classList.add('correct', 'pulse');
            trueSound.play().catch(e => console.log("Sound play requires user interaction."));
            currentScore++;
        } else {
            selectedButton.classList.add('incorrect', 'shake');
            falseSound.play().catch(e => console.log("Sound play requires user interaction."));
            
            // Highlight the correct answer
            Array.from(optionsContainer.children).forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }
        
        setTimeout(displayNextQuestion, 2000);
    }
    
    function updateProgress() {
        const progressPercentage = (questionCounter / quizLength) * 100;
        progressBarEl.style.width = `${progressPercentage}%`;
        progressTextEl.textContent = `প্রশ্ন ${questionCounter + 1} / ${quizLength}`;
    }

    function showFinalScore() {
        quizViewEl.style.display = 'none';
        scoreCardEl.style.display = 'block';
        updateProgress(); // To show 10/10

        currentScoreEl.textContent = `${currentScore} / ${quizLength}`;
        totalScore += currentScore;
        localStorage.setItem('totalQuizScore', totalScore);
        totalScoreEl.textContent = totalScore;

        let message = '';
        const percentage = (currentScore / quizLength) * 100;
        if (percentage >= 80) message = 'বাহ, চমৎকার! আপনার প্রস্তুতি অসাধারণ!';
        else if (percentage >= 50) message = 'ভালো করেছেন! আরেকটু চেষ্টা করলেই আরও ভালো হবে।';
        else message = 'আরও চেষ্টা করতে হবে। অধ্যায়টি আবার পড়ুন।';
        scoreMessageEl.textContent = message;
    }

    // --- Initial Setup ---
    quizTitleEl.textContent = currentConfig.title;
    document.title = currentConfig.title;
    playAgainBtn.addEventListener('click', startQuiz);
    loadQuestions();
});
