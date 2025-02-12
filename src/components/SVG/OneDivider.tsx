const OneDivider = ({ size = 16, color = "#414042" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 161.87 22.47"
      width={size}
      height={size * (22.47 / 161.87)}
      fill={color}
      stroke={color}
    >
      <rect
        x="5.11"
        y="4.3"
        width="151.66"
        height="13.28"
        rx="6.64"
        ry="6.64"
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
export default OneDivider;
