import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../assets/graphs.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GraphComponent from "./GraphComponent";

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}

function DDE({ compound, pkauser, showInput }) {
  // Variavéis usadas para construção do editor de gráfico

  const [showeditor, setShowEditor] = useState(false);
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [ph_editor, setPhEditor] = useState(() =>
    arange(0, 14, 0.05).map((value) => parseFloat(value.toFixed(1)))
  );

  const [ymin_editor, setYminEditor] = useState(undefined);
  const [ymax_editor, setYmaxEditor] = useState(undefined);
  let ph_reference = arange(0, 14.05, 0.05).map((value) =>
    parseFloat(value.toFixed(4))
  );

  const [loga0_editor, setLogA0Editor] = useState(undefined);
  const [loga1_editor, setLogA1Editor] = useState(undefined);
  const [loga2_editor, setLogA2Editor] = useState(undefined);
  const [loga3_editor, setLogA3Editor] = useState(undefined);

  // Variavéis usadas para construção do gráfico principal

  const chartInstanceRef = useRef(null);
  const chartRef = useRef(null);
  const pka = [
    Number(compound.pka1),
    Number(compound.pka2),
    Number(compound.pka3),
    Number(compound.pka4),
    Number(compound.pka5),
    Number(compound.pka6),
    Number(compound.pka7),
    Number(compound.pka8),
  ].filter((v) => v !== 0);
  const [ph, setPh] = useState(
    arange(0, 14.05, 0.05).map((value) => parseFloat(value.toFixed(4)))
  );
  const [xmin, setXmin] = useState(undefined);
  const [xmax, setXmax] = useState(undefined);
  const [ymin, setYmin] = useState(undefined);
  const [ymax, setYmax] = useState(undefined);

  // Função que retorna uma lista, em que cada elemento corresponde ao alfa0,alfa1....alfaN

  function calcAlpha(ph, pka) {
    let alpha = [];

    let denominator = 1;
    pka.forEach((element, idx) => {
      denominator += element
        ? 10 **
          ((idx + 1) * ph -
            pka.slice(0, idx + 1).reduce((acc, curr) => acc + curr, 0))
        : 0;
    });

    // alpha 0
    alpha.push(1 / denominator);

    // other alphas
    pka.forEach((element, idx) => {
      if (element)
        alpha.push(
          alpha[0] *
            10 **
              ((idx + 1) * ph -
                pka.slice(0, idx + 1).reduce((acc, curr) => acc + curr, 0))
        );
    });

    return alpha;
  }

  let alpha = ph.map((ph) => calcAlpha(ph, pka));
  let loga0 = alpha.map((a) => Math.log10(a[0]));
  let loga1 = alpha.map((a) => Math.log10(a[1]));
  let loga2 = alpha.map((a) => Math.log10(a[2]));
  let loga3 = alpha.map((a) => Math.log10(a[3]));
  let loga4 = alpha.map((a) => Math.log10(a[4]));
  let loga5 = alpha.map((a) => Math.log10(a[5]));
  let loga6 = alpha.map((a) => Math.log10(a[6]));
  let loga7 = alpha.map((a) => Math.log10(a[7]));
  let loga8 = alpha.map((a) => Math.log10(a[8]));
  let alpha_reference = ph_reference.map((ph) => calcAlpha(ph, pka));
  let loga0_reference = alpha_reference.map((a) => Math.log10(a[0]));
  let loga1_reference = alpha_reference.map((a) => Math.log10(a[1]));
  let loga2_reference = alpha_reference.map((a) => Math.log10(a[2]));
  let loga3_reference = alpha_reference.map((a) => Math.log10(a[3]));

  // Calculando com os dados inseridos pelo usuario
  let alpha_user = ph.map((ph) => calcAlpha(ph, pkauser));
  let loga0_user = alpha_user.map((a) => Math.log10(a[0]));
  let loga1_user = alpha_user.map((a) => Math.log10(a[1]));
  let loga2_user = alpha_user.map((a) => Math.log10(a[2]));
  let loga3_user = alpha_user.map((a) => Math.log10(a[3]));
  let loga4_user = alpha_user.map((a) => Math.log10(a[4]));
  let loga5_user = alpha_user.map((a) => Math.log10(a[5]));
  let loga6_user = alpha_user.map((a) => Math.log10(a[6]));
  let loga7_user = alpha_user.map((a) => Math.log10(a[7]));
  let loga8_user = alpha_user.map((a) => Math.log10(a[8]));
  // Criando o gráfico principal

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroi o gráfico anterior antes de criar o novo
    }

    if (chartRef.current) {
      // Verifica se os elementos canvas estão disponíveis
      const ctx = chartRef.current.getContext("2d");
      let alldata = [loga0, loga1, loga2, loga3];
      let legend_color_list = [
        "rgba(3, 119, 252, 0.2)",
        "rgba(252, 177, 3, 0.2)",
        "rgba(11, 158, 45, 0.2)",
        "rgba(219, 18, 18, 0.2)",
      ];
      let legend_bordercolor_list = [
        "rgba(3, 119, 252, 1)",
        "rgba(252, 177, 3, 1)",
        "rgba(11, 158, 45, 1)",
        "rgba(219, 18, 18, 1)",
      ];
      let label_list = ["α₀", "α₁", "α₂", "α₃"];
      let datachartset = [];
      alldata.forEach((array, index) => {
        if (array[0]) {
          datachartset.push({
            label: label_list[index],
            data: array,
            backgroundColor: legend_color_list[index],
            borderColor: legend_bordercolor_list[index],
            borderWidth: 2,
            fill: false,
          });
        }
      });

      // Cria o novo gráfico de linha
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ph ? ph : [0],
          datasets: datachartset,
        },
        options: {
          elements: {
            point: {
              radius: 0,
            },
          },
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 15,
                },
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Logarithm of fraction of equilibrium", // 'Fração de α'
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              beginAtZero: true,
              min: ymin ? ymin : -30,
              max: ymax ? ymax : 0,
            },
            x: {
              title: {
                display: true,
                text: "pH",
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              min: Math.min(ph),
              max: Math.max(ph),
              ticks: {
                callback: function (value, index) {
                  if (Number.isInteger(ph[index])) {
                    return ph[index];
                  }
                },
              },
            },
          },
        },
      });
    }
  }, [alpha, ph, loga0, loga1, loga2, loga3, ymax, ymin]);

  // Construindo o Modal e editor de gráfico

  let alpha_min = 0;
  let alpha_max = 0;

  useEffect(() => {
    if (!showeditor) return;
    if (editorInstanceRef.current) {
      editorInstanceRef.current.destroy();
    }

    if (editorRef.current) {
      // Verifica se os elementos canvas estão disponíveis

      const ctx_editor = editorRef.current.getContext("2d");

      editorInstanceRef.current = new Chart(ctx_editor, {
        type: "line",
        data: {
          labels: ph_editor,
          datasets: [
            {
              label: "α₀",
              data: loga0_editor || loga0_reference,
              backgroundColor: "rgba(3, 119, 252, 0.2)",
              borderColor: "rgba(3, 119, 252, 1)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "α₁",
              data: loga1_editor || loga1_reference,
              backgroundColor: "rgba(252, 177, 3, 0.2)",
              borderColor: "rgba(252, 177, 3, 1)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "α₂",
              data: loga2_editor || loga2_reference,
              backgroundColor: "rgba(11, 158, 45, 0.2)",
              borderColor: "rgba(11, 158, 45, 1)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "α₃",
              data: loga3_editor || loga3_reference,
              backgroundColor: "rgba(219, 18, 18, 0.2)",
              borderColor: "rgba(219, 18, 18, 1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          elements: {
            point: {
              radius: 0,
            },
          },
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 15,
                },
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Logarithm of fraction of equilibrium", // 'Fração de α'
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              min: ymin_editor ? ymin_editor : -30,
              max: ymax_editor ? ymax_editor : 0,
              beginAtZero: true,
            },
            x: {
              title: {
                display: true,
                text: "pH",
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              ticks: {
                callback: function (value, index) {
                  if (Number.isInteger(ph[index])) {
                    return ph[index];
                  }
                },
              },
            },
          },
        },
      });
    }
  }, [
    alpha,
    ph_editor,
    ymin,
    ymax,
    xmin,
    xmax,
    loga0_editor,
    loga1_editor,
    loga2_editor,
    loga3_editor,
    showeditor,
    loga0_reference,
    loga1_reference,
    loga2_reference,
    loga3_reference,
    ymax_editor,
    ymin_editor,
  ]);

  let y_data = [
    {
      label: "α0",
      data: loga0,
      backgroundColor: "rgba(3, 119, 252, 0.2)",
      borderColor: "rgba(3, 119, 252, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α1",
      data: loga1,
      backgroundColor: "rgba(252, 177, 3, 0.2)",
      borderColor: "rgba(252, 177, 3, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α2",
      data: loga2,
      backgroundColor: "rgba(11, 158, 45, 0.2)",
      borderColor: "rgba(11, 158, 45, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α3",
      data: loga3,
      backgroundColor: "rgba(219, 18, 18, 0.2)",
      borderColor: "rgba(219, 18, 18, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α4",
      data: loga4,
      backgroundColor: "rgba(18, 206, 219, 0.2)",
      borderColor: "rgb(18, 212, 219)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α5",
      data: loga5,
      backgroundColor: "rgba(162, 18, 219, 0.2)",
      borderColor: "rgb(179, 18, 219)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α6",
      data: loga6,
      backgroundColor: "rgba(108, 219, 18, 0.2)",
      borderColor: "rgb(98, 219, 18)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α7",
      data: loga7,
      backgroundColor: "rgba(219, 18, 112, 0.2)",
      borderColor: "rgb(219, 18, 169)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α8",
      data: loga8,
      backgroundColor: "rgba(18, 31, 219, 0.2)",
      borderColor: "rgb(18, 31, 219)",
      borderWidth: 2,
      fill: false,
    },
  ];
  y_data = y_data.filter((item) => Array.isArray(item.data) && item.data[0]);

  let y_data_user = [
    {
      label: "α0",
      data: loga0_user,
      backgroundColor: "rgba(3, 119, 252, 0.2)",
      borderColor: "rgba(3, 119, 252, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α1",
      data: loga1_user,
      backgroundColor: "rgba(252, 177, 3, 0.2)",
      borderColor: "rgba(252, 177, 3, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α2",
      data: loga2_user,
      backgroundColor: "rgba(11, 158, 45, 0.2)",
      borderColor: "rgba(11, 158, 45, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α3",
      data: loga3_user,
      backgroundColor: "rgba(219, 18, 18, 0.2)",
      borderColor: "rgba(219, 18, 18, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α4",
      data: loga4_user,
      backgroundColor: "rgba(18, 206, 219, 0.2)",
      borderColor: "rgb(18, 212, 219)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α5",
      data: loga5_user,
      backgroundColor: "rgba(162, 18, 219, 0.2)",
      borderColor: "rgb(179, 18, 219)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α6",
      data: loga6_user,
      backgroundColor: "rgba(108, 219, 18, 0.2)",
      borderColor: "rgb(98, 219, 18)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α7",
      data: loga7_user,
      backgroundColor: "rgba(219, 18, 112, 0.2)",
      borderColor: "rgb(219, 18, 169)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α8",
      data: loga8_user,
      backgroundColor: "rgba(18, 31, 219, 0.2)",
      borderColor: "rgb(18, 31, 219)",
      borderWidth: 2,
      fill: false,
    },
  ];

  y_data_user = y_data_user.filter(
    (item) => Array.isArray(item.data) && item.data[0]
  );

  return (
    <div>
      <div className="graph-container">
        {/* <canvas ref={chartRef} /> */}
        {showInput ? (
          <GraphComponent
            x_data={ph}
            y_data={y_data_user}
            y_title={"Fraction of equilibrium (logα)"}
            initial_limits={[0, 14, -30, 0]}
            graph_title={"Logaritmo Diagrama de distribuição de espécies"}
          />
        ) : (
          <GraphComponent
            x_data={ph}
            y_data={y_data}
            y_title={"Fraction of equilibrium (logα)"}
            initial_limits={[0, 14, -30, 0]}
            graph_title={"Logaritmo Diagrama de distribuição de espécies"}
          />
        )}
      </div>
    </div>
  );
}

export default DDE;
