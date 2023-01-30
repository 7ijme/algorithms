import React from "react";
import Grid, { Box, GridType, BoxType } from "./Grid";
import "../Styles/styles.css";
import Legend from "./Legend";
import Buttons from "./Buttons";

type Props = {};

export enum AlgorithmEnum {
  dijkstra = "Dijkstra",
  astar = "A*",
}

export default function Container({}: Props) {
  const [grid, setGrid] = React.useState<GridType>([]);
  const [finished, setFinished] = React.useState<boolean>(false);
  const [diagonalAlowed, setDiagonalAlowed] = React.useState<boolean>(false);
  const [checkAfterFindingEnd, setCheckAfterFindingEnd] =
    React.useState<boolean>(false);
  const [algorithm, setAlgorithm] = React.useState<AlgorithmEnum>(
    AlgorithmEnum.dijkstra
  );
  const [currentPath, setCurrentPath] = React.useState<Box[]>([]);
  const columns = 15;
  const rows = 15;

  const resetGrid = () => {
    setGrid(() => {
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
            type: BoxType.empty,
            cameFrom: null,
            checkedBy: [],
          });
        }
      }

      newGrid[7][2].type = BoxType.start;
      newGrid[7][12].type = BoxType.end;

      return newGrid;
    });
    setFinished(false);
    setCurrentPath([]);
  };

  React.useEffect(resetGrid, []);

  const getNeighborsOfBox = (box: Box) => {
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
      (neighbor) =>
        neighbor.type === BoxType.empty ||
        neighbor.type === BoxType.end ||
        (neighbor.type === BoxType.checking &&
          neighbor.cameFrom !== null &&
          !neighbor.checkedBy.includes(box.id)) ||
        (neighbor.type === BoxType.visited &&
          neighbor.cameFrom !== null &&
          neighbor.cameFrom.type !== BoxType.start &&
          !neighbor.checkedBy.includes(box.id))
    );
  };

  const createPathFromBox = (from: Box): Box[] => {
    let current: Box = from;
    let list = [];
    if (!current?.cameFrom) return [];
    while (current.cameFrom) {
      // if (current.type !== BoxType.start && current.type !== BoxType.end)
      list.push(current);
      current = current.cameFrom;
    }

    return list.reverse();
  };

  const animatePath = (path: Box[]) => {
    setGrid((oldGrid) => {
      const newGrid = [...oldGrid];

      path
        .filter((b) => b.type !== BoxType.start && b.type !== BoxType.end)
        .forEach((box, i) => {
          // setTimeout(() => {
          newGrid[box.y][box.x].type = BoxType.path;
          // }, i * 100);
        });

      return newGrid;
    });
  };

  const isDiagonal = (box1: Box, box2: Box) => {
    return Math.abs(box1.x - box2.x) === 1 && Math.abs(box1.y - box2.y) === 1;
  };

  const getWeightOfPath = (boxes: Box[]): number => {
    let weight = 0;
    boxes.forEach((box) => {
      if (isDiagonal(box, box.cameFrom!)) {
        weight += Math.SQRT2 * 0.5 * (box.weight + box.cameFrom!.weight);
      } else weight += 0.5 * (box.weight + box.cameFrom!.weight);
    });
    return weight;
  };

  const dijkstra = () => {
    const start = grid.flat().find((box) => box.type === BoxType.start);
    const end = grid.flat().find((box) => box.type === BoxType.end);
    if (!start || !end) return;

    let checkingNow = [start]; // this is the list of boxes we are currently checking
    let neighborsOfCheckingNow: Box[] = []; // the list we are manipulating and then setting to checkingNow

    let gotThere = false;

    // neighborsOfCheckingNow = [...checkingNow];
    const interval = setInterval(() => {
      setGrid((oldGrid) => {
        const newGrid = [...oldGrid];

        let i = 0;

        if (checkingNow.length === 0) {
          clearInterval(interval);
          return newGrid;
        }

        const newPath = createPathFromBox(checkingNow[i]);
        setCurrentPath(newPath);

        checkingNow[i].checkCount++;
        //
        // if (checkingNow[i].weight > checkingNow[i].checkCount) {
        //   // modifiedCheckingNow.shift();
        //   checkingNow = modifiedCheckingNow;
        //   modifiedCheckingNow = [];
        //   return;
        // }

        const neighbors = getNeighborsOfBox(checkingNow[i]);
        for (let j = 0; j < neighbors.length; j++) {
          neighbors[j].checkedBy.push(checkingNow[i].id);

          const newWeight = getWeightOfPath(
            createPathFromBox({ ...neighbors[j], cameFrom: checkingNow[i] })
          );
          const oldWeight =
            getWeightOfPath(createPathFromBox(neighbors[j])) || Infinity;

          if (newWeight < oldWeight) {
            neighbors[j].cameFrom = checkingNow[i];
          } else continue;

          if (
            neighbors[j].type === BoxType.visited ||
            neighbors[j].type === BoxType.checking
          )
            continue;

          if (neighbors[j].type === BoxType.end) {
            // alert("got there");
            gotThere = true;
          } else {
            if (!gotThere || checkAfterFindingEnd)
              neighbors[j].type = BoxType.checking;
          }
        }
        if (!gotThere || checkAfterFindingEnd)
          neighborsOfCheckingNow.push(...neighbors);
        if (
          checkingNow[i].type !== BoxType.start &&
          checkingNow[i].type !== BoxType.end
        )
          checkingNow[i].type = BoxType.visited;

        checkingNow.shift();

        // remove dupes
        neighborsOfCheckingNow = neighborsOfCheckingNow.filter((box, index) => {
          return (
            neighborsOfCheckingNow.findIndex(
              (box2) => box2.x === box.x && box2.y === box.y
            ) === index
          );
        });
        if (checkingNow.length < 1 && (!gotThere || checkAfterFindingEnd)) {
          checkingNow = neighborsOfCheckingNow;
          neighborsOfCheckingNow = [];
        }
        // checkingNow = modifiedCheckingNow;
        // modifiedCheckingNow = [];

        if (gotThere && !checkAfterFindingEnd) {
          checkingNow = [...checkingNow, ...neighborsOfCheckingNow];
          neighborsOfCheckingNow = [];
        }

        if (gotThere && checkingNow.length < 1 && !checkAfterFindingEnd) {
          const end = grid.flat().find((box) => box.type === BoxType.end);
          if (!end) return newGrid;
          setCurrentPath(createPathFromBox(end));
          animatePath(createPathFromBox(end));
          clearInterval(interval);
          setFinished(true);
        }

        if (
          grid.flat().every((box) => box.type !== BoxType.checking) &&
          (!gotThere || checkAfterFindingEnd)
        ) {
          setCurrentPath(createPathFromBox(end));
          animatePath(createPathFromBox(end));
          clearInterval(interval);
          setFinished(true);
        } else if (
          grid.flat().every((box) => box.type !== BoxType.checking) &&
          gotThere &&
          checkAfterFindingEnd
        ) {
          setFinished(true);
          clearInterval(interval);
          setCurrentPath(createPathFromBox(end));
        }
        return newGrid;
      });
    }, 0);
  };

  const astar = () => {
    const start = grid.flat().find((box) => box.type === BoxType.start);
    const end = grid.flat().find((box) => box.type === BoxType.end);
    if (!start || !end) return;

    let checkingNow = [start]; // this is the list of boxes we are currently checking
    // let neighborsOfCheckingNow: Box[] = []; // the list we are manipulating and then setting to checkingNow

    let gotThere = false;

    // neighborsOfCheckingNow = [...checkingNow];
    const interval = setInterval(() => {
      setGrid((oldGrid) => {
        const newGrid = [...oldGrid];

        let i = 0;

        if (checkingNow.length === 0) {
          clearInterval(interval);
          return newGrid;
        }

        const newPath = createPathFromBox(checkingNow[i]);
        setCurrentPath(newPath);

        checkingNow[i].checkCount++;
        //
        // if (checkingNow[i].weight > checkingNow[i].checkCount) {
        //   // modifiedCheckingNow.shift();
        //   checkingNow = modifiedCheckingNow;
        //   modifiedCheckingNow = [];
        //   return;
        // }

        const neighbors = getNeighborsOfBox(checkingNow[i]);
        for (let j = 0; j < neighbors.length; j++) {
          neighbors[j].checkedBy.push(checkingNow[i].id);

          const newWeight = getWeightOfPath(
            createPathFromBox({ ...neighbors[j], cameFrom: checkingNow[i] })
          );
          const oldWeight =
            getWeightOfPath(createPathFromBox(neighbors[j])) || Infinity;

          if (newWeight < oldWeight) {
            neighbors[j].cameFrom = checkingNow[i];
          } else continue;

          if (
            neighbors[j].type === BoxType.visited ||
            neighbors[j].type === BoxType.checking
          )
            continue;

          if (neighbors[j].type === BoxType.end) {
            // alert("got there");
            gotThere = true;
          } else {
            if (!gotThere || checkAfterFindingEnd)
              neighbors[j].type = BoxType.checking;
          }
        }

        if (!gotThere || checkAfterFindingEnd) checkingNow.push(...neighbors);

        if (
          checkingNow[i].type !== BoxType.start &&
          checkingNow[i].type !== BoxType.end
        )
          checkingNow[i].type = BoxType.visited;

        checkingNow.shift();

        // remove dupes
        checkingNow = checkingNow.filter((box, index) => {
          return (
            checkingNow.findIndex(
              (box2) => box2.x === box.x && box2.y === box.y
            ) === index
          );
        });

        checkingNow.sort((a, b) => {
          const aDistance = Math.abs(end.x - a.x) + Math.abs(end.y - a.y);
          const bDistance = Math.abs(end.x - b.x) + Math.abs(end.y - b.y);
          return aDistance - bDistance;
        });

        if (gotThere && !checkAfterFindingEnd) {
          const end = grid.flat().find((box) => box.type === BoxType.end);
          if (!end) return newGrid;
          setCurrentPath(createPathFromBox(end));
          animatePath(createPathFromBox(end));
          clearInterval(interval);
          setFinished(true);
        }

        if (
          grid.flat().every((box) => box.type !== BoxType.checking) &&
          (!gotThere || checkAfterFindingEnd)
        ) {
          setCurrentPath(createPathFromBox(end));
          animatePath(createPathFromBox(end));
          clearInterval(interval);
          setFinished(true);
        } else if (
          grid.flat().every((box) => box.type !== BoxType.checking) &&
          gotThere &&
          checkAfterFindingEnd
        ) {
          setFinished(true);
          clearInterval(interval);
          setCurrentPath(createPathFromBox(end));
        }
        return newGrid;
      });
    }, 0);
  };

  const startAlgorithm = (algorithm: AlgorithmEnum) => {
    switch (algorithm) {
      case AlgorithmEnum.dijkstra:
        dijkstra();
        break;
      case AlgorithmEnum.astar:
        astar();
      default:
        break;
    }
  };

  const addWeights = () => {
    setGrid((old) => {
      const newGrid = [...old];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          if (newGrid[i][j].type === BoxType.empty) {
            newGrid[i][j].weight = Math.ceil(Math.random() * 10);
          }
        }
      }
      return newGrid;
    });
  };

  const createMaze = () => {
    setGrid((oldGrid) => {
      const newGrid = [...oldGrid];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          if (Math.random() < 0.3) {
            if (newGrid[i][j].type !== BoxType.empty) continue;
            newGrid[i][j].type = BoxType.wall;
          }
        }
      }
      return newGrid;
    });
  };

  return (
    <>
      <div className="container">
        <Buttons
          startAlgorithm={startAlgorithm}
          reset={resetGrid}
          diagonalAlowed={diagonalAlowed}
          setDiagonalAlowed={setDiagonalAlowed}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          createMaze={createMaze}
          addWeights={addWeights}
          checkAfterFindingEnd={checkAfterFindingEnd}
          setCheckAfterFindingEnd={setCheckAfterFindingEnd}
          finished={finished}
          setFinished={setFinished}
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
