var ST_PENDING = "PENDING";
var ST_COUNTING = "COUNTING";
var ST_ON_ALARM = "ON_ALARM";
var N_ALARMS = 15;

// $(function(){
//   console.log($('.ui.dropdown').dropdown());
// })


var colorMap = {
  "PENDING": "WhiteSmoke",
  "COUNTING": "AliceBlue",
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
  document.getElementById("status_" + id).style.backgroundColor = bgkColor;
  document.getElementById("card_num_" + id).style.backgroundColor = bgkColor;

  if (state != ST_PENDING) {
    var endAt = parseInt(document.getElementById("end_at_" + id).innerHTML);

    var currentDate = new Date();
    var difference = endAt - currentDate.getTime();
    var nHours = parseInt((difference/3600000) % 24);
    var nMins = parseInt((difference/60000) % 60);
    var nSecs = parseInt((difference/1000) % 60);

    var text = "Rem: "
    + nHours.toString() + "h "
    + nMins.toString() + "m "
    + nSecs.toString() + "s";

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
    } else {

      updateStatus(status, id);
    }
  }

}

window.setInterval(counter, 1000);