import pymongo
import time

class BoardManager:

    #construct a new board manager with the specified board
    def __init__(self):
        self.dbClient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.db = self.dbClient['main']
        self.boardStats = self.db['boardStats']
    
    #returns the JSON of a board's stats
    def getBoardStats(self, board):
        assert(self.boardExists(board))
        return next(self.boardStats.find({"tag": board}))
    
    #check if a board exists
    def boardExists(self, boardTag):
        query = {"tag": boardTag}
        return self.boardStats.count(query) != 0
    

    def threadExists(self, boardTag, thread):
        assert(self.boardExists(boardTag))
        query = {"id": thread, "thread": True}
        boardDB = self.db[boardTag]
        return boardDB.count(query) != 0

    #add a board to the database
    def addBoard(self, tag, desc, name, nsfw, nonce):
        assert(nonce == 0)
        assert(not self.boardExists(tag))
        try:
            newBoard = {"tag": tag, "name": name, "description": desc, "nsfw": nsfw, "id": 0}
            self.boardStats.insert_one(newBoard)
        except:
            raise Exception("failed to add board")

    #add a new post to the desired board with the desired info
    def addPost(self, board, user, thread, content, image, replies):
        assert(self.boardExists(board))
        try:
            if (thread != True):
                assert(self.threadExists(board, thread))
            boardDB = self.db[board]
            postId = self.getBoardStats(board)["id"]
            post = {
                "id": postId,
                "user": user,
                "thread": thread,
                "content": content,
                "date": time.time(),
                "image": image,
                "replies": replies
            }
            newVal = {"$set": {"id": postId +1}}
            query = {"tag":board}
            self.boardStats.update_one(query, newVal)
            boardDB.insert_one(post)

        except:
            raise Exception("failed to add post");
    
    #get all threads from a speficic board
    def getThreads(self, board):
        assert(self.boardExists(board))
        try:
            boardDB = self.db[board]
            query = {"thread": True}
            results = boardDB.find(query)
            return [x for x in results]
        except:
            raise Exception("failed to get threads")
    
    #get all posts in a thread by their id
    def getThread(self, board, thread):
        assert(self.boardExists(board))
        try:
            boardDB = self.db[board]
            parent = next(boardDB.find({"id": thread}))
            posts = boardDB.find({"thread": thread})    
            return [parent] + [x for x in posts]
        except:
            raise Exception("failed to get thread")

    #deletes a single post, or an entire thread if the post to be deleted is a thread parent
    def deletePost(self, board, postId):
        assert(self.boardExists(board))
        try:
            boardDB = self.db[board]
            post = next(boardDB.find({"id": postId}))
            query = {"id" : postId}
            boardDB.delete_many(query)
            if (post["thread"] == True):
                query = {"thread": postId}
                boardDB.delete_many(query)
        except:
            raise Exception("failed to delete post")
    
    def deleteBoard(self, board, nonce):
        assert(self.boardExists)
        assert(nonce == 0)
        try:
            boardDB = self.db[board]
            boardDB.drop()
            query = {"tag": board}
            self.boardStats.delete_many(query)
        except:
            raise Exception("failed to delete board")






    

        