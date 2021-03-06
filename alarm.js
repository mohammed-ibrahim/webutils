var ST_PENDING = "PENDING";
var ST_COUNTING = "COUNTING";
var ST_ON_ALARM = "ON_ALARM";
var N_ALARMS = 15;

// $(function(){
//   console.log($('.ui.dropdown').dropdown());
// })


var colorMap = {
  "PENDING": "Black",
  "COUNTING": "SkyBlue",
  "ON_ALARM": "MediumVioletRed"
}

var SNOOZE_TIME = 5;

var actionButtons = [
  "start_button",
  "close_button",
  "snooze_button"
];

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

var debugging = !true;

function isDebug() {
  return debugging;
}

function anyCountingAlarms() {

  for (i=0;  i < N_ALARMS; i++) {
    var id = (i+1).toString();
    var status = document.getElementById("status_" + id).innerHTML;

    if (status == ST_COUNTING) {
      return true;
    }
  }

  return false;
}

window.onbeforeunload = function() {

  console.log("Entered onbeforeunload");
  if (isDebug()) {

    console.log("onbeforeunload::isDebug");
    return null;
  }

  console.log("onbeforeunload::Space1");
  if (!anyCountingAlarms()) {

    console.log("onbeforeunload::anyCountingAlarms");
    return null;
  }

  return true;
};


window.onload = function() {

  var template = document.getElementById("template").innerHTML;
  var buffer = "";

  for (i=0;  i < N_ALARMS ; i++) {
    buffer = buffer + template.replaceAll("_placeholder", "_" + (i+1).toString())
  }

  document.getElementById("placement").innerHTML = buffer;
  $('.content .ui.dropdown').dropdown();

  for (i=0;  i < N_ALARMS ; i++) {
    updateStatus(ST_PENDING, (i+1).toString());
  }
}

function getIdentifier(element) {
  var parts = element.id.split("_");
  return parts[parts.length - 1];
}

function playAudio() {
  var x = document.getElementById("audio_element");
  x.currentTime = 0;
  x.play();
}

function pauseAudio() {
  var x = document.getElementById("audio_element");
  x.pause();
}

function getSufixedArray(arr, id) {
  var sf = [];

  for (var index in arr) {
    var value = arr[index];
    sf.push(value + "_" + id);
  }

  return sf;
}

function showOnlyButtons(arr, id) {
  arr = getSufixedArray(arr, id);
  for (var index in actionButtons) {
    var buttonId = actionButtons[index] + "_" + id;

    if (arr.includes(buttonId)) {
      document.getElementById(buttonId).disabled = false;
    } else {
      document.getElementById(buttonId).disabled = true;
    }
  }
}

function updateStatus(state, id) {
  document.getElementById("status_" + id).innerHTML = state;
  var bgkColor = colorMap[state];
  // console.log("bgkColor: ", bgkColor);
  document.getElementById("status_" + id).style.color = bgkColor;
  document.getElementById("count_" + id).style.color = bgkColor;
  // document.getElementById("card_num_" + id).style.backgroundColor = bgkColor;

  if (state != ST_PENDING) {
    var endAt = parseInt(document.getElementById("end_at_" + id).innerHTML);

    var currentDate = new Date();
    var difference = endAt - currentDate.getTime();
    var nHours = parseInt((difference/3600000) % 24);
    var nMins = parseInt((difference/60000) % 60);
    var nSecs = parseInt((difference/1000) % 60);

    var text = "REM: "
    + nHours.toString() + "H "
    + nMins.toString() + "M "
    + nSecs.toString() + "S";

    document.getElementById("count_" + id).innerHTML = text;
  } else {

    document.getElementById("count_" + id).innerHTML = "";
  }
}

function applyFactor() {
  if (isDebug()) {

    return 1000;
  }

  return 60000;
}

function startAlarm(element) {
  var id = getIdentifier(element);

  showOnlyButtons(["close_button"], id);
  var minutesToAdd = document.getElementById("select_" + id).value;

  var date = new Date();
  var alarmAt = new Date(date.getTime() + (minutesToAdd * applyFactor()));
  var alarmAtStamp = alarmAt.getTime().toString();
  document.getElementById("end_at_" + id).innerHTML = alarmAtStamp;

  updateStatus(ST_COUNTING, id);
}

function closeAlarm(element) {

  var id = getIdentifier(element);
  pauseAudio();
  showOnlyButtons(["start_button"], id);
  updateStatus(ST_PENDING, id);
}

function snoozeAlarm(element) {

  var id = getIdentifier(element);
  showOnlyButtons(["close_button"], id);
  pauseAudio();

  var minutesToAdd = SNOOZE_TIME;
  var date = new Date();
  var alarmAt = new Date(date.getTime() + (minutesToAdd * applyFactor()));
  var alarmAtStamp = alarmAt.getTime().toString();
  document.getElementById("end_at_" + id).innerHTML = alarmAtStamp;

  updateStatus(ST_COUNTING, id);
}

function counter() {
  for (i=0;  i < N_ALARMS; i++) {
    counterFor((i+1).toString());
  }
}

function counterFor(id) {

  var status = document.getElementById("status_" + id).innerHTML;
  if (status != null && status == ST_COUNTING) {

    var endAt = parseInt(document.getElementById("end_at_" + id).innerHTML);
    var currentTime = new Date().getTime();

    if (endAt <= currentTime) {

      playAudio();
      showOnlyButtons(["snooze_button","close_button"], id);
      updateStatus(ST_ON_ALARM, id);
      // sendBrowserNotification();
    } else {

      updateStatus(status, id);
    }
  }
}

function sendBrowserNotification() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Alarm!!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Alarm!!");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}


window.setInterval(counter, 1000);
