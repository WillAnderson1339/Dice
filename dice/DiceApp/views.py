from django.shortcuts import render, HttpResponse
from .models import Dice

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


def get_dice_images(request):
    print('get_dice_images()')
    return HttpResponse("apple banana orange")

