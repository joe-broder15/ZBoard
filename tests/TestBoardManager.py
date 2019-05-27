import unittest
from BoardManager import BoardManager

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
    
    #tests that creating threads works
    def testCreateThreads(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)
    
        for i in range(0, 100):
            b.addPost('tst', 'anon', True, 'test post ' + str(i), [], [])

        threads = b.getThreads('tst')
        
        for i in range(0, 100):
            thread = threads[i]
            self.assertEquals(thread["id"], i)
            self.assertEquals(thread["content"], "test post " + str(i))

        b.deleteBoard('tst', 0)
    
    #tests that getting an entire thread's posts works
    def testGetThread(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)

        assert(not b.threadExists('tst', 0))
        
        b.addPost('tst', 'anon', True, 'test thread', [], [])

        assert(b.threadExists('tst', 0))

        for i in range(0, 100):
            b.addPost('tst', 'anon', 0, 'test post in thread 0 ' + str(i), [], [])

        thread = b.getThread('tst', 0)
        
        self.assertTrue(thread[0]["thread"])
        self.assertEqual(thread[0]["content"], "test thread")
        for i in range(1, 101):
            post = thread[i]
            self.assertEquals(post["id"], i)
            self.assertEquals(post["content"], "test post in thread 0 " + str(i - 1))

        b.deleteBoard('tst', 0)
    
    #test that deleting a single post works
    def testDeletePost(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)
        
        b.addPost('tst', 'anon', True, 'test thread', [], [])
        for i in range(0, 100):
            b.addPost('tst', 'anon', 0, 'test post in thread 0 ' + str(i), [], [])

        thread = b.getThread('tst', 0)
        self.assertEquals(len(thread), 101)

        for i in range(1, 101):
            b.deletePost('tst', i)

        thread = b.getThread('tst', 0)
        self.assertEquals(len(thread), 1)

        b.deleteBoard('tst', 0)
    
    #delete an entire thread
    def testDeleteThread(self):
        b = BoardManager()
        b.deleteBoard('tst', 0)
        b.addBoard('tst', 'test', 'test', False, 0)
        
        b.addPost('tst', 'anon', True, 'test thread', [], [])
        for i in range(0, 100):
            b.addPost('tst', 'anon', 0, 'test post in thread 0 ' + str(i), [], [])

        thread = b.getThread('tst', 0)
        self.assertEquals(len(thread), 101)

        b.deletePost('tst', 0)

        self.assertTrue(not b.threadExists('tst', 0))
        self.assertTrue(b.db['tst'].count({'thread':True}) == 0)

        b.deleteBoard('tst', 0)

if __name__ == '__main__':
    unittest.main()
        