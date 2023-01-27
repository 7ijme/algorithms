import React from "react";
import { Algorithm } from "./Container";

type Props = {
  grid: GridType;
  setGrid: React.Dispatch<React.SetStateAction<GridType>>;
  rows: number;
  columns: number;
};

export type GridType = Box[][];
export type Box = {
  id: number;
  x: number;
  y: number;
  type: BoxType;
  cameFrom?: Box;
};

export type BoxType =
  | "wall"
  | "empty"
  | "start"
  | "end"
  | "path"
  | "visited"
  | "checking";

export default function Grid({ grid, setGrid, columns, rows }: Props) {
  return (
    <>
      <div className="grid-wrapper">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns},1fr)`,
            gridTemplateRows: `repeat(${rows},1fr)`,
          }}>
          {grid.map((row, rowIndex) => {
            return row.map((box, boxIndex) => {
              return (
                <div
                  key={box.id}
                  className={`box ${box.type}`}
                  onClick={() => {
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
                  }}></div>
              );
            });
          })}
        </div>
      </div>
    </>
  );
}
