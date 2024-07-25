

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
    console.log("GetTestCallback() !4");

//    console.log("data:", data);
//    console.log("Status:", status);

    return_val = JSON.parse(data);

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
            display_string += "[" + item.id_value + "] " + item.name + " " + item.age + " " + item.city;
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
    // NOTE: typeof will return object for a standard python object and a class object
    else if (typeof return_val == "object") {
        console.log("Serialized data (object):", return_val);

        // the test code has the city in the address object if this a class object was serialized
        // typeof return_val.address will be "undefined" when the object is a standard python object
        // if (typeof return_val.address === "object") {
        // alternate javascript is to use the if in technique
        // if ("address" in return_val) {
        // alternate javascript is to check if the property is undefined
        //if (return_val.city === undefined) {
        // alternate javascript is to use the hasOwnProperty method
        if (return_val.hasOwnProperty("city") == false) {
            // set the city value of return_val from the city field of the return_val.address object
            return_val.city = return_val.address.city;
        }

        display_string = "[" + return_val.id_value + "] " + return_val.name + " " + return_val.age + " " + return_val.city;
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

/*
// this function gets the csrf token value - it is not needed because jQuery offers an easier way of doing this
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
*/

function PostTest() {
    console.log("PostTest() !22");

//    url = "getTestString";
//    url = "getTestObject";
//    url = "getTestList";
//    url = "getTestObject?type=" + "Object";
//    url = "getTest?get_type=" + "String";
//    url = "getTest?get_type=" + "List";

    post_value_name = $('#post_value').val();
    post_value_age = 22;
    post_value_city = "London";
    console.log("name = ", post_value_name, "age = ", post_value_age, "city = ", post_value_city);

//    url = "postTest?value=" + post_value;
    // the value parameter will be added in the data section of the AJAX call. This is b/c I don't know how to specify
    // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
    url = "postTest";
    console.log("url to call:", url, "data: name=", post_value_name, " age=", post_value_age, " city=", post_value_city);

//    const csrftoken = getCookie('csrftoken');
//    const csrftoken = $(“[name=csrfmiddlewaretoken]”).val();

    $.ajax({
        type: 'POST',
        url: url,
        data:{name: post_value_name, age: post_value_age, city: post_value_city, csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()},
        success: PostTestCallback,
        error: function(data, status) {console.log("ERROR calling url:", url);}
    });
}

function PostTestCallback(data, status) {
    console.log("PostTestCallback() !22");

//    console.log("data:", data);
//    console.log("Status:", status);

    return_val = JSON.parse(data);
    console.log("return_val = ", return_val);

    $('#Test2').text(return_val);
}

function PutTestCallback(data, status) {
    console.log("PutTestCallback() !1");

    console.log("data:", data);
    console.log("Status:", status);

    return_val = JSON.parse(data);
    console.log("return_val = ", return_val);

    $('#Test2').text(return_val);
}


function DeleteTestCallback(data, status) {
    console.log("DeleteTestCallback() !1");

    console.log("data:", data);
    console.log("Status:", status);

    return_val = JSON.parse(data);
    console.log("return_val = ", return_val);

    $('#Test2').text(return_val);
}

function RESTAPITest(type) {
    console.log("RESTAPITest(" + type + ") !1");


    return_val = "API type = " + type;
    $('#update_response_id').text(return_val);

    switch(type) {
      case "GET":
        console.log("GET!");
        get_type = $("input[name='get_type2']:checked").val();
        url = "RESTAPITest";
        console.log("url to call:", url);

        $.ajax({
            type: 'GET',
            url: url,
            data:{get_type: get_type},
            success: GetTestCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
       break;

      case "POST":
        console.log("POST!!");

        post_value_name = $('#post_value_name').val();
        post_value_age = $('#post_value_age').val();
        post_value_city = $('#post_value_city').val();
        console.log("name = ", post_value_name, "age = ", post_value_age, "city = ", post_value_city);

        // url = "postTest?value=" + post_value;
        // the value parameter will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "RESTAPITest";
        console.log("url to call:", url, "data: name = ", post_value_name, "age = ", post_value_age, "city = ", post_value_city);

        $.ajax({
            type: 'POST',
            url: url,
//            data:{value: post_value, csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()},
            data:{name: post_value_name, age: post_value_age, city: post_value_city, csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()},
            success: PostTestCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
        break;

      case "PUT":
        console.log("PUT!");
        put_ID = $('#put_ID_id').val();
        put_value = $('#put_value_id').val();
        console.log("put_ID = ", put_ID, " put_val = ", put_value);

        // url = "postTest?value=" + post_value;
        // the value parameter will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "RESTAPITest";
        console.log("url to call:", url);

        csrftoken = $("[name=csrfmiddlewaretoken]").val();

        $.ajax({
            type: 'PUT',
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            data:{ID: put_ID, value: put_value, csrfmiddlewaretoken: csrftoken},
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin', // Do not send CSRF token to another domain.
            success: PutTestCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
        break;

      case "DELETE":
        console.log("DELETE!");
        delete_ID = $('#delete_ID_id').val();
        console.log("delete_ID = ", delete_ID);

        // url = "postTest?value=" + post_value;
        // the value parameter will be added in the data section of the AJAX call. This is b/c I don't know how to specify
        // the csrf token other than providing the data attr (and that over-rides the previously supplied parameters on the url line)
        url = "RESTAPITest";
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
            success: DeleteTestCallback,
            error: function(data, status) {console.log("ERROR calling url:", url);}
        });
        break;

      default:
        console.log("Unknown type = ", type);
    }
}
