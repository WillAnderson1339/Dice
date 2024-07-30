
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

    return_val = JSON.parse(data);

    if (status == "success") {
        $("#diceInfoId").removeAttr("hidden");
        $("#diceFacesId").empty();

        // save this line for when we use this function to insert the audio tags
        //elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";

        if (typeof return_val == "string") {
            display_text = return_val;
        }
        if (typeof return_val == "object") {
            display_text = "<li>name: " + return_val.name + "</li>";
            display_text += "<li>default Face File: " + return_val.defaultFaceFile + "</li>";

            // now add the dice face filenames
            display_text += "<li>Face Files:</li>";
            display_text += "<ul>";
            if (return_val.diceFaces.length == 0) {
                    display_text += "<li>no dice faces found</li>";
            }
            else {
                for (index in return_val.diceFaces) {
                    display_text += "<li>" + return_val.diceFaces[index].name + " " + return_val.diceFaces[index].file + "</li>";
                }
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

    // when (if) the server returns a 500 error this is never reached - this callback function is not called
    else {
        console.log("GET call returned error:", status)
    }
}


// example calling GET with the id parameter in the URL itself (instead of as a parameter)
// NOTE: this GET call and the callback should be coded to return the Dice + Faces + Sounds and add the values to the
//       HTML but this is meant to illustrate the different calling method with the id in the URL line instead so
//       not coding everything (again)
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

    return_val = JSON.parse(data);

    if (status == "success") {
        $("#diceInfoId").removeAttr("hidden");
        $("#diceFacesId").empty();

        element = document.getElementById("diceNameId");
        element.innerHTML = "Dice Info:";

        elementText = "<li>name: " + return_val.name + "</li>";
        $("#diceFacesId").append(elementText);

        elementText = "<li>name: " + return_val.defaultFaceFile + "</li>";
        $("#diceFacesId").append(elementText);
    }
}


function DiceAPI(type) {
    console.log("DiceAPI(" + type + ") !1");


    return_val = "API type = " + type;
    $('#update_response_id').text(return_val);

    switch(type) {
      case "GET":
        console.log("GET!");
        console.log("not yet implemented");
//        get_type = $("input[name='get_type2']:checked").val();
//        url = "RESTAPITest";
//        console.log("url to call:", url);
//
//        $.ajax({
//            type: 'GET',
//            url: url,
//            data:{get_type: get_type},
//            success: GetTestCallback,
//            error: function(data, status) {console.log("ERROR calling url:", url);}
//        });
       break;

      case "POST":
        console.log("POST!");

        post_value_name = $('#post_dice_name').val();
        post_value_defaultFaceFile = $('#post_default_face').val();
        console.log("name = ", post_value_name, "defaultFaceFile = ", post_value_defaultFaceFile);

        // url = "postTest?value=" + post_value;
        // the query params will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "DiceAPI";
        console.log("url to call:", url, "data: name = ", post_value_name, "defaultFaceFile = ", post_value_defaultFaceFile);

        $.ajax({
            type: 'POST',
            url: url,
//            data:{value: post_value, csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()},
            data:{name: post_value_name, defaultFaceFile: post_value_defaultFaceFile, csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()},
            success: PostDiceCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
        break;

      case "PATCH":
        console.log("PUT!!!");
        console.log("not yet implemented");
//        // note even when an int is passed to the ajax call it will be a string on the server side of the call
//        put_ID = $('#put_ID_id').val();
//        put_name = $('#put_name_id').val();
//        put_age = $('#put_age_id').val();
//        console.log("put_ID = ", put_ID, " put_name = ", put_name, "put_age = ", put_age, " type = (", typeof put_age, ")");
//
//        // the query params will be added in the data section of the AJAX call. This is b/c I don't know how to specify
//        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
//        url = "RESTAPITest";
//        console.log("url to call:", url);
//
//        csrftoken = $("[name=csrfmiddlewaretoken]").val();
//
//        $.ajax({
//            type: 'PATCH',
//            url: url,
//            dataType: 'json',
//            contentType: 'application/json',
//            data:{id_value: put_ID, name: put_name, age: put_age, csrfmiddlewaretoken: csrftoken},
//            headers: {'X-CSRFToken': csrftoken},
//            mode: 'same-origin', // Do not send CSRF token to another domain.
//            success: PatchTestCallback,
//            error: function(data, status) {console.log("ERROR calling url:", url);}
//        });
        break;

      case "PUT":
        console.log("PUT!");
        console.log("not yet implemented");
//        // note even when an int is passed to the ajax call it will be a string on the server side of the call
//        put_ID = $('#put_ID_id').val();
//        put_name = $('#put_name_id').val();
//        put_age = $('#put_age_id').val();
//        console.log("put_ID = ", put_ID, " put_name = ", put_name, "put_age = ", put_age, " type = (", typeof put_age, ")");
//
//        // the query params will be added in the data section of the AJAX call. This is b/c I don't know how to specify
//        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
//        url = "RESTAPITest";
//        console.log("url to call:", url);
//
//        csrftoken = $("[name=csrfmiddlewaretoken]").val();
//
//        $.ajax({
//            type: 'PUT',
//            url: url,
//            dataType: 'json',
//            contentType: 'application/json',
//            data:{id_value: put_ID, name: put_name, age: put_age, csrfmiddlewaretoken: csrftoken},
//            headers: {'X-CSRFToken': csrftoken},
//            mode: 'same-origin', // Do not send CSRF token to another domain.
//            success: PutTestCallback,
//            error: function(data, status) {console.log("ERROR calling url:", url);}
//        });
        break;

      case "DELETE":
        console.log("DELETE!");
        delete_ID = $('#delete_dice_id').val();
        console.log("delete_ID = ", delete_ID);

        // url = "postTest?value=" + post_value;
        // the value parameter will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "DiceAPI";
        console.log("url to call:", url);

        csrftoken = $("[name=csrfmiddlewaretoken]").val();

        $.ajax({
            type: 'DELETE',
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            data:{id_value: delete_ID, csrfmiddlewaretoken: csrftoken},
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin', // Do not send CSRF token to another domain.
            success: DeleteDiceCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
        break;

      default:
        console.log("Unknown type = ", type);
    }
}


//function PostDice() {
//    console.log("PostDice() !1");
//
//    url = "postDice";
//
//    $.ajax({
//        type: 'POST',
//        url: url,
//        success: PostDiceListCallback,
//        error: function(data, status) {console.log("ERROR calling url:", url, "data:", data, "success:", success);}
//    });
//}

function PostDiceCallback(data, status) {
    console.log("PostDiceCallback() !1");

    console.log("data:", data);
    console.log("Status:", status);

    return_val = JSON.parse(data);

    console.log("return_val:", return_val);

    console.log("done");
}

function DeleteDiceCallback(data, status) {
    console.log("DeleteDiceCallback() !1");

    console.log("data:", data);
    console.log("Status:", status);

    return_val = JSON.parse(data);

    console.log("return_val:", return_val);

    console.log("done");
}

