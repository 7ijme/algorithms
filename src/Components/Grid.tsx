import React from "react";
import { Algorithm } from "./Container";

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

export type BoxType =
  | "wall"
  | "empty"
  | "start"
  | "end"
  | "path"
  | "visited"
  | "checking";

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
      case "empty":
        newGrid[rowIndex][boxIndex].type = "wall";
        break;
      case "wall":
        newGrid[rowIndex][boxIndex].type = "empty";
        break;
      default:
        break;
    }
    console.log(newGrid);
    setGrid(newGrid);
  };

  return (
    <>
      <div className="grid-wrapper">
        <div
          className={`grid ${
            grid.flat().some((box) => box.type === "path") ? "animate" : ""
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
                        (box) => box.type !== "start" && box.type !== "end"
                      )
                      .includes(box)
                      ? "currentPath"
                      : ""
                  }`}
                  onMouseDown={(e) => {
                    if (e.buttons == 2) {
                      if (box.type === "empty") box.weight++;
                      setGrid([...grid]);
                      return;
                    }
                    handleBoxClick(rowIndex, boxIndex);
                  }}
                  onTouchMove={handleBoxClick.bind(null, rowIndex, boxIndex)}
                  onMouseOver={(e) => {
                    if (e.buttons == 1) handleBoxClick(rowIndex, boxIndex);
                    if (e.buttons == 2) {
                      if (box.type === "empty") box.weight++;
                      setGrid([...grid]);
                      return;
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}>
                  {box.type !== "start" && box.type !== "end" ? box.weight : ""}
                </div>
              );
            });
          })}
        </div>
      </div>
    </>
  );
}
