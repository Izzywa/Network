
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:filter>=<int:page>", views.index, name="page_view"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("page/<str:filter>/<int:num>", views.page, name="pagination"),
    path("post", views.compose, name="compose"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("follow/<str:username", views.follow, name="follow"),
]