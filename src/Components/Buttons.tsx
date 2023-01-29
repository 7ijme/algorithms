import React from "react";
import { Algorithm } from "./Container";
import { GridType } from "./Grid";

type Props = {
  diagonalAlowed: boolean;
  setDiagonalAlowed: (diagonalAlowed: boolean) => void;
  checkAfterFindingEnd: boolean;
  setCheckAfterFindingEnd: (checkAfterFindingEnd: boolean) => void;
  algorithm: Algorithm;
  setAlgorithm: (algorithm: Algorithm) => void;
  startAlgorithm: (algorithm: Algorithm) => void;
  reset: () => void;
  createMaze: () => void;
  addWeights: () => void;
};

export default function Buttons({
  startAlgorithm,
  reset,
  diagonalAlowed,
  setDiagonalAlowed,
  algorithm,
  setAlgorithm,
  createMaze,
  addWeights,
  checkAfterFindingEnd,
  setCheckAfterFindingEnd,
}: Props) {
  const algorithms: Algorithm[] = ["dijkstra", "astar"];

  return (
    <>
      <div className="buttons">
        <button onClick={startAlgorithm.bind(null, algorithm)}>Start</button>
        <button onClick={createMaze}>Create maze</button>
        <button onClick={addWeights}>Add weights</button>
        <button onClick={reset}>Clear</button>
        <span className="check-box-span">
          <label htmlFor="diagonal">Diagonal</label>
          <input
            type="checkbox"
            name="Diagonal"
            id="diagonal"
            checked={diagonalAlowed}
            onChange={(e) => setDiagonalAlowed(e.target.checked)}
          />
        </span>
        <span className="check-box-span">
          <label htmlFor="checkAfterFindingEnd">Stop after finding end</label>
          <input
            type="checkbox"
            name="checkAfterFindingEnd"
            id="checkAfterFindingEnd"
            checked={!checkAfterFindingEnd}
            onChange={(e) => setCheckAfterFindingEnd(!e.target.checked)}
          />
        </span>

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
