import React from 'react';
import { Link } from "react-router-dom";
import './navBar.css'
import QuickReply from '../quickReply/quickReply'
var Request = require("request");
class NavBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boards: [],
            quickReplyOpen: false
        }
        this.handleHideQr = this.handleHideQr.bind(this);
    }

    componentDidMount(){
        Request.get({
            "headers": { "content-type": "application/json" },
            "url": this.props.api + "stats/boards"
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            let z = JSON.parse(JSON.parse(body));
            z.forEach(element => {
                var b = this.state.boards;
                b.push(element);
                this.setState({boards: b});
            });
        });
    }

    handleHideQr(){
        this.setState({quickReplyOpen: !this.state.quickReplyOpen});
    }

    render(props) {
        return(
            <div id="Bar">
                <div class="HorizontalContainer">
                    <div>
                        <a href={"/"}>
                            <div class="tagLink">Home</div>
                        </a>
                    </div>
                    {this.state.boards.map(element => 
                        <div>
                            <a href={"/boards/" + element.tag}>
                                <div class="tagLink">{element.tag}</div>
                            </a>
                        </div>
                    )} 
                </div>
                <div id="toolbar">
                    <button onClick={this.handleHideQr}>post</button>
                    {this.state.quickReplyOpen ? <QuickReply api={this.props.api} tag={this.props.tag} thread={this.props.thread} id={this.props.id} /> : null}
                </div>
                
            </div>
        )
    }
}

export default NavBar;