import React, { Component } from "react";
import Node from "./Nodes/Node";

import "./PathfindingVisualizer.css";

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push([]);
      }
      grid.push(currentRow);
    }
    this.setState({ grid });
  }

  render() {
    const { grid } = this.state;

    return (
      <div className="grid">
        {grid.map((row) => {
          return (
            <div>
              {" "}
              {row.map((grid) => (
                <Node></Node>
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}
