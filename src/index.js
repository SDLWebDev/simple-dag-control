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

  componentDidMount() {
    var LayoutControls = joint.mvc.View.extend({
      events: {
        change: "layout",
        input: "layout"
      },

      options: {
        padding: 50
      },

      init: function() {
        var options = this.options;
        if (options.adjacencyList) {
          options.cells = this.buildGraphFromAdjacencyList(options.adjacencyList);
        }

        this.listenTo(options.paper.model, "change", function(cell, opt) {
          if (opt.layout) {
            this.layout();
          }
        });
      },

      layout: function() {
        var paper = this.options.paper;
        var graph = paper.model;
        var cells = this.options.cells;

        joint.layout.DirectedGraph.layout(cells, this.getLayoutOptions());

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
          padding: this.options.padding,
          allowNewOrigin: "any"
        });

        paper.on("cell:pointerdblclick", function(cellView) {
          var isElement = cellView.model.isElement();
          var message = (isElement ? "Element" : "Link") + " clicked";
          info.attr("label/text", message);

          info.attr("body/visibility", "visible");
          info.attr("label/visibility", "visible");
        });

        this.trigger("layout");
      },

      getLayoutOptions: function() {
        return {
          setVertices: true,
          setLabels: true,
          ranker: this.$("#ranker").val(),
          rankDir: this.$("#rankdir").val(),
          align: this.$("#align").val(),
          rankSep: parseInt(this.$("#ranksep").val(), 10),
          edgeSep: parseInt(this.$("#edgesep").val(), 10),
          nodeSep: parseInt(this.$("#nodesep").val(), 10)
        };
      },

      buildGraphFromAdjacencyList: function(adjacencyList) {
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
      }
    });

    var paper = new joint.dia.Paper({
      el: this.paperContainer.current,
      interactive: function(cellView) {
        return cellView.model.isElement();
      }
    });

    var controls = new LayoutControls({
      el: this.layoutControls.current,
      paper: paper,
      adjacencyList: {
        a: ["b", "c", "d"],
        b: ["d", "e"],
        c: [],
        d: [],
        e: ["e"],
        f: [],
        g: ["b", "i"],
        h: ["f"],
        i: ["f", "h"]
      }
    });

    controls.layout();
  }

  render() {
    return (
      <>
        <div className="App">
          <div id="layout-controls" className="controls" ref={this.layoutControls}>
            <label for="ranker">Ranker:</label>
            <select id="ranker">
              <option value="network-simplex" selected>
                network-simplex
              </option>
              <option value="tight-tree">tight-tree</option>
              <option value="longest-path">longer-path</option>
            </select>
            <label for="rankdir">RankDir:</label>
            <select id="rankdir">
              <option value="TB" selected>
                TB
              </option>
              <option value="BT">BT</option>
              <option value="RL">RL</option>
              <option value="LR">LR</option>
            </select>
            <label for="align">Align:</label>
            <select id="align">
              <option value="UL" selected>
                UL
              </option>
              <option value="UR">UR</option>
              <option value="DL">DL</option>
              <option value="DR">DR</option>
            </select>
            <label for="ranksep">RankSep:</label>
            <input id="ranksep" type="range" min="1" max="100" value="50" />
            <label for="edgesep">EdgeSep:</label>
            <input id="edgesep" type="range" min="1" max="100" value="50" />
            <label for="nodesep">NodeSep:</label>
            <input id="nodesep" type="range" min="1" max="100" value="50" />
          </div>
          <div id="paper" className="paper" ref={this.paperContainer} />
        </div>
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
