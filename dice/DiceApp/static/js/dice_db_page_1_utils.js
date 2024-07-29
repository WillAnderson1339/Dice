
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

//    console.log("data:", data);
//    console.log("Status:", status);

//    console.log("serializing...");
    dice_list = JSON.parse(data);
//    console.log("...done serializing");
    name = dice_list[0].fields.name;
//    console.log("name = ", name);

//    console.log("looping:");
    for (die of dice_list) {
//        console.log("die id", die.pk);
//        console.log("die name", die.fields.name);
        elementText = "<li>";
        elementText += die.fields.name + "(id = " + die.pk + ")";
        elementText += "</li>";
        $("#list2").append(elementText);
    }
//    console.log(dice_list);
}


// example calling GET with a parameter
function GetDiceInfo() {
    console.log("GetDiceInfo() !1");

    dice_id = $('#dice_id').val();

    url = "getDiceInfo?id=" + dice_id;
    $.getJSON(url, GetDiceInfoCallback);
}

function GetDiceInfoCallback(data, status) {
    console.log("GetDiceInfoCallback()  !1");

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

        elementText = "<li>Bar</li>"
        elementText = "<li>name: " + data.defaultFaceFile + "</li>";
        $("#diceFacesId").append(elementText);
    }
}


// example calling GET with the id parameter in the URL itself
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
