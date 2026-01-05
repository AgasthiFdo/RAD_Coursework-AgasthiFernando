import DashboardLineChart from "./DashboardLineChart";
import DashboardPieChart from "./DashboardPieChart";

export default function Home() {
  return (
    <div>
      <div className="space-y-8">
        <DashboardLineChart />
        <DashboardPieChart/>
      </div>
    </div>
  )
}
