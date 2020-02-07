import React from 'react';
import logo from './logo.svg';
import './App.css';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import GuardedRoute from "./GuardedRoute.js";
import { GuardedComponent } from "./GuardedComponent.js";

import { NodeList, NodeGraph, NodeVisTimeline } from "./NodeComponents.js";

import { TestAuthentication } from "./TestAuthentication.js";

import Callback from './Callback.js';

import auth from "./Auth.js";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  request: (operation) => {
  	operation.setContext({
  		headers: {
  			authorization: auth.getIdToken()
  		},
  	});
  },
});



class App extends React.Component {

  async componentDidMount() {
    console.log("App mounted");
    if (this.props.location.pathname === '/callback') return;
    console.log("Not in callback");

    try {
      await auth.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err === "login_required") return;
      console.log(err.error);
    }
  }

  render() {
    return (
      <>
    		<Route exact path="/">
  		    <ApolloProvider client={client} className="App">
  		      <header className="App-header">
  		        <img src={logo} className="App-logo" alt="logo" />
  		        <NodeVisTimeline client={ client } />
  		      </header>
  		    </ApolloProvider>
    		</Route>
    		<Route path="/test">
    			<TestAuthentication client={ client }/>
    		</Route>
    		<Route exact path='/callback' component={Callback} />
        <GuardedRoute exact path="/guarded" component={GuardedComponent} />
      </>
    );
  }
}

export default withRouter(App);
