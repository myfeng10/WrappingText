import React, { useEffect, useState } from 'react';

const PartitionComponent2: React.FC = () => {
  const polygon = [
    [379, 241], [338, 217], [300, 214], [234, 225], [190, 247],
    [171, 266], [155, 305], [152, 343], [162, 372], [196, 404],
    [215, 411], [238, 408], [255, 422], [268, 418], [283, 424],
    [317, 417], [325, 409], [327, 388], [370, 407], [376, 397],
    [405, 381], [415, 354], [411, 300]
  ];
  const [centroid, setCentroid] = useState({ x: 0, y: 0 });
  const [extendedPaths, setExtendedPaths] = useState<string[]>([]);

  useEffect(() => {
    const { x, y } = calculateCentroid(polygon);
    setCentroid({ x, y });
    setExtendedPaths(generateExtendedPaths(x, y, polygon, 1.5)); // Extend paths by 1.5 times
  }, []);

  function calculateCentroid(points: number[][]) {
    let signedArea = 0;
    let Cx = 0;
    let Cy = 0;
    let x0, y0, x1, y1, a;

    for (let i = 0; i < points.length; i++) {
      x0 = points[i][0];
      y0 = points[i][1];
      x1 = points[(i + 1) % points.length][0];
      y1 = points[(i + 1) % points.length][1];

      a = x0 * y1 - x1 * y0;
      signedArea += a;
      Cx += (x0 + x1) * a;
      Cy += (y0 + y1) * a;
    }

    signedArea *= 0.5;
    Cx /= (6 * signedArea);
    Cy /= (6 * signedArea);

    return { x: Cx, y: Cy };
  }

  function generateExtendedPaths(centroidX: number, centroidY: number, vertices: number[][], multiplier: number) {
    let newPaths = [];
    vertices.forEach((vertex, i) => {
      const directionX = vertex[0] - centroidX;
      const directionY = vertex[1] - centroidY;
      const extendedX = centroidX + directionX * multiplier;
      const extendedY = centroidY + directionY * multiplier;
      newPaths.push(`M ${centroidX} ${centroidY} L ${extendedX} ${extendedY}`);
    });
    return newPaths;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <svg width="800" height="600">
        {extendedPaths.map((path, index) => (
          <path key={index} d={path} stroke="red" fill="none" />
        ))}
        <circle cx={centroid.x} cy={centroid.y} r={3} fill="blue" /> {/* Mark the centroid */}
      </svg>
    </div>
  );
};

export default PartitionComponent2;
