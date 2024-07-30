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


# API call with the ID as a parameter (instead of in the URL line)
def get_dice_info(request):
    print("get_dice_info()")

    # die_id = request.GET.get('id', 1) would use default of 1 if id not supplied
    # parameters = request.GET.dict() to access params as a dict. can also use request.GET
    # parameters = request.GET.items() to access as list of key-value pairs
    die_id = request.GET.get('id')
    print("die_id =", die_id)
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
    print("data:")
    print(data)
    return JsonResponse(data, safe=False)


# API call with the ID in the URL line (instead of as a parameter)
def get_dice(request, dice_id):
    print("get_dice()", dice_id)

    # get_object_or_404 will cause a return from get_dice with a 404 status (code after this line will not execute)
    dice = get_object_or_404(Dice, id=dice_id)
    print("dice =", dice)

    serializer = DiceSerializer(dice)
    print("serializer =", serializer)
    print("serializer.data =", serializer.data)

    data = json.dumps(serializer.data)
    print("data:")
    print(data)

    # return JsonResponse(serializer.data)
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
