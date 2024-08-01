from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import get_object_or_404
from django.core.serializers import serialize
from json import JSONEncoder
# import requests
import json

from .models import Dice
from .serializers import DiceSerializer

from .models import Dice

from .api_dice import *
from .api_rest_test import *


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
    elif "rest_test_1" in request.path.lower():
        return render(request, "rest_test_1.html")
    elif "dice_db_page_1" in request.path.lower():
        items = Dice.objects.all()
        return render(request, "dice_db_page_1.html", {"Dice": items})
    elif "roll_3" in request.path.lower():
        return render(request, "rolling_test_3.html")
    else:
        return HttpResponse("unknown page request " + request.path)

