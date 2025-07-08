//wait 4 dom 2 load
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded, initializing timer...");

    // Get all elements
    const pomodoroBtn = document.getElementById("pomodoro-session");
    const shortBreakBtn = document.getElementById("short-break");
    const longBreakBtn = document.getElementById("long-break");
    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
    const timerMsg = document.getElementById("timer-message");

    const pomodoroTimer = document.getElementById("pomodoro-timer");
    const shortTimer = document.getElementById("short-timer");
    const longTimer = document.getElementById("long-timer");
    const defaultDisplay = document.getElementById("default-display");

    const pomodoroOptions = document.getElementById("pomodoro-options");
    const customInput = document.getElementById("custom-input");
    const setCustomBtn = document.getElementById("set-custom");

    // Check if all elements exist
    console.log("Elements found:", {
        pomodoroBtn: !!pomodoroBtn,
        shortBreakBtn: !!shortBreakBtn,
        longBreakBtn: !!longBreakBtn,
        pomodoroTimer: !!pomodoroTimer,
        pomodoroOptions: !!pomodoroOptions
    });

    let currentTimer = null;
    let myInterval = null;

    // Timer format function
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Hide all timers
    function hideAllTimers() {
        pomodoroTimer.classList.remove("active");
        shortTimer.classList.remove("active");
        longTimer.classList.remove("active");
        defaultDisplay.style.display = "none";
        pomodoroOptions.classList.remove("show");
    }

    // Remove active class from all buttons
    function removeActiveFromButtons() {
        pomodoroBtn.classList.remove("active");
        shortBreakBtn.classList.remove("active");
        longBreakBtn.classList.remove("active");
    }

    // Show default message
    function showDefault() {
        hideAllTimers();
        defaultDisplay.style.display = "flex";
        removeActiveFromButtons();
        currentTimer = null;
    }

    // Initialize
    showDefault();

    // Pomodoro button click
    pomodoroBtn.addEventListener("click", function () {
        console.log("Pomodoro button clicked");
        hideAllTimers();
        pomodoroTimer.classList.add("active");
        pomodoroOptions.classList.add("show");

        removeActiveFromButtons();
        pomodoroBtn.classList.add("active");

        currentTimer = pomodoroTimer;
        timerMsg.style.display = "none";
    });

    // Short break button click
    shortBreakBtn.addEventListener("click", function () {
        console.log("Short break button clicked");
        hideAllTimers();
        shortTimer.classList.add("active");

        removeActiveFromButtons();
        shortBreakBtn.classList.add("active");

        currentTimer = shortTimer;
        timerMsg.style.display = "none";
    });

    // Long break button click
    longBreakBtn.addEventListener("click", function () {
        console.log("Long break button clicked");
        hideAllTimers();
        longTimer.classList.add("active");

        removeActiveFromButtons();
        longBreakBtn.classList.add("active");

        currentTimer = longTimer;
        timerMsg.style.display = "none";
    });

    // Duration button clicks
    const durationBtns = document.querySelectorAll(".duration-btn");
    console.log("Duration buttons found:", durationBtns.length);

    durationBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            console.log("Duration button clicked:", btn.getAttribute("data-time"));

            // Remove selected class from all duration buttons
            durationBtns.forEach(function (b) {
                b.classList.remove("selected");
            });

            // Add selected class to clicked button
            btn.classList.add("selected");

            // Update timer
            const time = parseInt(btn.getAttribute("data-time"));
            pomodoroTimer.setAttribute("data-duration", time);
            pomodoroTimer.querySelector(".time").textContent = formatTime(time);

            // Clear custom input
            customInput.value = "";
        });
    });

    // Custom duration button
    setCustomBtn.addEventListener("click", function () {
        console.log("Custom button clicked");
        const mins = parseInt(customInput.value);
        if (!isNaN(mins) && mins > 0) {
            const time = mins * 60;
            pomodoroTimer.setAttribute("data-duration", time);
            pomodoroTimer.querySelector(".time").textContent = formatTime(time);

            // Remove selected from preset buttons
            durationBtns.forEach(function (b) {
                b.classList.remove("selected");
            });

            console.log("Custom duration set:", mins, "minutes");
        } else {
            alert("Please enter a valid number of minutes!");
        }
    });

    // Enter key for custom input
    customInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            setCustomBtn.click();
        }
    });

    // Start timer function
    function startTimer(timerDisplay) {
        if (myInterval) {
            clearInterval(myInterval);
        }

        const durationInSeconds = parseInt(timerDisplay.getAttribute("data-duration"));
        let remainingSeconds = durationInSeconds;
        const timeElement = timerDisplay.querySelector(".time");

        console.log("Starting timer with duration:", durationInSeconds, "seconds");

        function updateTimer() {
            const mins = Math.floor(remainingSeconds / 60);
            const secs = remainingSeconds % 60;
            timeElement.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;

            if (remainingSeconds <= 0) {
                clearInterval(myInterval);
                alert("Time's up! 🎉");
                timeElement.textContent = formatTime(durationInSeconds);
                return;
            }

            remainingSeconds--;
        }

        updateTimer();
        myInterval = setInterval(updateTimer, 1000);
    }

    // Start button
    startBtn.addEventListener("click", function () {
        console.log("Start button clicked, current timer:", currentTimer);
        if (!currentTimer) {
            timerMsg.style.display = "block";
            setTimeout(function () {
                timerMsg.style.display = "none";
            }, 3000);
            return;
        }
        startTimer(currentTimer);
    });

    // Stop button
    stopBtn.addEventListener("click", function () {
        console.log("Stop button clicked");
        if (myInterval) {
            clearInterval(myInterval);
            myInterval = null;

            if (currentTimer) {
                const originalDuration = parseInt(currentTimer.getAttribute("data-duration"));
                currentTimer.querySelector(".time").textContent = formatTime(originalDuration);
            }
        }
    });

    console.log("Timer initialization complete");
});