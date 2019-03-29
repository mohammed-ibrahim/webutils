

window.onload = function () {
  var e = document.getElementById('bytes_holder');
  e.oninput = bytesToMb;
  e.onpropertychange = e.oninput; // for IE8

  var e = document.getElementById('mb_holder');
  e.oninput = mbToBytes;
  e.onpropertychange = e.oninput; // for IE8
};


function readableTimeStamp() {
  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
  var dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  //format: mon.31.jan.2019.21.20
  var date = new Date();
  var day = dayOfWeek[date.getDay()];
  var dt = date.getDate().toString();
  var month = months[date.getMonth()];
  var year = date.getFullYear().toString();

  return day.toString()
      + "."
      + dt
      + "."
      + month.toString()
      + "."
      + year.toString()
      + "."
      + date.getHours().toString()
      + "."
      + date.getMinutes().toString()
      + "."
      + date.getSeconds().toString();
}

function doCheck(elementid) {
  document.getElementById(elementid).checked = true;
}

function applyNewTimeStamp() {
  var ts = readableTimeStamp()
  document.getElementById("ts_txt_holder").value = ts;
  document.getElementById("ts_txt_holder").setSelectionRange(0, ts.length)
}

function applyUnixNewTimeStamp() {
  var ts = new Date().getTime().toString()
  document.getElementById("unix_ts_txt_holder").value = ts;
  document.getElementById("unix_ts_txt_holder").setSelectionRange(0, ts.length)
}

function bytesToMb() {
  var txtBytes = document.getElementById("bytes_holder").value;

  if (txtBytes) {
    var intBytes = parseInt(txtBytes);

    if (!isNaN(intBytes)) {
      document.getElementById("mb_holder").value = (intBytes/(1024*1024)).toString();
    }
  } else {
    document.getElementById("mb_holder").value = "";
  }
}

function mbToBytes() {

  var txtMb = document.getElementById("mb_holder").value;

  if (txtMb) {
    var intMb = parseInt(txtMb);

    if (!isNaN(intMb)) {
      document.getElementById("bytes_holder").value = (intMb*1024*1024).toString();
    }
  } else {
    document.getElementById("bytes_holder").value = "";
  }
}
