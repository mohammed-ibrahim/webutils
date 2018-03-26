

window.onload = function () {
  var e = document.getElementById('bytes_holder');
  e.oninput = bytesToMb;
  e.onpropertychange = e.oninput; // for IE8

  var e = document.getElementById('mb_holder');
  e.oninput = mbToBytes;
  e.onpropertychange = e.oninput; // for IE8
};



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
