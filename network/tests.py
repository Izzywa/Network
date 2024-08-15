from django.db import IntegrityError
from django.forms import ValidationError
from django.test import Client, TestCase

from .models import User, Follows, Post, Like

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        # Create User
        user1 = User.objects.create(username="user1", email="user1@example.com", password="12345")
        user2 = User.objects.create(username="user2", email="user2@example.com", password="12345")
        user3 = User.objects.create(username="user3", email="user3@example.com", password="12345")
        
        # Create following
        f1 = Follows.objects.create(follower=user1, followed=user2)
        f2 = Follows.objects.create(follower=user3, followed=user2)
        
        # Create post
        p1 = Post.objects.create(poster=user1, content="This is user1 first post")
        p2 = Post.objects.create(poster=user3, content="This is user3 first post")
        
        # Create likes
        l1 = Like.objects.create(post=p1, liker=user1)
        
        
    def test_follower(self):
        user1 = User.objects.get(username="user1")
        user2 = User.objects.get(username="user2")
        user3 = User.objects.get(username="user3")
        
        #test following count
        self.assertEqual(user1.following.all().count(), 1)
        
        #test follower count
        self.assertEqual(user2.follower.all().count(), 2)
        
        #test if user in following list
        user1_following_list = [i.followed for i in user1.following.all()]
        self.assertIn(user2, user1_following_list, "User2 not in list of user1 followings")
        self.assertNotIn(user3, user1_following_list, "User3 is in list of user1 following")
        
        #test if user in followed list
        user2_follwers_list = [i.follower for i in user2.follower.all()]
        self.assertTrue(user1 in user2_follwers_list and user3 in user2_follwers_list)
        
        #test if user can follow same user twice
        try:
            f = Follows(follower=user3, followed=user2)
            f.save()
            self.assertTrue(False, "User could follow the same person more than once")
        except IntegrityError:
            self.assertTrue(True)
        
        #test if user can follow self
        x = Follows(follower=user1, followed=user1)
        try:
            x.clean()
            x.save()
            self.assertTrue(False, "User can follow self")
        except ValidationError:
            self.assertTrue(True)     
        self.assertNotIn(user1, user1_following_list, "User1 can follow self")
        
    def test_post(self):
        user1 = User.objects.get(username="user1")
        user2 = User.objects.get(username="user2")
        user1_first_post = user1.post.first()
        
        # Test the number of user post
        self.assertEqual(user1.post.all().count(),1)
        
        # Test the total number of post
        self.assertEqual(Post.objects.all().count(),2)
        
        # Test if follower can see user post
        
        
        # Test number of likes
        self.assertEqual(user1_first_post.like.all().count(),1)
        
        # Test if user have liked the post
        list_of_likes_of_post = [i.liker for i in user1_first_post.like.all()]
        self.assertIn(user1, list_of_likes_of_post, "User1 should be in the list of the user that liked the post")
        self.assertNotIn(user2, list_of_likes_of_post, "User2 should not be in the list of uset that liked the post")
        
        # Test if user can like the same post twice
        try:
            l = Like(post=user1_first_post, liker=user1)
            l.save()
            self.assertTrue(False, "User1 should not be able to like the same post")
        except IntegrityError:
            self.assertTrue(True)
            
            
    def test_like_toggle(self):
        user1 = User.objects.get(username="user1")
        user1_first_post = user1.post.first()
        # Test like toggle
        Like.objects.get(post=user1_first_post, liker=user1).delete()
        self.assertEqual(user1_first_post.like.all().count(),0)
        Like.objects.create(post=user1_first_post, liker=user1)
        self.assertEqual(user1_first_post.like.all().count(),1)
        
    def test_routes(self):
        c = Client()
        
        # Test index page
        index = c.get("/")
        self.assertEqual(index.status_code, 200)
        
        # Test login page
        login = c.get("/login")
        self.assertEqual(login.status_code, 200)
        
        # Test register page
        register = c.get("/register")
        self.assertEqual(register.status_code, 200)