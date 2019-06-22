import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/landing.css';
import Landing from './containers/landing';
import ThreadPage from './containers/thread';
import BoardPage from './containers/board'
import NotFound from './containers/404'
import AdminPage from './containers/admin'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


function Index() {  
  return <Landing api= "http://localhost:5000/api/"/>;
}

function DNF() {
  return <NotFound/>;
}

function BoardRoute({match}) {
  return(
    <Router>
      <Switch>
        <Route path={`${match.path}/thread/:id`} component={Thread} />
        <Route path={`${match.path}/`} component={Board}/>
      </Switch>
    </Router>
  )
}

function Board({match}) {
  return <BoardPage  api= "http://localhost:5000/api/" tag={match.params.tag}/>
}

function Boards({match}) {
  return (<Route path={`${match.path}/:tag`} component={BoardRoute} />);
}

function Thread({match}) {
  return <ThreadPage api="http://localhost:5000/api/" id={match.params.id} tag={match.params.tag}/>
}

function Admin() {
  return <AdminPage api="http://localhost:5000/api/"/>
}

function AppRouter() {
  return (
    <Router>
        <Switch>
          <Route path="/" exact component={Index} />
          <Route path="/boards" component={Boards} />
          <Route path="/admin" component={Admin} />
          <Route component={DNF} />
        </Switch>
    </Router>
  );
}

export default AppRouter;
//export default App;
