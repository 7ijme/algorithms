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
    );
  };

  const createPath = () => {
    const newGrid = [...grid];
    const end = grid.flat().find((box) => box.type === "end");

    if (!end) return;
    let current: Box = end;
    let list = [];
    while (current.cameFrom) {
      current = current.cameFrom;
      if (current.type !== "start") list.push(current);
    }

    list.reverse().forEach((box, i) => {
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
        createPath();
        clearInterval(interval);
      }

      if (grid.flat().every((box) => box.type !== "checking")) {
        clearInterval(interval);
      }
    }, 100);
  };

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
          delete b.cameFrom;
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
        />
        <Grid
          grid={grid}
          setGrid={setGrid}
          rows={rows}
          columns={columns}
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
