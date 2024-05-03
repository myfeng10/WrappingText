import { Micro_5 } from 'next/font/google';
import React from 'react';
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
  
import { useEffect, useState } from 'react';
const FinalComponent: React.FC = () => {
  const pathId = "polygonPath";
  const imageUrl = "/images/1.png"; 
  const polygon = [
    [379,241], [338, 217], [300, 214], [234, 225], [190, 247], [171, 266],
    [155, 305], [152, 343], [162, 372], [196, 404], [215, 411], [238, 408],
    [255, 422], [268, 418], [283, 424], [317, 417], [325, 409], [327, 388],
    [370, 407], [376, 397], [405, 381], [415, 354], [411, 300]
  ];

  const text = "Hi, My name is Michelle Yilin Feng;".repeat(8);
  const pathData = polygon.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.join(' ')}`).join(' ') + ' Z';
  const [centroid, setCentroid] = useState({ x: 0, y: 0 });
  const [paths, setPaths] = useState<PathData[]>([]);
  const [connectionPaths, setConnectionPaths] = useState<ConnectionPath[]>([]);

  useEffect(() => {
    const { x, y } = calculateCentroid(polygon);
    setCentroid({ x, y });
    const generatedPaths = generatePaths(x, y, 6);
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
      const angle = 60*(i+1);
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

  function connectPaths(paths: PathData[]): ConnectionPath[] {
    let connections: ConnectionPath[] = [];
    const lineSpacing= 20;
    for (let i = 0; i < paths.length; i++) {
        const nextIndex = (i + 1) % paths.length;
        const startPath = paths[i];
        const endPath = paths[nextIndex];
    
        // Calculate the distance between the end of one path and the start of the next
        const distance = Math.sqrt(
          Math.pow(endPath.startX - startPath.endX, 2) +
          Math.pow(endPath.startY - startPath.endY, 2)
        );
    
        // Determine the number of lines based on the distance and desired line spacing
        const linesPerConnection = Math.floor(distance / lineSpacing);
    
      for (let j = 0; j < linesPerConnection; j++) {
        const t = (j + 1) / (linesPerConnection + 1);
        const interpolatedStartX = startPath.endX + t * (endPath.startX - startPath.endX);
        const interpolatedStartY = startPath.endY + t * (endPath.startY - startPath.endY);
        const interpolatedEndX = startPath.endX + t * (endPath.endX - startPath.endX);
        const interpolatedEndY = startPath.endY + t * (endPath.endY - startPath.endY);

        connections.push({
          path: `M ${interpolatedStartX} ${interpolatedStartY} L ${interpolatedEndX} ${interpolatedEndY}`,
          text: text
        });
      }
    }

    return connections;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
     <h1 style={{
        position: 'absolute',
        zIndex: 1,
        color: 'black',
        background: "white",
        top: '15%',  // Move the top of the element to the center
        left: '43%', // Move the left of the element to the center
        transform: 'translate(-50%, -50%)' // Offset the element by its own dimensions
    }}>
        Hi I am Michelle
    </h1>
    <svg width="800" height="600">
    <defs>
          <mask id="polygonMask">
            <rect x="0" y="0" width="100%" height="100%" fill="white"/>
            <polygon points={polygon.map(p => `${p[0]},${p[1]}`).join(' ')} fill="black"/>
          </mask>
        </defs>
        
      <image href={imageUrl} x="-60" y="90" height="400px" width="600px"/>
      <path id={pathId} d={pathData} fill="none" stroke="none" />
      <text style={{ letterSpacing: '4px' }}>
        <textPath href={`#${pathId}`} startOffset="10%" textAnchor="middle">
          {text}
        </textPath>
      </text>
      {paths.map((path, index) => (
        <path key={`path-${index}`} d={path.path} stroke="none" fill="none" />
      ))}
      <g mask="url(#polygonMask)">
          {connectionPaths.map((conn, index) => (
            <React.Fragment key={`connection-${index}`}>
              <path id={`connection-path-${index}`} d={conn.path} stroke="none" fill="none" />
              <text fill="black">
                <textPath href={`#connection-path-${index}`} startOffset="0%">
                  {conn.text}
                </textPath>
              </text>
            </React.Fragment>
          ))}
        </g>
      {/* <polygon points={polygon.map(p => `${p[0]},${p[1]}`).join(' ')} fill="none" stroke="none" /> */}
    </svg>
    </div>
    
  );
};

export default FinalComponent;
