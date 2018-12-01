/**********************
Pomodoro Timer
Base Functionality
***It should be able to count down from 25 minutes to 0
***It should always stop counting when reaching 00:00
***It should display each second of counting down*
***It should have ability to start, stop & reset 

Extras
Tier #1
***It should give an alarm sound when the timer counts down to 0
***It should give the option for pomodoro, short break & long break
***It should display the current time remaining in the page title

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
It should have browser notifications/desktop notifications
**********************/

/********************* 
 * VARIABLES
 *********************/
let countdown, dataTime, now, then, newSecondsLeft, status, alarmSound;
const timerDisplay = document.querySelector('.timer__time');
const endTime = document.querySelector('.timer__end-time');
const buttons = document.querySelectorAll('[data-time]');
const pomodoro = document.querySelector('#pomodoro');
const shortBreak = document.querySelector('#short-break');
const longBreak = document.querySelector('#long-break');
const timerNavLink = document.querySelectorAll('.timer__nav--link');
const start = document.querySelector('#start');
const stop = document.querySelector('#stop');
const reset = document.querySelector('#reset');

/********************* 
 * EVENT LISTENERS
 *********************/
buttons.forEach((button => {
    button.addEventListener('click', updateTimer);
}));

// MODE BUTTONS
pomodoro.addEventListener('click', pomoActive);
shortBreak.addEventListener('click', sbActive);
longBreak.addEventListener('click', lbActive);

// TIMER CONTROLS
start.addEventListener('click', startControl);
stop.addEventListener('click', stopControl);
reset.addEventListener('click', resetControl);


/********************* 
 * TIMER
 *********************/
function timer(seconds) {
    // Clear any existing timers
    clearInterval(countdown);
    now = Date.now();
    then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);
    // console.log({now, then});
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // Check if we should stop
        if(secondsLeft < 0) {
            clearInterval(countdown);
            document.title = `TIME'S UP!`;
            soundAlert();
            displayUpdateEndTime(then);
            status = 'reset';
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
    // started = true;
}

/********************* 
 * TIMER CONTROLS
 *********************/
function updateTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
    clearInterval(countdown);
}

function startControl(e) {
    if(pomodoro.classList.contains('active')) {
        dataTime = pomodoro.dataset.time;
    } else if(shortBreak.classList.contains('active')) {
        dataTime = shortBreak.dataset.time;
    } else if(longBreak.classList.contains('active')) {
        dataTime = longBreak.dataset.time;
    }

    if(status === false) {
        timer(newSecondsLeft);
        status = true;
    } else if(!status || status === 'reset') {
        timer(dataTime);
        status = true;
    } else {
        return;
    }
}

function stopControl() {
    // If there is no stopped status, then stop and create new seconds reference
    if(status === true) {
        newSecondsLeft = Math.round((then - Date.now()) / 1000);
        clearInterval(countdown);
        status = false;
    } else {
        return;
    }
}

function resetControl() {
    if(pomodoro.classList.contains('active')) {
        dataTime = pomodoro.dataset.time;
    } else if(shortBreak.classList.contains('active')) {
        dataTime = shortBreak.dataset.time;
    } else if(longBreak.classList.contains('active')) {
        dataTime = longBreak.dataset.time;
    }

    timer(dataTime);
    clearInterval(countdown);
    status = 'reset';
}

/********************* 
 * DISPLAY [TIMER]
 *********************/
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

    endTime.textContent = `
        Timer ends at ${hour % 12 === 0 ? '12' : ''}${hour > 12 ? hour - 12 : ''}${hour < 12 ? hour : ''}:${minutes < 10 ? `0` : ''}${minutes}${hour > 12 ? 'pm' : 'am'}
    `;
    console.log(`Timer ends at ${hour % 12 === 0 ? '12' : ''}${hour > 12 ? hour - 12 : ''}${hour < 12 ? hour : ''}:${minutes < 10 ? `0` : ''}${minutes}${hour > 12 ? 'pm' : 'am'}`);
}

function displayUpdateEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();

    endTime.textContent = `
        Timer ended at ${hour % 12 === 0 ? '12' : ''}${hour > 12 ? hour - 12 : ''}${hour < 12 ? hour : ''}:${minutes < 10 ? `0` : ''}${minutes}${hour > 12 ? 'pm' : 'am'}
    `;
}

/********************* 
 * DISPLAY [BUTTON STYLING]
 *********************/
function sbActive() {
    if(!shortBreak.classList.contains('active')) {
        shortBreak.classList.toggle('active');
    }
    pomodoro.classList.remove('active');
    longBreak.classList.remove('active');
    status = 'reset';
}

function pomoActive() {
    if(!pomodoro.classList.contains('active')) {
        pomodoro.classList.toggle('active');
    }
    shortBreak.classList.remove('active');
    longBreak.classList.remove('active');
    status = 'reset';
}

function lbActive() {
    if(!longBreak.classList.contains('active')) {
        longBreak.classList.toggle('active');
    }
    pomodoro.classList.remove('active');
    shortBreak.classList.remove('active');
    status = 'reset';
}


// document.customForm.addEventListener('submit', function(e) {
//     e.preventDefault();
//     const mins = this.minutes.value;
//     console.log(mins);
//     timer(mins * 60);
//     this.reset();
// });


/********************* 
 * ALARM NOTIFICATION
 *********************/

function soundAlert() {
    let alarmSrc = '../assets/audio/success-note.mp3';
    let alarm = new Audio(`${alarmSrc}`);
    alarm.play();
}