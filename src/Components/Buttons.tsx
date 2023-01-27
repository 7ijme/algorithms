import React from "react";
import { Algorithm } from "./Container";
import { GridType } from "./Grid";

type Props = {
  diagonalAlowed: boolean;
  setDiagonalAlowed: (diagonalAlowed: boolean) => void;
  algorithm: Algorithm;
  setAlgorithm: (algorithm: Algorithm) => void;
  startAlgorithm: (algorithm: Algorithm) => void;
  reset: () => void;
};

export default function Buttons({
  startAlgorithm,
  reset,
  diagonalAlowed,
  setDiagonalAlowed,
  algorithm,
  setAlgorithm,
}: Props) {
  const algorithms: Algorithm[] = ["dijkstra", "astar"];

  return (
    <>
      <div className="buttons">
        <button onClick={startAlgorithm.bind(null, algorithm)}>Start</button>
        <button onClick={reset}>Clear</button>
        <label htmlFor="Diagonal">Diagonal</label>
        <input
          type="checkbox"
          name="Diagonal"
          id="diagonal"
          checked={diagonalAlowed}
          onChange={(e) => setDiagonalAlowed(e.target.checked)}
        />

        <label htmlFor="algorithm">Algorithm</label>
        <select
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          id="algorithm"
          value={algorithm}>
          {algorithms.map((algorithm, i) => {
            return <option key={i}>{algorithm}</option>;
          })}
        </select>
      </div>
    </>
  );
}
