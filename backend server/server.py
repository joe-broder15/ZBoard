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

    def get(self, boardTag):
        b = BoardManager() 
        try:
            threads = b.getThreads(boardTag)
            return threads
        except:
            return {'success': False}


api.add_resource(Boards, '/boards')
api.add_resource(BoardId, '/boards/<boardTag>')



#when the site is visited at the root url, render index.html
# @app.route('/panel')
# def index():
#     return '<h1>TODO: add admin panel</h1>'
    
# @app.route('/boards/<board>')
# def index(board):
#     b = BoardManager()
#     try:
#         return b.getThreads(board)
#     return render_template('index.html')

# @app.route('/threads/<thread>')
# def index(thread):
#     return render_template('index.html')

#run app on 0.0.0.0:5000
if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    # port = int(os.environ.get('PORT', 5000))
    # app.run(host='0.0.0.0', port=port)
    app.run(debug=True)