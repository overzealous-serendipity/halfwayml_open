import React from "react";

const TwoDivider = ({ size = 16, color = "#414042" }) => {
  // Calculate height based on the original SVG's aspect ratio
  const height = size * (41.97 / 156.66);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 156.66 41.97"
      width={size}
      height={height}
      fill="none"
    >
      <path
        d="M27.65,15.78h101.36c3.67,0,6.64-2.97,6.64-6.64s-2.97-6.64-6.64-6.64H27.65c-3.67,0-6.64,2.97-6.64,6.64s2.97,6.64,6.64,6.64Z"
        style={{
          fill: color,
          opacity: 0.5,
          stroke: color,
          strokeMiterlimit: 10,
          strokeWidth: 5,
        }}
      />
      <path
        d="M147.52,26.19H9.14c-3.67,0-6.64,2.97-6.64,6.64s2.97,6.64,6.64,6.64H147.52c3.67,0,6.64-2.97,6.64-6.64s-2.97-6.64-6.64-6.64Z"
        style={{
          fill: color,
          opacity: 0.5,
          stroke: color,
          strokeMiterlimit: 10,
          strokeWidth: 5,
        }}
      />
    </svg>
  );
};

export default TwoDivider;
