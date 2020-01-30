import React from 'react';
import ReactDOM from 'react-dom';
import "./NodeComponents.css";

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
    isStarred
  }
}`;

const getMostRecentNodesQuery = gql`query {
  getMostRecentNodes(n: 200) {
    id
    url
    timestamp
    isStarred
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
    this.hideUnselected = false;
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

      items.push({id: maxId, title: node.timestamp, content: node.url, isStarred: node.isStarred, start: node.timestamp,  group: groupId});
      lastTimestamp = node.timestamp;
    }

    this.timeline.itemsData.add(items);

  }

  componentDidMount() {
    const toggleButton = document.getElementById("toggle-hide-unselected");
    toggleButton.addEventListener('mouseup', () => {
      this.hideUnselected = !this.hideUnselected;
      let allElems = document.getElementsByClassName("vis-item vis-point");
      if (allElems.length == 0) {
        return;
      }
      if (this.hideUnselected) {
        for (let elem of allElems) {
          if (!elem.classList.contains('vis-selected')) {
            console.log(elem.style.display);
            elem.style.display = 'none';
          }
        }
      } 
      else {
        for (let elem of allElems) {
          elem.style.display = '';
        }
      }
    });


    const container = document.getElementById('vis-timeline');

    this.dataset = new window.vis.DataSet([]);

    const options = {
      align: 'left',
      width: '100%',
      autoResize: false,
      height: '400px',
      zoomKey: 'shiftKey', 
      horizontalScroll: true,
      rollingMode: {
        follow: false
      },
      tooltip: {
        followMouse: true,
        delay: 5000
      },
      type: 'point',
      multiselect: true,
      // cluster: {
      //   fitOnDoubleClick: true
      // },

      template: (item, element, data) => {
        return ReactDOM.render(
          <a  href={item.content} 
              target="_blank"   
              className={item.isStarred ? "node-link starred-node" : "node-link"}>
              {item.content}
          </a>, element);
      },

      // timeAxis: {
      //   scale: 'hour',
      // },
      // configure: true
    };

    // Subscribe to node data:
    this.props.client.query({query: getMostRecentNodesQuery}).then((res) => this.updateNodes(res.data.getMostRecentNodes));

    this.timeline = new window.vis.Timeline(container, this.dataset, options);
    const currentTime = this.timeline.getCurrentTime();
    let startTime = currentTime-3*3600*1000;
    let endTime = currentTime+3600*1000;
    this.timeline.setWindow(startTime, endTime);

    this.timeline.on("changed", () => {
      const tableElement = document.getElementById("count-nodes-visible-val");
      tableElement.innerHTML = this.timeline.getVisibleItems().length;

      const windowStartElement = document.getElementById("window-start");
      const windowEndElement = document.getElementById("window-end");
      const timespanElement = document.getElementById("time-span-hours");

      const windowRange = this.timeline.getWindow();

      windowStartElement.innerHTML = windowRange.start;
      windowEndElement.innerHTML = windowRange.end;
      timespanElement.innerHTML = ((windowRange.end-windowRange.start)/3600/1000).toFixed(2);

    });
    this.timeline.on("currentTimeTick", () => {
      const tableElement = document.getElementById("current-timeline-time-val");
      tableElement.innerHTML = this.timeline.getCurrentTime();
    });

    window.addEventListener("keydown", (e) => {
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
        this.timeline.setSelection(currentId, {focus: false});
        const selection = this.timeline.getSelection();
        this.timeline.focus(selection, {zoom: false});
      } 
      else if (e.key == "f") {
        const selection = this.timeline.getSelection();
        this.timeline.focus(selection, {zoom: false});
      }
      else if (e.key == "h") {
        this.timeline.fit();
      }
      else if (e.key == "c") {
        const currentTime = this.timeline.getCurrentTime();
        this.timeline.moveTo(currentTime);
      }
      else if (e.key == "z") {
        this.timeline.zoomIn(1.0);
      } else if (e.key == "x") {
        this.timeline.zoomOut(1.0);
      }
    });
  }

  render() {
    return (
      <>
        <button id='toggle-hide-unselected'> Toggle Hide Unselected </button>
        <div id="vis-timeline" />
        <div id="timeline-info">
          <table id='timeline-info-table'>
            <tbody>
              <tr>
               <td colspan='2'> <b>Current Time</b> </td>
               <td id="current-timeline-time-val" colspan='2'/> 
              </tr>
              <tr>
               <td colspan='2'> <b>Window Start Time</b> </td>
               <td id="window-start" colspan='2' /> 
              </tr>
              <tr>
               <td colspan='2'> <b>Window End Time</b> </td>
               <td id="window-end" colspan='2' /> 
              </tr>
              <tr> 
                <td> <b>Nodes Visible</b> </td>
                <td> <span id="count-nodes-visible-val" align='right' /> Nodes </td>
                <td> <b> Time Span (hours)</b> </td>
                <td id='time-span-hours' />
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}


