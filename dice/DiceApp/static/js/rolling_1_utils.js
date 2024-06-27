/*/
Draws an image with rotation and scaling
/*/
function drawImage(ctx, img, x, y, angle = 0, scale = 1){
  ctx.save();
  ctx.translate(x + img.width * scale / 2, y + img.height * scale / 2);
  ctx.rotate(angle);
  ctx.translate(- x - img.width * scale / 2, - y - img.height * scale / 2);
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  ctx.restore();
}

function Action() {
    console.log("Action!")
}

function First() {
  var c = document.getElementById("canvas_1");
  var ctx = c.getContext("2d");
  var img = document.getElementById("dice_smile");
  ctx.drawImage(img,10,10);
}

function Second() {
  var c = document.getElementById("canvas_1");
  var ctx = c.getContext("2d");
  var img = document.getElementById("dice_mad");
  //ctx.drawImage(img,100,10);
  drawImage(ctx, img, 100, 10, 45, 2)
}

function Third() {
  var c = document.getElementById("canvas_1");
  var ctx = c.getContext("2d");
  var img = document.getElementById("dice_frown");
  ctx.drawImage(img,200,10);
}
