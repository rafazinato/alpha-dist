import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import "../assets/dde.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Line } from 'react-chartjs-2';
import { ModalBody } from "react-bootstrap";

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
      result.push(i);
  }
  return result;
}

function DDE({compound}) {



    const [showeditor, setShowEditor] = useState(false)


    const chartRef = useRef(null);
    const editorRef = useRef(null)
    const chartInstanceRef = useRef(null); // Ref para armazenar a instância do gráfico  
    const editorInstanceRef = useRef(null)  
    const pka = [Number(compound.pka1), Number(compound.pka2), Number(compound.pka3)].filter(v=>v!=0);
    const [ph, setPh] = useState(arange(0, 14.05, 0.05).map(value => parseFloat(value.toFixed(4))))
    const [ph_editor, setPhEditor] = useState(() => 
      arange(0, 14, 0.05).map(value => parseFloat(value.toFixed(1)))
  );
  // Limites dos eixos dos gráficos

    const [xmin, setXmin] = useState(undefined)
    const [xmax, setXmax] = useState(undefined)
    const [ymin, setYmin] = useState(undefined)
    const [ymax, setYmax] = useState(undefined)
    const [storage_ymin, setStorageYmin] = useState(null)
    const [storage_ymax, setStorageYmax] = useState(null)

    let ph_reference = arange(0, 14.05, 0.05).map(value => parseFloat(value.toFixed(4)))
  
    // let ph = arange(0, 14, .05);
    // let ph = arange(Math.floor(Math.min(...pka) - 3), Math.ceil(Math.max(...pka) + 3), .05);

    // console.log(ph)

      function calcAlpha(ph, pka) {
        let alpha = [];
    
        let denominator = 1;
        pka.forEach((element, idx) => {
            denominator += element ? 10 ** ((idx+1) * ph - pka.slice(0, idx+1).reduce((acc, curr) => acc + curr, 0)) : 0;
        });
    
        // alpha 0
        alpha.push(1 / denominator);
    
        // other alphas
        pka.forEach((element, idx) => {
            if (element) alpha.push(alpha[0] * 10 ** ((idx+1) * ph - pka.slice(0, idx+1).reduce((acc, curr) => acc + curr, 0)))
        });
    
        return alpha;
    }
    
    let alpha = ph.map(ph => calcAlpha(ph, pka));
    let a0 = alpha.map(a => a[0])
    let a1 = alpha.map(a => a[1])
    let a2 = alpha.map(a => a[2])
    let a3 = alpha.map(a => a[3])

    let a0_reference = alpha.map(a => a[0])
    let a1_reference = alpha.map(a => a[1])
    let a2_reference = alpha.map(a => a[2])
    let a3_reference= alpha.map(a => a[3])

    // const [a0, setA0] = useState()
    // const [a1, setA1] = useState()
    // const [a2, setA2] = useState()
    // const [a3, setA3] = useState()

    // setA0(alpha.map(a => a[0]))
    // setA1(alpha.map(a => a[1]))
    // setA2(alpha.map(a => a[2]))
    // setA3(alpha.map(a => a[3]))
    // condiçoes iniciais do site

    const [a0_editor, setA0Editor] = useState(undefined)
    const [a1_editor, setA1Editor] = useState(undefined)
    const [a2_editor, setA2Editor] = useState(undefined)
    const [a3_editor, setA3Editor] = useState(undefined)
  // Efeito para criar ou atualizar o gráfico sempre que 'text' for atualizado



  useEffect(() => {

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroi o gráfico anterior antes de criar o novo
    }

    if (chartRef.current) { // Verifica se os elementos canvas estão disponíveis
      const ctx = chartRef.current.getContext('2d');
  
      // Cria o novo gráfico de linha
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ph ? ph : [0],
          datasets: [
            {
              label: 'α₀',
              data: a0,
              backgroundColor: 'rgba(3, 119, 252, 0.2)',
              borderColor: 'rgba(3, 119, 252, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'α₁',
              data: a1,
              backgroundColor: 'rgba(252, 177, 3, 0.2)',
              borderColor: 'rgba(252, 177, 3, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'α₂',
              data: a2,
              backgroundColor: 'rgba(11, 158, 45, 0.2)',
              borderColor: 'rgba(11, 158, 45, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'α₃',
              data: a3,
              backgroundColor: 'rgba(219, 18, 18, 0.2)',
              borderColor: 'rgba(219, 18, 18, 1)',
              borderWidth: 2,
              fill: false,
            }
          ]
        },
        options: {
          elements: {
            point: {
              radius: 0,
            }
          },
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 15
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Fração de α',
                color: 'black',
                font: {
                  family: 'Inter',
                  size: '12px',
                }
              },
              beginAtZero: true,
            },
            x: {
              title: {
                display: true,
                text: 'pH',
                color: 'black',
                font: {
                  family: 'Inter',
                  size: '12px',
                }
              },
              min: Math.min(ph),
              max: Math.max(ph),
              ticks: {
                callback: (value, index, values) => {
                  return ph[index] ? ph[index].toFixed(1) : 0;
                },
              }
            }
          },
        },
      });
  

    }
  }, [alpha, ph,a0,a1,a2,a3]); // O efeito será disparado toda vez que 'alpha' ou 'ph' for atualizado
  
//   useEffect(() => {
//     if (xmin !== null && xmax !== null) {
//         setPhEditor(arange(xmin, xmax, 0.05)); // Recalcula 'ph' com base nos novos limites
//     }
// }, [xmin, xmax]);



  // Construindo o Modal e editor de gráfico
  // função que faz o modal aparecer
  let alpha_min = 0
  let alpha_max = 0
  let alpha_editor = []
  
  function changephEditor() {
    if (xmin !== 0 && xmax !== 0) {
      setPhEditor(arange(xmin,xmax,0.05))

      // alpha_editor = ph_editor.map(ph => calcAlpha(ph, pka));
      // setA0Editor(alpha_editor.map(a => a[0]));
      // setA1Editor(alpha_editor.map(a => a[1]));
      // setA2Editor(alpha_editor.map(a => a[2]));
      // setA3Editor(alpha_editor.map(a => a[3]));
  
      alpha_min = ph_reference.indexOf(xmin)
      alpha_max = ph_reference.indexOf(xmax)
      setA0Editor(a0.slice(alpha_min,alpha_max))
      setA1Editor(a1.slice(alpha_min,alpha_max))
      setA2Editor(a2.slice(alpha_min,alpha_max))
      setA3Editor(a3.slice(alpha_min,alpha_max))

  } else if (xmin !== 0 && xmax == 0) {
    setPhEditor(arange(xmin,14,0.05))
    console.log('a')
    alpha_min = ph_reference.indexOf(xmin)
    setA0Editor(a0.slice(alpha_min))
    setA1Editor(a1.slice(alpha_min))
    setA2Editor(a2.slice(alpha_min))
    setA3Editor(a3.slice(alpha_min))

  } else if (xmax !== 0) {
    setPhEditor(arange(0,xmax,0.05))
    alpha_max = ph_reference.indexOf(xmax)
    setA0Editor(a0.slice(0,alpha_max))
    setA1Editor(a1.slice(0,alpha_max))
    setA2Editor(a2.slice(0,alpha_max))
    setA3Editor(a3.slice(0,alpha_max))

  } else {
    setPhEditor(arange(xmin,14,0.05))
    alpha_min = ph_reference.indexOf(xmin)
    setA0Editor(a0.slice(alpha_min))
    setA1Editor(a1.slice(alpha_min))
    setA2Editor(a2.slice(alpha_min))
    setA3Editor(a3.slice(alpha_min))
  }
    setYmin(storage_ymin)
    setYmax(storage_ymax)
    console.log(a0_editor)
    console.log(a1_editor)
  }


  useEffect(() => {
    if (!showeditor) return; // Só recria o gráfico se o modal estiver aberto
    if (editorInstanceRef.current) {
      editorInstanceRef.current.destroy(); // Destroi o gráfico anterior antes de criar o novo
    }
  
    if (editorRef.current) { // Verifica se os elementos canvas estão disponíveis

      const ctx_editor = editorRef.current.getContext('2d');
  
  
      editorInstanceRef.current = new Chart(ctx_editor, {
        type: 'line',
        data: {
          labels: ph_editor,
          datasets: [
            {
              label: 'α₀',
              data: a0_editor || a0,
              backgroundColor: 'rgba(3, 119, 252, 0.2)',
              borderColor: 'rgba(3, 119, 252, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'α₁',
              data:  a1_editor || a1,
              backgroundColor: 'rgba(252, 177, 3, 0.2)',
              borderColor: 'rgba(252, 177, 3, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'α₂',
              data: a2_editor || a2,
              backgroundColor: 'rgba(11, 158, 45, 0.2)',
              borderColor: 'rgba(11, 158, 45, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'α₃',
              data: a3_editor || a3,
              backgroundColor: 'rgba(219, 18, 18, 0.2)',
              borderColor: 'rgba(219, 18, 18, 1)',
              borderWidth: 2,
              fill: false,
            }
          ]
        },
        options: {
          elements: {
            point: {
              radius: 0,
            }
          },
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 15
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Fração de α',
                color: 'black',
                font: {
                  family: 'Inter',
                  size: '12px',
                }
              },
              min: ymin ? ymin : 0,
              max: ymax ? ymax : 1,
              beginAtZero: true,
            },
            x: {
              title: {
                display: true,
                text: 'pH',
                color: 'black',
                font: {
                  family: 'Inter',
                  size: '12px',
                }
              },
              ticks: {
                    callback: (value, index) => 
                    ph_editor[index] ? ph_editor[index].toFixed(1) : ''
              }
            }
          },
        },
      });
    }
  }, [alpha, ph_editor,ymin,ymax,xmin,xmax,a0_editor,a1_editor,a2_editor,a3_editor,showeditor]); // O efeito será disparado toda vez que 'alpha' ou 'ph' for atualizado
  
  function handleSave() {
    a0 = a0_editor
    a1 = a1_editor
    a2 = a2_editor
    a3 = a3_editor
    setPh(ph_editor)



  }




    return(
        <div >
        <p className="graph-title">
            Diagrama de distribuição de espécies
        </p>
        <div class='graph-container'>
        <canvas ref={chartRef} />
        </div>
         <Button onClick={() => setShowEditor(true)}>Edite</Button>
         <Modal onHide={() => setShowEditor(false)} show={showeditor} dialogClassName='modal-editor' aria-labelledby="contained-modal-title-vcenter" centered >
          <Modal.Header closeButton>
            <Modal.Title> Edição de DDE</Modal.Title>
            </Modal.Header>
                  <Modal.Body>
                    <div>
                      <canvas ref={editorRef} />
                    </div>

                  </Modal.Body>
                  <Modal.Footer>
                    <div className="modal-buttons-container">
                      <p>X min:<input  type="number" onChange={(e) => setXmin(Number(e.target.value))}/> </p>
                      <p>X max:<input   type="number" onChange={(e) => setXmax(Number(e.target.value))}/></p>
                      <p>Y min:<input  type="number" onChange={(e) => setStorageYmin(Number(e.target.value))}/></p>
                      <p>Y max:<input   type="number" onChange={(e) =>  setStorageYmax(Number(e.target.value))}/></p>
                      <Button style={{'height':`35px`}} onClick={() => changephEditor()}>Aplicar</Button>
                      <Button style={{'height':`35px`}}  onClick={() => handleSave()}>Salvar</Button>
                    </div>

                  </Modal.Footer>

          </Modal>

        </div>

    );
}

export default DDE