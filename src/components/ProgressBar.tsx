interface ProgressBarProps {
  current: number;
  total: number;
}

const prideColors = [
  "bg-pride-red",
  "bg-pride-orange",
  "bg-pride-yellow",
  "bg-pride-green",
  "bg-pride-blue",
  "bg-pride-purple",
];

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full h-2 rounded-full bg-accent overflow-hidden flex">
      {prideColors.map((color, i) => {
        const segmentWidth = 100 / prideColors.length;
        const segmentEnd = segmentWidth * (i + 1);
        const filled = Math.min(Math.max(percentage - segmentWidth * i, 0), segmentWidth);
        const filledPercent = (filled / segmentWidth) * 100;

        return (
          <div key={i} className="h-full relative" style={{ width: `${segmentWidth}%` }}>
            <div
              className={`h-full ${color} opacity-60 transition-all duration-500 ease-out`}
              style={{ width: `${filledPercent}%` }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
