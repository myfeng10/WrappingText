import React from 'react';

const TextComponent: React.FC = () => {
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <svg width="800" height="600">
      <image href={imageUrl} x="-60" y="90" height="400px" width="600px"/>
      <path id={pathId} d={pathData} fill="none" stroke="none" />
      <text style={{ letterSpacing: '4px' }}>
        <textPath href={`#${pathId}`} startOffset="10%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
    </div>
  );
};

export default TextComponent;
