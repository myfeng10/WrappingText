import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

type Polygon = {
  points: string;
  id: string;
  area: number;
};

const Home: NextPage = () => {
  const shapes = [
    { points: "10,10 140,30 90,140 40,110", text: "This is the first polygon." },
    { points: "150,40 250,20 240,120 140,100", text: "This is the second polygon." }
  ];

  return (
    <svg width="300" height="200" style={{ border: '1px solid black' }}>
      {shapes.map((shape, index) => (
        <g key={index}>
          <polygon points={shape.points} fill="none" stroke="black" />
          <text x="20" y={(index + 1) * 15 + 20} fontSize="10" fill="black">
            {shape.text}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default Home;
