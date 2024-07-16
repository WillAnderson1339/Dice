
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


function GetTest() {
    console.log("GetTest() !1");

//    url = "getTestString";
//    url = "getTestObject";
//    url = "getTestList";
//    url = "getTestObject?type=" + "Object";
//    url = "getTest?get_type=" + "String";
//    url = "getTest?get_type=" + "List";

    get_type = $("input[name='get_type']:checked").val();
    url = "getTest?get_type=" + get_type;
    console.log("url to call:", url)

    $.ajax({
        type: 'GET',
        url: url,
        success: GetTestCallback,
        error: function(data, status) {console.log("ERROR calling url:", url);}
    });
}

function GetTestCallback(data, status) {
    console.log("GetTestCallback() !1");

//    console.log("data:", data);
//    console.log("Status:", status);

    return_val = JSON.parse(data);

    if (Array.isArray(return_val) == true) {
    }

    if (typeof return_val == "string") {
        console.log("Serialized data (string):", return_val);

        display_string = return_val;
    }
    // NOTE: typeof will return object for the array return type so check for isArray first
    else if (Array.isArray(return_val) == true) {
        console.log("Serialized data (list):", return_val);
        display_string = "";
        for (item of return_val) {
            console.log("item:", item);
            if (display_string.trim().length > 0) {
                display_string += ", ";
            }
            display_string += item.name + " " + item.age + " " + item.city;
            display_string += " (";
            isFirst = true;
            for (colour of item.fav_colours) {
                if (isFirst == false) {
                    display_string += ", ";
                }
                display_string += colour;
                isFirst = false;
            }
            display_string += ")";
        }
    }
    else if (typeof return_val == "object") {
        console.log("Serialized data (object):", return_val);

        display_string = return_val.name + " " + return_val.age + " " + return_val.city;
        display_string += " (";
        isFirst = true;
        for (colour of return_val.fav_colours) {
            if (isFirst == false) {
                display_string += ", ";
            }
            display_string += colour;
            isFirst = false;
        }
        display_string += ")";
    }
    else {
        console.log("unknown return type!!", typeof return_val);
        display_string = "unknown return type: " + typeof return_val;
    }

    element = document.getElementById("Test1");
    element.innerHTML = display_string;
}

// the GetTestList function is redundant with the GetTest() function .. change this to the Post example...
function GetTestList() {
    console.log("GetTestList() !1");

    url = "getTestList";

    $.ajax({
        type: 'GET',
        url: url,
        success: GetTestListCallback,
        error: function(data, status) {console.log("ERROR calling url:", url);}
    });
}

function GetTestListCallback(data, status) {
    console.log("GetTestListCallback() !1");

    console.log("data:", data);
    console.log("Status:", status);

//    console.log("serializing...");
    testList = JSON.parse(data);
//    console.log("...done serializing");
    console.log("Serialized data:", testList);

    num = testList.length;
    console.log("num entries:", num);

    for (item of testList) {
        console.log("item:", item);
        console.log("name:", item.name, "age:", item.age, "city:", item.city);
    }

    element = document.getElementById("Test2");
    element.innerHTML = testList[0].name + " " + testList[0].age + " " + testList[0].city;
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
