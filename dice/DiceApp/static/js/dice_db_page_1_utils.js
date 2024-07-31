$(document).ready(function(){
//    console.log("db_page_1 ready !1");

    $('#dice_list_by_template_Id').hide();
});

function GetDiceList() {
    console.log("GetDiceList() !");
    // call the API with GET and no id_value as a parameter will return the list of dice instead of a specific Dice
    url = "DiceAPI";
    console.log("url to call:", url, "data is empty");

    $.ajax({
        type: 'GET',
        url: url,
        data:{},
        success: GetDiceListCallback,
        error: function(data, status) {console.log("ERROR calling url:", url);}
    });
}

function GetDiceListCallback(data, status) {
    console.log("GetDiceListCallback() !1");

//    console.log("data:", data);
//    console.log("Status:", status);

    dice_list = JSON.parse(data);

//    console.log(dice_list);
//    name = dice_list[0].fields.name;
//    console.log("name at pos 0:", name);

    // clear the list of any if they exist
    $("#diceList_id").empty();

    count = 0;
    for (die of dice_list) {
        elementText = "<li>";
        elementText += die.fields.name + "(id = " + die.pk + ")";
        elementText += "</li>";
        $("#diceList_id").append(elementText);
        count += 1;
    }

    // update the result tags
    response_result_string = "success"
    response_string = "<li>";
    response_string += "There are now " + String(count) + " Dice in the database"
    response_string += "</li>";
    $('#RESTResponseResult').text(response_result_string);
    $('#RESTResponse').empty();
    $("#RESTResponse").append(response_string);
}


// example calling GET with the id parameter in the URL itself (instead of as a parameter)
// NOTE: this GET call and the callback should be coded to return the Dice + Faces + Sounds and add the values to the
//       HTML but this is meant to illustrate the different calling method with the id in the URL line instead so
//       not coding everything (again)
function GetDiceIdFromURL() {
    console.log("GetDiceIdFromURL() !1");

    dice_id = $('#dice_id').val();

    url = "getDice/" + dice_id;
    console.log("url to call =", url);
//    $.getJSON(url, GetDice-oldCallback);
    $.getJSON(url, GetDiceCallback);
}

function DiceAPI(type) {
    console.log("DiceAPI(" + type + ") !1");


    return_val = "API type = " + type;
    $('#update_response_id').text(return_val);

    switch(type) {
      case "GET":
        dice_id = $('#dice_id').val();
        console.log("id = ", dice_id, "type is ", typeof(dice_id))
        url = "DiceAPI";
        console.log("url to call:", url, "data: id_value = ", dice_id);

        $.ajax({
            type: 'GET',
            url: url,
            data:{id_value: dice_id},
            success: GetDiceCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
       break;

      case "POST":
        dice_name = $('#dice_name').val();
        dice_defaultFaceFile = $('#default_face').val();
//        console.log("name = ", dice_name, "defaultFaceFile = ", dice_defaultFaceFile);

        // url = "postTest?value=" + post_value;
        // the query params will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "DiceAPI";
        console.log("url to call:", url, "data: name = ", dice_name, "defaultFaceFile = ", dice_defaultFaceFile);

        $.ajax({
            type: 'POST',
            url: url,
            data:{name: dice_name, defaultFaceFile: dice_defaultFaceFile, csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()},
            success: PostDiceCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
        break;

      case "PUT":
//        // note even when an int is passed to the ajax call it will be a string on the server side of the call
        dice_name = $('#dice_name').val();
        dice_defaultFaceFile = $('#default_face').val();
        console.log("name = ", dice_name, "defaultFaceFile = ", dice_defaultFaceFile);

        // the query params will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "DiceAPI";
        console.log("url to call:", url);

        csrftoken = $("[name=csrfmiddlewaretoken]").val();

        $.ajax({
            type: 'PUT',
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            data:{name: dice_name, defaultFaceFile: dice_defaultFaceFile, csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()},
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin', // Do not send CSRF token to another domain.
            success: PutDiceCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
        break;

      case "PATCH":
        // note even when an int is passed to the ajax call it will be a string on the server side of the call
        patch_ID = $('#patch_dice_id').val();
        patch_name = $('#dice_name').val();
        patch_defaultFaceFile = $('#default_face').val();
//        console.log("patch_ID = ", patch_ID, " patch_name = ", patch_name, "patch_defaultFaceFile = ", patch_defaultFaceFile, " type = (", typeof patch_ID, ")");

        // the query params will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "DiceAPI";
        console.log("url to call:", url, "data: id_value = ", patch_ID, "name = ", patch_name, "defaultFaceFile = ", patch_defaultFaceFile);

        csrftoken = $("[name=csrfmiddlewaretoken]").val();

        $.ajax({
            type: 'PATCH',
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            data:{id_value: patch_ID, name: patch_name, defaultFaceFile: patch_defaultFaceFile, csrfmiddlewaretoken: csrftoken},
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin', // Do not send CSRF token to another domain.
            success: PatchDiceCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
        break;

      case "DELETE":
        delete_ID = $('#delete_dice_id').val();

        // url = "postTest?value=" + post_value;
        // the value parameter will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "DiceAPI";
        console.log("url to call:", url, "data: id_value = ", delete_ID);

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

function GetDiceCallback(data, status) {
    console.log("GetDiceCallback()  !1");

//    console.log("data:", data);
//    console.log("status:", status);

    return_val = JSON.parse(data);

    if (status == "success") {
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
            if (return_val.hasOwnProperty('diceFaces') == false) {
                    display_text += "<li>no dice faces in return response</li>";
            }
            else {
                for (index in return_val.diceFaces) {
                    display_text += "<li>" + return_val.diceFaces[index].name + " " + return_val.diceFaces[index].file + "</li>";
                }
            }
            display_text += "</ul>";

            // now add the dice sound
            display_text += "<li>Sound File:</li>";
            display_text += "<ul>";
            if (return_val.hasOwnProperty('diceSound') == false) {
                display_text += "<li>no sound in return response</li>";
            }
            else {
                display_text += "<li>" + return_val.diceSound.name + " " + return_val.diceSound.file + "</li>";
            }
            display_text += "</ul>";
        }
        $("#RESTResponseResult").text("success");
        $("#RESTResponse").empty();
        $("#RESTResponse").append(display_text);
    }

    // when (if) the server returns a 500 error this is never reached - this callback function is not called
    else {
        console.log("GET call returned error:", status)
    }
}

function PostDiceCallback(data, status) {
    console.log("PostDiceCallback() !1");

//    console.log("data:", data);
//    console.log("Status:", status);

    return_val = JSON.parse(data);

//    console.log("return_val:", return_val);

    // returnVal will be an object of the deleted item if successfully deleted or a string saying ID not found
    if (typeof return_val == 'object') {
        response_result_string = "success"
        response_string = "<li>";
        response_string += "inserted item: [" + return_val.id_value + "] " + return_val.name
        response_string += "</li>";
    }
    else {
        display_string = return_val;
        response_result_string = "unable to insert"
        response_string = "<li>";
        response_string += return_val
        response_string += "</li>";
    }

    // update the result tags
    $('#RESTResponseResult').text(response_result_string);
    $('#RESTResponse').empty();
    $("#RESTResponse").append(response_string);
}

function PutDiceCallback(data, status) {
    console.log("PutDiceCallback() !1");

//    console.log("data:", data);
//    console.log("Status:", status);

    return_val = JSON.parse(data);

//    console.log("return_val:", return_val);

    // returnVal will be an object of the deleted item if successfully deleted or a string saying ID not found
    if (typeof return_val == 'object') {
        response_result_string = "success"
        response_string = "<li>";
        response_string += "inserted item: [" + return_val.id_value + "] " + return_val.name
        response_string += "</li>";
    }
    else {
        display_string = return_val;
        response_result_string = "unable to insert"
        response_string = "<li>";
        response_string += return_val
        response_string += "</li>";
    }

    // update the result tags
    $('#RESTResponseResult').text(response_result_string);
    $('#RESTResponse').empty();
    $("#RESTResponse").append(response_string);
}

function PatchDiceCallback(data, status) {
    console.log("PatchDiceCallback() !1");

//    console.log("data:", data);
//    console.log("Status:", status);

    return_val = JSON.parse(data);

//    console.log("return_val:", return_val);

    // returnVal will be an object of the deleted item if successfully deleted or a string saying ID not found
    if (typeof return_val == 'object') {
        response_result_string = "success"
        response_string = "<li>";
        response_string += "updated item: [" + return_val.id_value + "] " + return_val.name
        response_string += "</li>";
    }
    else {
        display_string = return_val;
        response_result_string = "unable to update"
        response_string = "<li>";
        response_string += return_val
        response_string += "</li>";
    }

    // update the result tags
    $('#RESTResponseResult').text(response_result_string);
    $('#RESTResponse').empty();
    $("#RESTResponse").append(response_string);
}

function DeleteDiceCallback(data, status) {
    console.log("DeleteDiceCallback() !1");

//    console.log("data:", data);
//    console.log("Status:", status);

    return_val = JSON.parse(data);
//    console.log("return_val:", return_val);

    // returnVal will be an object of the deleted item if successfully deleted or a string saying ID not found
    if (typeof return_val == 'object') {
        response_result_string = "success"
        response_string = "<li>";
        response_string += "removed item: [" + return_val.id_value + "] " + return_val.name
        response_string += "</li>";
    }
    else {
        display_string = return_val;
        response_result_string = "unable to delete"
        response_string = "<li>";
        response_string += return_val
        response_string += "</li>";
    }

    // update the result tags
    $('#RESTResponseResult').text(response_result_string);
    $('#RESTResponse').empty();
    $("#RESTResponse").append(response_string);
}
