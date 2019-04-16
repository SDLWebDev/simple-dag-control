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

  buildGraphFromAdjacencyList = adjacencyList => {
    var elements = [];
    var links = [];

    Object.keys(adjacencyList).forEach(function(parentLabel) {
      // Add element
      elements.push(new DagNode({ id: parentLabel }).setText(parentLabel));
      // Add links
      adjacencyList[parentLabel].forEach(function(childLabel) {
        links.push(new DagEdge().connect(parentLabel, childLabel).setLabelText(parentLabel + "-" + childLabel));
      });
    });

    // Links must be added after all the elements. This is because when the links
    // are added to the graph, link source/target
    // elements must be in the graph already.
    return elements.concat(links);
  };

  layout = (paper, graph, cells) => {
    joint.layout.DirectedGraph.layout(cells, {
      setVertices: true,
      setLabels: true,
      ranker: "network-simplex",
      rankDir: "TB",
      align: "UL",
      rankSep: 50,
      edgeSep: 50,
      nodeSep: 50
    });

    if (graph.getCells().length === 0) {
      // The graph could be empty at the beginning to avoid cells rendering
      // and their subsequent update when elements are translated
      graph.resetCells(cells);
    }

    var info = new joint.shapes.standard.Rectangle();
    info.position(250, 70);
    info.resize(100, 20);
    info.attr({
      body: {
        visibility: "hidden",
        cursor: "default",
        fill: "white",
        stoke: "black"
      },
      label: {
        visibility: "hidden",
        text: "Link clicked",
        cursor: "default",
        fill: "black",
        fontSize: 12
      }
    });

    info.addTo(graph);

    paper.fitToContent({
      padding: 50,
      allowNewOrigin: "any"
    });

    paper.on("cell:pointerdblclick", function(cellView) {
      var isElement = cellView.model.isElement();
      var message = (isElement ? "Element" : "Link") + " clicked";
      info.attr("label/text", message);

      info.attr("body/visibility", "visible");
      info.attr("label/visibility", "visible");
    });

    //this.trigger("layout");
  };

  componentDidMount() {
    // var LayoutControls = joint.mvc.View.extend({
    //   events: {
    //     change: "layout",
    //     input: "layout"
    //   },

    //   options: {
    //     padding: 50
    //   },

    //   init: function() {
    //     var options = this.options;
    //     if (options.adjacencyList) {
    //       options.cells = this.buildGraphFromAdjacencyList(options.adjacencyList);
    //     }

    //     this.listenTo(options.paper.model, "change", function(cell, opt) {
    //       if (opt.layout) {
    //         this.layout(options.paper, options.paper.model.graph, options.cells);
    //       }
    //     });
    //   }
    // });

    var paper = new joint.dia.Paper({
      el: this.paperContainer.current,
      interactive: function(cellView) {
        return cellView.model.isElement();
      }
    });

    var adjacencyList = this.buildGraphFromAdjacencyList({
      a: ["b", "c", "d"],
      b: ["d", "e"],
      c: [],
      d: [],
      e: ["e"],
      f: [],
      g: ["b", "i"],
      h: ["f"],
      i: ["f", "h"]
    });

    this.layout(paper, paper.model, adjacencyList);
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
