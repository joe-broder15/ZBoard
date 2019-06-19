import React from 'react';
import Catalog from './components/catalog/catalog'
import './components/catalog/catalog.css'
import NavBar from './components/navBar/navBar'
var Request = require("request");
class BoardPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            catalog: false,
            loaded: false,
            name: null,
            description: null,
            id: null,
            nsfw: null,
            tag: null
        }
    }

    componentDidMount(){
        Request.get({
            "headers": { "content-type": "application/json" },
            "url": this.props.api + "stats/boards/" + this.props.tag
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            let r = JSON.parse(JSON.parse(body))[0];
            this.setState({
                loaded: true,
                name: r.name,
                description: r.description,
                id: r.id,
                nsfw: r.nsfw,
                tag: r.tag
            });
        });
    }

    render(props) {
        if(!this.state.loaded) {
            return(<h1>Loading...</h1>)
        }
        return(
            <div id="Container">
                <NavBar api={this.props.api} tag={this.state.tag} thread={true}/>            
                <div className="VerticalContainer">
                    <div id="BoardHeader" className="VerticalContainer">
                        <h1 id="SiteName">{"/"+this.state.tag+"/ - " + this.state.name}</h1>
                        <p>{this.state.description}</p>
                    </div>
                    <div className="thinLine"></div>
                    <Catalog tag={this.state.tag} api={this.props.api}/>
                </div>
            </div>
        )
    }
}

export default BoardPage;