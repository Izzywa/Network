from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("User", related_name="followers", blank=True)

    def __str__(self):
        return self.username
    
    def valid_follower(self):
        return self.follower.count() >= 0 and self.follower.count() <= User.objects.all().count()