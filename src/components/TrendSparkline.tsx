type TrendSparklineProps = {
  className?: string;
  height?: number;
  series: readonly (number | null)[];
  width?: number;
};

export function TrendSparkline({
  className = "home-trends__spark",
  height = 36,
  series,
  width = 132,
}: TrendSparklineProps) {
  const values = series.filter((value) => value !== null);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const path = series
    .flatMap((value, index) => {
      if (value === null) return [];
      const x = (index / Math.max(series.length - 1, 1)) * width;
      const y = height - ((value - min) / span) * (height - 6) - 3;
      const command = index === 0 || series[index - 1] === null ? "M" : "L";
      return [`${command}${x.toFixed(1)},${y.toFixed(1)}`];
    })
    .join(" ");

  return (
    <svg aria-hidden="true" className={className} viewBox={`0 0 ${width} ${height}`}>
      <path
        fill="none"
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
