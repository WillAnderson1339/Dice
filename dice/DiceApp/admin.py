from django.contrib import admin

from .models import Dice, DiceFaces, DiceSounds

# Register your models here.
admin.site.register(Dice)
admin.site.register(DiceFaces)
admin.site.register(DiceSounds)
