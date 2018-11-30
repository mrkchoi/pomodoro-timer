/**********************
Pomodoro Timer
Base Functionality
It should be able to count down from 25 minutes to 0
It should always stop counting when reaching 00:00
It should display each second of counting down
It should have ability to start, stop & reset 

Extras
Tier #1
It should give an alarm sound when the timer counts down to 0
It should give the option for pomodoro, short break & long break
It should display the current time remaining in the page title

Tier #2
It should have a settings panel for the following:
User preferences:
Timer indication in title
Browser notifications
Auto start pomodoros and breaks
Select Sound
Select Volume
Set Custom Times
It should have options for save, reset & sound test

Tier #3
It should have keyboard shortcuts
It should have a FAQ section
**********************/

let countdown;
const timerDisplay = document.querySelector('.timer__time');
const endTime = document.querySelector('.timer__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // Clear any existing timers
    clearInterval(countdown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);
    // console.log({now, then});
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // Check if we should stop
        if(secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;

    let display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    
    timerDisplay.textContent = display;
    document.title = `[${display}] tomatotimer.io`;

    // console.log({minutes, remainderSeconds});
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();
    endTime.textContent = `Timer ends at ${hour % 12}:${minutes < 10 ? `0` : ''}${minutes}${hour > 12 ? 'pm' : 'am'}`;
    console.log(`Timer ends at ${hour % 12}:${minutes < 10 ? `0` : ''}${minutes}${hour > 12 ? 'pm' : 'am'}`);
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach((button => {
    button.addEventListener('click', startTimer);
}));

// document.customForm.addEventListener('submit', function(e) {
//     e.preventDefault();
//     const mins = this.minutes.value;
//     console.log(mins);
//     timer(mins * 60);
//     this.reset();
// });