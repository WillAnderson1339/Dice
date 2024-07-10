
function GetDiceInfo() {
    console.log("GetDiceInfo() !2");

    $("#diceInfoId").removeAttr("hidden");

//    dice_id = Number($('#dice_id').val());
    dice_id = $('#dice_id').val();
    console.log("id to retrieve = ", dice_id);

    //console.log("line one");

    element = document.getElementById("diceNameId");
    element.innerHTML = "Dice Info:";

    //console.log("before get call");

//    url = "getDiceImages";
    url = "getDiceInfo?id=" + dice_id;
//    url = "getDiceInfo";
    console.log("1: url = ", url);
    $.getJSON(url, GetDiceInfoCallback);
    /*
    $.ajax({
        type: 'GET',
        //url: '/getDiceImages',
        url: url,
        success: GetDiceInfoCallback,
        error: function(data, status) {console.log("ERROR:", data, success);}
    });
    */


//    url = "getDiceList";
//    $.getJSON(url, GetDiceListCallback);
}


function GetDice() {
    console.log("GetDice() !1");

    $("#diceInfoId").removeAttr("hidden");

//    dice_id = Number($('#dice_id').val());
    dice_id = $('#dice_id').val();
    console.log("id to retrieve = ", dice_id);

    //console.log("line one");

    element = document.getElementById("diceNameId");
    element.innerHTML = "Dice Info:";

    url = "getDice/" + dice_id;
    console.log("2: url = ", url);
    $.getJSON(url, GetDiceCallback);
}

function GetDiceList() {
    url = "getDiceList";
    $.getJSON(url, GetDiceListCallback);
}

function GetDiceListCallback(data, status) {
    console.log("GetDiceListCallback() ***!1");

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

/*
*/
function GetDiceInfoCallback(data, status) {
    console.log("GetDiceInfoCallback()  !3");

    console.log("data:", data);
    console.log("status:", status);

    $("#diceFacesId").empty();

    //elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";
    if (status == "success"){
        //elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";
        elementText = "<li>name: " + data.name + "</li>";
        $("#diceFacesId").append(elementText);

        elementText = "<li>Bar</li>"
        elementText = "<li>name: " + data.defaultFaceFile + "</li>";
        $("#diceFacesId").append(elementText);
    }
}


function GetDiceCallback(data, status) {
    console.log("GetDiceCallback()  !1");

    console.log("data:", data);
    console.log("status:", status);

    if (status == "success"){
        $("#diceFacesId").empty();

        //elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";
        elementText = "<li>name: " + data.name + "</li>";
        $("#diceFacesId").append(elementText);

        elementText = "<li>Bar</li>"
        elementText = "<li>name: " + data.defaultFaceFile + "</li>";
        $("#diceFacesId").append(elementText);
    }
}
