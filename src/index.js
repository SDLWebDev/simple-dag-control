import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import joint from "jointjs/index";
import { DagNode, DagEdge } from "./jointjs/definitions";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.paperContainer = React.createRef();
    this.layoutControls = React.createRef();
  }

  buildGraph = (nodes, edges) => {
    var elements = nodes.map(n => new DagNode({ id: n.id }).setText(n.title));
    var links = edges.map(e => new DagEdge().connect(e.from, e.to).setLabelText(e.weight));

    return elements.concat(links);
  };

  layout = cells => {
    var paper = new joint.dia.Paper({
      el: this.paperContainer.current,
      interactive: function(cellView) {
        return cellView.model.isElement();
      }
    });

    var graph = paper.model;

    joint.layout.DirectedGraph.layout(cells, {
      setVertices: true,
      setLabels: true,
      ranker: "tight-tree",
      rankDir: "TB",
      align: "UL",
      weight: 100,
      rankSep: 50,
      edgeSep: 50,
      nodeSep: 50
    });

    if (graph.getCells().length === 0) {
      // The graph could be empty at the beginning to avoid cells rendering
      // and their subsequent update when elements are translated
      graph.resetCells(cells);
    }

    paper.fitToContent({
      padding: 50,
      allowNewOrigin: "any"
    });

    paper.on("cell:pointerdblclick", function(cellView) {
      var isElement = cellView.model.isElement();
      console.log(cellView.model.id);
    });
  };

  componentDidMount() {
    var nodes = [{ id: "1", title: "node 1" }, { id: "2", title: "long node node node 2" }, { id: "3", title: "node 3" }, { id: "4", title: "node 4" }, { id: "5", title: "node 5" }];
    var edges = [
      { from: "1", to: "3", weight: "33%" },
      { from: "2", to: "4", weight: "100%" },
      { from: "1", to: "4", weight: "33%" },
      { from: "1", to: "5", weight: "33%" },
      { from: "4", to: "5", weight: "100%" }
    ];

    this.layout(this.buildGraph(nodes, edges));
  }

  render() {
    return (
      <>
        <div className="App">
          <div id="paper" className="paper" ref={this.paperContainer} />
        </div>
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
