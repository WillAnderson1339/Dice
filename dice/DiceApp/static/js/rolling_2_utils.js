const timerInterval = 150;
const diceShakeInterval = 1000;
var tickCount = 1;
const tickMax = 11;
var tickRandom = -1;        // This will hold the randomized number choice dice face
var dieToDraw = "dice_smile";
const numDieFaces = 6;
diceImages = [];
diceSounds = [];
var intervalId = 0;     // used for the clearInterval function


// the dice object
function DiceObj(name, faces) {
    this.name = name;
    this.faces = faces;     // will hold an object of {face_id, face_file}

    this.fullName = function() {
        return this.name + " " + this.faces;
    };
}

// the sound effects object
function SoundObj(name, sound) {
    this.name = name;
    this.sound = sound;

    this.fullName = function() {
        return this.name + " " + this.sound;
    };
}

diceSound_shake = "";
diceSound_roll1 = "";
diceSound_roll2 = "";
diceSound_roll3 = "";
diceSound_rolling = "";

movementVars = {
    x : 10,
    y : 10,
    x_delta : 96,
    y_delta : 32,
    rotation : 0,
    rotation_delta: 45,
    scale : 2,
    interval : 3
};

$( document ).ready(function() {
    //console.log( "Ready!" );

/* moved to after the sound objects are added to the DOM
    // load the sounds
    diceSound_shake = document.getElementById("dice_shake_1");
    diceSound_roll1 = document.getElementById("dice_roll_1");
    diceSound_roll2 = document.getElementById("dice_roll_2");
    diceSound_roll3 = document.getElementById("dice_roll_3");
*/
    console.log('jQuery =', $);

    getUrl_DiceImages = "http://127.0.0.1:8000/getDiceImages";
    $.get(getUrl_DiceImages, getCallback_DiceImages);
/*
    jQuery.ajax({
    url: getUrl_DiceImages,
    dataType: 'text',
    type: "GET",
      success: getCallback_DiceImages
    });
*/

    // initialize the variables
    initVars();

    // load the dice images and sounds
    loadDiceImages();
    loadDiceSounds();
});

function getCallback_DiceImages(data, status) {
    console.log("getCallback_DiceImages()");

    console.log("status: ", status);
    console.log("data: ", data);
}

function loadDiceImages() {
    console.log("loadDiceImages()");

/*
    diceImages[0][0] = "First row first cell";
    diceImages[0][1] = "First row second cell";
    diceImages[0][2] = "First row third cell";
    diceImages[1][0] = "Second row first cell";
    diceImages[1][1] = "Second row second cell";
    diceImages[1][2] = "Second row third cell";
*/

    // create array with the number of dice
    numDice = 2;
    for (let i = 0; i < numDice; i++) {
        name = "Name" + i;
        faces = ["", ""];
        diceItem = new DiceObj(name, faces);
        diceImages.push(diceItem);
    }

    // load array with the dice faces
    /*
    faces = "";
    for (let i = 0; i < numDice; i++) {
        for (let j = 0; j < 3; j++){
            face = "face" + j;
            faces += face;
        }
        diceImages[i].faces = faces;
    }
    */
    faces = [];
    face_id = "dice_smile";
    face_file = "static/images/Dice Faces - 1 - Smile - v1 resize.png";
    faces.push({face_id, face_file});
    face_id = "dice_mad";
    face_file = "static/images/Dice Faces - 2 - Mad - v1 resize.png";
    faces.push({face_id, face_file});
    face_id = "dice_frown";
    face_file = "static/images/Dice Faces - 3 - Frown - v1 resize.png";
    faces.push({face_id, face_file});
    face_id = "dice_wink";
    face_file = "static/images/Dice Faces - 4 - Wink - v1 resize.png";
    faces.push({face_id, face_file});
    face_id = "dice_grim";
    face_file = "static/images/Dice Faces - 5 - Grim - v1 resize.png";
    faces.push({face_id, face_file});
    face_id = "dice_sad";
    face_file = "static/images/Dice Faces - 6 - Sad - v1 resize.png";
    faces.push({face_id, face_file});

    //console.log("array:", faces);
    diceImages[0].faces = faces;

    // insert the image elements into the Dom
    numThisDieFaces = diceImages[0].faces.length;
    for (let j = 0; j < numDieFaces; j++) {
        diceFaceId = diceImages[0].faces[j].face_id
        diceFaceFile = diceImages[0].faces[j].face_file;
        elementText = "<img id=\"" + diceFaceId + "\" src=\"" + diceFaceFile + "\" alt=\"Dice Smile Image\" width=\"32\" height=\"32\">";
        //console.log("elementText = ", elementText);

        $("#dice_images_id").append(elementText);
    }

    //console.log(elementText);

}

function loadDiceSounds() {
    console.log( "loadDiceSounds()" );

    // load array with the dice sounds
    sound_id = "dice_shake_1";
    sound_file = "static/sounds/diceshake-90280.mp3";
    //soundItem = new SoundObj(sound_id, sound_file);
    diceSounds.push({sound_id, sound_file});

    sound_id = "dice_roll_1";
    sound_file = "static/sounds/dice-142528.mp3";
    //soundItem = new SoundObj(sound_id, sound_file);
    diceSounds.push({sound_id, sound_file});

    sound_id = "dice_roll_2";
    sound_file = "static/sounds/dice_roll-96878.mp3";
    //soundItem = new SoundObj(sound_id, sound_file);
    diceSounds.push({sound_id, sound_file});

    sound_id = "dice_roll_3";
    sound_file = "static/sounds/diceland-90279.mp3";
    //soundItem = new SoundObj(sound_id, sound_file);
    diceSounds.push({sound_id, sound_file});

    console.log("Sound array:", diceSounds);

    // insert the sound elements into the Dom
    numSounds = diceSounds.length;
    for (let j = 0; j < numSounds; j++) {
        diceSoundId = diceSounds[j].sound_id;
        diceSoundFile = diceSounds[j].sound_file;
        //console.log("sound id: ", diceSoundId);
        //console.log("sound file: ", diceSoundFile);
    //<audio id="dice_shake_1"><source src="{% static 'sounds/diceshake-90280.mp3' %}" type="audio/mpeg">audio not supported</audio>
        elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";
        //console.log("elementText = ", elementText);

        $("#dice_sounds_id").append(elementText);
    }

    //console.log(elementText);

    // load the sounds
    diceSound_shake = document.getElementById("dice_shake_1");
    diceSound_roll1 = document.getElementById("dice_roll_1");
    diceSound_roll2 = document.getElementById("dice_roll_2");
    diceSound_roll3 = document.getElementById("dice_roll_3");
}

function initVars() {
    rotation = Number($('#rotation').val());
    scale = Number($('#scale').val());
    interval = Number($('#interval').val());

    movementVars.x = 10;
    movementVars.y = 10;
    movementVars.x_delta = 32;
    movementVars.y_delta = 0;
    movementVars.rotation = 0;
    movementVars.rotation_delta = rotation;
    movementVars.scale = scale;
    movementVars.interval = interval;

    tickCount = -1;
    dieToDraw = "dice_smile";
}

/*/
Draws an image with rotation and scaling
/*/
function drawImage(ctx, img, x, y, degrees = 0, scale = 1){
  ctx.save();
  ctx.translate(x + img.width * scale / 2, y + img.height * scale / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.translate(- x - img.width * scale / 2, - y - img.height * scale / 2);
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  ctx.restore();
}

function clearImage(ctx, img, x, y, degrees = 0, scale = 1){
  ctx.save();
  ctx.translate(x + img.width * scale / 2, y + img.height * scale / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.translate(- x - img.width * scale / 2, - y - img.height * scale / 2);
  // the +/- adjustment accounts for shadows left (not cleared) - maybe due to rounding or the difference between images and fill rects?
  ctx.clearRect(x-1, y-1, (img.width * scale) +2, (img.height * scale) +2);
  ctx.restore();
}

function updateMovementVars() {
    console.log("[updateMovementVars]");

    movementVars.x += movementVars.x_delta;
    movementVars.y += movementVars.y_delta;
    movementVars.rotation += movementVars.rotation_delta;

    console.log(movementVars)
}

/*/  No longer used

function timer_func(timerId) {

    if (tickCount < tickMax) {
        updateMovementVars();

        draw();

        // reset the timer
        tickCount += 1;
        setTimeout(timer_func, timerInterval, timerId);
    }
}
/*/

function draw(drawNewImage = true) {
    c = document.getElementById("canvas_1");
    ctx = c.getContext("2d");
    img = document.getElementById(dieToDraw);

    //console.log("  draw() x = ", movementVars.x, " y = ", movementVars.y, " rotation = ", movementVars.rotation, " scale = ", movementVars.scale)
    if (drawNewImage) {
        drawImage(ctx, img, movementVars.x, movementVars.y, movementVars.rotation, movementVars.scale)
    }
    else {
        clearImage(ctx, img, movementVars.x, movementVars.y, movementVars.rotation, movementVars.scale)
    }
}


function Action() {
    // play the audio
    diceSound_shake.play();

    // clear the table and reset the vars
    Clear();

    // pick a dice sound and set a timer to start the rolling (to allow the shake sound to complete)
    diceSound_rolling = PickDiceSound();
    id1 = setTimeout(StartRoll, diceShakeInterval, 1);
}

function PickDiceSound() {
    random = Math.floor(Math.random() * 3) + 1;

    random = 3;

    switch (random) {
        case 1:
            diceSound = diceSound_roll1;
            break;
        case 2:
            diceSound = diceSound_roll2;
            break;
        case 3:
            diceSound = diceSound_roll3;
            break;
        default:
            diceSound = diceSound_roll1;
            break;
    }

    return diceSound;
}

function StartRoll() {
    // choose the random dice face result number
    tickRandom = Math.floor(Math.random() * numDieFaces) + 1;

    // ensure the dice rolls for a few faces before landing on the final result
    if (tickRandom <= tickMax - numDieFaces) {
        tickRandom += numDieFaces;
    }

//    id1 = setTimeout(timer_func, timerInterval, 1);
    intervalId = setInterval(ShowNextDie, timerInterval, 1);
}

function ShowNextDie() {
    //console.log("tickCount = ", tickCount, " remainder = ", (tickCount + 2) % numDieFaces)

    diceSound_rolling.play();

    // tickCount starts at -1 and we want numbers 0-5
    switch ((tickCount + 1) % numDieFaces) {
        case 0:
            dieName = "dice_smile";
            break;
        case 1:
            dieName = "dice_mad";
            break;
        case 2:
            dieName = "dice_frown";
            break;
        case 3:
            dieName = "dice_wink";
            break;
        case 4:
            dieName = "dice_grim";
            break;
        case 5:
            dieName = "dice_sad";
            break;
        default:
            dieName = "dice_smile";
    }

    ShowSingleDie(dieName);

//    if (tickCount >= tickMax) {
    if (tickCount >= tickRandom) {
        clearInterval(intervalId);
        diceSound_rolling.pause();
        ShowResult();
    }
}

function ShowSingleDie(diceName) {
    dieToDraw = diceName
    var img = document.getElementById(dieToDraw);
    rotation = Number($('#rotation').val());
    scale = Number($('#scale').val());
    interval = Number($('#interval').val());

    //console.log("tickCount = ", tickCount, " interval = ", movementVars.interval, " result = ", Math.floor(tickCount / movementVars.interval), "even", Math.floor(tickCount / movementVars.interval) % 2 );

    // clears the previous image (before we update the location variables)
    draw(false);

    // if this is the first dice to draw then draw in the top left corner
    if (tickCount == -1) {
        movementVars.interval = interval;
        movementVars.x = 10;
        movementVars.x_delta = (img.width * scale) * 1.25;
        movementVars.y = 10;
        movementVars.y_delta = (img.height * scale) * .25;
        movementVars.rotation = 0;
        movementVars.scale = scale;
    }

    // if not the first position then determine the new position
    else {
        movementVars.interval = interval;
        // if tick count divided by interval is even move down else move up
        if (Math.floor(tickCount / movementVars.interval) % 2 == 0) {
            dir = 1;
            //console.log(" positive")
        }
        else {
            dir = -1;
            //console.log(" negative")
        }

        movementVars.x += movementVars.x_delta;
        movementVars.x_delta = (img.width * scale) * 1.25;
        movementVars.y += movementVars.y_delta * dir;
        movementVars.y_delta = (img.height * scale) * .25;
        movementVars.rotation += rotation;
        movementVars.scale = scale;
    }

    //console.log("image width = ", img.width, " scale = ", scale, " delta = ", movementVars.x_delta);
    //console.log(movementVars);

    draw();

    tickCount += 1;
    /*/
    if (tickCount >= tickMax) {
        tickCount = 1;
    }
    /*/
}


function Clear() {
    c = document.getElementById("canvas_1");
    ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width,c.height);
    element = document.getElementById("resultId");
    element.innerHTML = "";

    initVars();
}

function ShowResult() {
    element = document.getElementById("resultId");
    element.innerHTML = dieToDraw;

}
