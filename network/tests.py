from django.test import TestCase

from .models import User

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        #create User
        user1 = User.objects.create(username="user1", email="user1@example.com", password="12345")
        user2 = User.objects.create(username="user2", email="user2@example.com", password="12345")
        user3 = User.objects.create(username="user3", email="user3@example.com", password="12345")
        
        
    def test_follower(self):
        user1 = User.objects.get(username="user1")
        user2 = User.objects.get(username="user2")
        user3 = User.objects.get(username="user3")
        user1.following.add(user2)
        user3.following.add(user3)
        
        #test if detects not valid followers
        self.assertFalse(user3.valid_following())
        #test following count
        self.assertEqual(user1.following.count(),1)
        #test follower count
        self.assertEqual(user2.followers.count(), 1)
        #test followers
        self.assertIn(user1, user2.followers.all(), "user1 is not a follower of user2")
        self.assertNotIn(user3, user2.following.all(), "user3 is a follower of user2")
        #test following
        self.assertIn(user2, user1.following.all(), "user1 is not following user2")
        self.assertNotIn(user2, user3.following.all(), "user3 is following user2")
        