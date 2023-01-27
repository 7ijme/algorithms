import React from "react";
import Grid, { Box, GridType } from "./Grid";
import "../Styles/styles.css";
import Legend from "./Legend";
import Buttons from "./Buttons";

type Props = {};
export type Algorithm = "dijkstra" | "astar";

export default function Container({}: Props) {
  const [grid, setGrid] = React.useState<GridType>([]);
  const [diagonalAlowed, setDiagonalAlowed] = React.useState<boolean>(false);
  const [algorithm, setAlgorithm] = React.useState<Algorithm>("dijkstra");
  const [currentPath, setCurrentPath] = React.useState<Box[]>([]);
  const columns = 15;
  const rows = 15;

  React.useEffect(() => {
    const newGrid: GridType = [];
    for (let i = 0; i < rows; i++) {
      newGrid.push([]);
      for (let j = 0; j < columns; j++) {
        newGrid[i].push({
          id: i * columns + j,
          x: j,
          y: i,
          weight: 1,
          checkCount: 0,
          type: "empty",
          cameFrom: null,
        });
      }
    }

    newGrid[7][2].type = "start";
    newGrid[7][12].type = "end";

    setGrid(newGrid);
  }, []);

  const getNeighbors = (box: Box) => {
    const neighbors: Box[] = [];
    const { x, y } = box;
    if (diagonalAlowed) {
      if (x > 0 && y > 0) neighbors.push(grid[y - 1][x - 1]);
      if (x < columns - 1 && y > 0) neighbors.push(grid[y - 1][x + 1]);
      if (x > 0 && y < rows - 1) neighbors.push(grid[y + 1][x - 1]);
      if (x < columns - 1 && y < rows - 1) neighbors.push(grid[y + 1][x + 1]);
    }

    if (x > 0) neighbors.push(grid[y][x - 1]);
    if (x < columns - 1) neighbors.push(grid[y][x + 1]);
    if (y > 0) neighbors.push(grid[y - 1][x]);
    if (y < rows - 1) neighbors.push(grid[y + 1][x]);

    return neighbors.filter(
      (neighbor) => neighbor.type === "empty" || neighbor.type === "end" // we only want to check the neighbors that are empty or the end
      // (neighbor.type === "checking" &&
      //   neighbor.cameFrom !== null &&
      //   neighbor.cameFrom.id !== box.id) ||
      // (neighbor.type === "visited" &&
      //   neighbor.cameFrom !== null &&
      //   neighbor.cameFrom.id !== box.id &&
      //   // check if is getting closer to start
      //   neighbor.checkCount > box.checkCount + 2)
    );
  };

  const createPath = (from: Box): Box[] => {
    let current: Box = from;
    let list = [];
    while (current.cameFrom) {
      if (current.type !== "start" && current.type !== "end")
        list.push(current);
      current = current.cameFrom;
    }

    return list.reverse();
  };

  const animatePath = (path: Box[]) => {
    const newGrid = [...grid];

    path.forEach((box, i) => {
      setTimeout(() => {
        newGrid[box.y][box.x].type = "path";
        setGrid([...newGrid]);
      }, i * 100);
    });
  };

  const dijkstra = () => {
    const start = grid.flat().find((box) => box.type === "start");
    const end = grid.flat().find((box) => box.type === "end");
    if (!start || !end) return;

    let checkingNow = [start]; // this is the list of boxes we are currently checking/
    let editing: Box[] = []; // the list we are manipulating and then setting to checkingNow

    let gotThere = false;

    const interval = setInterval(() => {
      const newGrid = [...grid];
      editing = [...checkingNow];
      for (let i = 0; i < checkingNow.length; i++) {
        checkingNow[i].checkCount++;
        if (checkingNow[i].weight > checkingNow[i].checkCount) {
          continue;
        }

        const neighbors = getNeighbors(checkingNow[i]);
        for (let j = 0; j < neighbors.length; j++) {
          if (!neighbors[j].cameFrom) neighbors[j].cameFrom = checkingNow[i];
          if (neighbors[j].type === "end") {
            // alert("got there");
            gotThere = true;
          } else {
            neighbors[j].type = "checking";
          }
        }
        editing.push(...neighbors);
        if (checkingNow[i].type !== "start") checkingNow[i].type = "visited";
      }

      checkingNow = editing;
      editing = [];
      setGrid(newGrid);

      if (gotThere) {
        animatePath(createPath(end));
        clearInterval(interval);
      }

      if (grid.flat().every((box) => box.type !== "checking")) {
        clearInterval(interval);
      }
    }, 100);
  };

  const getWeight = (boxes: Box[]): number => {
    return boxes.reduce((acc, box) => acc + box.weight, 0);
  };

  // const dijkstra = () => {
  //   const start = grid.flat().find((box) => box.type === "start");
  //   const end = grid.flat().find((box) => box.type === "end");
  //   if (!start || !end) return;

  //   let checkingNow = [start]; // this is the list of boxes we are currently checking/
  //   let modifiedCheckingNow: Box[] = []; // the list we are manipulating and then setting to checkingNow

  //   let gotThere = false;

  //   const interval = setInterval(() => {
  //     const newGrid = [...grid];
  //     modifiedCheckingNow = [...checkingNow];

  //     let i = 0;
  //     const newPath = createPath(checkingNow[i]);
  //     setCurrentPath(newPath);

  //     checkingNow[i].checkCount++;
  //     // console.log(checkingNow[i].checkCount);
  //     // if (checkingNow[i].weight > checkingNow[i].checkCount) {
  //     //   // modifiedCheckingNow.shift();
  //     //   checkingNow = modifiedCheckingNow;
  //     //   modifiedCheckingNow = [];
  //     //   return;
  //     // }

  //     const neighbors = getNeighbors(checkingNow[i]);
  //     for (let j = 0; j < neighbors.length; j++) {
  //       const weight = getWeight(
  //         createPath({ ...neighbors[j], cameFrom: checkingNow[i] })
  //       );

  //       if (neighbors[j].type === "visited") {
  //         if (weight < getWeight(createPath(neighbors[j]))) {
  //           neighbors[j].cameFrom = checkingNow[i];
  //           console.log("replacing", neighbors[j].cameFrom, checkingNow[i]);
  //         }
  //         continue;
  //       }

  //       // if (8 > neighbors[j].y && neighbors[j].y > 5)
  //       //   console.log(getWeight(newPath), weight, neighbors[j]);
  //       if (getWeight(newPath) > weight) continue;

  //       if (
  //         !neighbors[j].cameFrom ||
  //         getWeight(newPath) < getWeight(createPath(neighbors[j]))
  //       )
  //         neighbors[j].cameFrom = checkingNow[i];
  //       if (neighbors[j].type === "end") {
  //         // alert("got there");
  //         gotThere = true;
  //       } else {
  //         neighbors[j].type = "checking";
  //       }
  //     }
  //     modifiedCheckingNow.push(...neighbors);
  //     if (checkingNow[i].type !== "start") checkingNow[i].type = "visited";

  //     modifiedCheckingNow.shift();
  //     checkingNow = modifiedCheckingNow;
  //     modifiedCheckingNow = [];
  //     setGrid(newGrid);

  //     if (gotThere) {
  //       const end = grid.flat().find((box) => box.type === "end");
  //       if (!end) return;
  //       animatePath(createPath(end));
  //       clearInterval(interval);
  //     }

  //     if (grid.flat().every((box) => box.type !== "checking")) {
  //       clearInterval(interval);
  //     }
  //   }, 1);
  // };

  const startAlgorithm = (algorithm: Algorithm) => {
    console.log(algorithm);
    if (algorithm === "dijkstra") {
      dijkstra();
    }
  };

  const reset = () => {
    setGrid(
      grid.map((l) => {
        return l.map((b) => {
          b.cameFrom = null;
          b.checkCount = 0;
          b.weight = 1;
          if (
            b.type === "path" ||
            b.type === "visited" ||
            b.type === "wall" ||
            b.type === "checking"
          ) {
            return { ...b, type: "empty" };
          }
          return b;
        });
      })
    );
  };

  const createMaze = () => {
    const newGrid = [...grid];
    // for (let i = 0; i < 3; i++) {

    //   // create a maze that always has a path from start to end using recursive backtracking
    //   // https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker

    //   const stack: Box[] = [];
    //   const visited: Box[] = [];
    //   let current = newGrid[0][0];
    //   visited.push(current);

    //   while (visited.length < rows * columns) {
    //     const neighbors = getNeighbors(current);
    //     const unvisitedNeighbors = neighbors.filter(
    //       (neighbor) =>
    //         !visited.includes(neighbor) &&
    //         neighbor.type !== "start" &&
    //         neighbor.type !== "end"
    //     );
    //     if (unvisitedNeighbors.length > 0) {
    //       const randomNeighbor =
    //         unvisitedNeighbors[
    //           Math.floor(Math.random() * unvisitedNeighbors.length)
    //         ];
    //       stack.push(current);
    //       current.type = "empty";
    //       randomNeighbor.type = "wall";
    //       current = randomNeighbor;
    //       visited.push(current);
    //     } else {
    //       current = stack.pop() as Box;
    //     }
    //     setGrid(newGrid);
    //   }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (Math.random() < 0.3) {
          if (newGrid[i][j].type !== "empty") continue;
          newGrid[i][j].type = "wall";
        }
      }
    }
    setGrid(newGrid);
  };

  return (
    <>
      <div className="container">
        <Buttons
          startAlgorithm={startAlgorithm}
          reset={reset}
          diagonalAlowed={diagonalAlowed}
          setDiagonalAlowed={setDiagonalAlowed}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          createMaze={createMaze}
        />
        <Grid
          grid={grid}
          setGrid={setGrid}
          rows={rows}
          columns={columns}
          currentPath={currentPath}
        />
        <Legend />
        <footer>
          <code>
            Created with Vite + React + TypeScript <br />
            <a
              href="https://github.com/7ijme/algorithms-v2"
              target="_blank">
              Source
            </a>
            {" • "}
            By Tijme
          </code>
        </footer>
      </div>
    </>
  );
}
