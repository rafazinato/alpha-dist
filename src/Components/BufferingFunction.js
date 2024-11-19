import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import "../assets/dde.css";

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
      result.push(i);
  }
  return result;
}

function BUFFERFUNCTION({compound,alfascharge,chosenconc}) {

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null); // Ref para armazenar a instância do gráfico    
    const pka = [Number(compound.pka1), Number(compound.pka2), Number(compound.pka3)].filter(v=>v!=0);

    let pKw = 14
    let ph = arange(0, 14, .05);
    // let ph = arange(Math.floor(Math.min(...pka) - 3), Math.ceil(Math.max(...pka) + 3), .05);
    let qwat = ph.map( ph => (10**(-ph))**2 + (10**(ph - pKw))**2)

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

    // criando o cálculo da carga efetiva
    let alpha_list = [a0,a1,a2,a3]
    let each_charge = ph.map((ph,phindex) => alfascharge.map((charge,index) => Number(charge)*Number(alpha_list[index][phindex])))


    let effective_charge = [];

    each_charge.forEach( num => {
        effective_charge.push(num.reduce((acc, curr) => acc + curr, 0))   
    })

    let ionic_strength = effective_charge.map( effective_charge => (1/2 * chosenconc * effective_charge**2))  


    // Criando o gráfico

  // Efeito para criar ou atualizar o gráfico sempre que 'text' for atualizado
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroi o gráfico anterior antes de criar o novo
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Cria o novo gráfico de linha
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line', // Tipo de gráfico
      data: {
        labels: ph ? ph : [0],
        datasets: [
          {
            data: ionic_strength,
            label: "Sitema",
            backgroundColor: 'rgba(3, 119, 252, 0.2)',
            borderColor: 'rgba(3, 119, 252, 1)',
            borderWidth: 2,
            fill: false,
          }, {
            data: qwat,
            label: "Contribuição da água",
            backgroundColor: 'rgba(11, 158, 45, 0.2)',
            borderColor: 'rgba(11, 158, 45, 1)',
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
              textAlign: 'right',
              font: {
                size: 15
              },
              color: 'black',
              padding: 10,

            }
          },
          // title: {
          //   display: true,
          // },
        },
        scales: {
          
          y: {
            title: {
              display: true,
              text: 'Força Iônica',
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

  }, [alpha, ph]); // O efeito será disparado toda vez que o 'text' mudar
    
    
    return(
        <div >
        <p className="graph-title">
            Força Iônica 
        </p>
        <div class='graph-container'>
            <canvas ref={chartRef} /> 
        </div>    
        </div>

    );
}

export default BUFFERFUNCTION