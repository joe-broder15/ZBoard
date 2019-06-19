import React from 'react';
import './threadCard.css'
var Request = require("request");
class ThreadCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data,
            date: new Date(this.props.data.date * 1000),
            expanded: false

        }
        this.handleExpand = this.handleExpand.bind(this);
    }

    handleExpand(event) {
        this.setState({expanded: !this.state.expanded});
    }

    render(props) {
        let user = this.state.data.author == null ? "Anonymous" : this.state.data.author;
        return(
            <div id="ThreadCardContainer">
                <div id="ThreadCardBar">
                    {this.state.data.id + "   " 
                    + user + "   " 
                    + this.state.data.subject + "   "
                    + this.state.date.getHours() % 12 + ":"
                    + this.state.date.getMinutes() + "  |  "
                    + this.state.date.getMonth() + "/"
                    + this.state.date.getDay() + "/"
                    + this.state.date.getFullYear()}
                </div>
                <div id="ThreadCardPostBody">
                    {this.state.data.image != null? 
                    <img onClick={this.handleExpand} src={
                        (this.state.expanded? "http://localhost:5000/files/" : "http://localhost:5000/files/thumbnail-")
                         + this.state.data.image}/> : null
                    }
                    {this.state.data.content}
                </div>
            </div>         
        )
    }
}

export default ThreadCard;