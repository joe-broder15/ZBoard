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
            <div id="ThreadCardContainer" class="card">
                <div id="ThreadCardBar" class="card-header">
                    <span class="badge badge-success">{this.state.data.id}</span>
                    <span class="badge badge-warning">{user}</span>
                    <span class="badge badge-danger">{this.state.data.subject}</span>
                    <span class="badge badge-info">{+ this.state.date.getHours() % 12 + ":"
                    + this.state.date.getMinutes() + "  |  "
                    + this.state.date.getMonth() + "/"
                    + this.state.date.getDay() + "/"
                    + this.state.date.getFullYear()}</span>
                    
                    
                </div>
                <div id="ThreadCardPostBody" className="card-body">
                    {this.state.data.image != null? 
                    <img onClick={this.handleExpand} src={
                        (this.state.expanded? "http://localhost:5000/files/" : "http://localhost:5000/files/thumbnail-")
                         + this.state.data.image}/> : null
                    }
                    <div id="PostText">
                        {this.state.data.content}
                    </div>
                </div>
            </div>         
        )
    }
}

export default ThreadCard;