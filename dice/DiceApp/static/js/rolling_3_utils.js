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

/* Helper function to return the die by id. Check the returned die id for -1 for die not found */
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

/* helper function to determine the id string of the image tag in the DOM. Used for inserting and the retrieving the tag */
function getImageIdString (dice_id, image_id) {
    idString = "Image-DieId" + dice_id + "-ImageId" + image_id;
//    console.log("imageID String:", idString);
    return idString;
}

/* helper function to determine the id string of the sound tag in the DOM. Used for inserting and the retrieving the tag */
function getSoundIdString (dice_id, sound_id) {
    idString = "RollingSound-DieId" + dice_id + "-SoundId" + sound_id;
//    console.log("soundID String:", idString);
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
});


function GetDiceListCallback(data, status) {
    console.log("GetDiceListCallback() !1");

//    console.log("data:", data);
//    console.log("Status:", status);

    return_val = JSON.parse(data);

//    count = 0;
    for (die of return_val) {
        // add the button to select this dice
        dice_id = die.pk;
        elementText = "<button onclick=\"ChooseDie(" + String(dice_id) + ")\" style=\"margin-left: 1em\">" + die.fields.name;
        elementText += "</button>";
//        console.log("HTML:", elementText)
        $("#DiceListButtons").after(elementText);
//        count += 1;

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

    // set the currently selected dice to the last one loaded (had to pick something - note that an invalid or missing ID will be handled by the funtion)
    ChooseDie(dice_id);
}

function ChooseDie(dice_id) {
    console.log("ChooseDie() with id=", dice_id);

    m_chosenDiceId = dice_id;       // ToDo: no longer needed - using the module scope die object instead of the die ID

    // update the element with the chosen die for rolling
    text = String(dice_id);
    $('#DiceNameToRoll').text(text);

    m_chosenDie = getDiceById(dice_id);
//    console.log("chosen die:", m_chosenDie);

    if (m_chosenDie.id != -1)
    {
        if (m_chosenDie.faces.length == 0) {
            // load the chosen dice info
            url = "DiceAPI";
            console.log("url to call: \"", url, "\"  data param =", dice_id);

            $.ajax({
                type: 'GET',
                url: url,
                data:{id_value: dice_id},
                success: GetDiceCallback,
                error: function(data, status) {console.log("ERROR calling url:", url);}
            });
        }
        else
        {
            console.log("faces for this dice already loaded");
        }
    }
    else
    {
        console.log("unknown dice id =", dice_id);
    }
}

function GetDiceCallback(data, status) {
    console.log("GetDiceCallback()  !1");

//    console.log("data:", data);
//    console.log("status:", status);

    return_val = JSON.parse(data);

    if (status == "success") {
        if (typeof return_val == "string") {
            display_text = return_val;      // TODO: need to update this code
        }
        if (typeof return_val == "object") {
//            console.log("return_val:", return_val);

            if (m_chosenDie.id != -1) {
                // add the shaking sound element
                if (return_val.shakeSoundFile != "")
                {
                    // add the audio tag to the DOM
                    diceSoundId = "ShakingSound-DieId"+m_chosenDie.id;
                    diceSoundFile = return_val.shakeSoundFile;
                    elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";

                    $("#dice_sounds_id").append(elementText);

                    // update the shake sound ID in the Dice object
                    m_chosenDie.shakeSoundFile = return_val.shakeSoundFile; // ToDo: is this needed?  just use the element ID?
                    m_chosenDie.shakeSoundElementId = diceSoundId;
                }

                // add the image files for the dice faces
                if (return_val.hasOwnProperty('diceFaces') == false) {
                    console.log("no dice faces in return response");        // ToDo: update this code
                }
                else {
                    for (index in return_val.diceFaces) {
                        // add the img tag to the DOM
                        image_id = getImageIdString(m_chosenDie.id, return_val.diceFaces[index].image_id);
                        image_name = return_val.diceFaces[index].name;
                        image_file = return_val.diceFaces[index].file;
                        elementText = "<img id=\"" + image_id + "\" name=\"" + image_name + "\" src=\"" + image_file + "\" alt=\"" + image_id + "\" width=\"32\" height=\"32\">";
                        $("#dice_images_id").append(elementText);

                        // update the faces image info in the list
                        item = {
                            "image_id" : return_val.diceFaces[index].image_id,
                            "name" : return_val.diceFaces[index].name,
                            "file" : return_val.diceFaces[index].file
                        };
                        m_chosenDie.faces.push(item);
                    }
//                    console.log("faces:", m_chosenDie.faces);
                }

                // add the rolling sound
                if (return_val.hasOwnProperty('diceSound') == false) {
                    console.log("no dice sound in return response");
                }
                else {
                    // add the audio tag to the DOM
                    diceSoundId = getSoundIdString(m_chosenDie.id, return_val.diceSound.sound_id);
                    diceSoundFile = return_val.diceSound.file;
                    elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";

                    $("#dice_sounds_id").append(elementText);

                    // update the sound ID in the list
                    m_chosenDie.diceRollingId = diceSoundId;
                }
            }
        }
    }

    // NOTE: when (if) the server returns a 500 error this is never reached - this callback function is not called
    else {
        console.log("GET call returned error:", status)
    }
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

/******************************************
Draws an image with rotation and scaling
*******************************************/
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
    diceSound_shaking = document.getElementById(m_chosenDie.shakeSoundElementId);
    diceSound_shaking.play();

    // clear the table and reset the vars
    Clear();

    if (m_chosenDie.id != -1) {
        diceSoundId = m_chosenDie.diceRollingId;
        diceSound_rolling = document.getElementById(m_chosenDie.diceRollingId);
    }

    // sets a timer with a callback to allow the shake dice sound to finish. Callback will start timer for the dice roll
    id1 = setTimeout(StartRoll, diceShakeInterval, 1);
}


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
//    console.log("ShowNextDie() tickCount = ", tickCount);

    numDieFaces = m_chosenDie.faces.length;

    diceSound_rolling.play();

    // tickCount starts at -1 and we want numbers 0-5
    index = (tickCount + 1) % numDieFaces;
    imageIdString = getImageIdString(m_chosenDie.id, m_chosenDie.faces[index].image_id)

    ShowSingleDie(imageIdString);

    if (tickCount >= tickRandom) {
        clearInterval(intervalId);
        diceSound_rolling.pause();
        ShowResult(m_chosenDie.faces[index].name);
    }
}

/* called from the buttons labeled with "First", "Second", "Third", etc. and also internally from the ShowNextDie() */
function ShowSingleDie(diceName) {
//    console.log("ShowSingleDie()  image = ", diceName);

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
    else
    {
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

    $('#resultId').text(resultName);
}
