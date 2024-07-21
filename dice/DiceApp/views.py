from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core.serializers import serialize
from json import JSONEncoder
# import requests
import json

from .models import Dice
from .serializers import DiceSerializer


# Create your views here.

def page_router(request):
    # print("page_router handler")
    if "/" == request.path.lower():
        return render(request, "home.html")
    if "home" in request.path.lower():
        return render(request, "home.html")
    elif "about" in request.path.lower():
        return render(request, "about.html")
    elif "roll_1" in request.path.lower():
        return render(request, "rolling_test_1.html")
    elif "roll_2" in request.path.lower():
        return render(request, "rolling_test_2.html")
    elif "dice_db_page_1" in request.path.lower():
        items = Dice.objects.all()
        return render(request, "dice_db_page_1.html", {"Dice": items})
    else:
        return HttpResponse("unknown page request " + request.path)


def get_dice_list(request):
    qs = Dice.objects.all()
    print("printing the query set")
    print(qs)
    print("done")

    data = serialize("json", qs, fields=('name', 'defaultFaceFile'))

    print("printing the serialized data")
    print(data)
    print("done")

    # if return JsonResponse() object it would cause our JSON output to contain backslashes due to double serialization
    # return HttpResponse(data, content_type="application/json")
    return JsonResponse(data, safe=False)


def get_dice_info(request):
    print("get_dice_info()")

    # die_id = request.GET.get('id', 1) would use default of 1 if id not supplied
    # parameters = request.GET.dict() to access params as a dict. can also use request.GET
    # parameters = request.GET.items() to access as list of key-value pairs
    die_id = request.GET.get('id')
    print("die_id =", die_id)
    if die_id is None:
        print("setting die_id = 1")
        die_id = "1"

    qs = Dice.objects.get(pk=die_id)
    # qs = Dice.objects.all()
    # print("printing the query set")
    # print(qs)
    # print("done")
    # 4 different ways to print a string with parameters
    # print("Name:", qs.name, " defaultFaceFile: ", qs.defaultFaceFile)
    # output = f"Name: {qs.name} defaultFaceFile: {qs.defaultFaceFile}"
    # print(output)
    print(f"Name: {qs.name} defaultFaceFile: {qs.defaultFaceFile}")
    # print(qs.name)
    # print("printing the defaultFaceFile")
    # print(qs.defaultFaceFile)

    print("qs: ", qs)
    # data = serialize("json", qs, fields=('name', 'defaultFaceFile'))
    data = qs
    print("data: ", data)

    # print("printing the non-serialized data")
    # print(data)
    print("done")

    serializer = DiceSerializer(qs)
    print("serializer.data: ", serializer.data)

    # if return JsonResponse() object it would cause our JSON output to contain backslashes due to double serialization
    # return HttpResponse("Hello World", content_type="application/json")
    # return JsonResponse(data, safe=False)
    return JsonResponse(serializer.data)


def get_dice(request, dice_id):
    print("get_dice()", dice_id)
    dice = get_object_or_404(Dice, id=dice_id)
    serializer = DiceSerializer(dice)
    return JsonResponse(serializer.data)


def get_dice_images(request):
    print('get_dice_images()')
    dice_name = ""
    all_dice = Dice.objects.all()
    # print("Showing all dice below:")
    # print(all_dice)
    # print("all dice shown above")
    dice_list = ""
    for die in all_dice:
        if dice_list == "":
            dice_list += die.name
        else:
            dice_list += ", "
            dice_list += die.name

    dice_name += dice_list
    print("printing dice_name")
    print(dice_name)
    print("done")

    status = 200
    # return HttpResponse(dice_name, status)
    return JsonResponse(dice_name, safe=False)


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

    get_type = request.GET.get('get_type', None)
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

    print("line 1")

    # test = []
    # test.append('Hello World!')
    # test.append('Hello Windows!')
    #
    # print("printing the test data:", test)
    # data = serialize("json", test)
    #
    # print("printing the serialized data")
    # print(data)
    # print("done")

    print("line 2")

    # a Python object (dict):
    x = "Hello World!"

    # convert into JSON:
    y = json.dumps(x)

    # the result is a JSON string:
    print(y)

    data = y

    # if return JsonResponse() object it would cause our JSON output to contain backslashes due to double serialization
    # return HttpResponse(data, content_type="application/json")
    return JsonResponse(data, safe=False)


def get_test_object(request):
    print("get_test_object()")

    print("line 1")

    # test = []
    # test.append('Hello World!')
    # test.append('Hello Windows!')
    #
    # print("printing the test data:", test)
    # data = serialize("json", test)
    #
    # print("printing the serialized data")
    # print(data)
    # print("done")

    fav_colours = ["red", "blue"]
    print("line 2")
    # a Python object (dict):
    x = {
        "name": "John",
        "age": 30,
        "city": "New York",
        "fav_colours": fav_colours
    }

    # convert into JSON:
    y = json.dumps(x)

    # the result is a JSON string:
    print(y)

    data = y

    # if return JsonResponse() object it would cause our JSON output to contain backslashes due to double serialization
    # return HttpResponse(data, content_type="application/json")
    return JsonResponse(data, safe=False)


class Employee:
    def __init__(self, name, age, salary, fav_colours, address):
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


def get_test_class(request):
    print("get_test_class()")

    address = Address("Alpharetta", "7258 Spring Street", "30004")
    fav_colours = ["orange", "grey"]
    employee = Employee("Herb", 38, 9000, fav_colours, address)

    # print("Printing to check how it will look like")
    # print(EmployeeEncoder().encode(employee))

    # print("Encode Employee Object into JSON formatted Data using custom JSONEncoder")
    employeeJSONData = json.dumps(employee, indent=4, cls=EmployeeEncoder)
    # print(employeeJSONData)

    # Let's load it using the load method to check if we can decode it or not.
    # print("Decode JSON formatted Data")
    # employeeJSON = json.loads(employeeJSONData)
    # print(employeeJSON)

    data = employeeJSONData

    return JsonResponse(data, safe=False)


def get_test_list(request):
    print("get_test_list()")

    print("line 1")

    # test = []
    # test.append('Hello World!')
    # test.append('Hello Windows!')
    #
    # print("printing the test data:", test)
    # data = serialize("json", test)
    #
    # print("printing the serialized data")
    # print(data)
    # print("done")

    print("line 2")
    # a Python object (dict):
    fav_colours = ["red", "blue"]
    x1 = {
        "name": "John",
        "age": 30,
        "city": "New York",
        "fav_colours": fav_colours
    }

    fav_colours = ["cyan"]
    x2 = {
        "name": "Fred",
        "age": 22,
        "city": "Los Angeles",
        "fav_colours": fav_colours
    }

    fav_colours = ["yellow", "teal", "rose"]
    x3 = {
        "name": "Sue",
        "age": 26,
        "city": "Miami",
        "fav_colours": fav_colours
    }

    arr = [x1, x2]
    arr.append(x3)

    # convert into JSON:
    data = json.dumps(arr)

    # the result is a JSON string:
    print(data)

    # if return JsonResponse() object it would cause our JSON output to contain backslashes due to double serialization
    # return HttpResponse(data, content_type="application/json")
    return JsonResponse(data, safe=False)
