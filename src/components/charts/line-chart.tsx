import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  type BubbleDataPoint,
  type ChartData,
  type Point,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  data: ChartData<
    "line",
    (number | Point | [number, number] | BubbleDataPoint | null)[],
    unknown
  >;
};

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Line Chart",
    },
  },
};

export default function LineChart({ data }: Props) {
  return <Line options={options} data={data} />;
}
