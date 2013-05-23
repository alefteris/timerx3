# [TimerX3](http://alefteris.github.io/timerx3/) [![Build Status](https://api.travis-ci.org/alefteris/timerx3.png?branch=master)](https://travis-ci.org/alefteris/timerx3)

<a href="http://alefteris.github.io/timerx3/">
  <img src="http://alefteris.github.io/timerx3/apple-touch-icon-114x114-precomposed.png" width="114">
</a>

TimerX3 is a cooking timer for the modern web.

**I take no responsibility for any burned food (or worse :fire:) caused by an application failure** :unamused:

## Features

 * Set up to three timers at the same time, from the same screen
 * Save presets of timers you use often
 * Remembers duration of last timer set
 * Fast to download and use
 * Works offline
 * Get notified on timer finish by:
   * Visual alarm with a pulsing red color
   * Alarm sound
   * Window title change
   * Desktop notification, when the app is not visible (works in Chrome, Firefox 22+ and Firefox OS)
   * Vibration (works in Firefox for Android and Firefox OS)

## Why?

Does the world need another timer? Probably not. But my motivation for building this app was to learn what it would be like to not use a framework like jQuery and instead use plain JavaScript. Also to learn about some new web technologies and tools used by this app.

### Web Standards

Here is a list of web standards used by the app and supported by modern web browsers:

 * [HTML5](http://www.w3.org/TR/html5/)
   * [Offline Web applications](http://www.w3.org/TR/html5/browsers.html#offline): used to make the app work offline
   * Semantic HTML elements, such as `<header>`
   * [Audio element](http://www.w3.org/TR/html5/embedded-content-0.html#the-audio-element): used for the alarm sound
 * [CSS](http://www.w3.org/Style/CSS/current-work)
   * [CSS Transforms](http://www.w3.org/TR/css3-transforms): used to open the side panel, provides better performance on mobile
   * [CSS Animations](http://www.w3.org/TR/css3-animations): used for the pulse animation
   * [Box-sizing](http://www.w3.org/TR/css3-ui/#box-sizing): used for implementing the responsive layout
 * [Web Storage](http://www.w3.org/TR/webstorage/): used for saving duration of last set timer and for storing the presets
 * [Web Notifications](http://www.w3.org/TR/notifications/): used for showing the desktop notifications
 * [Push API](http://www.w3.org/TR/push-api/): for using browser back button to close side panel
 * [Vibration API](http://www.w3.org/TR/vibration/): used for vibrating on mobile devices
 * [SVG](http://www.w3.org/Graphics/SVG/): used for the side panel toggle button
 * [Page Visibility](http://www.w3.org/TR/page-visibility/): used for determining if app is visible and not show notifications
 * [Touch Events](http://www.w3.org/TR/touch-events/): used for faster responsiveness on touch devices compared with normal click events. Also for the swipe gesture to reveal the side panel
 * [Web Application Manifest Format and Management APIs](http://mozilla.github.io/webapps-spec/): used for installing site as an app

### Tools

 * [Yeoman](http://yeoman.io/): provided the initial app scaffold
 * [Grunt](http://gruntjs.com/): used for building, previewing, deploying the app and [other tasks](https://github.com/alefteris/timerx3/blob/master/Gruntfile.js)
 * [Bower](http://bower.io/): used for installing the third-party libraries
 * [SASS + Compass](http://compass-style.org/): used for making CSS authoring easier

### Libs

The following are the only JavaScript libraries I used, mainly because it would be quite complicated to do it myself. You can also see what I used in the [component.json](https://github.com/alefteris/timerx3/blob/master/component.json) file.

 * [normalize.scss](http://necolas.github.io/normalize.css/): used for normalizing browser default styles
 * [hammer.js](http://eightmedia.github.io/hammer.js/): used for the tap and swipe touch gestures
 * [page.js](http://visionmedia.github.io/page.js/): used for implementing routing

## How to get it

### The usual way of the web

Just visit <a href="http://alefteris.github.io/timerx3/">http://alefteris.github.io/timerx3/</a> in your browser. Bookmark it if you like it.

### Install it as an app

To install it as an app, go to the app settings in the side panel. This is supported in desktop Chrome and Firefox.

### Install it from an web app store

Install it as an app from the Firefox Marketplace or the Chrome Web Store.

<a href="https://marketplace.firefox.com/app/timerx3/">
  <img src="http://alefteris.github.io/timerx3/images-other/firefox-marketplace-badge.png" width="206" height="45">
</a>

<a href="https://chrome.google.com/webstore/detail/timerx3/dekigijbacfpbgmockjacjpnmfmhnhje">
  <img src="http://alefteris.github.io/timerx3/images-other/chrome-web-store-badge.png" width="206" height="58">
</a>

## Browser support

The list of browsers I have tested with are:

 * Chrome
 * Firefox
 * Firefox OS
 * Firefox for Android
 * Android 4.1 browser

For the last two browsers on Android, when the app goes into the background, the timers stop. Notifications also do not work on Android. So, there is little point in running the app in this platform.

## Build Instructions

You will need to have [Node.js](http://nodejs.org/) installed in your system.

``` shell
npm install -g grunt-cli bower
git clone git://github.com/alefteris/timerx3.git
cd timerx3
npm install
bower install
grunt server
```

## License

 * Sound file (beep.ogg):
   * Apache Software License, 2.0. Copyright © Google, Inc.
 * Unless otherwise stated, all the rest:
   * MIT License. Copyright © Thanos Lefteris
