import React, { useEffect, useRef, useState } from "react";
import { AlgorithmEnum } from "./Container";

type Props = {
  diagonalAlowed: boolean;
  setDiagonalAlowed: (diagonalAlowed: boolean) => void;
  checkAfterFindingEnd: boolean;
  setCheckAfterFindingEnd: (checkAfterFindingEnd: boolean) => void;
  finished: boolean;
  algorithm: AlgorithmEnum;
  setAlgorithm: (algorithm: AlgorithmEnum) => void;
  startAlgorithm: (algorithm: AlgorithmEnum) => void;
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
  finished,
}: Props) {
  const algorithms: AlgorithmEnum[] = Object.values(AlgorithmEnum);
  const [isIntervalOn, setIsIntervalOn] = useState(false);

  useEffect(() => {
    if (isIntervalOn) {
      resetButton.current?.click();
      mazeButton.current?.click();
      weightsButton.current?.click();

      setTimeout(() => {
        startButton.current?.click();
      }, 500);
    }
  }, [isIntervalOn]);

  const resetButton = useRef<HTMLButtonElement>(null);
  const mazeButton = useRef<HTMLButtonElement>(null);
  const weightsButton = useRef<HTMLButtonElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log("finished", finished);
    if (finished && isIntervalOn) {
      const startAfter = 3000;
      setTimeout(() => {
        if (isIntervalOn) resetButton.current?.click();
      }, startAfter);

      setTimeout(() => {
        if (isIntervalOn) mazeButton.current?.click();
      }, startAfter + 500);

      setTimeout(() => {
        if (isIntervalOn) weightsButton.current?.click();
      }, startAfter + 1000);

      setTimeout(() => {
        if (isIntervalOn) startButton.current?.click();
      }, startAfter + 1500);
    }
  }, [finished]);

  return (
    <>
      <div className="buttons">
        <button
          onClick={startAlgorithm.bind(null, algorithm)}
          ref={startButton}>
          Start
        </button>
        <button
          onClick={createMaze}
          ref={mazeButton}>
          Create maze
        </button>
        <button
          onClick={addWeights}
          ref={weightsButton}>
          Add weights
        </button>
        <button
          onClick={reset}
          ref={resetButton}>
          Clear
        </button>
        <span className="check-box-span">
          <label htmlFor="repeat">Repeat</label>
          <input
            type="checkbox"
            name="repeat"
            id="repeat"
            checked={isIntervalOn}
            onChange={(e) => setIsIntervalOn(e.target.checked)}
          />
        </span>
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
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmEnum)}
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
