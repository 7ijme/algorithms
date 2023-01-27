import React from "react";
import { BoxType } from "./Grid";

type Props = {};

export default function Legend({}: Props) {
  const gridTypes: BoxType[] = [
    "wall",
    "empty",
    "start",
    "end",
    "checking",
    "visited",
    "path",
  ];

  return (
    <>
      <div className="legend">
        Legend
        {gridTypes.map((type) => {
          return (
            <div className={`box ${type} legend-item`}>
              <span>{type}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
