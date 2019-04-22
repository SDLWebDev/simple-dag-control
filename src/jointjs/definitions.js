import joint from "jointjs/index";

export const DagNode = joint.dia.Element.define(
  "dag.Node",
  {
    size: {
      width: 150,
      height: 50
    },
    inPorts: ["in"],
    outPorts: ["out"],
    ports: {
      groups: {
        out: {
          position: {
            name: "absolute",
            args: {
              x: "50%",
              y: "100%"
            }
          },
          attrs: {
            ".port-body": {
              stroke: "black",
              fill: "red",
              strokeWidth: 2,
              height: 10,
              width: 20,
              refX: -10,
              refY: -5,
              opacity: 1,
              magnet: true
            }
          },
          markup: '<rect class="port-body"/>'
        }
      },
      items: [
        {
          group: "out",
          args: {} // overrides `args` from the group level definition.
        }
      ]
    },
    attrs: {
      body: {
        refWidth: "100%",
        refHeight: "100%",
        strokeWidth: 2,
        stroke: "#000000",
        fill: "#FFFFFF",
        rx: 10,
        ry: 10
      },

      label: {
        fontSize: 15,
        refX: "50%",
        refY: "50%",
        textVerticalAnchor: "middle",
        textAnchor: "middle",
        textWrap: {
          text: "",
          width: -25, // reference width minus 10
          height: "80%", // half of the reference height
          ellipsis: true // could also be a custom string, e.g. '...!?'
        },
        style: "-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"
      }
    }
  },
  {
    markup: [
      {
        tagName: "rect",
        selector: "body"
      },
      {
        tagName: "text",
        selector: "label"
      }
    ],

    setText: function(text) {
      return this.attr("label/textWrap/text", text || "");
    }
    // hidePort: function(text) {
    //   console.log("hide port");
    //   return this.attr("ports/groups/out/attrs/opacity", 0);
    // },
    // showPort: function(text) {
    //   console.log("show port");
    //   return this.attr("ports/groups/out/attrs/opacity", 1);
    // }
  }
);

export const DagOutPort = new joint.shapes.devs.Model({
  position: { x: 50, y: 50 },
  size: { width: 90, height: 90 },
  inPorts: ["in1", "in2"],
  outPorts: ["out"],
  ports: {
    groups: {
      in: {
        attrs: {
          ".port-body": {
            fill: "#16A085"
          }
        }
      },
      out: {
        attrs: {
          ".port-body": {
            fill: "#E74C3C"
          }
        }
      }
    }
  },
  attrs: {
    ".label": { text: "Model", "ref-x": 0.5, "ref-y": 0.2 },
    rect: { fill: "#2ECC71" }
  }
});

export const DagEdge = joint.dia.Link.define(
  "dag.Edge",
  {
    attrs: {
      line: {
        connection: true,
        stroke: "gray",
        strokeWidth: 2,
        pointerEvents: "none",
        targetMarker: {
          type: "path",
          fill: "gray",
          stroke: "none",
          d: "M 10 -10 0 0 10 10 z"
        }
      }
    },
    router: {
      name: "manhattan"
    },
    connector: {
      name: "rounded"
    },
    z: -1,
    weight: 0,
    minLen: 0,
    labels: [
      {
        markup: [
          {
            tagName: "rect",
            selector: "labelBody"
          },
          {
            tagName: "text",
            selector: "labelText"
          }
        ],
        size: {
          width: 100,
          height: 50
        },
        attrs: {
          labelText: {
            fill: "gray",
            textAnchor: "middle",
            textVerticalAnchor: "middle",
            fontSize: 15,
            cursor: "pointer"
          },
          labelBody: {
            ref: "labelText",
            fill: "lightgray",
            stroke: "gray",
            strokeWidth: 1,
            refWidth: "150%",
            refHeight: "150%",
            yAlignment: "middle",
            xAlignment: "middle"
          }
        }
      }
    ]
  },
  {
    markup: [
      {
        tagName: "path",
        selector: "line",
        attributes: {
          fill: "none"
        }
      }
    ],

    connect: function(sourceId, targetId) {
      return this.set({
        source: { id: sourceId },
        target: { id: targetId }
      });
    },

    setLabelText: function(text) {
      return this.prop("labels/0/attrs/labelText/text", text || "");
    }
  }
);
