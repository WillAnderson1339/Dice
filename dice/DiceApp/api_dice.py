from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core.serializers import serialize

from .models import Dice
from .serializers import DiceSerializer


"""GET call to return Dice objects"""
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

