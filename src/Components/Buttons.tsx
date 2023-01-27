import React from "react";
import { Algorithm } from "./Container";
import { GridType } from "./Grid";

type Props = {
  diagonalAlowed: boolean;
  setDiagonalAlowed: (diagonalAlowed: boolean) => void;
  startAlgorithm: (algorithm: Algorithm) => void;
  reset: () => void;
};

export default function Buttons({
  startAlgorithm,
  reset,
  diagonalAlowed,
  setDiagonalAlowed,
}: Props) {
  return (
    <>
      <div className="buttons">
        <button onClick={startAlgorithm.bind(null, "dijkstra")}>Start</button>
        <button onClick={reset}>Clear</button>
        <label htmlFor="Diagonal">Diagonal</label>
        <input
          type="checkbox"
          name="Diagonal"
          id="diagonal"
          checked={diagonalAlowed}
          onChange={(e) => setDiagonalAlowed(e.target.checked)}
        />
      </div>
    </>
  );
}
