import React, { useEffect, useRef } from 'react';

interface ScoreTableProps {
  guesses: {
    guess: string;
    cdcps: number;
    cdwps: number;
    score: number;
  }[];
}

function ScoreTable({ guesses }: ScoreTableProps) {
  const tableRef = useRef<HTMLTableSectionElement | null>(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [guesses]);

  return (
    <table>
      <thead>
        <tr>
          <th>Guess</th>
          <th>Number Guessed</th>
          <th>CDCP</th>
          <th>CDWP</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody ref={tableRef}>
        {guesses.map((guess, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{guess.guess}</td>
            <td>{guess.cdcps}</td>
            <td>{guess.cdwps}</td>
            <td>{guess.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ScoreTable;
