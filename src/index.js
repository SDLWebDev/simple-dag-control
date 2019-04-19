import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import joint from "jointjs/index";
import g from "jointjs/index";
import { DagNode, DagEdge } from "./jointjs/definitions";
import _ from "lodash";

const LINK_STROKE_WIDTH = 1;
const LINK_HIGHLIGHTED_STROKE_WIDTH = 2;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.paperContainer = React.createRef();
  }

  buildGraph = (nodes, edges) => {
    var elements = nodes.map(n => new DagNode({ id: n.id }).setText(n.title));
    // var links = edges.map(e => new DagEdge().connect(e.from, e.to).setLabelText(e.weight));

    var links = edges.map(e =>
      new joint.shapes.standard.Link({
        source: { id: e.from },
        target: { id: e.to },
        connector: { name: "rounded" },
        attrs: {
          line: {
            stroke: "black",
            strokeWidth: LINK_STROKE_WIDTH
          }
        }
      }).router("normal", {
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

    graph.on("change:position", function(cell) {
      var allCells = graph.getCells();

      // has an obstacle been moved? Then reroute the link.
      if (allCells.indexOf(cell) > -1) {
        console.log("updating...");

        allCells.forEach(link => {
          paper.findViewByModel(link).update();
        });
      }
    });

    paper.fitToContent({
      padding: 50,
      allowNewOrigin: "any"
    });

    paper.on("cell:pointerdblclick", function(cellView) {
      var isElement = cellView.model.isElement();
      console.log(cellView.model.id);
    });

    paper.on("blank:pointerclick", function(cellView) {
      var links = graph.getLinks();

      links.forEach(l => {
        var linkView = l.findView(paper);
        linkView.model.attr("line/stroke", "black");
        linkView.model.attr("line/strokeWidth", LINK_STROKE_WIDTH);
        linkView.model.toBack();
        linkView.removeTools();
      });
    });

    /// link tools //////////////////////////////////////////////////////////////////////////////

    paper.on("link:mouseenter", function(linkView) {
      linkView.showTools();
    });

    paper.on("link:mouseleave", function(linkView) {
      //if (!linkView.hasTools("onhover")) return;
      //
    });

    paper.on("link:pointerdown", function(linkView) {
      var links = graph.getLinks();

      links.forEach(l => {
        var linkView = l.findView(paper);
        linkView.model.attr("line/stroke", "black");
        linkView.model.attr("line/strokeWidth", LINK_STROKE_WIDTH);
        linkView.model.toBack();
        linkView.removeTools();
      });

      linkView.model.attr("line/stroke", "red");
      linkView.model.attr("line/strokeWidth", LINK_HIGHLIGHTED_STROKE_WIDTH);
      linkView.model.toFront();

      // tools
      var verticesTool = new joint.linkTools.Vertices({
        vertexAdding: false
      });
      var segmentsTool = new joint.linkTools.Segments();
      var sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
      var targetArrowheadTool = new joint.linkTools.TargetArrowhead();
      var sourceAnchorTool = new joint.linkTools.SourceAnchor({
        focusOpacity: 0.5,
        redundancyRemoval: false,
        restrictArea: false,
        snapRadius: 20
      });
      var targetAnchorTool = new joint.linkTools.TargetAnchor({
        focusOpacity: 0.5,
        redundancyRemoval: false,
        restrictArea: false,
        snapRadius: 20
      });
      var boundaryTool = new joint.linkTools.Boundary();
      var removeButton = new joint.linkTools.Remove({
        focusOpacity: 0.5,
        rotate: false,
        distance: 0,
        offset: 15
      });

      linkView.addTools(
        new joint.dia.ToolsView({
          tools: [
            //
            verticesTool,
            //segmentsTool,
            //sourceArrowheadTool,
            targetArrowheadTool,
            // sourceAnchorTool,
            // targetAnchorTool,
            //boundaryTool,
            removeButton
          ]
        })
      );
    });
    //////////////////////////////////////////////////////////////////////////////////////////
  };

  componentDidMount() {
    var nodes = [
      //
      { id: "1", title: "node 1" },
      { id: "2", title: "long nody node node node really really long node let's see what happens" },
      { id: "3", title: "node 3" },
      { id: "4", title: "node 4" },
      { id: "5", title: "node 5" }
    ];
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
