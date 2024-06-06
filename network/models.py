from typing import Collection
from django.contrib.auth.models import AbstractUser
from django.forms import ValidationError
from django.db import models


class User(AbstractUser):
    pass    

    def __str__(self):
        return self.username
    
class Follows(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    
    class Meta:
        unique_together = ("follower", "followed")
        
    def clean(self):
        if self.follower == self.followed:
            raise ValidationError("User cannot follow self")
        
    def __str__(self):
        return f"{self.follower} followed {self.followed}"