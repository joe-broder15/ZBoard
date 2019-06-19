import React from 'react';
import { Link } from "react-router-dom";
import './catalogCard.css'
var Request = require("request");
class Catalog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            stats: this.props.stats,
            date: new Date(this.props.stats.post.date * 1000)
        }
    }

    render(props) {
        var name = this.state.stats.post.user;
        if (name == "") {
            name = "Anonymous";
        }
        return(
            <div id="CardBody" className="VerticalContainer">
                <div id="TopStrip">
                    <div>{this.state.stats.id}</div>
                    <div>{name}</div>
                </div>
                <Link className="VerticalContainer" to={this.props.tag + "/thread/" + this.state.stats.id}>
                    <img id="ThumbNail" src={"http://localhost:5000/files/thumbnail-" + this.state.stats.post.image}/>
                </Link>
                <div>{this.state.stats.subject}</div>
                <div>
                    { 
                        "PPH: " +
                        parseInt(Number(this.state.stats.postCount) / (((new Date() - this.state.date.getTime())/1000) / 3600)) +
                        " / R: " +
                        this.state.stats.postCount
                    }
                </div>
                <p id="Content">{this.state.stats.post.content}</p>
                <div>
                    { 
                        + this.state.date.getHours() % 12 + ":"
                        + this.state.date.getMinutes() + "  |  "
                        + this.state.date.getMonth() + "/"
                        + this.state.date.getDay() + "/"
                        + this.state.date.getFullYear()
                    }
                </div>
            </div>
        )
    }
}

export default Catalog;