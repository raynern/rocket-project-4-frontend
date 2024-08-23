export default function Guidance({
  width,
  height,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  text,
  bx,
  by,
  col,
}: {
  width: number;
  height: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
  text: string;
  bx: number;
  by: number;
  col: string;
}) {
  return (
    <g>
      <rect
        width={(width - marginLeft - marginRight) / 2}
        height={(height - marginBottom - marginTop) / 2}
        y={marginTop + (by * (height - marginBottom - marginTop)) / 2}
        x={marginLeft + (bx * (width - marginLeft - marginRight)) / 2}
        fill={col}
      />
      <text
        x={
          marginLeft +
          (width - marginLeft - marginRight) / 4 +
          (bx * (width - marginLeft - marginRight)) / 2
        }
        y={
          marginTop +
          (height - marginBottom - marginTop) / 4 +
          (by * (height - marginBottom - marginTop)) / 2
        }
        font-size="0.75rem"
        font-style="italic"
        fill="grey"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {text}
      </text>
    </g>
  );
}
