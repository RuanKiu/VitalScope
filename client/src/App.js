import React, { Fragment } from "react";
import "./App.css";
import Data from "./components/Data";
import Home from "./components/Home";
import Groups from "./components/Groups";
import User from "./components/User";
import { Link, Redirect, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Fragment>
      <div className="nav-bar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/data">Add Data</Link>
          </li>
          <li className="nav-item">
            <Link to="groups">Monitor Patients</Link>
          </li>
        </ul>
      </div>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/data" component={Data}></Route>
        <Route exact path="/groups" component={Groups}></Route>
        <Route exact path="/patient/:id" component={User}></Route>
        <Route path="/">
          <Redirect to="/"></Redirect>
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
