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
    
class Post(models.Model):
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post", blank=False)
    content = models.TextField(blank=False, max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.poster} posted [{self.content}]on {self.timestamp}"
    
    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }
    
class Like(models.Model):
    post = models.ForeignKey(Post, related_name="like", on_delete=models.CASCADE)
    liker = models.ForeignKey(User, related_name="liked", on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ("post", "liker")
        
    def __str__(self):
        return f"{self.liker} liked {self.post}"