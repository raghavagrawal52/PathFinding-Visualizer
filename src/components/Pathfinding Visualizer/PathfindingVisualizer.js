import React, { Component } from "react";
import Node from "./Node";
import {
  dijkstra,
  getNodesInShortestPathOrder_d,
} from "../../algorithms/dijkstra";
import { Astar, getNodesInShortestPathOrder_a } from "../../algorithms/a_star";

import "./PathfindingVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  //--------------------ANIMATION DIJKSTRA ----------------------

  animateShortestPath_d(nodesInShortestPathOrder_d) {
    for (let i = 0; i < nodesInShortestPathOrder_d.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder_d[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  animateAlgorithm_d(visitedNodesInOrder, nodesInShortestPathOrder_d) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath_d(nodesInShortestPathOrder_d);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder_d = getNodesInShortestPathOrder_d(
      finishNode
    );
    this.animateAlgorithm_d(visitedNodesInOrder, nodesInShortestPathOrder_d);
  }

  //--------------------ANIMATION ASTAR ----------------------

  animateShortestPath_a(nodesInShortestPathOrder_a) {
    for (let i = 0; i < nodesInShortestPathOrder_a.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder_a[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  animateAlgorithm_a(visitedNodesInOrder, nodesInShortestPathOrder_a) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath_a(nodesInShortestPathOrder_a);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }
  visualizeAstar() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = Astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder_a = getNodesInShortestPathOrder_a(
      finishNode
    );
    this.animateAlgorithm_a(visitedNodesInOrder, nodesInShortestPathOrder_a);
  }

  //--------------------OUTPUT ----------------------

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Dijkstra's Algorithm
        </button>
        <button onClick={() => this.visualizeAstar()}>A* Search</button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

//---------------------HELPER FUNCTIONS--------------------

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 30; row++) {
    const currentRow = [];
    for (let col = 0; col < 70; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    heuristicDistance: null,
    totalDistance: Infinity,
    direction: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
