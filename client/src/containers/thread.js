import React from 'react';
import NavBar from './components/navBar/navBar'
import ThreadCard from './components/threadCard/threadCard'
var Request = require("request");
class ThreadPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            thread: [],
            loading: true

        }
    }

    componentDidMount(){
        Request.get({
            "headers": { "content-type": "application/json" },
            "url": this.props.api + "boards/" + this.props.tag + "/thread/" + this.props.id
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            let r = JSON.parse(JSON.parse(body));
            console.log(r.posts);
            this.setState({
                thread: r,
                loading: false
            });
        });
    }

    render(props) {
        if(this.state.loading) {
            return(<h1>Loading...</h1>);
        }
        return(
            // <div id="Container">
            //     <NavBar api={this.props.api} tag={this.state.tag} thread={true}/>            
            //     <div className="VerticalContainer">
            //         <div id="BoardHeader" className="VerticalContainer">
            //             <h1 id="SiteName">{"/"+this.state.tag+"/ - " + this.state.name}</h1>
            //             <p>{this.state.description}</p>
            //         </div>
            //         <div className="thinLine"></div>
            //         <Catalog tag={this.state.tag} api={this.props.api}/>
            //     </div>
            // </div>
            <div id="Container">
                <NavBar id={this.props.id} tag={this.props.tag} thread={false} api={this.props.api} />
                <div class="VerticalContainer" id="ThreadContainer">
                    {this.state.thread.posts.map(element => 
                        <ThreadCard data={element}/>
                    )}
                </div>
            </div>            
        )
    }
}

export default ThreadPage;