from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, Follows, Post, Like


def index(request):
    if request == 'PUT':
        pass
    else:
        return render(request, "network/index.html") 


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def posts(request, filter):
    if filter == "all":
        posts = Post.objects.all().order_by("-timestamp")
        
    elif filter == "following":
        user = request.user
        user_following_list = [person.followed for person in user.following.all()]
        posts = Post.objects.filter(poster__in=user_following_list).order_by("-timestamp")
        """filter by reverse chronological order"""
        
    else:
        try:
            username = User.objects.get(username=filter)
        except User.DoesNotExist:
            return JsonResponse({
                "type": "warning",
                "message": "User does not exist"
            }, status=400)
        
        posts = Post.objects.filter(poster=username).order_by("-timestamp")

    if len(posts) == 0:
        return JsonResponse('None', safe=False)
    else:
        return JsonResponse([post.serialize() for post in posts], safe=False)
    
def page(request, filter, num):
    if filter == "all":
        posts = Post.objects.all().order_by("-timestamp")
    elif filter == "following":
        user = request.user
        user_following_list = [person.followed for person in user.following.all()]
        posts = Post.objects.filter(poster__in=user_following_list).order_by("-timestamp")
    else:
        try:
            username = User.objects.get(username=filter)
        except User.DoesNotExist:
            return JsonResponse({
                "type": "warning",
                "message": "User does not exist"
            }, status=400)
        
        posts = Post.objects.filter(poster=username).order_by("-timestamp")
        
    if len(posts) == 0:
        return JsonResponse('None', safe=False)
        
    page_list = Paginator(posts,2)
    try:
        this_page = page_list.page(num)
    except PageNotAnInteger:
        this_page = page_list.page(1)
    except EmptyPage:
        return JsonResponse({
            "type": "warning",
            "message": "This page does not exist"
        }, status=400)
    
    return JsonResponse({
        "num_pages": page_list.num_pages,
        "object_list": [p.serialize() for p in this_page.object_list],
        "has_next": this_page.has_next(),
        "has_previous": this_page.has_previous()
        }, safe=False)