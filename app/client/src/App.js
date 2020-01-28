import React from 'react';
import logo from './logo.svg';
import './App.css';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { NodeList, NodeGraph, NodeVisTimeline } from "./NodeComponents.js";


const client = new ApolloClient({
  uri: "http://localhost:4000",
});



function App() {
  return (
    <ApolloProvider client={client} className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <NodeVisTimeline client={client} />
      </header>
    </ApolloProvider>
  );
}

export default App;
