import React from 'react';
import { Link } from "react-router-dom";
import CatalogCard from '../catalogCard/catalogCard';
import QuickReply from '../quickReply/quickReply';
var Request = require("request");
class Catalog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            threads: []
        }
    }

    componentDidMount(){
        Request.get({
            "headers": { "content-type": "application/json" },
            "url": this.props.api + "boards/" + this.props.tag
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            let r = JSON.parse(JSON.parse(body));
            console.log(r);
            this.setState({
                loaded: true,
                threads: r
            })
        });
    }

    render(props) {
        if(!this.state.loaded) {
            return(<h1>Loading...</h1>)
        }
        return(
            <div class="VerticalContainer" id="DragGaurd">
                <div id="CatalogThreadContainer">
                    {this.state.threads.map(element => 
                        <CatalogCard stats={element} tag={this.props.tag}/>
                    )}
                </div>
                {/* <QuickReply thread={true} tag={this.props.tag} api={this.props.api} /> */}
            </div>
            
            
        )
    }
}

export default Catalog;