import React from 'react';
import './quickReply.css'
var Request = require("request");

//component class
class quickReply extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            author: "",
            subject: null,
            postBody: null,
            uploading: false,
            posting: false,
            fkey: Date.now(),
            fExists: false
        }
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.fileInput = React.createRef();
    }

    componentDidMount(props){
        // console.log(this.props.tag);
    }

    //event handlers
    handleContentChange(event) {
        this.setState({postBody: event.target.value})
    }

    handleAuthorChange(event) {
        this.setState({author: event.target.value});
    }

    handleSubjectChange(event) {
        this.setState({subject: event.target.value})
    }

    handleFileChange(event) {
        this.setState({fExists: true})
    }

    //submits a post and takes a filename
    handlePost(image) {
        if (this.props.thread) {
            let url = this.props.api + "boards/" + this.props.tag + "/thread";
            return Request.post({
                "headers": { "content-type": "application/json" },
                "url": url ,
                "body": JSON.stringify({
                    "subject": this.state.subject,
                    "user": this.state.author,
                    "postBody": this.state.postBody,
                    "image": image
                })
            }, (error, response, body) => {
                if(error) {
                    alert("post failed")
                    return console.dir(error);
                }
                alert("post successfull");
                window.location.reload();
            });
        } else {
            let url = this.props.api + "boards/" + this.props.tag + "/thread/" + this.props.id + "/post";
            return Request.post({
                "headers": { "content-type": "application/json" },
                "url": url ,
                "body": JSON.stringify({
                    "subject": this.state.subject,
                    "user": this.state.author,
                    "content": this.state.postBody,
                    "image": image,
                    "mentions": []
                })
            }, (error, response, body) => {
                if(error) {
                    alert("post failed")
                    return console.dir(error);
                }
                alert("post successfull");
                window.location.reload();
            });
        }
    }

    //uploads a file, and then proceeds
    handleUpload() {
        if(this.state.fExists == false && this.props.thread == true){
            alert("Thread must have an image");
            return
        }
        if(this.state.postBody == null) {
            alert("please fill out post content");
            return
        }
        console.log(this.props.id);
        if(this.state.fExists){
            let fileName = this.fileInput.files[0].name;
            const data = new FormData();
            data.append('file', this.fileInput.files[0]);
            data.append('filename', fileName);
            console.log(data);
            let url = this.props.api + "upload";
            fetch(url, {
                    method: 'POST',
                    body: data
                }).then((response) => {
                response.json().then((body) => {
                    if (body.success == false) {
                        alert("Upload Failed");
                        return
                    } else {
                        console.log(body);
                        this.handlePost(body.fileName);
                    }
                });
            });
            this.setState({fkey: Date.now(), fExists: false})
        } else {
            this.handlePost(null);
        }
    }

    render(props) {
        return(
            <div id="QRBody" className="VerticalContainer">
                <div id="QrBar" className="handle">Quick Reply</div>
                <label>
                    <input type="text" value={this.state.author} onChange={this.handleAuthorChange} placeholder="Name"/>
                    <input type="text" value={this.state.subject} onChange={this.handleSubjectChange} placeholder="Subject"/>
                </label>
                <textarea value={this.state.postBody} onChange={this.handleContentChange} placeholder="content"/>
                <div>
                    <input key={this.state.fkey} onChange={this.handleFileChange} ref={(ref) => { this.fileInput = ref; }} type="file" />
                </div>
                <button disabled={this.state.posting || this.state.uploading} onClick={this.handleUpload}>
                    Submit
                </button>
                <p>{(this.state.posting || this.state.uploading) ? 'Posting...' : ''}</p>
            </div>
        )
    }
}

export default quickReply;