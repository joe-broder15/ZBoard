import React from 'react';
import { Link } from "react-router-dom";
var Request = require("request");
class Landing extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boards: [],
        }
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

    render(props) {
        return(
            <div className="VerticalContainer" id="LandingContainer">
                <div className="card">
                    <div className="card-body">
                        <h1 className="card-title">ZChan</h1>
                        <ul className="VerticalContainer, list-group" id="BoardsList">
                            {this.state.boards.map(element => 
                                <li className="list-group-item" id={element.nsfw? 'nsfwTag' : 'sfwTag'}>
                                    <Link className="card-link" to={"/boards/" + element.tag}>
                                        {"/" + element.tag + "/" + " - " + element.name}
                                    </Link>
                                </li>
                            )}
                            <li className="list-group-item">
                                <Link classname="card-link" to={"/admin/"}>
                                    Admin Login
                                </Link>
                            </li>                    
                        </ul>
                    </div>
                </div> 
            </div>
        )
    }
}

export default Landing;