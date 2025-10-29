class MathPuzzleGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.currentDifficulty = 'easy';
        this.currentQuestion = null;
        this.timer = 30;
        this.timerInterval = null;
        this.isGameActive = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.generateNewQuestion();
    }
    
    initializeElements() {
        this.questionElement = document.getElementById('question');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackElement = document.getElementById('feedback');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.streakElement = document.getElementById('streak');
        this.timerElement = document.getElementById('timer');
        this.newQuestionBtn = document.getElementById('new-question-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
    }
    
    bindEvents() {
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        this.newQuestionBtn.addEventListener('click', () => this.generateNewQuestion());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeDifficulty(e.target.dataset.level));
        });
    }
    
    changeDifficulty(level) {
        this.currentDifficulty = level;
        this.difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.level === level) {
                btn.classList.add('active');
            }
        });
        this.generateNewQuestion();
    }
    
    generateQuestion() {
        const difficulties = {
            easy: {
                operations: ['+', '-'],
                maxNumber: 20,
                timeLimit: 30
            },
            medium: {
                operations: ['+', '-', '*'],
                maxNumber: 50,
                timeLimit: 25
            },
            hard: {
                operations: ['+', '-', '*', '/'],
                maxNumber: 100,
                timeLimit: 20
            }
        };
        
        const config = difficulties[this.currentDifficulty];
        const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
        
        let num1, num2, answer, question;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * config.maxNumber) + 1;
                num2 = Math.floor(Math.random() * config.maxNumber) + 1;
                answer = num1 + num2;
                question = `${num1} + ${num2}`;
                break;
                
            case '-':
                num1 = Math.floor(Math.random() * config.maxNumber) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                question = `${num1} - ${num2}`;
                break;
                
            case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                question = `${num1} × ${num2}`;
                break;
                
            case '/':
                answer = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                num1 = answer * num2;
                question = `${num1} ÷ ${num2}`;
                break;
        }
        
        return { question, answer };
    }
    
    generateNewQuestion() {
        this.stopTimer();
        this.currentQuestion = this.generateQuestion();
        this.questionElement.textContent = this.currentQuestion.question;
        this.answerInput.value = '';
        this.answerInput.disabled = false;
        this.submitBtn.disabled = false;
        this.feedbackElement.textContent = '';
        this.feedbackElement.className = 'feedback';
        
        this.startTimer();
        this.answerInput.focus();
    }
    
    checkAnswer() {
        if (!this.currentQuestion || this.answerInput.disabled) return;
        
        const userAnswer = parseInt(this.answerInput.value);
        const correctAnswer = this.currentQuestion.answer;
        
        this.answerInput.disabled = true;
        this.submitBtn.disabled = true;
        this.stopTimer();
        
        if (userAnswer === correctAnswer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer(correctAnswer);
        }
    }
    
    handleCorrectAnswer() {
        this.streak++;
        this.score += this.calculatePoints();
        
        if (this.streak % 5 === 0) {
            this.level++;
        }
        
        this.feedbackElement.textContent = `Richtig! 🎉 Die Antwort war ${this.currentQuestion.answer}`;
        this.feedbackElement.className = 'feedback correct';
        
        this.updateDisplay();
        this.scheduleNextQuestion();
    }
    
    handleIncorrectAnswer(correctAnswer) {
        this.streak = 0;
        this.feedbackElement.textContent = `Falsch! 😔 Die richtige Antwort war ${correctAnswer}`;
        this.feedbackElement.className = 'feedback incorrect';
        
        this.updateDisplay();
        this.scheduleNextQuestion();
    }
    
    calculatePoints() {
        const basePoints = this.currentDifficulty === 'easy' ? 10 : 
                          this.currentDifficulty === 'medium' ? 20 : 30;
        const streakBonus = Math.floor(this.streak / 3) * 5;
        const levelBonus = this.level * 2;
        
        return basePoints + streakBonus + levelBonus;
    }
    
    scheduleNextQuestion() {
        setTimeout(() => {
            this.generateNewQuestion();
        }, 2000);
    }
    
    startTimer() {
        this.timer = this.getTimeLimit();
        this.timerElement.textContent = this.timer;
        this.timerElement.classList.remove('warning');
        
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.timerElement.textContent = this.timer;
            
            if (this.timer <= 5) {
                this.timerElement.classList.add('warning');
            }
            
            if (this.timer <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    getTimeLimit() {
        const timeLimits = {
            easy: 30,
            medium: 25,
            hard: 20
        };
        return timeLimits[this.currentDifficulty];
    }
    
    handleTimeUp() {
        this.stopTimer();
        this.answerInput.disabled = true;
        this.submitBtn.disabled = true;
        
        this.feedbackElement.textContent = `Zeit abgelaufen! ⏰ Die richtige Antwort war ${this.currentQuestion.answer}`;
        this.feedbackElement.className = 'feedback incorrect';
        
        this.streak = 0;
        this.updateDisplay();
        this.scheduleNextQuestion();
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.streakElement.textContent = this.streak;
    }
    
    resetGame() {
        this.stopTimer();
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.updateDisplay();
        this.generateNewQuestion();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MathPuzzleGame();
});

// Add some fun animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add focus effects to input
    const answerInput = document.getElementById('answer-input');
    answerInput.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    answerInput.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});
