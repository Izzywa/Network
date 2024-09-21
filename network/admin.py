from django.contrib import admin
from .models import User, Follows, Post, Like

class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "username"]
    
class FollowsAdmin(admin.ModelAdmin):
    list_display = ["id", "follower", "followed"]
    
class PostAdmin(admin.ModelAdmin):
    list_display = ["id", "poster", "content"]

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Follows, FollowsAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Like)
