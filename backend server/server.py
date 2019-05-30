from flask import Flask, session, redirect, url_for, escape, request, render_template
from flask_restful import Resource, Api
import json
import os
from BoardManager import BoardManager

app = Flask(__name__)
api = Api(app)

#add and delete boards at /boards
class Boards(Resource):
    
    #adds a board
    #params: tag, description, name, nsfw, nonce
    def put(self):
        b = BoardManager()
        data = request.form.to_dict()
        print(data)
        try:
            b.addBoard(data['tag'], data['description'], data['name'], data['nsfw'], int(data['nonce']))
            return {'success': True}
        except:
            return {'success': False}

    #deletes a board
    #params: tag, nonce
    def delete(self):
        b = BoardManager()
        data = request.form.to_dict()
        try:
            b.deleteBoard(data['tag'], int(data['nonce']))
            return {'success': True}
        except:
            return {'success': False}

class BoardId(Resource):

    #get all threads on a board
    def get(self, boardTag):
        b = BoardManager() 
        try:
            threads = b.getThreads(boardTag)
            return threads
        except:
            return {'success': False}

class Thread(Resource):

    #add a new thread to a board
    def put(self, boardTag):
        b = BoardManager()
        try:
            data = request.form.to_dict()
            b.addThread(boardTag, data['subject'], data['user'], data['content'], data['image'])
            return {'success': True}
        except:
            {'success': False}
    
    def delete(self, boardTag):
        b = BoardManager()
        try:
            data = request.form.to_dict()
            b.deleteThread(boardTag, data['threadId'])
            return {'success': True}
        except:
            return {'success': False}

class ThreadId(Resource):

    #add a new thread to a board
    def get(self, boardTag, threadId):
        b = BoardManager()
        try:
            thread = b.getThread(boardTag, threadId)
            return thread
        except:
            {'success': False}

class Post(Resource):

    #add a post to a thread 
    def put(self, boardTag, threadId):
        b = BoardManager()
        try:
            data = request.form.to_dict()
            b.addPost(boardTag, data['subject'], data['user'], threadId, data['content'], data['image'], data['mentions'])
            return {'success': True}
        except:
            {'success': False}

class BoardStats(Resource):
    #add a post to a thread 
    def get(self, boardTag):
        b = BoardManager()
        try:
            return b.getBoardStats(boardTag)
        except:
            {'success': False}

class threadStats(Resource):
    #add a post to a thread 
    def get(self, boardTag, threadId):
        b = BoardManager()
        try:
            return b.getThreadStats(boardTag, threadId)
        except:
            {'success': False}
    

api.add_resource(Boards, '/boards')
api.add_resource(BoardId, '/boards/<boardTag>')
api.add_resource(Thread, '/boards/<boardTag>/thread')
api.add_resource(ThreadId, '/boards/<boardTag>/thread/<threadId>')
api.add_resource(Post, '/boards/<boardTag>/thread/<threadId>/post')
api.add_resource(BoardStats, '/stats/boards/<boardTag>')
api.add_resource(ThreadStats, '/stats/boards/<boardTag>/threads/<threadId>')

#run app on 0.0.0.0:5000
if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    # port = int(os.environ.get('PORT', 5000))
    # app.run(host='0.0.0.0', port=port)
    app.run(debug=True)