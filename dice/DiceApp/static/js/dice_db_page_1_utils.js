
function GetDiceList() {
    console.log("GetDiceList() !1");

    url = "getDiceList";
//    $.getJSON(url, GetDiceListCallback);

    $.ajax({
        type: 'GET',
        url: url,
        success: GetDiceListCallback,
        error: function(data, status) {console.log("ERROR calling url:", url, "data:", data, "success:", success);}
    });
}

function GetDiceListCallback(data, status) {
    console.log("GetDiceListCallback() !1");

    console.log("data:", data);
    console.log("Status:", status);

    dice_list = JSON.parse(data);
    console.log("JSON parsed:");
    console.log(dice_list);
    name = dice_list[0].fields.name;
    console.log("name at pos 0:", name);
    console.log("length of list: ", dice_list.length);
    console.log("list 0:");
    console.log(dice_list[0]);
    console.log("list 1:");
    console.log(dice_list[1]);

    console.log("looping:");
    for (die of dice_list) {
        console.log("die id", die.pk);
        console.log("die name", die.fields.name);
        elementText = "<li>";
        elementText += die.fields.name + "(id = " + die.pk + ")";
        elementText += "</li>";
        $("#list2").append(elementText);
    }
    console.log("list:")
    console.log(dice_list);
}


// example calling GET with a parameter
function GetDiceInfo() {
    console.log("GetDiceInfo() !1");

    dice_id = $('#dice_id').val();

    url = "getDiceInfo?id=" + dice_id;
    console.log("url to call =", url);
    $.getJSON(url, GetDiceInfoCallback);
}

function GetDiceInfoCallback(data, status) {
    console.log("GetDiceInfoCallback()  !1");

    console.log("data:", data);
    console.log("status:", status);

    if (status == "success") {
        $("#diceInfoId").removeAttr("hidden");
        $("#diceFacesId").empty();

        // save this line for when we use this function to insert the audio tags
        //elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";

        return_val = JSON.parse(data);

        if (typeof return_val == "string") {
            display_text = return_val;
        }
        if (typeof return_val == "object") {
            display_text = "<li>name: " + return_val.name + "</li>";
            display_text += "<li>default Face File: " + return_val.defaultFaceFile + "</li>";

            // now add the dice face filenames
            display_text += "<li>Face Files:</li>";
            display_text += "<ul>";
            for (index in return_val.diceFaces) {
//                console.log("index = ", index, "name = ", return_val.diceFaces[index].name, "file = ", return_val.diceFaces[index].file);
                display_text += "<li>" + return_val.diceFaces[index].name + " " + return_val.diceFaces[index].file + "</li>";
            }
            display_text += "</ul>";

            // now add the dice sound
            console.log("sound name = ", return_val.diceSound.name, "file = ", return_val.diceSound.file);
            display_text += "<li>Sound File:</li>";
            display_text += "<ul>";
            display_text += "<li>" + return_val.diceSound.name + " " + return_val.diceSound.file + "</li>";
            display_text += "</ul>";
        }
        $("#diceFacesId").append(display_text);
    }
}


// example calling GET with the id parameter in the URL itself (instead of as a parameter)
function GetDice() {
    console.log("GetDice() !1");

    dice_id = $('#dice_id').val();

    url = "getDice/" + dice_id;
    console.log("url to call =", url);
    $.getJSON(url, GetDiceCallback);
}

function GetDiceCallback(data, status) {
    console.log("GetDiceCallback()  !1");

    console.log("data:", data);
    console.log("status:", status);

    if (status == "success") {
        $("#diceInfoId").removeAttr("hidden");
        $("#diceFacesId").empty();

        element = document.getElementById("diceNameId");
        element.innerHTML = "Dice Info:";

        //elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";
        elementText = "<li>name: " + data.name + "</li>";
        $("#diceFacesId").append(elementText);

        elementText = "<li>name: " + data.defaultFaceFile + "</li>";
        $("#diceFacesId").append(elementText);
    }
}
