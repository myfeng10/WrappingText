import React, { useEffect, useState } from 'react';

interface PathData {
  path: string;
  angle: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface ConnectionPath {
  path: string;
  text: string;
}
interface Point {
    x: number;
    y: number;
  }
  

const ConnectionTextComponent: React.FC = () => {
  const polygon = [
    [379, 241], [338, 217], [300, 214], [234, 225], [190, 247],
    [171, 266], [155, 305], [152, 343], [162, 372], [196, 404],
    [215, 411], [238, 408], [255, 422], [268, 418], [283, 424],
    [317, 417], [325, 409], [327, 388], [370, 407], [376, 397],
    [405, 381], [415, 354], [411, 300]
  ];
  const [centroid, setCentroid] = useState({ x: 0, y: 0 });
  const [paths, setPaths] = useState<PathData[]>([]);
  const [connectionPaths, setConnectionPaths] = useState<ConnectionPath[]>([]);

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
    const length = 300;

    for (let i = 0; i < numPaths; i++) {
      const angle = Math.random() * 360;
      const radians = angle * Math.PI / 180;
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

    return newPaths.sort((a, b) => a.angle - b.angle);
  }
  function connectPaths(paths: PathData[]): string[] {
    let connections: string[] = [];
    const linesPerConnection = 10; // Number of lines to draw between each pair of paths
  
    for (let i = 0; i < paths.length; i++) {
      const nextIndex = (i + 1) % paths.length;
      const startPath = paths[i];
      const endPath = paths[nextIndex];
  
      for (let j = 0; j < linesPerConnection; j++) {
        const t = (j + 1) / (linesPerConnection + 1); // Normalized distance between each line
  
        // Find midpoints for interpolated paths
        const midX = startPath.endX + t * (endPath.startX - startPath.endX);
        const midY = startPath.endY + t * (endPath.startY - startPath.endY);
  
        // Calculate direction vectors
        const dirX = endPath.startX - startPath.endX;
        const dirY = endPath.startY - startPath.endY;
  
        // Calculate unit direction vector for perpendicular line
        const mag = Math.sqrt(dirX * dirX + dirY * dirY);
        const perpUnitX = -dirY / mag;
        const perpUnitY = dirX / mag;
  
        // Extend line in both directions along the perpendicular
        const dist = 10; // max search distance for intersections
        const extendedStartX = midX + perpUnitX * dist;
        const extendedStartY = midY + perpUnitY * dist;
        const extendedEndX = midX - perpUnitX * dist;
        const extendedEndY = midY - perpUnitY * dist;
  
        // Now find intersection points between the extended line and the start and end path lines
        let intersectionStart = findIntersection(
          startPath.startX, startPath.startY, startPath.endX, startPath.endY,
          midX, midY, extendedStartX, extendedStartY
        );
        let intersectionEnd = findIntersection(
          endPath.startX, endPath.startY, endPath.endX, endPath.endY,
          midX, midY, extendedEndX, extendedEndY
        );
  
        if (intersectionStart && intersectionEnd) {
          connections.push(`M ${intersectionStart.x} ${intersectionStart.y} L ${intersectionEnd.x} ${intersectionEnd.y}`);
        }
      }
    }
  
    return connections;
  }
  function findIntersection(
    x1: number, y1: number, 
    x2: number, y2: number, 
    x3: number, y3: number, 
    x4: number, y4: number
  ): Point | null {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return null; // Lines are parallel
  
    const intersectX = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
    const intersectY = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;
  
    return { x: intersectX, y: intersectY };
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width="800" height="600">
        {paths.map((path, index) => (
          <path key={`path-${index}`} d={path.path} stroke="red" fill="none" />
        ))}
        {connectionPaths.map((conn, index) => (
          <React.Fragment key={`connection-${index}`}>
            <path id={`connection-path-${index}`} d={conn.path} stroke="blue" fill="none" />
            <text fill="green">
              <textPath href={`#connection-path-${index}`} startOffset="50%">
                {conn.text}
              </textPath>
            </text>
          </React.Fragment>
        ))}
        <polygon points={polygon.map(p => `${p[0]},${p[1]}`).join(' ')} fill="none" stroke="black" />
      </svg>
    </div>
  );
};

export default ConnectionTextComponent;
