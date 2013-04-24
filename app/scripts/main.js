(function () {

    'use strict';


    // Helpers
    ////////////////////////////////////////////////////////////////////////////

    var windowHasFocus = true;

    var askForNotifications = function askForNotifications() {
        if (window.Notification) {
            Notification.requestPermission(function(perm) {
                alert('Notifications permission: ' + perm);
            });
        }
    };

    // Generates UUID. Used as a preset id
    var getUuid = function getUuid() {
        var i,
            random,
            uuid = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    };

    // Converts seconds to string for display
    var getTimeLeftString = function getTimeLeftString(time) {
        var h   = Math.floor(time / 3600);
        var m = Math.floor((time - (h * 3600)) / 60);
        var s = time - (h * 3600) - (m * 60);
        if (h < 10) { h = '0' + h; }
        if (m < 10) { m = '0' + m; }
        if (s < 10) { s = '0' + s; }
        return h + ':' + m + ':' + s;
    };


    // Classes
    ////////////////////////////////////////////////////////////////////////////

    // Alarm class
    var Alarm = function Alarm() {
        var requestsCounter = 0;
        var vibrateInterval = null;
        var audioOuput = new Audio('media/beep.ogg');
        audioOuput.loop = true;

        this.startAlarm = function startAlarm() {
            requestsCounter++;
            if (requestsCounter < 2) {
                audioOuput.play();
                if (navigator.vibrate) {
                    startVibration();
                }
                document.title = 'ALARM - TimerX3';
            }
        };

        this.stopAlarm = function stopAlarm() {
            if (requestsCounter > 0) {
                requestsCounter--;
            }
            if (requestsCounter === 0) {
                audioOuput.pause();
                audioOuput.currentTime = 0;
                if (navigator.vibrate) {
                    stopVibration();
                }
                document.title = 'TimerX3';
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

    // Timer class
    var Timer = function Timer(elDisplay, elButton, alarm) {
        this.time = 0;
        this.status = 'off'; // other values: 'ticking' and 'alarm'
        this.elDisplay = elDisplay;
        this.elButton = elButton;
        this.alarm = alarm;
        var interval = null;
        var notification = null;
        var that = this;

        this.start = function start(time) {
            startTicking(time);
            that.status = 'ticking';
            that.alarm.stopAlarm();
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
                if (notification !== null) {
                    notification.close();
                }
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

        var updateUI = function updateUI() {
            that.elDisplay.textContent = getTimeLeftString(that.time);

            switch (that.status) {
            case 'ticking':
                that.elButton.innerHTML = 'Stop';
                that.elDisplay.classList.remove('finished');
                break;
            case 'alarm':
                that.elButton.innerHTML = 'Start';
                that.elDisplay.classList.add('finished');
                that.alarm.startAlarm();
                var hidden;
                if (typeof document.hidden !== 'undefined') {
                    hidden = 'hidden';
                } else if (typeof document.webkitHidden !== 'undefined') {
                    hidden = 'webkitHidden';
                }
                if (document[hidden] || !windowHasFocus) {
                    if (window.Notification) {
                        notification = new Notification('Alarm - TimerX3', {
                            icon: 'logo-64.png',
                            body: 'A timer finished',
                        });
                        notification.onclose = function() {
                            that.dismissAlarm();
                        };
                    } else if (navigator.mozNotification) {
                        var icon30 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAABI1BMVEX/////AAD/SQD/VQD/UAD/TwD/TQD/TgD/TgDdXSTdXCbiWyD/TgD/TgD/TgD4Ugn3Ugn/TgD/aSb/UgX/VQn+UQUAAAAGBgYKCgoMDAwhISEpKSkqKio9PT1NTU1YWFhkZGR1dXV4eHh7e3uFhYWIiIiRkZGTk5OVlZWjo6OqqqqrjoGsj4KsrKytkIOukYSxsbG5ubm8vLzAwMDDw8PExMTHx8fIyMjJycnKysrMzMzPz8/Q0NDS0tLT0NDT09PU1NTV0tLV1dXW1tbX19fY2Njb29vc3Nzd3d3f39/j4+Pl5eXnZCvoXB/o6Ojq6urr6+vz8/P19fX29vb39/f6+vr7+/v9/f3+/v7/TgD/mWz/rIf/rIj/0b3/3M3//Pv///8N30akAAAAFnRSTlMAAQcMEB1CW2h+f5ewu9Lv8Pr8/f3+XL7/kwAAAZVJREFUKM+Fk2lbgkAUhTH3FE1c2nfSsLLUwlK0stJSySUrLm73//+KhkVg2rwfeM7wMsPcM2cYxi6Pzx8K+X0e5pdaCrAx0CvGBpa+QdfyCgEJrtPhEkREgy4ndYcBkupkhoKAs4maBAi7beqNAMgnCqKGEZWcDBDxWnMjEB/X+DIhrRZ5SHxtFIeIOd8VhvgUMftASF28qfces4jTOISN/wcBxmhWXSRV6RM1AgjqHUVBrlFYLPUQazJEtf4CkMzxWQqLpW6WzyUhQDALqiI9UTi/u1mXFBVY4mQMJojOxS8P1lf33xAnEPMwPkjMKHy8kdppaHqWAB/jB86mw8O97dRW3hxx4GdC0BGEtvkik0qtpT902RaEDoR+4CNTmphePJMZ2iNtcXprztK35mysic8DcW6B0ZjTlnL1WlEKuryrGLY4TX1PD7Bxocsz/tQw1XEkxdeCgsW+ru/NI7EP9LOJL92rW+PT+YFacbD2RMdhHiZJM0MzqEqFyYxizooinlNRXBRk8v9g9J9rsOgS/XUFvwD41b0VEaL41wAAAABJRU5ErkJggg==';
                        notification = navigator.mozNotification.createNotification(
                            'Alarm - TimerX3',
                            'A timer finished',
                            icon30);
                        notification.onclick = function () {
                            navigator.mozApps.getSelf().onsuccess = function(evt) {
                                var app = evt.target.result;
                                app.launch();
                            };
                        };
                        notification.show();
                    }
                }
                break;
            case 'off':
                that.elButton.innerHTML = 'Start';
                that.elDisplay.classList.remove('finished');
                that.alarm.stopAlarm();
                break;
            default:
                alert('Something went wrong');
            }
        };
    };

    // Preset class
    var Preset = function Preset(duration, description) {
        this.id = getUuid();
        this.duration = duration;
        this.description = description;
    };

    // On document ready
    document.onreadystatechange = function () {
        if (document.readyState === 'interactive') {

            var presets = [],
                lastEnteredDuration = 0,
                alarm = new Alarm();


            // UI elements references
            ////////////////////////////////////////////////////////////////////

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
            // Side panel
            var sidePanelButton = document.getElementById('toggle-sidepanel');
            var addPresetButton = document.getElementById('addpreset');
            var notificationsButton = document.getElementById('notifications');
            var appInstallButton = document.getElementById('appinstall');


            // UI functions
            ////////////////////////////////////////////////////////////////////

            var timer1 = new Timer(timer1Display, timer1Button, alarm),
                timer2 = new Timer(timer2Display, timer2Button, alarm),
                timer3 = new Timer(timer3Display, timer3Button, alarm);

            // Associate controls with timers
            timer1Button.timer = timer1Display.timer = timer1;
            timer2Button.timer = timer2Display.timer = timer2;
            timer3Button.timer = timer3Display.timer = timer3;

            // Get duration in seconds from the UI
            var getDuration = function getDuration() {
                return Number(hoursInput.value) * 3600 +
                       Number(minsInput.value) * 60 +
                      Number(secsInput.value);
            };

            // Set duration in seconds in the UI
            var setDuration = function setDuration(seconds) {
                var time = Number(seconds);
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

            // Toggle side panel display
            var toggleSidePanel = function toggleSidePanel() {
                var centerPanel = document.getElementById('center-panel');
                centerPanel.classList.toggle('sidepanel-enabled');
                if (centerPanel.classList.contains('sidepanel-enabled')) {
                    page.show('#sidebar');
                } else {
                    window.history.back();
                }
            };

            var showSidePanel = function toggleSidePanel() {
                document.getElementById('center-panel').classList.add('sidepanel-enabled');
            };

            var hideSidePanel = function toggleSidePanel() {
                document.getElementById('center-panel').classList.remove('sidepanel-enabled');
            };

            var updatePresetsUI = function updatePresetsUI() {
                document.getElementById('presets').innerHTML = '';
                presets.forEach(function (el) {
                    var duration = getTimeLeftString(el.duration);
                    var description = el.description;
                    var tagString = '<div class="description">' + description + '</div><div class="duration">' + duration + '</div>';
                    var li = document.createElement('li');
                    li.dataset.id = el.id;
                    li.innerHTML = tagString;
                    new Hammer(li).on('tap', setDurationFromPresetHandler);
                    new Hammer(li).on('hold', deletePresetHandler);
                    document.getElementById('presets').appendChild(li);
                });
                var presetsHint = document.getElementById('presetshint');
                if (presets.length > 0) {
                    presetsHint.classList.remove('hidden');
                } else {
                    presetsHint.classList.add('hidden');
                }
            };

            // Hide app install button if installation not supported or
            // when app is already installed
            var checkAppInstallSupport = function checkAppInstallSupport() {
                // Firefox
                if (typeof window.navigator.mozApps !== 'undefined') {
                    var request = window.navigator.mozApps.getSelf();
                    request.onsuccess = function() {
                        if (request.result) {
                            appInstallButton.classList.add('hidden');
                        }
                    };
                } else if (typeof chrome !== 'undefined') {
                    if (typeof chrome.app !== 'undefined') {
                        if (chrome.app.isInstalled) {
                            appInstallButton.classList.add('hidden');
                        }
                    } else {
                        appInstallButton.classList.add('hidden');
                    }
                } else {
                    appInstallButton.classList.add('hidden');
                }
            };


            // Event handlers
            ////////////////////////////////////////////////////////////////////

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

            // Allow 2 chars only to be entered in duration
            var timeInputHandler = function timeInputHandler() {
                if (this.value.length > 2) {
                    this.value = this.value.slice(0, 2);
                }
            };

            // Toggle timer status
            var toggleTimerHandler = function toggleTimerHandler(event) {
                var timer = event.target.timer;
                if (timer.status === 'ticking') {
                    timer.stop();
                } else {
                    if (!getDuration()) {
                        alert('Select time first');
                    } else {
                        timer.start(getDuration());
                        lastEnteredDuration = getDuration();
                        saveLastEnteredDuration();
                    }
                }
            };

            // Dismiss timer
            var dismissAlarmHandler = function dismissAlarmHandler(event) {
                var timer = event.target.timer;
                timer.dismissAlarm();
            };

            // Toggle side panel
            var toggleSidePanelHandler = function menuButtonHandler(event) {
                event.preventDefault();
                event.stopPropagation();
                event.gesture.stopDetect();
                toggleSidePanel();
            };

            // Set duration from selected preset
            var setDurationFromPresetHandler = function setDurationFromPresetHandler(event) {
                event.preventDefault();
                event.stopPropagation();
                var id = event.currentTarget.dataset.id;
                presets.forEach(function (el) {
                    if (el.id === id) {
                        setDuration(el.duration);
                        toggleSidePanel();
                        return;
                    }
                });
            };

            // Add new preset
            var addPresetHandler = function addPresetHandler(event) {
                event.preventDefault();
                event.stopPropagation();
                var duration = getDuration();
                if (!duration) {
                    alert('Enter duration first.');
                    toggleSidePanel();
                } else {
                    var description = prompt('Preset description');
                    var trimmedDescription = null;
                    if (description !== null) {
                        trimmedDescription = description.trim();
                    }
                    if (!trimmedDescription) {
                        alert('You must enter a description first.');
                    } else {
                        var preset = new Preset(duration, trimmedDescription);
                        presets.push(preset);
                        savePresets();
                        updatePresetsUI();
                    }
                }
            };

            // Delete preset
            var deletePresetHandler = function deletePresetHandler(event) {
                event.preventDefault();
                event.stopPropagation();
                var id = event.currentTarget.dataset.id;
                var i;
                for (i = presets.length - 1; i >= 0; i -=1) {
                    if (presets[i].id === id) {
                        var delConfirm = confirm('Delete "' + presets[i].description + '" preset?');
                        if (delConfirm) {
                            presets.splice(i, 1);
                            savePresets();
                            updatePresetsUI();
                        }
                        return;
                    }
                }
            };

            // Ask for Notifications permission
            var checkForNotificationPerm = function checkForNotificationPerm() {
                event.preventDefault();
                event.stopPropagation();
                askForNotifications();
            };

            var appInstallHandler = function appInstallHandler() {
                if (typeof window.navigator.mozApps !== 'undefined') {
                    var request = window.navigator.mozApps.install('http://alefteris.github.io/timerx3/manifest.webapp');
                    request.onsuccess = function () {
                        // Save the App object that is returned
                        alert('Installation successful!');
                        appInstallButton.classList.add('hidden');
                    };
                    request.onerror = function () {
                        alert('Install failed, error: ' + this.error.name);
                    };
                } else {
                    chrome.webstore.install('https://chrome.google.com/webstore/detail/dekigijbacfpbgmockjacjpnmfmhnhje',
                        function () {
                        appInstallButton.classList.add('hidden');
                    }, function (error) {
                        alert('Install failed, error: ' + error);
                    });
                }
            };


            // Register event listeners
            ////////////////////////////////////////////////////////////////////

            // Plus/Minus buttons
            new Hammer(hoursPlusButton).on('tap', increaseHoursHandler);
            new Hammer(hoursMinusButton).on('tap', decreaseHoursHandler);
            new Hammer(minsPlusButton).on('tap', increaseMinsHandler);
            new Hammer(minsMinusButton).on('tap', decreaseMinsHandler);
            new Hammer(secsPlusButton).on('tap', increaseSecsHandler);
            new Hammer(secsMinusButton).on('tap', decreaseSecsHandler);
            // Start/Stop timer buttons
            new Hammer(timer1Button).on('tap', toggleTimerHandler);
            new Hammer(timer2Button).on('tap', toggleTimerHandler);
            new Hammer(timer3Button).on('tap', toggleTimerHandler);
            // Time displays
            new Hammer(timer1Display).on('tap', dismissAlarmHandler);
            new Hammer(timer2Display).on('tap', dismissAlarmHandler);
            new Hammer(timer3Display).on('tap', dismissAlarmHandler);
            // Duration input fields
            hoursInput.addEventListener('input', timeInputHandler, false);
            minsInput.addEventListener('input', timeInputHandler, false);
            secsInput.addEventListener('input', timeInputHandler, false);
            // Menu button
            new Hammer(sidePanelButton).on('tap', toggleSidePanelHandler);
            // Add preset button
            new Hammer(addPresetButton).on('tap', addPresetHandler);
            // Swipe to toggle side panel
            new Hammer(document).on('swipeleft', toggleSidePanelHandler);
            new Hammer(document).on('swiperight', toggleSidePanelHandler);
            // Settings
            new Hammer(notificationsButton).on('tap', checkForNotificationPerm);
            new Hammer(appInstallButton).on('tap', appInstallHandler);

            window.onblur = function() {
                windowHasFocus = false;
            };

            window.onfocus = function() {
                windowHasFocus = true;
            };

            // Storage
            ////////////////////////////////////////////////////////////////////

            var savePresets = function savePresets() {
                localStorage.setItem('presets', JSON.stringify(presets));
            };

            var loadPresets = function loadPresets() {
                if (!localStorage.getItem('presets')) {
                    localStorage.setItem('presets', JSON.stringify([]));
                }
                presets = JSON.parse(localStorage.getItem('presets'));
            };

            var saveLastEnteredDuration = function saveLastEnteredDuration() {
                lastEnteredDuration = localStorage.setItem('last', lastEnteredDuration);
            };

            var loadLastEnteredDuration = function loadLastEnteredDuration() {
                if (!localStorage.getItem('last')) {
                    localStorage.setItem('last', 0);
                }
                lastEnteredDuration = localStorage.getItem('last');
            };


            // Initialize app
            ////////////////////////////////////////////////////////////////////

            loadLastEnteredDuration();
            setDuration(lastEnteredDuration);
            loadPresets();
            updatePresetsUI();
            checkAppInstallSupport();

            page('/', hideSidePanel);
            page('#sidebar', showSidePanel);
            page.start();
        }
    };

}());
