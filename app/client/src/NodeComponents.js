import React from 'react';

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { useQuery } from '@apollo/react-hooks';


import * as THREE from '../node_modules/three/build/three.min.js';
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

import '../node_modules/vis-timeline/dist/vis-timeline-graph2d.min.css';
// import * as vistimeline from '../node_modules/vis-timeline';

const getAllNodesQuery = gql`query {
  getAllNodes {
    id
    url
    timestamp
  }
}`;

export class NodeList extends React.Component {

  render() {
    return (
      <Query query={getAllNodesQuery}>
        {
          ({loading, error, data}) => {
            if (loading) return <p> Loading... </p>;
            if (error) return <p> Error: {error} </p>;

            return data.getAllNodes.map(({id, url}) => (
              <div key={id}>
                <p> {id}: {url} </p>
              </div>
            ));
          }
        }
      </Query>
    );
  }
}


export class NodeGraph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {nodes: []};
    this.updateNodes = this.updateNodes.bind(this);
  }

  updateNodes(nodeList) {
    debugger;
    this.setState({
      nodes: nodeList
    });

    let sphere = new THREE.Mesh(new THREE.SphereGeometry(.1, 32, 32), new THREE.MeshNormalMaterial());
    for (let node of nodeList) {
      let nodeSphere = sphere.clone();
      nodeSphere.nodeID = node.id;
      nodeSphere.url = node.url;

      const scale = 2;

      nodeSphere.position.x += scale*(.5 - Math.random());
      nodeSphere.position.y += scale*(.5 - Math.random());

      this.scene.add(nodeSphere);
    }
  }


  componentDidMount() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // const controls = new THREE.OrbitControls( this.camera, renderer.domElement );

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.refs['three-canvas'].appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry( .1, .1, .1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );
    this.camera.position.z = 5;
    const animate = () => {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( this.scene, this.camera );
    };
    animate();

    // Subscribe to node data:
    this.props.client.query({query: getAllNodesQuery}).then((res) => this.updateNodes(res.data.getAllNodes));
  }

  render() {
    return (
      <div ref="three-canvas" />
    );
  }
}


export class NodeVisTimeline extends React.Component {


  constructor(props) {
    super(props);
    this.state = {nodes: []};
    this.updateNodes = this.updateNodes.bind(this);
    this.timeline = null;
    this.dataset = null;
  }

  updateNodes(nodeList) {
    this.setState({
      nodes: nodeList,
    });

    let items = [];

    let maxId = this.timeline.itemsData.length > 0 ? this.timeline.itemsData.max('id').id : 0;
    let lastTimestamp = null;
    let groupId = 0;
    for (let node of nodeList) {
      maxId += 1;

      // if ( lastTimestamp == null || Math.abs(node.timestamp - lastTimestamp) < 1000 ) {
      //   // Keep same groupId
      // } else {
      //   groupId += 1;
      // }
      groupId += 1;

      items.push({id: maxId, title: node.timestamp, content: node.url, start: node.timestamp,  group: groupId});
      lastTimestamp = node.timestamp;
    }

    this.timeline.itemsData.add(items);

  }

  componentDidMount() {
    const container = document.getElementById('vis-timeline');

    this.dataset = new window.vis.DataSet([]);

    const options = {
      align: 'left',
      width: '100%',
      autoResize: false,
      maxHeight: '400px',
      zoomKey: 'shiftKey', 
      horizontalScroll: true,
      rollingMode: {
        follow: false
      },
      tooltip: {
        followMouse: true,
        delay: 5000
      },
      // type: 'point',
      cluster: {
        fitOnDoubleClick: true
      },

      // timeAxis: {
      //   scale: 'hour',
      // },
      // configure: true
    };

    // Subscribe to node data:
    this.props.client.query({query: getAllNodesQuery}).then((res) => this.updateNodes(res.data.getAllNodes));

    this.timeline = new window.vis.Timeline(container, this.dataset, options);
    const currentTime = this.timeline.getCurrentTime();
    this.timeline.setWindow(currentTime-3*3600*1000, currentTime+3600*1000);

    window.addEventListener("keydown", (e) => {
      debugger;

      if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
        const currentIds = this.timeline.getSelection();
        const maxId = this.timeline.itemsData.length;
        let currentId = 1;
        if (currentIds.length > 0) {
          if (e.key == "ArrowRight") {
            currentId = (currentIds[currentIds.length-1] + 1) % (maxId);
          } else {
            currentId = (maxId + currentIds[currentIds.length-1] - 1) % (maxId);
          }
        }
        this.timeline.setSelection(currentId, {focus: true});
      } 
      else if (e.key == "h") {
        this.timeline.fit();
      }
    });
  }

  render() {
    return (
      <>
        <div id="vis-timeline" />
        <div id="node-info" />
      </>
    );
  }
}


