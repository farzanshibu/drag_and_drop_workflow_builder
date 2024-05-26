import {
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

type Props = {
  data: ChartData<
    "scatter",
    {
      x: number;
      y: number;
    }[],
    unknown
  >;
};

export default function ScatterChart({ data }: Props) {
  return <Scatter options={options} data={data} />;
}
