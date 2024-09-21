import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import IntegrityError
from django.forms import ValidationError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt


from .models import User, Follows, Post, Like


def index(request, filter="", page=None):
    if not filter and not page:
        return HttpResponseRedirect(reverse("page_view", args=('all', 1,)))
    
    if request == 'PUT':
        pass
    else:
        return render(request, "network/index.html", {
            "filter": filter,
            "page": page
        }) 


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
    
def page(request, filter, num):
    if filter == "all":
        posts = Post.objects.all().order_by("-timestamp")
    elif filter == "following":
        if request.user.is_authenticated:
            user = request.user
            user_following_list = [person.followed for person in user.following.all()]
            posts = Post.objects.filter(poster__in=user_following_list).order_by("-timestamp")
        else:
            return JsonResponse({
                "type": "danger",
                "message": "Unauthorised"
            }, status=400)
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
        
    page_list = Paginator(posts,10)
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
    
@csrf_exempt
@login_required
def compose(request):
    if request.method != "POST":
        return JsonResponse({
            "error": True,
            "type": "danger",
            "message": "POST request required."
            }, status=400)
        
    else:
        content = json.loads(request.body).get("content", "")
        
        if content.strip() == "":
            return JsonResponse({
            "error": True,
            "type": "info",
            "message": "Post must not be empty."
        }, status=400)
        elif len(content) > 1000:
            return JsonResponse({
            "error": True,
            "type": "info",
            "message": f"Post must not be longer than 1000 character. This text have {len(content)} character"
        }, status=400)
        else:
            user = request.user
            Post.objects.create(poster=user, content=content)
            
            return JsonResponse({
                "error": False,
                "type": "success",
                "message": "Post successfully made."
            }, status=201)
            
def profile(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse('None', safe=False)
    
    following = user.following.all().count()
    followers = user.follower.all().count()

    return JsonResponse({
        "following": following,
        "followers": followers,
        "addFollowBtn": request.user.is_authenticated and user != request.user
    }, safe=False)
    
@csrf_exempt
@login_required
def follow(request, username):
    try:
        other_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse("None", safe=False)
    
    current_user = request.user
    other_user_follower_list = [follower.follower for follower in other_user.follower.all()]
    following = current_user in other_user_follower_list
    
    if request.method == "GET":
        return JsonResponse(following, safe=False)
    
    elif request.method == "POST":
        if following:
            # insert code to unfollow
            Follows.objects.get(follower=current_user, followed=other_user).delete()
        else:
            # insert code to follow
            createfollow = Follows(follower=current_user, followed=other_user)
            try:
                createfollow.clean()
                createfollow.save()
            except ValidationError:
                return JsonResponse({
                    "message": "User cannot follow self."
                }, status=400)
            
        # Update followings to take into considerations that multiple user could be following and unfollowing simultaneously 
        
        return JsonResponse({
            "following": other_user.following.all().count(),
            "followers": other_user.follower.all().count()
        }, status=200)
    else:
        return JsonResponse({
            "message": "Not valid method."
        }, status=400)
        
@csrf_exempt
@login_required
def edit(request, postId):
    if request.method != "PUT":
        return JsonResponse({
            "error": True,
            "type": "danger",
            "message": "Method not allowed."
        }, status=400)
    else:
# ensure that your application is designed such that it is not possible for a user, 
# via any route, to edit another user’s posts.
        try:
            post = Post.objects.get(pk=postId)
        except Post.DoesNotExist:
            return JsonResponse({
                "error": True,
                "type": "danger",
                "message": "Post does not exist."
            }, status=400)
            
        poster = post.poster
        
        if poster != request.user:
            return JsonResponse({
                "error": True,
                "type": "danger",
                "message": "User not authorised."
            }, status=400)
            
        content = json.loads(request.body).get("content", "")
        
        if content.strip() == "":
            return JsonResponse({
            "error": True,
            "type": "info",
            "message": "Post must not be empty."
        }, status=400)
        elif len(content) > 1000:
            return JsonResponse({
            "error": True,
            "type": "info",
            "message": "Content must not be longer than 1000 character."
        }, status=400)
        else:
            post.content = content
            post.save()
            
            return JsonResponse({
                "error": False,
                "type": "success",
                "message": content
            }, status=201)
            
@csrf_exempt
def like(request, postId):
    try:
        post = Post.objects.get(pk=postId)
    except Post.DoesNotExist:
        return JsonResponse({
            "message": "Post does not exist"
        }, status=400)
        
    if request.user.is_authenticated:
        try:
            like = Like.objects.get(post=post, liker=request.user)
            user_liked_this_post = True
        except Like.DoesNotExist:
            like = Like(post=post, liker=request.user)
            user_liked_this_post = False
    else:
        user_liked_this_post = False
        
    if request.method == "GET":
        return JsonResponse({
            "likeNum": post.like.all().count(),
            "userLikedThisPost": user_liked_this_post
        }, status=200)
    elif request.method == "POST" and request.user.is_authenticated:
        if user_liked_this_post:
            #delete like here
            like.delete()
            return JsonResponse({
                "likeNum": post.like.all().count(),
                "userLikedThisPost": not user_liked_this_post
            },status=200)
        else:
            # create like
            try:
                like.clean()
                like.save()
            except IntegrityError:
                return JsonResponse({
                    "message": "User cannot like the same post more than once."
                }, status=400)
                
            return JsonResponse({
                "likeNum": post.like.all().count(),
                "userLikedThisPost": not user_liked_this_post
            }, status=200)
    else:
        return JsonResponse({
            "message": "Method not allowed"
        }, status=400)