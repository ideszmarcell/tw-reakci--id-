let clickCount = 0;
let lastTime = "";

function drawChart() {
  const eredmeny = document.getElementById("Eredmény")!;
  let chart = document.getElementById("chart") as HTMLDivElement | null;
  if (!chart) {
    chart = document.createElement("div");
    chart.id = "chart";
    chart.style.position = "relative";
    chart.style.height = "120px";
    chart.style.marginTop = "26px";
    chart.style.width = "100%";
    chart.style.background = "#f5f5f5";
    chart.style.overflow = "hidden";
    eredmeny.parentElement!.appendChild(chart);
  }
  chart.innerHTML = "";

  const values =
    eredmeny.textContent
      ?.split(",")
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v)) ?? [];

  // --- Itt számoljuk a min és max értéket ---
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const w = chart.clientWidth || 400;
  const h = 120;
  const n = values.length;

  // Tengelyek mindig legyenek
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", h.toString());
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.style.display = "block";
  const axisColor = "#888";
  const topMargin = 26;

  // Y tengely
  const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  yAxis.setAttribute("x1", "30");
  yAxis.setAttribute("y1", topMargin.toString());
  yAxis.setAttribute("x2", "30");
  yAxis.setAttribute("y2", (h - 20).toString());
  yAxis.setAttribute("stroke", axisColor);
  yAxis.setAttribute("stroke-width", "2");
  svg.appendChild(yAxis);

  // Y tengely beosztás (8 vonal)
  const ySteps = 8;
  const scaleHeight = h - topMargin - 20;
  for (let i = 0; i <= ySteps; i++) {
    const y = topMargin + (scaleHeight / ySteps) * i;
    const grid = document.createElementNS("http://www.w3.org/2000/svg", "line");
    grid.setAttribute("x1", "25");
    grid.setAttribute("x2", (w - 10).toString());
    grid.setAttribute("y1", y.toString());
    grid.setAttribute("y2", y.toString());
    grid.setAttribute("stroke", "#ccc");
    grid.setAttribute("stroke-width", "1");
    svg.appendChild(grid);

    // Skála érték kiírása (felül a max, alul a min)
    const value = max - ((max - min) / ySteps) * i;
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", "10");
    label.setAttribute("y", (y + 4).toString());
    label.setAttribute("font-size", "11");
    label.setAttribute("fill", "#666");
    label.textContent = value.toFixed(3);
    svg.appendChild(label);
  }

  // X tengely a tetején, a 0 értékkel együtt
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxis.setAttribute("x1", "30");
  xAxis.setAttribute("y1", topMargin.toString());
  xAxis.setAttribute("x2", (w - 10).toString());
  xAxis.setAttribute("y2", topMargin.toString());
  xAxis.setAttribute("stroke", axisColor);
  xAxis.setAttribute("stroke-width", "2");
  svg.appendChild(xAxis);

  // ... pontok elhelyezése ...
  if (n > 0) {
    const left = 30;
    const right = w - 30;
    const availableWidth = right - left;

    const points = values.map((v, i) => {
      const x = n === 1 ? (left + right) / 2 : left + (i * availableWidth) / (n - 1);
      // Y-t úgy számoljuk, hogy a max érték felül (topMargin), a min alul (topMargin + scaleHeight) legyen
      const y = topMargin + scaleHeight * ((max - v) / (max - min));
      return { x, y, v };
    });

    // Vonalak kirajzolása színezve
    for (let i = 0; i <= ySteps; i++) {
      const y = topMargin + (scaleHeight / ySteps) * i;
      const grid = document.createElementNS("http://www.w3.org/2000/svg", "line");
      grid.setAttribute("x1", "25");
      grid.setAttribute("x2", (w - 10).toString());
      grid.setAttribute("y1", y.toString());
      grid.setAttribute("y2", y.toString());
      grid.setAttribute("stroke", "#ccc");
      grid.setAttribute("stroke-width", "1");
      svg.appendChild(grid);

      // Skála érték kiírása (felül a min, alul a max)
      const value = min + ((max - min) / ySteps) * i;
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", "10");
      label.setAttribute("y", (y + 4).toString());
      label.setAttribute("font-size", "11");
      label.setAttribute("fill", "#666");
      label.textContent = value.toFixed(3);
      svg.appendChild(label);
    }

    // Pontok és értékek kirajzolása
    points.forEach((p, i) => {
      let color = "#4caf50";
      if (i > 0) {
        color = p.v >= points[i - 1].v ? "#4caf50" : "#e53935";
      }
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", p.x.toString());
      circle.setAttribute("cy", p.y.toString());
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", color);
      svg.appendChild(circle);

      // Érték kiírása a pont fölé
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", p.x.toString());
      text.setAttribute("y", (p.y - 8).toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "12");
      text.setAttribute("fill", "#222");
      text.textContent = p.v.toFixed(3);
      svg.appendChild(text);
    });
  }

  chart.appendChild(svg);
}

function számol() {
  const content = document.getElementById("content")!;
  const eredmeny = document.getElementById("Eredmény")!;
  clickCount++;

  if (clickCount === 1) {
    let count = 4;
    content.textContent = count.toString();
    content.style.backgroundColor = "";
    content.style.pointerEvents = "none";

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        content.textContent = count.toString();
      } else {
        clearInterval(interval);
        content.textContent = "0!";
        content.style.backgroundColor = "yellow";

        let ms = 0;
        content.textContent = "0.000";
        content.style.pointerEvents = "auto";
        const stopper = setInterval(() => {
          ms += 1;
          content.textContent = (ms / 1000).toFixed(3);
        }, 10);

        const stopperHandler = () => {
          if (clickCount === 2) {
            clearInterval(stopper);
            lastTime = (ms / 1000).toFixed(3);
            content.removeEventListener("click", stopperHandler);
          }
        };
        content.addEventListener("click", stopperHandler);
      }
    }, 1000);
  }

  drawChart();

  if (clickCount === 3) {
    clickCount = 0;
    content.textContent = "Kattints ide az újabb mérés kezdéséhez!";
    content.style.backgroundColor = "";
    content.style.pointerEvents = "auto";

    if (lastTime <= "0.010") {
      lastTime = "";
    } else {
      if (lastTime) {
        if (eredmeny.textContent && eredmeny.textContent.trim() !== "") {
          eredmeny.textContent = eredmeny.textContent.trim() + ", " + lastTime;
        } else {
          eredmeny.textContent = lastTime;
        }
        lastTime = "";
        drawChart();
      }
    }
  }
}

document.getElementById("content")!.addEventListener("click", számol);

window.addEventListener("DOMContentLoaded", () => {
  drawChart();
});
window.addEventListener("resize", drawChart);
