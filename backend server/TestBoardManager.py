import unittest
from BoardManager import BoardManager
from bson.json_util import loads, dumps

class Tests(unittest.TestCase):
    
    #tests that adding and deleting boards works
    def testCreateDeleteBoard(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        self.assertTrue(not b.boardExists('b'))
        b.addBoard('tst', 'test', 'test', False, 0)
        self.assertTrue(b.boardExists('tst'))
        b.deleteBoard('tst', 0)
        self.assertTrue(not b.boardExists('tst'))
    
    #tests adding, deleting, and getting multiple threads
    def testCreateDeleteThread(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)
        b.addThread("tst", "test thread", "sharpton", "content", [])
        self.assertTrue(b.threadExists('tst', 0))
        b.deleteThread('tst', 0)
        self.assertFalse(b.threadExists('tst', 0))
        b.deleteBoard('tst', 0)
    
    def testGetThreadStats(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)
        b.addThread("tst", "test thread", "sharpton", "content", [])
        stats = b.getThreadStats('tst', 0)
        self.assertTrue(loads(stats)[0]['id'] == 0 and loads(stats)[0]['postCount'] == 1)
        b.deleteBoard('tst', 0)
    
    def testGetThreads(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)
        for i in range(0, 20):
            b.addThread("tst", "test thread " + str(i), "sharpton", "content " + str(i), [])
        
        threads = loads(b.getThreads('tst'))
        for i in range(0, 20):
            self.assertTrue(threads[i]['post']['content'] == "content " + str(i))
        b.deleteBoard('tst', 0)   

    def testGetThreadAddPostReply(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)
        b.addThread('tst', 'test thread', 'sharpton', 'test content', [])
        b.addPost('tst', 'test thread', 'sharpton', 0, 'test content', [], [0])
        thread = loads(b.getThread('tst', 0))
        self.assertTrue(len(thread['posts']) == 2)
        self.assertTrue(thread['posts'][0]['replies'][0] == 1)
        b.deleteBoard('tst', 0)

    def testDeletePost(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)
        b.addThread('tst', 'test thread', 'sharpton', 'test content', [])
        b.addPost('tst', 'test thread', 'sharpton', 0, 'test content', [], [0])
        b.deletePost('tst', 1)
        thread = loads(b.getThread('tst', 0))
        self.assertTrue(thread['posts'][1]['content'] == 'DELETED')
        b.deleteBoard('tst', 0)
    
    def testIsAdmin(self):
        b = BoardManager()
        self.assertTrue(b.isAdminKey("admin"))
    
    def testNewAdmin(self):
        b = BoardManager()
        self.assertTrue(not b.isAdminKey("admin1"))
        b.newAdmin("admin", "admin1")
        self.assertTrue(b.isAdminKey("admin1"))

if __name__ == '__main__':
    unittest.main()
        