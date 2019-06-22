import pymongo
import time
import hashlib
from bson.json_util import dumps, loads

#this class is the bulk of the backend
#it's a simple wrapper around a mongo server
class BoardManager:
    

    #construct a new board manager with the specified board
    def __init__(self):

        #creates mongo client on the following port
        self.dbClient = pymongo.MongoClient("mongodb://localhost:27017/")

        #main is the db used primarily
        self.db = self.dbClient['main']

        #table containing board stats
        self.boardStats = self.db['boardStats']
    

    #returns the JSON of a board's stats
    #these stats consist of a tag, name, description, boolean for nsfw, and the next id to be assigned
    def getBoardStats(self, board):
        try:
            assert(self.boardExists(board))
            return dumps(self.boardStats.find({"tag": board}), separators=(',', ':'))
        except:
            raise Exception("failed to get board stats")
    
    #check if a board exists
    def boardExists(self, boardTag):
        query = {"tag": boardTag}
        return self.boardStats.count(query) != 0
    
    #check if a thread exists
    #simply looks in the db of thread stats for a board and returns wether an object exists for the specified id
    def threadExists(self, boardTag, thread):
        assert(self.boardExists(boardTag))
        query = {"id": thread}
        threadDB = self.db[ boardTag + '_threads']
        return threadDB.count(query) != 0
    
    #get thread stats
    #threads have an id, boolean flagged, subject, pinned boolean, post count, and date
    def getThreadStats(self, board, thread):
        try:
            assert(self.boardExists(board))
            assert(self.threadExists(board, thread))
            threadDB = self.db[board + '_threads']
            query = {"id": thread}
            return dumps(threadDB.find(query), separators=(',', ':'))
        except:
            raise Exception("failed to get thread stats")


    #add a board to the database
    #has all of the board state and requires an admin key
    def addBoard(self, tag, desc, name, nsfw, adminKey):
        assert(self.isAdminKey(adminKey))
        assert(not self.boardExists(tag))
        try:
            newBoard = {"tag": tag, "name": name, "description": desc, "nsfw": nsfw, "id": 0}
            self.boardStats.insert_one(newBoard)
        except:
            raise Exception("failed to add board")

    #add a new post to the desired board with the desired info
    #posts have a subject, user, thread number, content, image, mentions,date, and replies
    #not all of these are given when creating a new post
    def addPost(self, board, subject, user, thread, content, image, mentions):
        try:
            assert(self.boardExists(board))
            assert(self.threadExists(board, thread))
            boardDB = self.db[board]
            threadDB = self.db[board + '_threads']
            postId = loads(self.getBoardStats(board))[0]["id"]
            post = {
                "id": postId,
                "subject": subject,
                "user": user,
                "thread": thread,
                "content": content,
                "date": time.time(),
                "image": image,
                "replies": [],
                "mentions": mentions,
                "flagged": False
            }

            newVal = {"$set": {"id": postId +1}}
            query = {"tag":board}
            self.boardStats.update_one(query, newVal)

            postCount = loads(self.getThreadStats(board, thread))[0]["postCount"]
            newVal = {"$set": {"postCount": postCount + 1}}
            query = {"id":thread}
            threadDB.update_one(query, newVal)

            boardDB.insert_one(post)

            for m in mentions:
                query = {"id":m}
                newVal = {"$push": {"replies": postId}}
                boardDB.update_one(query, newVal)

        except:
            raise Exception("failed to add post");
    
    #create a new thread, takes post parameters without mentions
    #creates a new thread object for stats and makes a post
    def addThread(self, board, subject, user, content, image):
        assert(self.boardExists(board))
        try:
            threadDB = self.db[board + '_threads']
            threadId = loads(self.getBoardStats(board))[0]["id"]
            newThread = {
                "id": threadId,
                "flagged": False,
                "subject": subject,
                "pinned": False,
                "postCount": 0,
                "date": time.time()
            }
            threadDB.insert_one(newThread)
            self.addPost(board, subject, user, threadId, content, image, [])
        except:
            raise Exception("failed to add thread")
    
    #get all threads from a speficic board
    #returns a list of thread stat objects contianing their parent post for a given board
    def getThreads(self, board):
        assert(self.boardExists(board))
        try:
            boardDB = self.db[board]
            threadDB = self.db[board + '_threads']
            threads = []
            for t in threadDB.find({}):
                parentPost = loads(dumps(boardDB.find({"id":t["id"]}), separators=(',', ':')))[0]
                t["post"] = parentPost
                threads.append(t)
            #query = {"thread": True}
            #3esults = boardDB.find(query)
            return dumps(threads, separators=(',', ':'))
        except:
            raise Exception("failed to get threads")
    
    #get a list of all posts in a thread by their id
    def getThread(self, board, threadId):
        assert(self.boardExists(board))
        try:
            boardDB = self.db[board]
            threadDB = self.db[board + '_threads']
            thread = loads(self.getThreadStats(board, threadId))[0]
            posts = dumps(boardDB.find({"thread": threadId}), separators=(',', ':'))
            thread["posts"] = loads(posts)
            return dumps(thread, separators=(',', ':'))
        except:
            raise Exception("failed to get thread")

    #deletes a single post
    def deletePost(self, board, postId):
        assert(self.boardExists(board))
        try:
            boardDB = self.db[board]
            query = {"id" : postId}
            newVal = {'$set': {"subject": "DELETED","user": "DELETED","image":[], "flagged":True, 'content': 'DELETED'}}
            boardDB.update_one(query, newVal)
        except:
            raise Exception("failed to delete post")
    
    #deletes an entire thread and its stats
    def deleteThread(self, board, threadId):
        assert(self.boardExists(board))
        assert(self.threadExists(board, threadId))
        try:
            boardDB = self.db[board]
            threadDB = self.db[board + '_threads']
            query = {"id":threadId}
            threadDB.delete_many(query)
            query = {"thread":threadId}
            boardDB.delete_many(query)
        except:
            raise Exception("failed to delete thread")
    
    #delete an entire board
    def deleteBoard(self, board, adminKey):
        assert(self.boardExists(board))
        assert(self.isAdminKey(adminKey))
        try:
            boardDB = self.db[board]
            boardDB.drop()
            threadDB = self.db[board + '_threads']
            threadDB.drop()
            query = {"tag": board}
            self.boardStats.delete_many(query)
        except:
            raise Exception("failed to delete board")
    
    #get a list of all board stat objects
    def boardList(self):
        try:
            allBoards = self.boardStats.find()
            return dumps(allBoards, separators=(',', ':'))
        except Exception as e:
            print(e)
            raise Exception("failed to get list of boards")

    #checks if an admin key exists in the admin database
    def isAdminKey(self, password):
        db = self.dbClient['admin']
        adminDB = db['admins']
        password = str(password)
        password = password.encode("utf-8")
        query = {"hash": str(hashlib.sha256(password).hexdigest())}
        return adminDB.count(query) != 0

    #adds a new admin key to the database with the permission of another admin
    def newAdmin(self, current, newAdmin):
        assert(self.isAdminKey(current))
        assert(not self.isAdminKey(newAdmin))
        db = self.dbClient['admin']
        adminDB = db['admins']
        newAdmin = str(newAdmin)
        newAdmin = newAdmin.encode("utf-8")
        newAdmin = str(hashlib.sha256(newAdmin).hexdigest())
        adminDB.insert_one({"hash":newAdmin})
    