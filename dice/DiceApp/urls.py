from django.urls import path
from . import views

urlpatterns = [
    path("", views.page_router, name="home"),
    path("home", views.page_router, name="home"),
    path("about", views.page_router, name="about"),
    path("roll_1", views.page_router, name="roll_1"),
    path("roll_2", views.page_router, name="roll_2"),
    path("dice_db_page_1", views.page_router, name="dice_db_page_1"),
    path("getDiceList", views.get_dice_list, name="getDiceList"),
    path("getDiceInfo", views.get_dice_info, name="getDiceInfo"),
    path("getDiceImages", views.get_dice_images, name="getDiceImages"),
    path('getDice/<int:dice_id>/', views.get_dice, name='getDice'),
]
