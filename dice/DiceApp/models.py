from django.db import models


# Create your models here.
class Dice(models.Model):
    name = models.CharField(max_length=50)
    defaultFaceFile = models.CharField(max_length=200)
    shakeSoundFile = models.CharField(max_length=200)

    def __str__(self):
        return f"[{self.pk}] {self.name}"


class DiceFaces(models.Model):
    dice = models.ForeignKey(Dice, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    file = models.CharField(max_length=200)

    def __str__(self):
        return f"[{self.pk}] {self.name} (DiceName={self.dice.name})"


class DiceSounds(models.Model):
    dice = models.ForeignKey(Dice, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    file = models.CharField(max_length=200)

    def __str__(self):
        return f"[{self.pk}] {self.name}"
