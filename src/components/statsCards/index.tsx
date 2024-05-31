
import { MousePointerClick, Split, SquareGanttChart, View } from "lucide-react";
import { StatsCard } from "./statCard";
const StatCards = ({statsData, loading}) => {

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visits"
        icon={<View className="text-blue-600" />}
        helperText="All time form visits"
        value={statsData?.visits?.toLocaleString() || "0"}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total submissions"
        icon={<SquareGanttChart className="text-yellow-600" />}
        helperText="All time form submissions"
        value={statsData?.submissions?.toLocaleString() || "0"}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="Submission rate"
        icon={<MousePointerClick className="text-green-600" />}
        helperText="Visits that result in form submission"
        value={ statsData?.submissionRate ? `${statsData?.submissionRate?.toLocaleString()}%` : "0%"}
        loading={loading}
        className="shadow-md shadow-green-600"
      />

      <StatsCard
        title="Bounce rate"
        icon={<Split className="text-red-600" />}
        helperText="Visits that leaves without interacting"
        value={statsData?.bounceRate ? `${statsData?.bounceRate?.toLocaleString()}%` : "0%"}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
};

export default StatCards;
