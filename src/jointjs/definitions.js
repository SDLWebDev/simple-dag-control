import joint from "jointjs/index";

export const DagNode = joint.dia.Element.define(
  "dag.Node",
  {
    size: {
      width: 100,
      height: 50
    },
    attrs: {
      body: {
        ref: "label",
        refWidth: "125%",
        refHeight: "125%",
        fill: "ivory",
        stroke: "gray",
        strokeWidth: 2,
        rx: 10,
        ry: 10,
        yAlignment: "middle",
        xAlignment: "middle"
      },
      label: {
        fontSize: 20,
        textAnchor: "middle",
        textVerticalAnchor: "middle"
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
      return this.attr("label/text", text || "");
    }
  }
);

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
      name: "normal"
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
