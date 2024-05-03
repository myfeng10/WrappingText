import React from 'react';
import { useEffect, useState } from 'react';
interface PathData {
  path: string;
  angle: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const ConnectionComponent: React.FC = () => {
  const polygon = [
    [379, 241], [338, 217], [300, 214], [234, 225], [190, 247],
    [171, 266], [155, 305], [152, 343], [162, 372], [196, 404],
    [215, 411], [238, 408], [255, 422], [268, 418], [283, 424],
    [317, 417], [325, 409], [327, 388], [370, 407], [376, 397],
    [405, 381], [415, 354], [411, 300]
  ];
  const [centroid, setCentroid] = useState({ x: 0, y: 0 });
  const [paths, setPaths] = useState<PathData[]>([]);
  const [connectionPaths, setConnectionPaths] = useState<string[]>([]);

  useEffect(() => {
    const { x, y } = calculateCentroid(polygon);
    setCentroid({ x, y });
    const generatedPaths = generatePaths(x, y, 8);
    setPaths(generatedPaths);
    setConnectionPaths(connectPaths(generatedPaths));
  }, []);

  function calculateCentroid(points: number[][]): { x: number; y: number } {
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

  function generatePaths(x: number, y: number, numPaths: number): PathData[] {
    let newPaths: PathData[] = [];
    const length = 300;  // Set a fixed length for each path

    for (let i = 0; i < numPaths; i++) {
      const angle =  Math.random() * (360);  // Angle between 10 and 120 degrees
      const radians = angle * Math.PI / 180;  // Convert angle to radians
      const endX = x + length * Math.cos(radians);
      const endY = y + length * Math.sin(radians);
      newPaths.push({
        path: `M ${x} ${y} L ${endX} ${endY}`,
        angle,
        startX: x,
        startY: y,
        endX,
        endY
      });
    }

    return newPaths.sort((a, b) => a.angle - b.angle); // Sort by angle
  }

  function connectPaths(paths: PathData[]): ConnectionPath[] {
    let connections: ConnectionPath[] = [];
    const linesPerConnection = 5;

    for (let i = 0; i < paths.length; i++) {
      const nextIndex = (i + 1) % paths.length;
      const startPath = paths[i];
      const endPath = paths[nextIndex];

      for (let j = 0; j < linesPerConnection; j++) {
        const t = (j + 1) / (linesPerConnection + 1);
        const interpolatedStartX = startPath.endX + t * (endPath.startX - startPath.endX);
        const interpolatedStartY = startPath.endY + t * (endPath.startY - startPath.endY);
        const interpolatedEndX = startPath.endX + t * (endPath.endX - startPath.endX);
        const interpolatedEndY = startPath.endY + t * (endPath.endY - startPath.endY);

        connections.push({
          path: `M ${interpolatedStartX} ${interpolatedStartY} L ${interpolatedEndX} ${interpolatedEndY}`,
          text: `Connection ${i}-${j}`
        });
      }
    }

    return connections;
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <svg width="800" height="600">
        {paths.map((path, index) => (
          <path key={`path-${index}`} d={path.path} stroke="red" fill="none" />
        ))}
        {connectionPaths.map((path, index) => (
          <path key={`connection-${index}`} d={path} stroke="blue" fill="none" />
        ))}
        <polygon points={polygon.map(p => `${p[0]},${p[1]}`).join(' ')} fill="none" stroke="black" />
      </svg>
    </div>
  );
};

export default ConnectionComponent;
