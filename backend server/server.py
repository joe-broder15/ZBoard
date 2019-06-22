from flask import Flask, session, redirect, url_for, escape, request, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import os
import random
import string
from PIL import Image
from BoardManager import BoardManager

#UPDATE: the word nonce is used to refference an admin key

#specify file types and uploads folder
UPLOAD_FOLDER = 'static/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__, static_url_path = "/static")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
api = Api(app)
cors = CORS(app, origins="http://localhost:3000", resources=r'/api/*', allow_headers='content-type')

#checks if a file is of the allowed type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#add and delete boards at /boards
class Boards(Resource):
    #adds a board
    #params: tag, description, name, nsfw, nonce
    def post(self):
        b = BoardManager()
        data = request.json
        try:
            b.addBoard(data['tag'], data['description'], data['name'], data['nsfw'], str(data['nonce']))
            return {'success': True}
        except:
            return {'success': False}

    #deletes a board
    #params: tag, nonce
    def delete(self):
        b = BoardManager()
        data = request.json
        try:
            b.deleteBoard(data['tag'], str(data['nonce']))
            return {'success': True}
        except:
            return {'success': False}

#get all threads on a board at /boards/tag
class BoardId(Resource):

    #get all threads on a board
    def get(self, boardTag):
        b = BoardManager() 
        try:
            threads = b.getThreads(boardTag)
            return threads
        except:
            return {'success': False}

#add and delete a thread at /boards/tag/thread
class Thread(Resource):

    #add a new thread to a board
    #params: subject, user, postBody, and Image
    def post(self, boardTag):
        b = BoardManager()
        try:
            data = request.json
            print(data)
            b.addThread(boardTag, data['subject'], data['user'], data['postBody'], data['image'])
            return {'success': True}
        except:
            return {'success': False}
    
    #delete a thread from a board
    #params: threadId
    def delete(self, boardTag):
        b = BoardManager()
        try:
            data = request.json
            b.deleteThread(boardTag, int(data['threadId']))
            return {'success': True}
        except:
            return {'success': False}

#get an entire thread at /boards/tag/thread/id
class ThreadId(Resource):

    #get a specific thread
    def get(self, boardTag, threadId):
        b = BoardManager()
        try:
            thread = b.getThread(boardTag, int(threadId))
            return thread
        except:
            {'success': False}

#post in a thread at /boards/tag/thread/id/post
class Post(Resource):

    #add a post to a thread 
    #params: subject, user, content, image, mentions
    def post(self, boardTag, threadId):
        b = BoardManager()
        # try:
        data = request.json
        b.addPost(boardTag, data['subject'], data['user'], int(threadId), data['content'], data['image'], data['mentions'])
        return {'success': True}
        # except:
            # {'success': False}

#get board stats at /stats/boards/tag
class BoardStats(Resource):
    
    #get the stats for a given board
    def get(self, boardTag):
        b = BoardManager()
        try:
            return b.getBoardStats(boardTag)
        except:
            {'success': False}

#get thread stats /stats/boards/tag/threads/id
class ThreadStats(Resource):
    
    #get stats for a given thread
    def get(self, boardTag, threadId):
        b = BoardManager()
        try:
            return b.getThreadStats(boardTag, int(threadId))
        except:
            {'success': False}
    
#get list of all board stats at /stats/boards
class BoardList(Resource):
    
    #get list of board stats
    def get(self):
        b = BoardManager()
        try:
            r = b.boardList()
            print(r)
            return r
        except:
            return {'success': False}

#upload files at /upload
class Upload(Resource):
    
    #handles file uploads
    def post(self):

        file = request.files['file']
        
        if file and allowed_file(file.filename):

            #save file with random name and return it
            filename, file_extension = os.path.splitext(file.filename)
            rfName = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(12)])
            filename = secure_filename(rfName + file_extension)
            fname = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            fname = os.path.normpath(fname)
            file.save(fname)
            
            #generate a thumbnail for the image
            im = Image.open(fname)
            tfName = secure_filename('thumbnail-' + filename)
            fname = os.path.join(app.config['UPLOAD_FOLDER'], tfName)
            fname = os.path.normpath(fname) 
            print(fname)
            size = 200, 150
            im.thumbnail(size)
            im.save(fname)

            return {'success': True, 'fileName': filename}
        return {'success': False}
        # except:
        #     return {'success': False}

#authenticate an admin key at /admin
class Admin(Resource):

    #authenticates an admin key
    #params key
    def post(self):
        b = BoardManager();
        try:
            data = request.json
            return {'success': b.isAdminKey(data['key'])}
        except:
            return {'success': False}

#url endpoints for the above functions
api.add_resource(Boards, '/api/boards')
api.add_resource(BoardId, '/api/boards/<boardTag>')
api.add_resource(Thread, '/api/boards/<boardTag>/thread')
api.add_resource(ThreadId, '/api/boards/<boardTag>/thread/<threadId>')
api.add_resource(Post, '/api/boards/<boardTag>/thread/<threadId>/post')
api.add_resource(BoardList, '/api/stats/boards')
api.add_resource(BoardStats, '/api/stats/boards/<boardTag>')
api.add_resource(ThreadStats, '/api/stats/boards/<boardTag>/threads/<threadId>')
api.add_resource(Upload, '/api/upload')
api.add_resource(Admin, '/api/admin')

#serve uploaded files
@app.route('/files/<path:path>')
def send_html(path):
    return send_from_directory('static', path)

#run app on 0.0.0.0:5000
if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    app.secret_key = os.urandom(24)
    port = int(os.environ.get('PORT', 5000))
    app.run(debug = True, host='localhost', port=port)
    #app.run(debug=True)