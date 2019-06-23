import React from 'react';
import { Link } from "react-router-dom";
import './catalogCard.css'
var Request = require("request");
class Catalog extends React.Component {
    constructor(props){
        super(props);
        var name = this.props.stats.post.user;
        var sub = this.props.stats.post.subject;
        this.state = {
            stats: this.props.stats,
            date: new Date(this.props.stats.post.date * 1000),
            user: name.length > 15 ? name.slice(0, 15 - 1) + "…" : name,
            subject: sub.length > 30 ? sub.slice(0, 30 - 1) + "…" : sub,
        }

    }

    render(props) {
        var name = this.state.user;
        if (name == "") {
            name = "Anonymous";
        }
        return(
            <div className="VerticalContainer, card" id="CardBody">
                <div className="card-header" id="card-header">
                    <div>
                        <span className="badge badge-success">{this.state.stats.id}</span>
                        <span className="badge badge-warning">{name}</span>
                    </div>
                </div>
                <Link className="VerticalContainer" to={this.props.tag + "/thread/" + this.state.stats.id}>
                    <img id="ThumbNail" src={"http://localhost:5000/files/thumbnail-" + this.state.stats.post.image}/>
                </Link>
                <div className="VerticalContainer">
                    <span className="badge badge-dark">
                    { 
                        "PPH: " +
                        parseInt(Number(this.state.stats.postCount) / (((new Date() - this.state.date.getTime())/1000) / 3600)) +
                        " / R: " +
                        this.state.stats.postCount
                    }
                    </span>
                </div>
                <div className="VerticalContainer">
                    <span class="badge badge-danger">{this.state.subject}</span>
                </div>
                <p id="Content">{this.state.stats.post.content}</p>
                <div className="VerticalContainer">
                    <span className="badge badge-info">
                    { 
                        + this.state.date.getHours() % 12 + ":"
                        + this.state.date.getMinutes() + "  |  "
                        + this.state.date.getMonth() + "/"
                        + this.state.date.getDay() + "/"
                        + this.state.date.getFullYear()
                    }
                    </span>
                </div>
            </div>
        )
    }
}

export default Catalog;