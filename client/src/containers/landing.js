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
            <div className="VerticalContainer">
                <h1 id="SiteName">ZChan</h1>
                <div className="VerticalContainer" id="BoardsList">
                    {this.state.boards.map(element => 
                        <div id={element.nsfw? 'nsfwTag' : 'sfwTag'}>
                            <Link to={"/boards/" + element.tag}>
                                {"/" + element.tag + "/" + " - " + element.name}
                            </Link>
                        </div>
                    )}
                    <div>
                        <Link to={"/admin/"}>
                            Admin Login
                        </Link>
                    </div>                    
                </div>
            </div>
        )
    }
}

export default Landing;