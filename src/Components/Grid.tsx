import React from "react";
import { AlgorithmEnum } from "./Container";

type Props = {
  grid: GridType;
  setGrid: React.Dispatch<React.SetStateAction<GridType>>;
  rows: number;
  columns: number;
  currentPath: Box[];
};

export type GridType = Box[][];
export type Box = {
  id: number;
  x: number;
  y: number;
  weight: number;
  checkCount: number;
  type: BoxType;
  cameFrom: Box | null;
  checkedBy: number[];
};

export enum BoxType {
  wall = "wall",
  empty = "empty",
  start = "start",
  end = "end",
  path = "path",
  visited = "visited",
  checking = "checking",
}

export default function Grid({
  grid,
  setGrid,
  columns,
  rows,
  currentPath,
}: Props) {
  const handleBoxClick = (rowIndex: number, boxIndex: number) => {
    const newGrid = [...grid];

    switch (newGrid[rowIndex][boxIndex].type) {
      case BoxType.empty:
        newGrid[rowIndex][boxIndex].type = BoxType.wall;
        break;
      case BoxType.wall:
        newGrid[rowIndex][boxIndex].type = BoxType.empty;
        break;
      default:
        break;
    }

    setGrid(newGrid);
  };

  return (
    <>
      <div className="grid-wrapper">
        <div
          className={`grid ${
            grid.flat().some((box) => box.type === BoxType.path)
              ? "animate"
              : ""
          }`}
          style={{
            gridTemplateColumns: `repeat(${columns},1fr)`,
            gridTemplateRows: `repeat(${rows},1fr)`,
          }}>
          {grid.map((row, rowIndex) => {
            return row.map((box, boxIndex) => {
              return (
                <div
                  style={{ filter: `brightness(${100 - box.weight}%)` }}
                  key={box.id}
                  className={`box ${box.type} ${
                    currentPath
                      .filter(
                        (box) =>
                          box.type !== BoxType.start && box.type !== BoxType.end
                      )
                      .includes(box)
                      ? "currentPath"
                      : ""
                  }`}
                  onMouseDown={(e) => {
                    if (e.buttons == 2) {
                      if (box.type === BoxType.empty) box.weight++;
                      setGrid([...grid]);
                      return;
                    }
                    handleBoxClick(rowIndex, boxIndex);
                  }}
                  onTouchMove={handleBoxClick.bind(null, rowIndex, boxIndex)}
                  onMouseOver={(e) => {
                    if (e.buttons == 1) handleBoxClick(rowIndex, boxIndex);
                    if (e.buttons == 2) {
                      if (box.type === BoxType.empty) box.weight++;
                      setGrid([...grid]);
                      return;
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}>
                  {box.type !== BoxType.start && box.type !== BoxType.end
                    ? box.weight
                    : ""}
                </div>
              );
            });
          })}
        </div>
      </div>
    </>
  );
}
