var Request = require("request");
const fetch = require("node-fetch");

api =  "http://0.0.0.0:5000/api/"

//add a board
function addBoard(tag, name, description, nsfw, nonce) {
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": api + "boards",
        "body": JSON.stringify({
            "tag": tag,
            "name": name,
            "description": description,
            "nsfw": nsfw,
            "nonce": nonce
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return JSON.parse(body);
    });
}

//delete a board
function deleteBoard(tag, nonce) {
    Request.delete({
        "headers": { "content-type": "application/json" },
        "url": api + "boards",
        "body": JSON.stringify({
            "tag": tag,
            "nonce": nonce
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return JSON.parse(body);
    });
}

// //add a thread
function addThread(tag, subject, user, content, image) {
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": api + "boards/" + tag + "/thread" ,
        "body": JSON.stringify({
            "subject": subject,
            "user": user,
            "content": content,
            "image": image
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return console.dir(JSON.parse(body));
    });
}

//delete a thread
function deleteThread(tag, threadId) {
    Request.delete({
        "headers": { "content-type": "application/json" },
        "url": api + "boards/" + tag + "/thread" ,
        "body": JSON.stringify({
            "threadId": threadId
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return console.dir(JSON.parse(body));
    });
}

//addBoard('tst', 'test', 'test board', true, 0)
function getThread(tag, threadId) {
    Request.get({
        "headers": { "content-type": "application/json" },
        "url": api + "boards/" + tag + "/thread/" + threadId
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return console.dir(JSON.parse(body));
    });
}

function getThreads(tag) {
    Request.get({
        "headers": { "content-type": "application/json" },
        "url": api + "boards/" + tag
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return console.dir(JSON.parse(body));
    });
}

function addPost(tag, threadId, subject, user, content, image, mentions) {
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": api + "boards/" + tag + "/thread/" + threadId.toString() + "/post",
        "body": JSON.stringify({
            "subject": subject,
            "user": user,
            "content": content,
            "image": image,
            "mentions": mentions
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return console.dir(JSON.parse(body));
    });
}

function getBoardStats(tag) {
    Request.get({
        "headers": { "content-type": "application/json" },
        "url": api + "stats/boards/" + tag
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return console.dir(JSON.parse(body));
    });
}

function getThreadStats(tag, threadId) {
    Request.get({
        "headers": { "content-type": "application/json" },
        "url": api + "stats/boards/" + tag + "/threads/" + threadId
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return console.dir(JSON.parse(body));
    });
}

function getBoardList() {
    Request.get({
        "headers": { "content-type": "application/json" },
        "url": api + "stats/boards"
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        let z = JSON.parse(JSON.parse(body));
        return console.dir(z[0]);
    });
}

getBoardList()


