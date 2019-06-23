import React from 'react';
import { Link } from "react-router-dom";
import './navBar.css'
import QuickReply from '../quickReply/quickReply'
import $ from 'jquery';
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
        
        $(function() {

            $('.dropdown-toggle').on('click', function(event) {
              $('.dropdown-menu').slideToggle();
              event.stopPropagation();
            });
          
            $('.dropdown-menu').on('click', function(event) {
              event.stopPropagation();
            });
          
            $(window).on('click', function() {
              $('.dropdown-menu').slideUp();
            });
          
          });

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
            // <div id="Bar">
            //     <div class="HorizontalContainer">
            //         <div>
            //             <a href={"/"}>
            //                 <div class="tagLink">Home</div>
            //             </a>
            //         </div>
            //         {this.state.boards.map(element => 
            //             <div>
            //                 <a href={"/boards/" + element.tag}>
            //                     <div class="tagLink">{element.tag}</div>
            //                 </a>
            //             </div>
            //         )} 
            //     </div>
            //     <div id="toolbar">
            //         <button onClick={this.handleHideQr}>post</button>
            //         {this.state.quickReplyOpen ? <QuickReply api={this.props.api} tag={this.props.tag} thread={this.props.thread} id={this.props.id} /> : null}
            //     </div>
            // </div>
            <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="/">Home</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">

                            {this.state.boards.map(element => 
                                <li class="nav-item">
                                    <a className="nav-link" href={"/boards/" + element.tag}>
                                        <div class="tagLink">{"/" + element.tag + "/"}</div>
                                    </a>
                                </li>
                            )}
                        </ul>
                        <div class="nav-item dropdown keep-open">
                            <a class="nav-link dropdown-toggle btn-success" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Post
                            </a>
                            <QuickReply api={this.props.api} tag={this.props.tag} thread={this.props.thread} id={this.props.id}/>
                        </div>
                    </div>
                </nav>
        )
    }
}

export default NavBar;