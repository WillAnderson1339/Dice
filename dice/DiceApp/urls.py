from django.urls import path
from . import views

urlpatterns = [
    path("", views.page_router, name="home"),
    path("home", views.page_router, name="home"),
    path("about", views.page_router, name="about"),
    path("roll_1", views.page_router, name="roll_1"),
    path("roll_2", views.page_router, name="roll_1"),
    path("getDiceImages", views.get_dice_images, name="roll_1")
]
