import urllib

from django.http import JsonResponse
from json import JSONEncoder
import json

string_value = "Hello World!!"
list_of_people = []


class Employee:
    def __init__(self, id_value, name, age, salary, fav_colours, address):
        self.id_value = id_value
        self.name = name
        self.age = age
        self.salary = salary
        self.fav_colours = fav_colours
        self.address = address


class Address:
    def __init__(self, city, street, pin):
        self.city = city
        self.street = street
        self.pin = pin


# subclass JSONEncoder
class EmployeeEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


def get_next_id_value():
    print("get_next_id_value()")

    global list_of_people

    num_items = len(list_of_people)
    # print("num items = ", num_items)

    if num_items == 0:
        next_id_value = 1
    else:
        next_id_value = 0
        for item in list_of_people:
            # print("item", item)
            item_value = item['id_value']
            if item_value > next_id_value:
                next_id_value = item_value
        next_id_value += 1

    # print("returning next id = ", next_id_value)
    return next_id_value


def get_index_of_id_value(id_value):
    print("get_index_of_id_value() with value = ", id_value)

    global list_of_people

    # if list is empty return -1
    if len(list_of_people) == 0:
        # print("list is empty returning index of", -1)
        return -1

    index = 0

    for item in list_of_people:
        item_value = item['id_value']
        if item_value == id_value:
            break
        index += 1

    if index == len(list_of_people):
        # print("ID", index, "not found, returning ", -1)
        return -1
    else:
        # print("returning index of ", index)
        return index


def get_test(request):
    # access all query params as a dictionary like this: parameters = request.GET.dict() or parameters = request.GET
    # access all query params as a list of key-value pairs like this: parameters = request.GET.items()
    # to build URL strings with parameters (to call a different URL from a python script or handler) use reverse:
    #   from django.urls import reverse
    #   url = reverse('search') + '?query=django&page=1'
    #   response = requests.get(url)
    #   if response.status_code == 200:
    #     data = response.json()
    #     return HttpResponse(data)
    #   else:
    #     return HttpResponse("Error retrieving data")
    # documentation on the Request and Response objects: https://docs.djangoproject.com/en/5.0/ref/request-response/

    get_type = request.GET.get('get_type', "String")
    print("get_test()", get_type)

    if get_type == "String":
        response = get_test_string(request)
    elif get_type == "Object":
        response = get_test_object(request)
    elif get_type == "Class":
        response = get_test_class(request)
    elif get_type == "List":
        response = get_test_list(request)
    else:
        response = "unknown type" + get_type

    return response


def get_test_string(request):
    print("get_test_string()")

    if request.method != "GET":
        print("unexpected API method = ", request.method)
        data_string = "unexpected API method = " + request.method
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    data = json.dumps(string_value)

    return JsonResponse(data, safe=False)


def get_test_object(request):
    print("get_test_object()")

    if request.method != "GET":
        print("unexpected API method = ", request.method)
        data_string = "unexpected API method = " + request.method
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    fav_colours = ["red", "blue"]
    # a Python object (dict):
    x = {
        "id_value": 20,
        "name": "John",
        "age": 30,
        "city": "New York",
        "fav_colours": fav_colours
    }

    # convert into JSON:
    y = json.dumps(x)

    # the result is a JSON string:
    # print(y)

    data = y

    # if return JsonResponse() object it would cause our JSON output to contain backslashes due to double serialization
    # return HttpResponse(data, content_type="application/json")
    return JsonResponse(data, safe=False)


def get_test_class(request):
    print("get_test_class()")

    if request.method != "GET":
        print("unexpected API method = ", request.method)
        data_string = "unexpected API method = " + request.method
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    address = Address("Alpharetta", "7258 Spring Street", "30004")
    fav_colours = ["orange", "grey"]
    employee = Employee(31, "Herb", 38, 9000, fav_colours, address)

    # print("Printing to check how it will look like")
    # print(EmployeeEncoder().encode(employee))

    # print("Encode Employee Object into JSON formatted Data using custom JSONEncoder")
    employee_json_data = json.dumps(employee, indent=4, cls=EmployeeEncoder)
    # print(employeeJSONData)

    # Let's load it using the load method to check if we can decode it or not.
    # print("Decode JSON formatted Data")
    # employee_json = json.loads(employee_json_data)
    # print(employee_json)

    data = employee_json_data

    return JsonResponse(data, safe=False)


def init_list_values():
    print("init_list_values()")

    global list_of_people

    next_id_value = 100

    # a Python object (dict):
    fav_colours = ["red", "blue"]
    x1 = {
        "id_value": next_id_value,
        "name": "John",
        "age": 30,
        "city": "New York",
        "fav_colours": fav_colours
    }

    next_id_value += 1
    fav_colours = ["cyan"]
    x2 = {
        "id_value": next_id_value,
        "name": "Fred",
        "age": 22,
        "city": "Los Angeles",
        "fav_colours": fav_colours
    }

    next_id_value += 1
    fav_colours = ["yellow", "teal", "rose"]
    x3 = {
        "id_value": next_id_value,
        "name": "Sue",
        "age": 26,
        "city": "Miami",
        "fav_colours": fav_colours
    }

    # initialize an array with objects
    list_of_people = [x1, x2]
    # these 2 lines avoid the warning recommendation of initializing the literal arr with [x1, x2, x3]
    num_items = list_of_people.count(x1)
    num_items += 1

    # now show appending an object
    list_of_people.append(x3)

    # print("list count = ", len(list_of_people))

    return


def get_test_list(request):
    print("get_test_list()")

    if request.method != "GET":
        print("unexpected API method = ", request.method)
        data_string = "unexpected API method = " + request.method
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # if the list is empty then initialize it (this should not be done in a GET it should be done by an initialize)
    if len(list_of_people) == 0:
        init_list_values()

    # convert into JSON:
    data = json.dumps(list_of_people)

    # the result is a JSON string:
    # print(data)

    # if return JsonResponse() object it would cause our JSON output to contain backslashes due to double serialization
    # return HttpResponse(data, content_type="application/json")
    return JsonResponse(data, safe=False)


def post_test(request):
    print("post_test()")

    global list_of_people

    # if the list is empty then initialize it (this should not be done in a GET it should be done by an initialize)
    if len(list_of_people) == 0:
        init_list_values()

    post_value_name = request.POST.get('name', "Loki")
    post_value_age = request.POST.get('age', 99)
    post_value_city = request.POST.get('city', "Hades")
    # print("post_test()", post_value_name, " ", post_value_age, " ", post_value_city)

    # print("typeof age = ", type(post_value_age))

    # age_number = int(post_value_age)
    age_string = str(post_value_age)

    next_id_value = get_next_id_value()
    fav_colours = ["brown", "pink"]
    item = {
        "id_value": next_id_value,
        "name": post_value_name,
        "age": post_value_age,
        "city": post_value_city,
        "fav_colours": fav_colours
    }

    list_of_people.append(item)

    data_string = "the POST value was: " + post_value_name + age_string + post_value_city
    data = json.dumps(data_string)

    return JsonResponse(data, safe=False)



def patch_test(request):
    print("patch_test()")

    global list_of_people

    data_string = "API method = " + request.method
    data = json.dumps(data_string)

    # Parse the query string into a dictionary
    body = request.body.decode('utf-8')
    # print(body)

    # print("parsed data:")
    parsed_data = urllib.parse.parse_qs(body)
    # print(parsed_data)

    # convert the parsed data to an object
    # returns a dictionary with lists as values, we'll extract the single values
    query_args = {k: v[0] for k, v in parsed_data.items()}

    # there must be a better way of safely getting the params and providing error if query params are missing
    put_value_id = 99
    put_value_name = ""
    put_value_age = 99
    if 'id_value' in query_args:
        query_args['id_value'] = int(query_args['id_value'])  # is there a better way to do this?
        put_value_id = query_args['id_value']
    if 'name' in query_args:
        put_value_name = query_args['name']
    if 'age' in query_args:
        put_value_age = query_args['age']
        put_value_age = int(put_value_age)

    # print("params:", put_value_id, " (type =", type(put_value_id), ") ", put_value_name, " ", put_value_age, " (type =", type(put_value_age), ") ")

    index = get_index_of_id_value(put_value_id)
    if index == -1:
        data_string = "PUT called but the requested id was not found: " + str(put_value_id)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # print("found ID", put_value_id, " at position ", index)

    # fav_colours = ["coral", "mauve"]
    item = list_of_people[index]
    if put_value_name != "":
        item['name'] = put_value_name
    if put_value_age != 99:
        item['age'] = put_value_age
    list_of_people[index] = item

    data_string = item
    data = json.dumps(data_string)

    return JsonResponse(data, safe=False)


def put_test(request):
    """The HTTP PUT method is used to create a new resource or replace a resource. It’s similar to the POST method,
    in that it sends data to a server, but it’s idempotent. This means that the effect of multiple PUT requests
    should be the same as one PUT request."""
    print("put_test()")

    global list_of_people

    data_string = "API method = " + request.method
    data = json.dumps(data_string)

    # put_value_id = request.POST.get('id_value', 99)
    # put_value_name = request.POST.get('name', "Hades")
    # put_value_age = request.POST.get('age', 40)
    # print("params:", put_value_id, " (type =", type(put_value_id), ") ", put_value_name, " ", put_value_age, " (type =", type(put_value_age), ") ")

    # Parse the query string into a dictionary
    body = request.body.decode('utf-8')
    # print(body)

    # print("parsed data:")
    parsed_data = urllib.parse.parse_qs(body)
    # print(parsed_data)

    # convert the parsed data to an object
    # returns a dictionary with lists as values, we'll extract the single values
    query_args = {k: v[0] for k, v in parsed_data.items()}

    # there must be a better way of safely getting the params and providing error if query params are missing
    put_value_id = 99
    put_value_name = ""
    put_value_age = 99
    if 'id_value' in query_args:
        query_args['id_value'] = int(query_args['id_value'])  # is there a better way to do this?
        put_value_id = query_args['id_value']
    if 'name' in query_args:
        put_value_name = query_args['name']
    if 'age' in query_args:
        put_value_age = query_args['age']
        put_value_age = int(put_value_age)

    # print("params:", put_value_id, " (type =", type(put_value_id), ") ", put_value_name, " ", put_value_age, " (type =", type(put_value_age), ") ")

    index = get_index_of_id_value(put_value_id)
    if index == -1:
        data_string = "PUT called but the requested id was not found: " + str(put_value_id)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # print("found ID", put_value_id, " at position ", index)

    fav_colours = ["coral", "mauve"]
    item = {
        "id_value": put_value_id,
        "name": put_value_name,
        "age": put_value_age,
        "city": "Seattle",          # did not add the city to the test so just hard code it
        "fav_colours": fav_colours  # did not add the fav colours to the test so just hard code it
    }
    list_of_people[index] = item

    data_string = item
    data = json.dumps(data_string)

    return JsonResponse(data, safe=False)


def delete_test(request):
    print("delete_test()")

    global list_of_people

    # # this block of code illustrates accessing the params in a query string
    # print("testing")
    # # Query string
    # query_string = "id_value=101&age=33"
    #
    # # Parse the query string into a dictionary
    # parsed_data = urllib.parse.parse_qs(query_string)
    #
    # # Convert the parsed data into a more convenient format
    # # parse_qs returns a dictionary with lists as values, we'll extract the single values
    # python_object = {k: v[0] for k, v in parsed_data.items()}
    #
    # # Now you can access the data
    # print(python_object)
    # print(f"ID: {python_object['id_value']}")
    # print(f"Age: {python_object['age']}")
    # print("done testing")

    # print("request body:")
    # print(request.body)
    # print("request body decode utf-8:")

    # Parse the query string into a dictionary
    body = request.body.decode('utf-8')
    # print(body)

    # print("parsed data:")
    parsed_data = urllib.parse.parse_qs(body)
    # print(parsed_data)

    # convert the parsed data to an object
    # returns a dictionary with lists as values, we'll extract the single values
    query_args = {k: v[0] for k, v in parsed_data.items()}

    if 'id_value' in query_args:
        query_args['id_value'] = int(query_args['id_value'])  # is there a better way to do this?
        id_value = query_args['id_value']
    else:
        keys = ""
        for key in query_args.keys():
            if len(keys) == 0:
                keys += key
            else:
                keys += ", " + key
        data_string = request.method + " called but id_value missing. Keys = " + keys
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    index = get_index_of_id_value(id_value)
    if index == -1:
        data_string = "DELETE called but the requested id was not found: " + str(id_value)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    print("found ID", id_value, " at position ", index)

    num_items = len(list_of_people)
    print("num items = ", num_items)

    item = list_of_people.pop(index)

    num_items = len(list_of_people)
    print("num items after pop = ", num_items)

    print("item removed: ", item)
    print("item removed name: ", item['name'])

    # data_string = "API method = " + request.method
    data_string = item
    data = json.dumps(data_string)

    return JsonResponse(data, safe=False)


def rest_api_test(request):
    # post_value = request.POST.get('value', None)
    print("rest_api_test() method = ", request.method)
    # print("the request object:")
    # print(request)

    if request.method == "GET":
        response = get_test(request)
        return response

    elif request.method == "POST":
        response = post_test(request)
        return response

    elif request.method == "PUT":
        response = put_test(request)
        return response

    elif request.method == "PATCH":
        response = patch_test(request)
        return response

    elif request.method == "DELETE":
        response = delete_test(request)
        return response

    else:
        print("unexpected API method = ", request.method)
        data_string = "unexpected API method = " + request.method
        data = json.dumps(data_string)

        return JsonResponse(data, safe=False)

    # get the parameter
    # post_value = request.POST["value"]
    # try:
    #     post_value = request.POST["value"]
    # except (KeyError, Choice.DoesNotExist):
    #     print("key named 'value' not found in URL")
    #     data_string = "key named 'value' not found in URL"
    # else:
    #     print("key named 'value' found with value of: ", post_value)
    #     data_string = "the posted value was: " + post_value

    # data = json.dumps(data_string)

    # return JsonResponse(data, safe=False)
