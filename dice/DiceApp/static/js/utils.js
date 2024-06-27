
function ToggleOrangeColour() {
  var x = document.getElementsByClassName("orange_style");
  for (var i = 0; i < x.length; i++) {
    if (x[i].style.color == "orange") {
        x[i].style.color = "";
    }
    else {
        x[i].style.color = "orange";
    }
  }
}
