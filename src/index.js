import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import joint from "jointjs/index";
import { DagNode, DagEdge } from "./jointjs/definitions";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.paperContainer = React.createRef();
  }

  buildGraph = (nodes, edges) => {
    var elements = nodes.map(n => new DagNode({ id: n.id }).setText(n.title));
    // var links = edges.map(e => new DagEdge().connect(e.from, e.to).setLabelText(e.weight));

    // var elements = nodes.map(n =>
    //   new joint.shapes.standard.Rectangle(
    //     { id: n.id },
    //     {
    //       attr: {
    //         body: {
    //           fill: {
    //             type: "linearGradient",
    //             stops: [{ offset: "0%", color: "#f7a07b" }, { offset: "100%", color: "#fe8550" }],
    //             attrs: { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }
    //           },
    //           stroke: "#ed8661",
    //           strokeWidth: 2
    //         },
    //         label: {
    //           text: n.title,
    //           fill: "#f0f0f0",
    //           fontSize: 18,
    //           fontWeight: "lighter",
    //           fontVariant: "small-caps"
    //         }
    //       }
    //     },
    //     {
    //       markup: [
    //         {
    //           tagName: "rect",
    //           selector: "body"
    //         },
    //         {
    //           tagName: "text",
    //           selector: "label"
    //         }
    //       ]
    //     }
    //   ).resize(300, 100)
    // );

    var links = edges.map(e =>
      new joint.shapes.standard.Link({
        source: { id: e.from },
        target: { id: e.to },
        connector: { name: "rounded" },
        attrs: {
          line: {
            stroke: "#333333",
            strokeWidth: 3
          }
        }
      }).router("manhattan", {
        // excludeEnds: ['source'],
        // excludeTypes: ['myNamespace.MyCommentElement'],
        startDirections: ["bottom"],
        endDirections: ["top"]
      })
    );

    return elements.concat(links);
  };

  layout = cells => {
    var graph = new joint.dia.Graph();

    var paper = new joint.dia.Paper({
      el: this.paperContainer.current,
      width: 1000,
      height: 600,
      gridSize: 10,
      model: graph
    });

    var graphBBox = joint.layout.DirectedGraph.layout(cells, {
      ranker: "tight-tree",
      rankDir: "TB",
      align: "UL",
      rankSep: 100,
      edgeSep: 100,
      nodeSep: 100
    });

    if (graph.getCells().length === 0) {
      // The graph could be empty at the beginning to avoid cells rendering
      // and their subsequent update when elements are translated
      graph.resetCells(cells);
    }

    // graph.on("change:position", function(cell) {
    //   // has an obstacle been moved? Then reroute the link.
    //   if (obstacles.indexOf(cell) > -1) paper.findViewByModel(link).update();
    // });

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

    var dag = this.buildGraph(nodes, edges);
    console.log(dag);
    this.layout(dag);
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
