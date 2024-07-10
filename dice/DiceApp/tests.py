from django.test import TestCase

# Create your tests here.
from .models import Dice

class DiceModelTests(TestCase):
    def test_is_name_invalid(self):
        """
        example test that will test to ensure the name is not the word "error"
        """
        bad_name = "error"
        dice = Dice(name="good", defaultFaceFile="test_image.png")
        dice.save()

        all_dice = Dice.objects.all()
        # print("here 1")
        # print(all_dice)
        # print("here 2")

        self.assertIs(bad_name != dice.name, True)
