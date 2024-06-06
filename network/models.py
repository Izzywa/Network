from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("User", related_name="followers", blank=True)

    def __str__(self):
        return self.username
    
    def valid_following(self):
        return self in self.following.all()