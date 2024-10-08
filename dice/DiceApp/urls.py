from django.urls import path
from . import views

urlpatterns = [
    # pages (views)
    path("", views.page_router, name="home"),
    path("home", views.page_router, name="home"),
    path("about", views.page_router, name="about"),
    path("roll_1", views.page_router, name="roll_1"),
    path("roll_2", views.page_router, name="roll_2"),
    path("rest_test_1", views.page_router, name="rest_test_1"),
    path("dice_db_page_1", views.page_router, name="dice_db_page_1"),
    path("roll_3", views.page_router, name="roll_3"),

    # API - Dice
    # path("getDiceList", views.get_dice_list, name="getDiceList"),
    # path("getDiceInfo", views.get_dice, name="getDiceInfo"),
    path("getDiceImages", views.get_dice_images, name="getDiceImages"),
    path('getDice/<int:dice_id>/', views.get_dice_id_from_url, name='getDice'),
    # path("getDice", views.get_dice_list, name="getDiceList"),
    path("DiceAPI", views.dice_api, name="diceAPI"),

    # API - test
    path("getTestString", views.get_test_string, name="getTestString"),
    path("getTestObject", views.get_test_object, name="getTestObject"),
    path("getTestList", views.get_test_list, name="getTestList"),
    path("getTest", views.get_test, name="getTest"),
    path("postTest", views.post_test, name="postTest"),
    path("RESTAPITest", views.rest_api_test, name="restAPITest"),
]
