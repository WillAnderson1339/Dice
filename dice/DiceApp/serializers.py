from rest_framework import serializers
from .models import Dice


class DiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dice
        fields = ['name', 'defaultFaceFile']


