type TrendSparklineProps = {
  className?: string;
  height?: number;
  series: number[];
  width?: number;
};

export function TrendSparkline({
  className = "home-trends__spark",
  height = 36,
  series,
  width = 132,
}: TrendSparklineProps) {
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const span = Math.max(max - min, 1);
  const points = series
    .map((value, index) => {
      const x = (index / Math.max(series.length - 1, 1)) * width;
      const y = height - ((value - min) / span) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg aria-hidden="true" className={className} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        points={points}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
