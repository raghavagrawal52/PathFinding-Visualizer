export function Astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  startNode.distance = 0;
  startNode.direction = "up";
  startNode.totalDistance = 0;
  let unvisitedNodes = getAllNodes(grid);
  while (unvisitedNodes.length) {
    let currentNode = closestNode(unvisitedNodes);
    while (currentNode.isWall && unvisitedNodes.length) {
      currentNode = closestNode(unvisitedNodes);
    }
    if (currentNode.isWall) continue;
    if (currentNode.distance === Infinity) return visitedNodesInOrder;
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);
    if (currentNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(currentNode, grid, startNode, finishNode);
  }
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function updateUnvisitedNeighbors(node, grid, startNode, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

  for (let neighbor of unvisitedNeighbors) {
    if (finishNode) {
      updateNode(node, neighbor, finishNode);
    } else {
      updateNode(node, neighbor);
    }
  }
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function updateNode(currentNode, finishNode, actualFinishNode) {
  let distance = getDistance(currentNode, finishNode);
  if (!finishNode.heuristicDistance) {
    finishNode.heuristicDistance = manhattanDistance(
      finishNode,
      actualFinishNode
    );
  }
  let distanceToCompare = currentNode.distance + distance[0];
  if (distanceToCompare < finishNode.distance) {
    finishNode.distance = distanceToCompare;
    finishNode.totalDistance =
      finishNode.distance + finishNode.heuristicDistance;
    finishNode.previousNode = currentNode.id;
    finishNode.path = distance[1];
    finishNode.direction = distance[2];
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);

  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function manhattanDistance(node_a, node_b) {
  return Math.abs(node_a.row - node_b.row) + Math.abs(node_a.col - node_b.col);
}

function closestNode(unvisitedNodes) {
  let currentClosest, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (
      !currentClosest ||
      currentClosest.totalDistance > unvisitedNodes[i].totalDistance
    ) {
      currentClosest = unvisitedNodes[i];
      index = i;
    } else if (
      currentClosest.totalDistance === unvisitedNodes[i].totalDistance
    ) {
      if (
        currentClosest.heuristicDistance > unvisitedNodes[i].heuristicDistance
      ) {
        currentClosest = unvisitedNodes[i];
        index = i;
      }
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function getDistance(nodeOne, nodeTwo) {
  let x1 = nodeOne.row;
  let y1 = nodeOne.col;
  let x2 = nodeTwo.row;
  let y2 = nodeTwo.col;
  if (x2 < x1 && y1 === y2) {
    if (nodeOne.direction === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    } else if (nodeOne.direction === "up-right") {
      return [1.5, null, "up"];
    } else if (nodeOne.direction === "down-right") {
      return [2.5, null, "up"];
    } else if (nodeOne.direction === "up-left") {
      return [1.5, null, "up"];
    } else if (nodeOne.direction === "down-left") {
      return [2.5, null, "up"];
    }
  } else if (x2 > x1 && y1 === y2) {
    if (nodeOne.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.direction === "down") {
      return [1, ["f"], "down"];
    } else if (nodeOne.direction === "up-right") {
      return [2.5, null, "down"];
    } else if (nodeOne.direction === "down-right") {
      return [1.5, null, "down"];
    } else if (nodeOne.direction === "up-left") {
      return [2.5, null, "down"];
    } else if (nodeOne.direction === "down-left") {
      return [1.5, null, "down"];
    }
  }
  if (y2 < y1 && x1 === x2) {
    if (nodeOne.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.direction === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.direction === "down") {
      return [2, ["r", "f"], "left"];
    } else if (nodeOne.direction === "up-right") {
      return [2.5, null, "left"];
    } else if (nodeOne.direction === "down-right") {
      return [2.5, null, "left"];
    } else if (nodeOne.direction === "up-left") {
      return [1.5, null, "left"];
    } else if (nodeOne.direction === "down-left") {
      return [1.5, null, "left"];
    }
  } else if (y2 > y1 && x1 === x2) {
    if (nodeOne.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.direction === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.direction === "down") {
      return [2, ["l", "f"], "right"];
    } else if (nodeOne.direction === "up-right") {
      return [1.5, null, "right"];
    } else if (nodeOne.direction === "down-right") {
      return [1.5, null, "right"];
    } else if (nodeOne.direction === "up-left") {
      return [2.5, null, "right"];
    } else if (nodeOne.direction === "down-left") {
      return [2.5, null, "right"];
    }
  }
}

export function getNodesInShortestPathOrder_a(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
