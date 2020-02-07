import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';

import auth from "./Auth.js";


const getThreeNodesQuery = gql`query {
  getMostRecentNodes(n: 3) {
    id
    url
    isStarred
  }
}`;

export class TestAuthentication extends React.Component {

	constructor(props) {
		super(props);
		this.state = {queryResults: null};
		// this.updateQueryResults = this.updateQueryResults.bind(this);
	}

	updateQueryResults = (res) => {
		const listResults = res.data.getMostRecentNodes.map( (node) => {return (<p key={node.id}> {node.url} </p>)});

		this.setState({
			queryResults: ( 
				<React.Fragment>
					<p> { Date.now() } </p>
					<ul> { listResults } </ul> 
				</React.Fragment>
				)
		});
	}

	logout = () => {
		auth.logout();
	}

	queryStuff() {

		console.log("Auth status in queryStuff(): ", auth.isAuthenticated());
		console.log("Auth id: ", auth.getIdToken());

    	this.props.client.query({query: getThreeNodesQuery})
    	.then((res) => this.updateQueryResults(res))
    	.catch((err) => this.setState({
    		queryResults: (
    			<React.Fragment>
	    			<p> { Date.now() } </p>
	    			<p> { err.message } </p>
    			</React.Fragment>
    		)
    	}));
	}

	componentDidMount() {
		this.queryStuff();
	}


	render() {
		return (
			<div>
				<h1> Welcome to the authentication test page! </h1>

				<button id="login" onClick={ () => auth.login() }>Login</button>
				<button id="logout" onClick={ () => auth.logout() }>Logout</button>
				{
					( auth.isAuthenticated() ) ? <p>We're authenticated!</p> : <p> Whoops! Looks like we're not authenticated </p>
				}
				<Link to="/guarded"> GuardedComponent </Link>
				<div>
					<h3> Sample Authenticated Query </h3>
					<p> <b> Last 3 nodes urls: </b> <button onClick={() => this.queryStuff() }>Refresh</button></p>
					<div id="query-results"> { this.state.queryResults } </div>
				</div> 
			</div>
		);
	}

}