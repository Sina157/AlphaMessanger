from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from re import match

class Member(AbstractUser):
    ChatToken = models.CharField(max_length=25 , null=True ,  default=None , blank=True)
    def clean_fields(self, exclude=None):
        super().clean_fields(exclude)
        username_characters_count = len(self.username)
        if username_characters_count < 3:
            raise ValidationError(
                message={"Username":f"Ensure this value has at least 3 characters (it has {username_characters_count})."}
            )
        if Member.objects.filter(username=self.username).exists():
             raise ValidationError(
                message={"Username":f"This username is already registered"}
            )
        if match(r'^[a-zA-Z0-9_]', self.username) is None:
            raise ValidationError(
                message={"Username":f"Invalid characters for username"}
            )
        if Member.objects.filter(email=self.email).exists():
             raise ValidationError(
                message={"Email":f"This Email is already registered"}
            )
        password_characters_count = len(self.password)
        if password_characters_count < 6:
            raise ValidationError(
                message={"Password":f"Ensure this value has at least 6 characters (it has {password_characters_count})."}
            )
       
class Message(models.Model):
    message = models.CharField(max_length=1000)
    Member = models.ForeignKey(Member, on_delete=models.CASCADE)

