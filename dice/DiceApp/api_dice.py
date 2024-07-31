import urllib

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core.serializers import serialize
import json

from .models import Dice, DiceFaces, DiceSounds
from .serializers import DiceSerializer


def bold_text(text):
    """util functions - consider moving into a util library """
    return "\033[1m" + text + "\033[0m"


def get_dice_list(request):
    """GET call to return Dice objects"""
    print("get_dice_list()")

    qs = Dice.objects.all()
    # print("printing the query set")
    # print(qs)
    # print("done")

    data = serialize("json", qs, fields=('name', 'defaultFaceFile'))

    # print("printing the serialized data")
    # print(data)
    # print("done")

    # if return JsonResponse() object it would cause our JSON output to contain backslashes due to double serialization
    # return HttpResponse(data, content_type="application/json")
    return JsonResponse(data, safe=False)


def dice_api(request):
    """this is the common handler for all REST calls for the Dice object (other than the list of Dice objects) """
    print("dice_api() method = ", request.method)
    # print("the request object:")
    # print(request)

    if request.method == "GET":
        response = get_dice_info(request)
        return response

    elif request.method == "POST":
        response = post_dice(request)
        return response

    elif request.method == "PUT":
        response = put_dice(request)
        return response

    elif request.method == "PATCH":
        response = patch_dice(request)
        return response

    elif request.method == "DELETE":
        response = delete_dice(request)
        return response

    else:
        print("unexpected API method = ", request.method)
        data_string = "unexpected API method = " + request.method
        data = json.dumps(data_string)

        return JsonResponse(data, safe=False)


# API call with the ID as a parameter (instead of in the URL line)
def get_dice_info(request):
    print("get_dice_info()")

    # die_id = request.GET.get('id', 1) would use default of 1 if id not supplied
    # parameters = request.GET.dict() to access params as a dict. can also use request.GET
    # parameters = request.GET.items() to access as list of key-value pairs
    die_id = request.GET.get('id')
    # print("die_id =", die_id)
    if die_id is None:
        data_string = "die_id param missing"
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # lookup the id with exception handling
    try:
        qs = Dice.objects.get(pk=die_id)

        # Retrieve all DiceFaces related to the Dice object
        # commenting out the next line and moving it to its own try/catch code below
        # dice_faces = DiceFaces.objects.filter(dice=qs)
        # for face in dice_faces:
        #     print(f"- {face.name}: {face.file}")

        # Retrieve all sounds related to the Dice object
        dice_sound = DiceSounds.objects.get(dice=qs)

    except ObjectDoesNotExist:
        data_string = f"die_id {die_id} does not exist"
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    except MultipleObjectsReturned:
        # Handle the case where multiple Dice objects with the same ID exist (should not happen with primary key)
        data_string = f"Multiple dice found with ID: {die_id}"
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    except Exception as e:
        # Handle any other exceptions that may occur
        data_string = f"An unexpected error occurred: {e}"
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # lookup the dice faces with exception handling (illustrating an example where it is valid to have no child objects)
    try:
        # Retrieve all DiceFaces related to the Dice object
        dice_faces = DiceFaces.objects.filter(dice=qs)
        # for face in dice_faces:
        #     print(f"- {face.name}: {face.file}")

    except ObjectDoesNotExist:
        print(f"no dice faces found for die ID {die_id}")

    except Exception as e:
        # Handle any other exceptions that may occur
        data_string = f"An unexpected error occurred: {e}"
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # print("printing the DICE query set")
    # print(qs)
    # print(f"Query Set values are Id: {qs.id} Name: {qs.name} defaultFaceFile: {qs.defaultFaceFile}")
    # print("done")

    dice_faces_list = []
    for face in dice_faces:
        # print(f"- {face.name}: {face.file}")
        item_diceFace = {
            "name": face.name,
            "file": face.file
        }
        dice_faces_list.append(item_diceFace)

    # print("dice_faces count = ", len(dice_faces))
    # print("diceFaces count = ", len(dice_faces_list))
    # print("diceFaces = ", dice_faces_list)

    item_diceSound = {
        "name": dice_sound.name,
        "file": dice_sound.file,
    }

    # print("diceSound = ", item_diceSound)

    item = {
        "id_value": qs.id,
        "name": qs.name,
        "defaultFaceFile": qs.defaultFaceFile,
        "diceFaces": dice_faces_list,
        "diceSound": item_diceSound
    }

    # print("printing item: ")
    # print(item)
    #
    # print("printing item values:")
    # print(f"Item values are {bold_text("id_value:")}  {item['id_value']}  {bold_text("name:")} {item['name']}  {bold_text("defaultFaceFile:")} {item['defaultFaceFile']}  {bold_text("diceFaces:")} {item['diceFaces']}  {bold_text("sound:")} {item['diceSound']}")

    # serialize not working - not sure I understand how to use it properly - or if it would be effective here given the composite item
    # serializer = DiceSerializer(qs)
    # print("serializer.data: ", serializer.data)
    # data = json.dumps(serializer.data)

    data = json.dumps(item)
    # print("data:")
    # print(data)
    return JsonResponse(data, safe=False)


# API call with the ID in the URL line (instead of as a parameter)
def get_dice(request, dice_id):
    print("get_dice()", dice_id)

    # get_object_or_404 will cause a return from get_dice with a 404 status (code after this line will not execute)
    dice = get_object_or_404(Dice, id=dice_id)
    # print("dice =", dice)

    serializer = DiceSerializer(dice)
    # print("serializer =", serializer)
    # print("serializer.data =", serializer.data)

    data = json.dumps(serializer.data)
    # print("data:")
    # print(data)

    # return JsonResponse(serializer.data)
    return JsonResponse(data, safe=False)


def create_dice_item(dice_id, name, defaultFaceFile):
    """pass -1 for dice_id when unknown id"""
    dice_faces_list = []

    item_diceSound = {
        "name": "",
        "file": "",
    }

    item = {
        # "id_value": dice_id,
        "name": name,
        "defaultFaceFile": defaultFaceFile,
        "diceFaces": dice_faces_list,
        "diceSound": item_diceSound
    }

    # only add the dice id if a valid id
    if dice_id != -1:
        item["id_value"] = dice_id

    # print("item created:")
    # print(item)
    return item

def insert_new_dice(name, defaultFaceFile):
    """Inserts a new dice object. Called from both POST and PUT. Note that it does not insert any child entries"""
    # Create a new Dice object
    new_dice = Dice(name=name, defaultFaceFile=defaultFaceFile)

    # Save the new Dice object to the database
    new_dice.save()

    # print("insert new dice id = ", new_dice.id)
    item = create_dice_item(new_dice.id, name, defaultFaceFile)

    return item


def post_dice(request):
    """The HTTP POST method is used to create a resource. It will create dupes if called for an existing entry"""
    """Action: how do you create the model with name as unique and what exceptions will be raised upon dupes?"""
    print("post_dice()")

    post_value_name = request.POST.get('name', "Loki")
    post_value_defaultFaceFile = request.POST.get('defaultFaceFile', "Loki")
    # print("post_dice()", post_value_name, " ", post_value_defaultFaceFile)

    # create the new dice object
    item = insert_new_dice(post_value_name, post_value_defaultFaceFile)

    data = json.dumps(item)
    # print("data:")
    # print(data)
    return JsonResponse(data, safe=False)


def put_dice(request):
    """The HTTP PUT method is used to create a new resource or replace a resource. It’s similar to the POST method,
    in that it sends data to a server, but it’s idempotent. This means that the effect of multiple PUT requests
    should be the same as one PUT request."""
    print("put_dice()")

    # Parse the query string into a dictionary
    body = request.body.decode('utf-8')
    # print(body)

    # print("parsed data:")
    parsed_data = urllib.parse.parse_qs(body)
    # print(parsed_data)

    # convert the parsed data to an object
    # returns a dictionary with lists as values, we'll extract the single values
    query_args = {k: v[0] for k, v in parsed_data.items()}

    put_value_name = ""
    put_value_defaultFaceFile = ""
    missing_params = False
    # if 'id_value' in query_args:
    #     query_args['id_value'] = int(query_args['id_value'])  # is there a better way to do this?
    #     id_value = query_args['id_value']
    # else:
    #     missing_params = True
    if 'name' in query_args:
        put_value_name = query_args['name']
    else:
        missing_params = True

    if 'defaultFaceFile' in query_args:
        put_value_defaultFaceFile = query_args['defaultFaceFile']
    else:
        missing_params = True

    # check if any params are missing - PUT requires that all values be present
    if missing_params:
        keys = ""
        for key in query_args.keys():
            if len(keys) == 0:
                keys += key
            else:
                keys += ", " + key
        data_string = request.method + " called but missing one or more parameters. Params = " + keys
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # check to see if this Dice object already exists (by name) and do not insert a second one if found
    entry_already_exists = False
    try:
        qs = Dice.objects.get(name=put_value_name)
        entry_already_exists = True
    except MultipleObjectsReturned:
        entry_already_exists = True
    except ObjectDoesNotExist:
        entry_already_exists = False

    if entry_already_exists:
        data_string = f"found object with same name. Name = {put_value_name}"
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)
    else:
        # create the new dice object
        item = insert_new_dice(put_value_name, put_value_defaultFaceFile)

    data = json.dumps(item)

    return JsonResponse(data, safe=False)


def patch_dice(request):
    """The HTTP PATCH method is used to update an existing entry"""
    print("patch_dice()")

    # Parse the query string into a dictionary
    body = request.body.decode('utf-8')
    # print(body)

    # print("parsed data:")
    parsed_data = urllib.parse.parse_qs(body)
    # print(parsed_data)

    # convert the parsed data to an object
    # returns a dictionary with lists as values, we'll extract the single values
    query_args = {k: v[0] for k, v in parsed_data.items()}

    id_value = 0
    dice_name = ""
    dice_defaultFaceFile = ""
    missing_params = False
    if 'id_value' in query_args:
        query_args['id_value'] = int(query_args['id_value'])  # is there a better way to do this?
        id_value = query_args['id_value']
    else:
        missing_params = True
    if 'name' in query_args:
        dice_name = query_args['name']
    else:
        missing_params = True

    if 'defaultFaceFile' in query_args:
        dice_defaultFaceFile = query_args['defaultFaceFile']
    else:
        missing_params = True

    # check if any params are missing - PUT requires that all values be present
    if missing_params:
        keys = ""
        for key in query_args.keys():
            if len(keys) == 0:
                keys += key
            else:
                keys += ", " + key
        data_string = request.method + " called but missing one or more parameters. Params = " + keys
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # check to see if this Dice object already exists (by name) and do not insert a second one if found
    found_item = False
    try:
        qs = Dice.objects.get(pk=id_value)
        found_item = True
    # except MultipleObjectsReturned:
    #     found_item = False
    # except ObjectDoesNotExist:
    #     found_item = False
    except Exception as e:
        # Handle any other exceptions that may occur
        data_string = f"An unexpected error occurred: {e}"
        print(data_string)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    # update fields and save
    qs.name = dice_name
    qs.defaultFaceFile = dice_defaultFaceFile
    qs.save()

    item = create_dice_item(id_value, dice_name, dice_defaultFaceFile)
    data = json.dumps(item)

    return JsonResponse(data, safe=False)


def delete_dice(request):
    print("delete_dice()")

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

    try:
        # dice = get_object_or_404(Dice, id=id_value)
        dice = Dice.objects.get(pk=id_value)
    except ObjectDoesNotExist:
        data_string = "DELETE called but the requested id was not found: " + str(id_value)
        data = json.dumps(data_string)
        return JsonResponse(data, safe=False)

    dice.delete()
    # print("item removed: ", dice)
    # print("item removed name: ", dice.name)

    item = create_dice_item(id_value, dice.name, dice.defaultFaceFile)

    data = json.dumps(item)

    return JsonResponse(data, safe=False)



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
