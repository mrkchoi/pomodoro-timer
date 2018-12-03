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
***It should have a settings panel for the following:
User preferences:
***Timer indication in title
***Select Sound
***Select Volume
***Set Custom Times
***It should have options for save, reset & sound test

Tier #3
***Keyboard shortcuts
FAQ section
Browser notifications/desktop notifications
Ads

Tier #4
Auto start pomodoros and breaks
**********************/

/********************* 
 * VARIABLES
 *********************/
// Global
 let countdown, dataTime, now, then, newSecondsLeft, status, alarmSound, alarmSrc, setVolume, selectedSound;
// Timer
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
const timerSection = document.querySelector('.container__timer--wrapper');
// Settings
const settingsNav = document.querySelector('#header__nav--settings');
const settingswrapper = document.querySelector('.settings__wrapper');
const settingsForm = document.querySelector('.settings__form');
const settingsModal = document.querySelector('.container__settings');
const closeModalBtn = document.querySelector('.settings__close--btn');
const soundSettingsInput = document.querySelector('.settings__sound');
const soundVolumeInput = document.querySelector('.settings__volume');
const soundtestBtn = document.querySelector('#settings__button--sound-test');
const customPomo = document.querySelector('#setting__time--pomodoro');
const customSB = document.querySelector('#setting__time--short-break');
const customLB = document.querySelector('#setting__time--long-break');
const saveSettings = document.querySelector('#settings__button--submit');
const saveSettingsConfirm = document.querySelector('.settings__buttons--saved-message');
const enableDesktopAlertsBtn = document.querySelector('.info__notifications--btn');
const notifyModalCheckbox = document.querySelector('#browser-notifications');
// FAQ
const faqBtn = document.querySelector('.header__nav--faq');
const faqContent = document.querySelector('.container__faq--wrapper'); 
const faqBackBtn = document.querySelector('#faq-timer'); 

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

// SETTINGS MODAL
settingsNav.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
settingsModal.addEventListener('click', closeModalOnExit);
settingsForm.addEventListener('submit', updateSettings);
soundSettingsInput.addEventListener('change', updateSound);
soundVolumeInput.addEventListener('input', updateVolume);
soundtestBtn.addEventListener('click', updateSound);
customPomo.addEventListener('change', updatePomo);
customSB.addEventListener('change', updateShortBreak);
customLB.addEventListener('change', updateLongBreak);
saveSettings.addEventListener('click', saveSettingsMsg);

// KEYBOARD SHORTCUTS
window.addEventListener('keydown', keyEvent);

// DESKTOP ALERTS
enableDesktopAlertsBtn.addEventListener('click', requestNotificationStatus);

// FAQ SECTION
faqBtn.addEventListener('click', showFAQ);
faqBackBtn.addEventListener('click', hideFAQ);

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
            updateSound();
            displayUpdateEndTime(then);
            status = 'reset';
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
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
    let displayHours;
    if(hour > 12) {
        displayHours = hour - 12;
    } else if(hour === 0 || hour === 12) {
        displayHours = 12;
    } else {
        displayHours = hours;
    }

    endTime.textContent = `
        Timer ends at ${displayHours}:${minutes < 10 ? `0` : ''}${minutes}${hour > 12 ? 'pm' : 'am'}
    `;
    console.log(`Timer ends at ${displayHours}:${minutes < 10 ? `0` : ''}${minutes}${hour > 12 ? 'pm' : 'am'}`);
}

function displayUpdateEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();
    let displayHours, endNotify;
    if(hour > 12) {
        displayHours = hour - 12;
    } else if(hour === 0 || hour === 12) {
        displayHours = 12;
    } else {
        displayHours = hours;
    }
    
    endNotify = `${displayHours}:${minutes < 10 ? `0` : ''}${minutes}${hour > 12 ? 'pm' : 'am'}`;
    endTime.textContent = `
        Timer ended at ${endNotify}
    `;
    alarmNotification(endNotify);
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
    // let alarmSrc = '../assets/audio/success-note.mp3';
    let alarm = new Audio(`${alarmSrc}`);
    if(!setVolume) {
        alarm.play();
    } else {
        alarm.volume = setVolume;
        alarm.play();
    }
}

/********************* 
 * SETTINGS MODAL
 *********************/
function openModal() {
    settingsModal.style.display = 'initial';
}
function closeModal() {
    settingsModal.style.display = 'none';
}
function closeModalOnExit(e) {
    // console.log(e.target);
    if(e.target.classList.contains('container__settings')) {
        closeModal();
    }
}

function updateSettings(e) {
    e.preventDefault();
    // Update Sound file
    // updateSound();

    // closeModal();
}

function updateSound() {
    selectedSound = soundSettingsInput.selectedIndex; 
    
    let soundOptions = soundSettingsInput.querySelectorAll('option');
    soundOptions.forEach(sound => {
        sound.selected = false;
    });

    soundOptions[selectedSound].selected = true; 
    alarmSrc = soundOptions[selectedSound].value;
    soundAlert();
}

function updateVolume(e) {
    setVolume = e.target.value / 100;
}

function updatePomo(e) {
    let newPomo = e.target.value * 60;
    pomodoro.dataset.time = newPomo;
    displayTimeLeft(newPomo);
    resetControl();
    // console.log(newPomo);
}
function updateShortBreak(e) {
    let newSB = e.target.value * 60;
    shortBreak.dataset.time = newSB;
    displayTimeLeft(newSB);
    resetControl();
}
function updateLongBreak(e) {
    let newLB = e.target.value * 60;
    longBreak.dataset.time = newLB;
    displayTimeLeft(newLB);
    resetControl();
}

function saveSettingsMsg() {
    saveSettingsConfirm.classList.toggle('active');
    setTimeout(() => {
        saveSettingsConfirm.classList.toggle('active');
    }, 2500);
}



/********************* 
 * KEYBOARD SHORTCUTS
 *********************/
function keyEvent(e) {
    keyCode = e.key;
        
    if(keyCode === 'π') {
        // ALT + P -> set pomodoro to active
        pomoActive();
        resetControl()
    } else if(keyCode === 'ß') {
        // ALT + S -> set short break to active
        sbActive();
        resetControl()
    } else if(keyCode === '¬') {
        // ALT + L -> set long break to active
        lbActive();
        resetControl();
    } else if(keyCode === '®') {
        // ALT + R -> reset
        resetControl()
    } else if(e.keyCode === 32) {
        // SPACE -> start / stop timer
        if(!status) {
            startControl();
        } else if(status === false) {
            startControl();
        } else if(status === true) {
            stopControl();
        } else if(status === 'reset') {
            startControl();
        }
    }
}


/********************* 
 * BROWSER NOTIFICATION
 *********************/

function requestNotificationStatus() {
    if(window.Notification) {
        if(Notification.permission === 'granted') {
            Notification.requestPermission((status) => {
                let n = new Notification('tomatotimer.io', {
                    body: 'Desktop alerts enabled!'
                });
            });
        } else if(Notification.permission === 'default') {
            let n = Notification.requestPermission();
        } else {
            alert('Notifications have been blocked. Please enable them in your browser settings.');
        }
    }
}

function alarmNotification(alertMessage) {
    new Notification(`Time's Up!`, {
        body: `Time ended at ${alertMessage}`,
        requireInteraction: true
    });
}

/********************* 
 * FAQ NOTIFICATION
 *********************/
function showFAQ() {
    faqContent.style.display = 'block';
    timerSection.style.display = 'none';
}
function hideFAQ() {
    faqContent.style.display = 'none';
    timerSection.style.display = 'block';
}