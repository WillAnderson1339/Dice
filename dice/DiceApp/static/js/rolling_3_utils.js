const timerInterval = 150;
const diceShakeInterval = 1000;
var tickCount = 1;
const tickMax = 11;
var tickRandom = -1;        // This will hold the randomized number choice dice face
var dieToDraw = "dice_smile";
const m_numDieFaces = 6;
var m_chosenDiceId = -1;    // holds the id of the dice to roll
var m_chosenDie = null;     // holds the dice object of the dice to roll
diceList   = [];
diceImages = [];
diceSounds = [];
var intervalId = 0;     // used for the clearInterval function


// the dice object
function DiceObj(id, name, defaultFaceFile, shakeSoundFile, diceRollingId, faces) {
    this.id = id,
    this.name = name;
    this.defaultFaceFile = defaultFaceFile;
    this.shakeSoundFile = shakeSoundFile;
    this.shakeSoundElementId = "";
    this.diceRollingId = diceRollingId;
    this.faces = faces;     // will hold an object of {face_id, face_name, face_file}

    this.fullName = function() {
        return this.name + " " + this.defaultFaceFile;
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

m_diceSound_shaking = "";
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

// Helper function to return the die by id. Check the returned die id for -1 for die not found
function getDiceById(dice_id) {
    for (die of diceList) {
        if (die.id == dice_id)
        {
            return die;
        }
    }

    // no die found for that id
    console.log("no die found with id:", dice_id);
    faces = [];
    no_die_found = new DiceObj(-1, "", "", "", -1, faces);
    return no_die_found;
}

// helper function to determine the id string of the image tag in the DOM. Used for inserting and the retrieving the tag
function getImageIdString (dice_id, image_id) {
    idString = "Image-DieId" + dice_id + "-ImageId" + image_id;
    console.log("imageID String:", idString);
    return idString;
}

// helper function to determine the id string of the sound tag in the DOM. Used for inserting and the retrieving the tag
function getSoundIdString (dice_id, sound_id) {
    idString = "RollingSound-DieId" + dice_id + "-SoundId" + sound_id;
    console.log("soundID String:", idString);
    return idString;
}


$( document ).ready(function() {
    console.log( "Document Ready "+document.URL.split("/").pop() + ".html" );
//    console.log("documentURI is: ", document.documentURI)
//    console.log("baseURI is: ", document.baseURI)
//    console.log("URL is: ", document.URL)
//    page = document.URL.split("/").pop();
//    console.log( page );

    // get the list of dice
    url = "DiceAPI";
    console.log("url to call: \"", url, "\"  data param = empty");

    $.ajax({
        type: 'GET',
        url: url,
        data:{},
        success: GetDiceListCallback,
        error: function(data, status) {console.log("ERROR calling url:", url);}
    });

    // initialize the variables
    initVars();

    // load the dice images and sounds
    loadDiceImages();
    loadDiceSounds();
});


function GetDiceListCallback(data, status) {
    console.log("GetDiceListCallback() !1");

    console.log("data:", data);
    console.log("Status:", status);

    return_val = JSON.parse(data);

    count = 0;
    for (die of return_val) {
        // add the button to select this dice
        dice_id = die.pk;
        elementText = "<button onclick=\"ChooseDie(" + String(dice_id) + ")\" style=\"margin-left: 1em\">" + die.fields.name;
        elementText += "</button>";
//        console.log("HTML:", elementText)
        $("#DiceListButtons").after(elementText);
        count += 1;

        // add this dice to the dice list with default values. Full values will be updated from GetDiceCallback
        dice_id = die.pk;
        name = die.fields.name;
        defaultFaceFile = die.fields.defaultFaceFile;
        shakeSoundFile = "";
        diceRollingId = -1;
        faces = [];
        diceItem = new DiceObj(dice_id, name, defaultFaceFile, shakeSoundFile, diceRollingId, faces);

//        console.log("dice added to list:", diceItem);
        diceList.push(diceItem);
    }
}

function ChooseDie(dice_id) {
    console.log("ChooseDie() with ", dice_id);

    text = String(dice_id);
    $('#DiceNameToRoll').text(text);
    m_chosenDiceId = dice_id;
    console.log("m_chosenDiceId = ", m_chosenDiceId);

//    for (die of diceList) {
//        console.log("checking dice name", die.name, "id", die.id);
//        if (die.id == dice_id)
        m_chosenDie = getDiceById(m_chosenDiceId);
        console.log("chosen die:", m_chosenDie);

        if (m_chosenDie.id != -1)
        {
//            console.log("found dice in list");
            if (m_chosenDie.faces.length == 0) {
                console.log("no faces in this dice yet");

                // load the chosen dice info
//                dice_id = m_chosenDie.id;
                url = "DiceAPI";
                console.log("url to call: \"", url, "\"  data param =", dice_id);

                $.ajax({
                    type: 'GET',
                    url: url,
                    data:{id_value: dice_id},
                    success: GetDiceCallback,
                    error: function(data, status) {console.log("ERROR calling url:", url);}
                });
//                break;
            }
            else
            {
                console.log("found faces in this dice");
            }
        }
//    }
}

function GetDiceCallback(data, status) {
    console.log("GetDiceCallback()  !1");

    console.log("data:", data);
    console.log("status:", status);

    return_val = JSON.parse(data);

    if (status == "success") {
        // save this line for when we use this function to insert the audio tags
        //elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";

        if (typeof return_val == "string") {
            display_text = return_val;      // TODO: need to update this code
        }
        if (typeof return_val == "object") {
            console.log("return_val:", return_val);
            dice_id = return_val.id_value;
//            dice_id = return_val.pk;
            console.log("looking for dice id ", dice_id);
            found_dice = false;
//            for (die of diceList) {
//                console.log("checking dice name ", die.name, "die.id = ", die.id, "dice_id = ", dice_id);
//                if (die.id == dice_id)
                if (m_chosenDie.id != -1) {
//                    console.log("found dice " + die.name + " in list", die.id, " ", dice_id);
                    found_dice = true;

                    // add the shaking sound element
                    if (return_val.shakeSoundFile != "")
                    {
                        // add the audio tag to the DOM
                        console.log("dice shake sound found in return response");

                        // add the audio tag to the DOM
                        console.log("** sound:", return_val.shakeSoundFile);
//                        diceSoundId = getSoundIdString(dice_id, "ShakeSound");
                        diceSoundId = "ShakingSound-DieId"+dice_id;
                        diceSoundFile = return_val.shakeSoundFile;
                        elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";
                        console.log("elementText = ", elementText);

                        $("#dice_sounds_id").append(elementText);

                        // update the shake sound ID in the Dice object
                        m_chosenDie.shakeSoundFile = return_val.shakeSoundFile; // ToDo: is this needed?  just use the element ID?
                        m_chosenDie.shakeSoundElementId = diceSoundId;
//                        console.log("sound... ");
//                        console.log("sound = ", return_val.shakeSoundFile);
                    }
                    if (return_val.hasOwnProperty('diceFaces') == false) {
                        console.log("no dice faces in return response");        // ToDo: update this code
                    }
                    else {
//                        console.log("dice faces found in return response");

                        for (index in return_val.diceFaces) {
                            // add the img tag to the DOM
                            image_id = getImageIdString(dice_id, return_val.diceFaces[index].image_id);
                            image_name = return_val.diceFaces[index].name;
                            image_file = return_val.diceFaces[index].file;
                            elementText = "<img id=\"" + image_id + "\" name=\"" + image_name + "\" src=\"" + image_file + "\" alt=\"" + image_id + "\" width=\"32\" height=\"32\">";
                            console.log("elementText = ", elementText);
                            $("#dice_images_id").append(elementText);

                            // update the faces image info in the list
                            item = {
                                "image_id" : return_val.diceFaces[index].image_id,
                                "name" : return_val.diceFaces[index].name,
                                "file" : return_val.diceFaces[index].file
                            };
                            m_chosenDie.faces.push(item);
                        }
//                        console.log("faces:", m_chosenDie.faces);
                        console.log("added ", m_chosenDie.faces.length, "images");
                    }

                    // add the sound
                    if (return_val.hasOwnProperty('diceSound') == false) {
                        console.log("no dice sound in return response");
                    }
                    else {
                        // add the audio tag to the DOM
                        console.log("dice sounds found in return response");
                        // add the audio tag to the DOM
                        console.log("** sound:", return_val.diceSound);
                        diceSoundId = getSoundIdString(dice_id, return_val.diceSound.sound_id);
                        diceSoundFile = return_val.diceSound.file;
                        elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";
                        console.log("elementText = ", elementText);

                        $("#dice_sounds_id").append(elementText);

                        // update the sound ID in the list
                        m_chosenDie.diceRollingId = diceSoundId;
                        console.log("* rolling sound updated: ", diceSoundId);
                    }
                    // ToDO: should I add a break statement here?
//                    break;
                }
//            }
            if (found_dice == false) {
                console.log("could not find die id", dice_id)
            }
        }
    }

    // when (if) the server returns a 500 error this is never reached - this callback function is not called
    else {
        console.log("GET call returned error:", status)
    }
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
        defaultFaceFile = "TBD";
        faces = ["", ""];
        diceItem = new DiceObj(i, name, defaultFaceFile, "", -1, faces);
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
    numDieFaces = m_numDieFaces;    // change this to setting to the num die faces for this die
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

/* called from the Action button */
function Action() {
    console.log( "Action()" );

    // play the audio
//    diceSound_shake.play();
//    m_diceSound_shaking.play();
    console.log("shakeSoundElementID= ", m_chosenDie.shakeSoundElementId)
    diceSound_shaking = document.getElementById(m_chosenDie.shakeSoundElementId);
//    m_chosenDie.shakeSoundElementId.play();
    diceSound_shaking.play();

    // clear the table and reset the vars
    Clear();

    // pick a dice sound and set a timer to start the rolling (to allow the shake sound to complete)
//    diceSound_rolling = PickDiceSound();
    if (m_chosenDiceId != -1)
    {
        dieToRoll = getDiceById(m_chosenDiceId);
        if (dieToRoll.id != -1) {
            sound_id = dieToRoll.diceRollingSound;
//            console.log("getting sound id string from die:", dieToRoll.id);
//            diceSoundId = getSoundIdString(dieToRoll.id, dieToRoll.diceRollingId);
//            shakeSoundElementId = dieToRoll.shakeSoundElementId;
            diceSoundId = dieToRoll.diceRollingId;
//            console.log("* soundIDString to retrieve audio element = ", diceSoundId);

//            console.log("shakeSoundElementID= ", dieToRoll.shakeSoundElementId)
//            m_diceSound_shaking = document.getElementById(dieToRoll.shakeSoundElementId);
            diceSound_rolling = document.getElementById(diceSoundId);
        }
    }

    // sets a timer with a callback to allow the shake dice sound to finish. Callback will start timer for the dice roll
    id1 = setTimeout(StartRoll, diceShakeInterval, 1);
}

/*
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
*/

function StartRoll() {
//    numDieFaces = m_numDieFaces;    // change this to setting to the num die faces for this die
    numDieFaces = m_chosenDie.faces.length;

    // choose the random dice face result number
    // ToDO: fix this - it is not random!
    // Wait - is this the random face to start with?
    tickRandom = Math.floor(Math.random() * numDieFaces) + 1;
    console.log("!!! CHOOSING RANDOM ANSWER = ", tickRandom);

    // ensure the dice rolls for a few faces before landing on the final result
    if (tickRandom <= tickMax - numDieFaces) {
        tickRandom += numDieFaces;
    }

    // sets a timer with a callback to show the next die face
//    id1 = setTimeout(timer_func, timerInterval, 1);
    intervalId = setInterval(ShowNextDie, timerInterval, 1);
}

/* callback from the timer */
function ShowNextDie() {
    console.log("ShowNextDie() tickCount = ", tickCount);

//    numDieFaces = m_numDieFaces;    // change this to setting to the num die faces for this die
    numDieFaces = m_chosenDie.faces.length;
    //console.log("tickCount = ", tickCount, " remainder = ", (tickCount + 2) % numDieFaces)

    diceSound_rolling.play();

    // tickCount starts at -1 and we want numbers 0-5
    index = (tickCount + 1) % numDieFaces;
    console.log("index = ", index, "(tickCount + 1 = ", tickCount + 1, "numDieFaces = ", numDieFaces, ")");
//    imageIdString = m_chosenDie.faces[index].image_id;
    imageIdString = getImageIdString(m_chosenDie.id, m_chosenDie.faces[index].image_id)
//    console.log("imageIdString = ", imageIdString);

    /*
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
    */

    ShowSingleDie(imageIdString);

//    if (tickCount >= tickMax) {
    console.log("tickCount = ", tickCount, "tickRandom = ", tickRandom);
    if (tickCount >= tickRandom) {
        clearInterval(intervalId);
        diceSound_rolling.pause();
        ShowResult(m_chosenDie.faces[index].name);
    }
}

/* called from the buttons labeled with "First", "Second", "Third", etc. and also internally from the ShowNextDie() */
function ShowSingleDie(diceName) {
    console.log("ShowSingleDie()  image = ", diceName);

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


/* called from the Clear button and also internally from the Action() function */
function Clear() {
    c = document.getElementById("canvas_1");
    ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width,c.height);
    element = document.getElementById("resultId");
    element.innerHTML = "";

    initVars();
}

/* Shows the resulting (final) dice role */
function ShowResult(resultName) {
    console.log("ShowResult() with name = ", resultName);

//    element = document.getElementById("resultId");
//    element.innerHTML = dieToDraw;

//    id = m_chosenDie.id;
//    name = $('#resultId').attr('name');
//    console.log("name = ", name);
//    name = $('#resultId').prop('name');
//    console.log("name = ", name);

    $('#resultId').text(resultName);
//    $('#DiceNameToRoll').text(text);
}
