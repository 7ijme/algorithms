import React from "react";
import { BoxType } from "./Grid";

type Props = {};

export default function Legend({}: Props) {
  const gridTypes: BoxType[] = Object.values(BoxType);

  return (
    <>
      <div className="legend">
        Legend
        {gridTypes.map((type, i) => {
          return (
            <div
              className={`box ${type} legend-item`}
              key={i}>
              <span>{type}</span>
            </div>
          );
        })}
        <div className={`box currentPath legend-item`}>
          <span>current path</span>
        </div>
      </div>
    </>
  );
}
