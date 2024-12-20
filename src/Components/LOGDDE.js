import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../assets/graphs.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}

function DDE({ compound }) {
  // Variavéis usadas para construção do editor de gráfico

  const [showeditor, setShowEditor] = useState(false);
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [ph_editor, setPhEditor] = useState(() =>
    arange(0, 14, 0.05).map((value) => parseFloat(value.toFixed(1)))
  );
  const [storage_ymin, setStorageYmin] = useState(null);
  const [storage_ymax, setStorageYmax] = useState(null);
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
  let alpha_reference = ph_reference.map((ph) => calcAlpha(ph, pka));
  let loga0_reference = alpha_reference.map((a) => Math.log10(a[0]));
  let loga1_reference = alpha_reference.map((a) => Math.log10(a[1]));
  let loga2_reference = alpha_reference.map((a) => Math.log10(a[2]));
  let loga3_reference = alpha_reference.map((a) => Math.log10(a[3]));

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

  function changephEditor() {
    if (xmin !== 0 && xmax !== 0) {
      setPhEditor(arange(xmin, xmax, 0.05));
      alpha_min = ph_reference.indexOf(xmin);
      alpha_max = ph_reference.indexOf(xmax);
      setLogA0Editor(loga0.slice(alpha_min, alpha_max));
      setLogA1Editor(loga1.slice(alpha_min, alpha_max));
      setLogA2Editor(loga2.slice(alpha_min, alpha_max));
      setLogA3Editor(loga3.slice(alpha_min, alpha_max));
    } else if (xmin !== 0 && xmax === 0) {
      setPhEditor(arange(xmin, 14, 0.05));
      console.log("a");
      alpha_min = ph_reference.indexOf(xmin);
      setLogA0Editor(loga0.slice(alpha_min));
      setLogA1Editor(loga1.slice(alpha_min));
      setLogA2Editor(loga2.slice(alpha_min));
      setLogA3Editor(loga3.slice(alpha_min));
    } else if (xmax !== 0) {
      setPhEditor(arange(0, xmax, 0.05));
      alpha_max = ph_reference.indexOf(xmax);
      setLogA0Editor(loga0.slice(0, alpha_max));
      setLogA1Editor(loga1.slice(0, alpha_max));
      setLogA2Editor(loga2.slice(0, alpha_max));
      setLogA3Editor(loga3.slice(0, alpha_max));
    } else {
      setPhEditor(arange(xmin, 14, 0.05));
      alpha_min = ph_reference.indexOf(xmin);
      setLogA0Editor(loga0.slice(alpha_min));
      setLogA1Editor(loga1.slice(alpha_min));
      setLogA2Editor(loga2.slice(alpha_min));
      setLogA3Editor(loga3.slice(alpha_min));
    }
    setYmin(storage_ymin);
    setYmax(storage_ymax);
    setYmaxEditor(storage_ymax);
    setYminEditor(storage_ymin);
  }

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
                callback: function (value,index) { if (Number.isInteger(ph[index])) { return ph[index]; } },
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

  function handleSave() {
    loga0 = loga0_editor;
    loga1 = loga1_editor;
    loga2 = loga2_editor;
    loga3 = loga3_editor;
    setPh(ph_editor);
  }
  function handleResetGraph() {
    setPh(arange(0, 14.05, 0.05).map((value) => parseFloat(value.toFixed(4))));
    loga0 = alpha.map((a) => a[0]);
    loga1 = alpha.map((a) => a[1]);
    loga2 = alpha.map((a) => a[2]);
    loga3 = alpha.map((a) => a[3]);
    setYmin(0);
    setYmax(1);
    console.log(loga0);
  }

  function openModal() {
    setPhEditor(
      arange(0, 14.05, 0.05).map((value) => parseFloat(value.toFixed(4)))
    );
    setLogA0Editor(loga0_reference);
    setLogA1Editor(loga1_reference);
    setLogA2Editor(loga2_reference);
    setLogA3Editor(loga3_reference);
    setYmaxEditor(1);
    setYminEditor(0);
    setShowEditor(true);
  }

  return (
    <div>
      <div className="graph-title" style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          <p> Logaritmo Diagrama de distribuição de espécies</p>
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
        <canvas ref={chartRef} />
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
            {" "}
            Editor do Logaritmo do Diagrama de distribuição de espécies
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <canvas ref={editorRef} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-buttons-container">
            <p>
              X min:
              <input
                type="number"
                onChange={(e) => setXmin(Number(e.target.value))}
              />{" "}
            </p>
            <p>
              X max:
              <input
                type="number"
                onChange={(e) => setXmax(Number(e.target.value))}
              />
            </p>
            <p>
              Y min:
              <input
                type="number"
                onChange={(e) => setStorageYmin(Number(e.target.value))}
              />
            </p>
            <p>
              Y max:
              <input
                type="number"
                onChange={(e) => setStorageYmax(Number(e.target.value))}
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
              onClick={() => changephEditor()}
            >
              Aplicar
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
              onClick={() => handleSave()}
            >
              Salvar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DDE;
