import * as React from "react";
import { createRoot } from "react-dom/client";
import { ConArtist } from "./con-artist";
import { to as navigateTo } from "./update/navigate";
import { resolveRoute } from "./routing";
import "./styles/global.css";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  ScatterController,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  ScatterController,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

const root = createRoot(document.querySelector("#root"));
root.render(<ConArtist />);

window.addEventListener("popstate", (event) => {
  const { state } = event;
  if (state) {
    navigateTo(resolveRoute());
  }
});
