import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../assets/graphs.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMemo } from "react";
function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}

function QEGRAPH({ compound, alfascharge }) {
  // Variavéis usadas para construção do editor de gráfico
  const [showeditor, setShowEditor] = useState(false);
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [storage_ymin, setStorageYmin] = useState(null);
  const [storage_ymax, setStorageYmax] = useState(null);
  const [ymin_editor, setYminEditor] = useState(undefined);
  const [ymax_editor, setYmaxEditor] = useState(undefined);
  const [ph_editor, setPhEditor] = useState(() =>
    arange(0, 14, 0.05).map((value) => parseFloat(value.toFixed(1)))
  );

  let ph_reference = arange(0, 14.05, 0.05).map((value) =>
    parseFloat(value.toFixed(4))
  );
  const [effective_charge_editor, setEffectiveChargeEditor] =
    useState(undefined);

  // Variavéis usadas para construção do gráfico principal
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const pka = [
    Number(compound.pka1),
    Number(compound.pka2),
    Number(compound.pka3),
  ].filter((v) => v !== 0);
  const [xmin, setXmin] = useState(undefined);
  const [xmax, setXmax] = useState(undefined);
  const [ymin, setYmin] = useState(undefined);
  const [ymax, setYmax] = useState(undefined);
  const [ph, setPh] = useState(
    arange(0, 14.05, 0.05).map((value) => parseFloat(value.toFixed(4)))
  );

  // Função que retorna uma lista, em qu cada elemento corresponde ao alfa0,alfa1....alfaN
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

  // Atribuindo cada elemento de alfa a uma variavel
  let alpha = ph.map((ph) => calcAlpha(ph, pka));
  let a0 = alpha.map((a) => a[0]);
  let a1 = alpha.map((a) => a[1]);
  let a2 = alpha.map((a) => a[2]);
  let a3 = alpha.map((a) => a[3]);

  // Criando o cálculo da carga efetiva
  let alpha_list = [a0, a1, a2, a3];
  let each_charge = ph.map((ph, phindex) =>
    alfascharge.map(
      (charge, index) => Number(charge) * Number(alpha_list[index][phindex])
    )
  );

  // let effective_charge = [];
  // let effective_charge_reference = [];

  // each_charge.forEach((num) => {
  //   effective_charge.push(num.reduce((acc, curr) => acc + curr, 0));
  //   // effective_charge_reference.push(num.reduce((acc, curr) => acc + curr, 0));
  // });

  let effective_charge = useMemo(() => {
    const tempReference = [];
    each_charge.forEach((num) => {
      tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
    });
    return tempReference;
  }, [each_charge]);

  let effective_charge_reference = useMemo(() => {
    const tempReference = [];
    each_charge.forEach((num) => {
      tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
    });
    return tempReference;
  }, [each_charge]); 


  // Criando o gráfico

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (ctx) {
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ph ? ph : [0],
          datasets: [
            {
              label: "α₀",
              data: effective_charge,
              backgroundColor: "rgba(3, 119, 252, 0.2)",
              borderColor: "rgba(3, 119, 252, 1)",
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
                text: "", // 'Fração de α'
                color: "black",
                font: {
                  family: "Inter",
                  size: "12px",
                },
              },
              beginAtZero: true,
              min: ymin ? ymin : Math.min(effective_charge_reference),
              max: ymax ? ymax : Math.max(effective_charge_reference),
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
                callback: (value, index, values) => {
                  return ph[index] ? ph[index].toFixed(1) : 0;
                },
              },
            },
          },
        },
      });
    }
  }, [alpha, ph, effective_charge, effective_charge_reference, ymax, ymin]);

  // Gráfico do editor

  useEffect(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.destroy();
    }
    if (editorRef.current) {
      const ctx_editor = editorRef.current.getContext("2d");

      if (ctx_editor) {
        editorInstanceRef.current = new Chart(ctx_editor, {
          type: "line",
          data: {
            labels: ph_editor,
            datasets: [
              {
                data: effective_charge_editor || effective_charge_reference,
                label: "Carga Efetiva",
                backgroundColor: "rgba(3, 119, 252, 0.2)",
                borderColor: "rgba(3, 119, 252, 1)",
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
                display: false,
                position: "top",
                labels: {
                  textAlign: "right",
                  font: {
                    size: 15,
                  },
                  color: "black",
                  padding: 10,
                },
              },
              // title: {
              //   display: true,
              // },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Carga Efetiva",
                  color: "black",
                  font: {
                    family: "Inter",
                    size: "12px",
                  },
                },
                beginAtZero: true,
                min: ymin_editor
                  ? ymin_editor
                  : Math.min(effective_charge_reference),
                max: ymax_editor
                  ? ymax_editor
                  : Math.max(effective_charge_reference),
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
                  callback: (value, index, values) => {
                    return ph_editor[index] ? ph_editor[index].toFixed(1) : 0;
                  },
                },
              },
            },
          },
        });
      }
    }
  }, [
    alpha,
    ph_editor,
    ymin,
    ymax,
    xmin,
    xmax,
    effective_charge_editor,
    showeditor,
    effective_charge_reference,
    ymax_editor,
    ymin_editor,
  ]);
  // Função que abre o modal e reseta o gráfico do editor sempre que aberta
  function openModal() {
    setPhEditor(
      arange(0, 14.05, 0.05).map((value) => parseFloat(value.toFixed(4)))
    );
    setEffectiveChargeEditor(undefined);
    setShowEditor(true);
    setYminEditor(Math.min(effective_charge_reference));
    setYmaxEditor(Math.max(effective_charge_reference));
  }
  let alpha_min = 0;
  let alpha_max = 0;

  // função que salva limites no gráfico do editor
  function changephEditor() {
    if (xmin !== 0 && xmax !== 0) {
      setPhEditor(arange(xmin, xmax, 0.05));

      alpha_min = ph_reference.indexOf(xmin);
      alpha_max = ph_reference.indexOf(xmax);
      setEffectiveChargeEditor(effective_charge.slice(alpha_min, alpha_max));
      console.log(effective_charge_editor);
    } else if (xmin !== 0 && xmax === 0) {
      setPhEditor(arange(xmin, 14, 0.05));
      console.log("a");
      console.log(ph_editor);
      alpha_min = ph_reference.indexOf(xmin);
      setEffectiveChargeEditor(effective_charge.slice(alpha_min));
    } else if (xmax !== 0) {
      setPhEditor(arange(0, xmax, 0.05));
      alpha_max = ph_reference.indexOf(xmax);
      setEffectiveChargeEditor(effective_charge.slice(0, alpha_max));
    } else {
      setPhEditor(arange(xmin, 14, 0.05));
      alpha_min = ph_reference.indexOf(xmin);
      setEffectiveChargeEditor(effective_charge.slice(alpha_min));
    }
    setYmaxEditor(storage_ymax);
    setYminEditor(storage_ymin);
    console.log(ymax_editor);
    console.log(ymin_editor);
  }
  // Função que salva os limites dos eixos no gráfico principal
  function handleSave() {
    effective_charge = effective_charge_editor;
    setYmin(ymin_editor);
    setYmax(ymax_editor);
    setPh(ph_editor);
  }

  // Função que reseta o gráfico princial
  function handleResetGraph() {
    setPh(arange(0, 14.05, 0.05).map((value) => parseFloat(value.toFixed(4))));
    effective_charge = effective_charge_reference;
    setYmin(undefined);
    setYmax(undefined);
  }

  return (
    <div>
      <div className="graph-title" style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          <p>Carga Efetiva</p>
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
          <Modal.Title> Editor de Carga Efetiva</Modal.Title>
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

export default QEGRAPH;
