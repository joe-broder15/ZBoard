import React from 'react';
import { Link } from "react-router-dom";
var Request = require("request");
class AdminPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            authenticated: false,
            key: "",
            newBoardName: null,
            newBoardTag: null,
            newBoardDesc: null,
            newBoardNSFW: null,
            delBoardTag: null,
            delThreadId: null,
            delThreadTag: null
        }
        this.handleChangeKey = this.handleChangeKey.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleAddBoard = this.handleAddBoard.bind(this);
        this.handleNewBoardDesc = this.handleNewBoardDesc.bind(this);
        this.handleNewBoardNSFW = this.handleNewBoardNSFW.bind(this);
        this.handleNewBoardName = this.handleNewBoardName.bind(this);
        this.handleNewBoardTag = this.handleNewBoardTag.bind(this);
        this.handleAddBoard = this.handleAddBoard.bind(this);
        this.handleDelBoardTag = this.handleDelBoardTag.bind(this);
        this.handleDelBoard = this.handleDelBoard.bind(this);
        this.handleDelThreadId = this.handleDelThreadId.bind(this);
        this.handleDelThreadTag = this.handleDelThreadTag.bind(this);
        this.handleDelThread = this.handleDelThread.bind(this);
    }

    componentDidMount(){
        // Request.get({
        //     "headers": { "content-type": "application/json" },
        //     "url": this.props.api + "stats/boards"
        // }, (error, response, body) => {
        //     if(error) {
        //         return console.dir(error);
        //     }
        //     let z = JSON.parse(JSON.parse(body));
        //     z.forEach(element => {
        //         var b = this.state.boards;
        //         b.push(element);
        //         this.setState({boards: b});
        //     });
        // });
    }

    handleChangeKey(event) {
        this.setState({key: event.target.value});
    }

    handleNewBoardTag(event) {
        this.setState({newBoardTag: event.target.value})
    }

    handleNewBoardDesc(event) {
        this.setState({newBoardDesc: event.target.value})
    }

    handleNewBoardName(event) {
        this.setState({newBoardName: event.target.value})
    }

    handleNewBoardNSFW(event) {
        this.setState({newBoardNSFW: event.target.value})
    }

    handleDelBoardTag(event) {
        this.setState({delBoardTag: event.target.value})
    }

    handleDelThreadId(event) {
        this.setState({delThreadId: event.target.value})
    }

    handleDelThreadTag(event) {
        this.setState({delThreadTag: event.target.value})
    }
    
    handleLogin(event) {
        event.preventDefault();
        return Request.post({
            "headers": { "content-type": "application/json" },
            "url": this.props.api + "admin",
            "body": JSON.stringify({
                "key": this.state.key
            })
        }, (error, response, body) => {
            body = JSON.parse(body);
            if(error) {
                alert("failed")
                
            }
            alert("success: " + body.success);
            this.setState({authenticated: body.success});
            // window.location.reload();
        });
    }

    handleAddBoard(event) {
        event.preventDefault();
        return Request.post({
            "headers": { "content-type": "application/json" },
            "url": this.props.api + "boards",
            "body": JSON.stringify({
                "tag": this.state.newBoardTag,
                "name": this.state.newBoardName,
                "description": this.state.newBoardDesc,
                "nsfw": this.state.newBoardNSFW,
                "nonce": this.state.key
            })
        }, (error, response, body) => {
            body = JSON.parse(body);
            if(error) {
                return console.dir(error);
            }
            alert("success: " + body.success);
        });
    }

    handleDelBoard(event) {
        event.preventDefault();
        return Request.delete({
            "headers": { "content-type": "application/json" },
            "url": this.props.api + "boards",
            "body": JSON.stringify({
                "tag": this.state.delBoardTag,
                "nonce": this.state.key
            })
        }, (error, response, body) => {
            body = JSON.parse(body);
            if(error) {
                return console.dir(error);
            }
            alert("success: " + body.success);
        });
    }

    handleDelThread(event) {
        event.preventDefault();
        return Request.delete({
            "headers": { "content-type": "application/json" },
            "url": this.props.api + "boards/" + this.state.delThreadTag + "/thread" ,
            "body": JSON.stringify({
                "threadId": this.state.delThreadId
            })
        }, (error, response, body) => {
            body = JSON.parse(body);
            if(error) {
                return console.dir(error);
            }
            alert("success: " + body.success);
        });
    }

    render(props) {
        if(!this.state.authenticated) {
            return(
                <div className="VerticalContainer">
                    <h1>Admin Login</h1>
                    <form onSubmit={this.handleLogin}>
                    <label>
                        Admin Key:
                        <input type="text" value={this.state.value} onChange={this.handleChangeKey} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                </div>
            )
        } else {
            return(
                <div className="VerticalContainer">
                    <h1>Admin Panel</h1>
                    <form onSubmit={this.handleAddBoard}>
                        <h3>Add Board:</h3>
                        <div>
                            Tag:
                            <input type="text" value={this.state.newBoardTag} onChange={this.handleNewBoardTag} />
                        </div>
                        <div>
                            Name:
                            <input type="text" value={this.state.newBoardName} onChange={this.handleNewBoardName} />
                        </div>
                        <div>
                            Description:
                            <input type="text" value={this.state.newBoardDesc} onChange={this.handleNewBoardDesc} />
                        </div>
                        <div>
                            NSFW (0 is false, 1 is true):
                            <input type="text" value={this.state.newBoardNSFW} onChange={this.handleNewBoardNSFW} />
                        </div>
                        <input type="submit" value="Submit" />
                    </form>

                    <form onSubmit={this.handleDelBoard}>
                        <h3>Delete Board:</h3>
                        <div>
                            Tag:
                            <input type="text" value={this.state.delBoardTag} onChange={this.handleDelBoardTag} />
                        </div>
                        <input type="submit" value="Submit" />
                    </form>

                    <form onSubmit={this.handleDelThread}>
                        <h3>Delete Thread:</h3>
                        <div>
                            Board:
                            <input type="text" value={this.state.delThreadTag} onChange={this.handleDelThreadTag} />
                        </div>
                        <div>
                            Thread:
                            <input type="text" value={this.state.delThreadId} onChange={this.handleDelThreadId} />
                        </div>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            )
        }
    }
}

export default AdminPage;