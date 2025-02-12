"use strict";
let isRunning = false;
let timeLeft = 25 * 60;
let breakTime = 5 * 60;
let isSession = true;
let timer;
let isDarkMode = true;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const themeToggleBtn = document.getElementById("themeToggle");
const alarm = document.getElementById("alarm");
const tickSound = new Audio("sound/tick.mp3");
const breakLength = document.getElementById("break-length");
const sessionLength = document.getElementById("session-length");
const increaseBtns = document.querySelectorAll(".increase");
const decreaseBtns = document.querySelectorAll(".decrease");
const modeText = document.querySelector(".mode");
const body = document.body;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, "0");
    secondsDisplay.textContent = seconds.toString().padStart(2, "0");
}

function startPauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        startPauseBtn.textContent = "▶ play";
    } else {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
                tickSound.play(); 
            } else {
                alarm.play();
                clearInterval(timer);
                isSession = !isSession;
                modeText.textContent = isSession ? "Session" : "Break";
                timeLeft = isSession ? sessionLength.textContent * 60 : breakLength.textContent * 60;
                startPauseTimer();
            }
        }, 1000);
        startPauseBtn.textContent = "⏸ pause";
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isSession = true;
    timeLeft = sessionLength.textContent * 60;
    modeText.textContent = "Session";
    updateDisplay();
    startPauseBtn.textContent = "▶ play";
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        body.style.backgroundColor = "#002b23";
        body.style.color = "#00ff99";
        themeToggleBtn.textContent = "☀ light";
    } else {
        body.style.backgroundColor = "#00ffff";
        body.style.color = "#000000";
        themeToggleBtn.textContent = "🌙 dark";
    }
}

increaseBtns.forEach(button => {
    button.addEventListener("click", () => {
        let type = button.getAttribute("data-type");
        if (type === "break" && breakLength.textContent < 60) {
            breakLength.textContent++;
        } else if (type === "session" && sessionLength.textContent < 60) {
            sessionLength.textContent++;
            if (!isRunning) timeLeft = sessionLength.textContent * 60;
        }
        updateDisplay();
    });
});

decreaseBtns.forEach(button => {
    button.addEventListener("click", () => {
        let type = button.getAttribute("data-type");
        if (type === "break" && breakLength.textContent > 1) {
            breakLength.textContent--;
        } else if (type === "session" && sessionLength.textContent > 1) {
            sessionLength.textContent--;
            if (!isRunning) timeLeft = sessionLength.textContent * 60;
        }
        updateDisplay();
    });
});

startPauseBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", resetTimer);
themeToggleBtn.addEventListener("click", toggleTheme);
updateDisplay();