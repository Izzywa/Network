from django.db import IntegrityError
from django.forms import ValidationError
from django.test import TestCase

from .models import User, Follows

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        #create User
        user1 = User.objects.create(username="user1", email="user1@example.com", password="12345")
        user2 = User.objects.create(username="user2", email="user2@example.com", password="12345")
        user3 = User.objects.create(username="user3", email="user3@example.com", password="12345")
        
        #create following
        f1 = Follows.objects.create(follower=user1, followed=user2)
        f2 = Follows.objects.create(follower=user3, followed=user2)
        
        
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
            f = Follows.objects.create(follower=user3, followed=user2)
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