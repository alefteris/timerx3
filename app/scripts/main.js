(function () {

    'use strict';

    var Alarm = function Alarm() {

        var requestsCounter = 0;
        var vibrateInterval = null;
        var audioOuput = new Audio('media/beep.ogg');
        audioOuput.loop = true;

        this.startAlarm = function startAlarm() {
            requestsCounter++;
            console.log(requestsCounter);
            if (requestsCounter < 2) {
                audioOuput.play();
                if (navigator.vibrate) {
                    startVibration();
                }
            }
        };

        this.stopAlarm = function stopAlarm() {
            if (requestsCounter > 0) {
                requestsCounter--;
            }
            console.log(requestsCounter);
            if (requestsCounter === 0) {
                audioOuput.pause();
                audioOuput.currentTime = 0;
                if (navigator.vibrate) {
                    stopVibration();
                }
            }
        };

        var doVibration = function doVibration() {
            navigator.vibrate(200);
        };

        var stopVibration = function stopVibration() {
            window.clearInterval(vibrateInterval);
            navigator.vibrate(0);
        };

        var startVibration = function startVibration() {
            vibrateInterval = window.setInterval(doVibration, 1000);
        };

    };

    var alarm = new Alarm();

    var Timer = function Timer(elDisplay, elButton) {

        this.time = 0;
        this.status = 'off'; // other values: 'ticking' and 'alarm'
        this.elDisplay = elDisplay;
        this.elButton = elButton;
        var interval = null;
        var that = this;

        this.start = function start(time) {
            startTicking(time);
            that.status = 'ticking';
            alarm.stopAlarm();
            updateUI();
        };

        this.stop = function stop() {
            stopTicking();
            that.status = 'off';
            updateUI();
        };

        this.dismissAlarm = function dismissAlarm() {
            if (that.status === 'alarm') {
                that.status = 'off';
                updateUI();
            }
        };

        var tick = function tick() {
            that.time--;
            if (that.time === 0) {
                stopTicking();
                that.status = 'alarm';
            }
            updateUI();
        };

        var startTicking = function startTicking(time) {
            that.time = time;
            interval = window.setInterval(tick, 1000);
        };

        var stopTicking = function stopTicking() {
            that.time = 0;
            window.clearInterval(interval);
        };

        var getTimeLeftString = function getTimeLeftString() {
            var h   = Math.floor(that.time / 3600);
            var m = Math.floor((that.time - (h * 3600)) / 60);
            var s = that.time - (h * 3600) - (m * 60);
            if (h < 10) {h = '0' + h;}
            if (m < 10) {m = '0' + m;}
            if (s < 10) {s = '0' + s;}
            return h + ':' + m + ':' + s;
        };

        var updateUI = function updateUI() {
            logStatus();
            that.elDisplay.textContent = getTimeLeftString();

            switch (that.status) {
            case 'ticking':
                that.elButton.innerHTML = 'Stop';
                that.elDisplay.classList.remove('finished');
                break;
            case 'alarm':
                that.elButton.innerHTML = 'Start';
                that.elDisplay.classList.add('finished');
                alarm.startAlarm();
                break;
            case 'off':
                that.elButton.innerHTML = 'Start';
                that.elDisplay.classList.remove('finished');
                alarm.stopAlarm();
                break;
            default:
                alert('Something went wrong');
            }
        };

        var logStatus = function logStatus() {
            console.log('Timer: ' + that.status + ', remaining ' + getTimeLeftString());
        };

    };

    document.onreadystatechange = function () {
        if (document.readyState === 'interactive') {

            // Hours
            var hoursPlusButton = document.getElementById('hplus');
            var hoursMinusButton = document.getElementById('hminus');
            var hoursInput = document.getElementById('hours');
            // Mins
            var minsPlusButton = document.getElementById('mplus');
            var minsMinusButton = document.getElementById('mminus');
            var minsInput = document.getElementById('mins');
            // Secs
            var secsPlusButton = document.getElementById('splus');
            var secsMinusButton = document.getElementById('sminus');
            var secsInput = document.getElementById('secs');
            // Start/Stop timer buttons
            var timer1Button = document.getElementById('btn1');
            var timer2Button = document.getElementById('btn2');
            var timer3Button = document.getElementById('btn3');
            // Remaining time display
            var timer1Display = document.getElementById('timer1');
            var timer2Display = document.getElementById('timer2');
            var timer3Display = document.getElementById('timer3');

            var timer1 = new Timer(timer1Display, timer1Button);
            var timer2 = new Timer(timer2Display, timer2Button);
            var timer3 = new Timer(timer3Display, timer3Button);

            // Hours
            var increaseHoursHandler = function increaseHoursHandler() {
                var hours = Number(hoursInput.value) + 1;
                if (hours > 23) {
                    hoursInput.value = 0;
                } else {
                    hoursInput.value = hours;
                }
            };

            var decreaseHoursHandler = function decreaseHoursHandler() {
                var hours = Number(hoursInput.value) - 1;
                if (hours < 0) {
                    hoursInput.value = 23;
                } else {
                    hoursInput.value = hours;
                }
            };

            // Mins
            var increaseMinsHandler = function increaseMinsHandler() {
                var mins = Number(minsInput.value) + 1;
                if (mins > 59) {
                    minsInput.value = 0;
                } else {
                    minsInput.value = mins;
                }
            };

            var decreaseMinsHandler = function decreaseMinsHandler() {
                var mins = Number(minsInput.value) - 1;
                if (mins < 0) {
                    minsInput.value = 59;
                } else {
                    minsInput.value = mins;
                }
            };

            // Secs
            var increaseSecsHandler = function increaseSecsHandler() {
                var secs = Number(secsInput.value) + 1;
                if (secs > 59) {
                    secsInput.value = 0;
                } else {
                    secsInput.value = secs;
                }
            };

            var decreaseSecsHandler = function decreaseSecsHandler() {
                var secs = Number(secsInput.value) - 1;
                if (secs < 0) {
                    secsInput.value = 59;
                } else {
                    secsInput.value = secs;
                }
            };

            var getTime = function getTime() {
                var timeInSecs = Number(hoursInput.value) * 3600 +
                                 Number(minsInput.value) * 60 +
                                 Number(secsInput.value);
                return timeInSecs;
            };

            var setTime = function setTime(timeInSecs) {
                var time = Number(timeInSecs);
                var h = 0;
                var m = 0;
                var s = 0;
                h = Math.floor(time / 3600);
                m = Math.floor((time - (h * 3600)) / 60);
                s = time - (h * 3600) - (m * 60);
                hoursInput.value = h;
                minsInput.value = m;
                secsInput.value = s;
            };

            var toggleTimerHandler = function toggleTimerHandler(event) {
                var timer = event.target.timer;
                if (timer.status === 'ticking') {
                    timer.stop();
                } else {
                    if (!getTime()) {
                        alert('Select time first');
                    } else {
                        timer.start(getTime());
                        if (window.localStorage) {
                            window.localStorage.setItem('last', getTime());
                        }
                    }
                }
            };

            var dismissAlarmHandler = function dismissAlarmHandler(event) {
                var timer = event.target.timer;
                timer.dismissAlarm();
            };

            var timeInputHandler = function timeInputHandler() {
                if (this.value.length > 2) {
                    this.value = this.value.slice(0, 2);
                }
            };

            // Associate controls with timers
            timer1Button.timer = timer1Display.timer = timer1;
            timer2Button.timer = timer2Display.timer = timer2;
            timer3Button.timer = timer3Display.timer = timer3;

            // Event listeners

            // Plus/Minus buttons
            hoursPlusButton.addEventListener('click', increaseHoursHandler, false);
            hoursMinusButton.addEventListener('click', decreaseHoursHandler, false);
            minsPlusButton.addEventListener('click', increaseMinsHandler, false);
            minsMinusButton.addEventListener('click', decreaseMinsHandler, false);
            secsPlusButton.addEventListener('click', increaseSecsHandler, false);
            secsMinusButton.addEventListener('click', decreaseSecsHandler, false);

            // Start/Stop timer buttons
            timer1Button.addEventListener('click', toggleTimerHandler, false);
            timer2Button.addEventListener('click', toggleTimerHandler, false);
            timer3Button.addEventListener('click', toggleTimerHandler, false);

            // Time display
            timer1Display.addEventListener('click', dismissAlarmHandler, false);
            timer2Display.addEventListener('click', dismissAlarmHandler, false);
            timer3Display.addEventListener('click', dismissAlarmHandler, false);

            // Time input
            hoursInput.addEventListener('input', timeInputHandler, false);
            minsInput.addEventListener('input', timeInputHandler, false);
            secsInput.addEventListener('input', timeInputHandler, false);

            if (window.localStorage) {
                var time = window.localStorage.getItem('last');
                setTime(time);
            }

        }
    };

}());
