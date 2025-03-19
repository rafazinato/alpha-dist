import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../assets/graphs.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function GraphComponent({
  x_data,
  y_data,
  x_label,
  y_labels,
  y_title,
  initial_limits,
  graph_title,
  depedency
}) {
  const [showeditor, setShowEditor] = useState(false);

  const chartRef = useRef(null); // Criação do ref para o canvas
  const editorchartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Criação do ref para o Chart.js
  const editorchartInstanceRef = useRef(null); // Criação do ref para o Chart.js

  // States que vão possuir limites dos gráficos

  const [xmin, setXmin] = useState(undefined);
  const [xmax, setXmax] = useState(undefined);
  const [ymin, setYmin] = useState(undefined);
  const [ymax, setYmax] = useState(undefined);

  const [main_limit, setMainLimit] = useState([
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  // Gráfico normal
  useEffect(() => {
    if (!y_data) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroi o gráfico anterior antes de criar o novo
    }

    if (chartRef.current) {
      // Verifica se os elementos canvas estão disponíveis
      const ctx = chartRef.current.getContext("2d");

      // Cria o novo gráfico de linha
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: x_data,
          datasets: y_data,
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
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Valor: ${tooltipItem.raw.toFixed(5)}`; // Exibe com 5 casas decimais
                }}},
          },
          scales: {
            y: {
              title: {
                display: true,
                text: y_title, // 'Fração de α'
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              beginAtZero: true,
              min: main_limit[2] ? main_limit[2] : initial_limits[2],
              max: main_limit[3] ? main_limit[3] : initial_limits[3],
            },

            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: "pH",
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              min: main_limit[0] ? main_limit[0] : initial_limits[0],
              max: main_limit[1] ? main_limit[1] : initial_limits[1],
              ticks: {},
            },
          },
        },
      });
    }
  }, [x_data, y_data, x_label, y_labels, y_title, main_limit, initial_limits,depedency]);

  // Gráfico do Modal

  useEffect(() => {
    if (!showeditor) return; // Apenas construa o gráfico se o modal estiver aberto

    if (editorchartInstanceRef.current) {
      editorchartInstanceRef.current.destroy(); // Destroi o gráfico anterior antes de criar o novo
    }

    if (editorchartRef.current) {
      // Verifica se os elementos canvas estão disponíveis
      const ctx = editorchartRef.current.getContext("2d");

      // Cria o novo gráfico de linha
      editorchartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: x_data,
          datasets: y_data,
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
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Valor: ${tooltipItem.raw.toFixed(5)}`; // Exibe com 5 casas decimais
                }}},
          },
          scales: {
            xAxes: [{
              ticks: {
                precision: 0
              }
            }],
            y: {
              title: {
                display: true,
                text: y_title, // 'Fração de α'
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              //   beginAtZero : true,
              min: ymin ? ymin : initial_limits[2],
              max: ymax ? ymax : initial_limits[3],
            },

            x: {
              type: 'linear',
              position: 'bottom',
              title: {

                display: true,
                text: "pH",
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              min: xmin ? xmin : initial_limits[0],
              max: xmax ? xmax : initial_limits[1],
              ticks: 
              {},
            },
          },
        },
      });
    }
  }, [
    x_data,
    y_data,
    x_label,
    y_labels,
    y_title,
    showeditor,
    xmin,
    xmax,
    ymax,
    ymin,
    initial_limits,
    depedency,
  ]);

  function openModal() {
    setShowEditor(true);
  }
  function handleSave() {
    setMainLimit([xmin, xmax, ymin, ymax]);
  }
  function handleResetGraph() {
    setMainLimit(initial_limits);
  }
  function resetEditor() {
    setYmin(undefined);
    setXmin(undefined);
    setYmax(undefined);
    setXmax(undefined);
  }

  
  return (
    <>
      <div className="graph-title" style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          <p> {graph_title}</p>
        </div>

        <div className="edition-buttons-container">
        <Button
          style={{
            backgroundColor: "#C7DCE5",
            fontFamily: "Inter",
            border: "none",
            fontSize: "12px",
          }}
          onClick={() => openModal()}
        >
          <span class="material-symbols-outlined">edit</span>
        </Button>
        <Button
          style={{
            backgroundColor: "#C7DCE5",
            fontFamily: "Inter",
            border: "none",
            fontSize: "12px",
          }}
          onClick={() => handleResetGraph()}
        >
          <span class="material-symbols-outlined">restart_alt</span>{" "}
        </Button>
      </div>
      </div>  
      <div className="graph-container">
        <canvas ref={chartRef}></canvas>
      </div>

      <Modal
        onHide={() => setShowEditor(false)}
        show={showeditor}
        dialogClassName="modal-editor"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Editor do Diagrama de distribuição de espécies
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <canvas ref={editorchartRef}></canvas>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-buttons-container">
            <p>
              X mínimo:
              <input
              id="modal-input"
                type="number"
                onChange={(e) => setXmin(Number(e.target.value))}
              />
            </p>
            <p>
              X máximo:
              <input
              id="modal-input"
                type="number"
                onChange={(e) => setXmax(Number(e.target.value))}
              />
            </p>
            <p>
              Y mínino:
              <input
              id="modal-input"
                type="number"
                onChange={(e) => setYmin(Number(e.target.value))}
              />
            </p>
            <p>
              Y máximo:
              <input
              id="modal-input"
                type="number"
                onChange={(e) => setYmax(Number(e.target.value))}
              />
            </p>
            <Button
              style={{
                backgroundColor: "#C7DCE5",
                color: "black",
                fontFamily: "Inter",
                border: "none",
                fontSize: "12px",
                height: `35px`,
              }}
              onClick={() => handleSave()}
            >
              Salvar
            </Button>
            <Button
              style={{
                backgroundColor: "#C7DCE5",
                color: "black",
                fontFamily: "Inter",
                border: "none",
                fontSize: "12px",
                height: `35px`,
              }}
              onClick={() => resetEditor()}
            >
              Resetar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GraphComponent;
