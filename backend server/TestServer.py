import unittest
from bson.json_util import loads
from BoardManager import BoardManager
from requests import put, get, delete


class Tests(unittest.TestCase):
    
    #tests that adding and deleting boards works
    def testCreateDeleteBoard(self):
        delete('http://localhost:5000/boards', data={'tag':'tst', 'nonce': 0}).json()
        
        response = put('http://localhost:5000/boards', data={'tag':'tst', 'description':'test board', 'name': 'test', 'nsfw':False, 'nonce': 0}).json()
        self.assertTrue(response['success'])
        
        response = put('http://localhost:5000/boards', data={'tag':'tst', 'description':'test board', 'name': 'test', 'nsfw':False, 'nonce': 0}).json()
        self.assertFalse(response['success'])
        
        response = delete('http://localhost:5000/boards', data={'tag':'tst', 'nonce': 0}).json()
        self.assertTrue(response['success'])
    
    def testGetThreads(self):
        delete('http://localhost:5000/boards', data={'tag':'tst', 'nonce': 0}).json()
        put('http://localhost:5000/boards', data={'tag':'tst', 'description':'test board', 'name': 'test', 'nsfw':False, 'nonce': 0}).json()

        b = BoardManager()
        for i in range(0, 10):
            b.addPost('tst', 'test thread ' + str(i), 'sharpton', True, 'test', [], [])

        self.assertTrue(loads(get('http://localhost:5000/boards/tst').json()) == loads(b.getThreads('tst')))
    
        delete('http://localhost:5000/boards', data={'tag':'tst', 'nonce': 0}).json()
    
    #def testGetThread

if __name__ == '__main__':
    unittest.main()
        