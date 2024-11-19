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

function VANSYKLE({compound,alfascharge,chosenconc}) {

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null); // Ref para armazenar a instância do gráfico    
    const pka = [Number(compound.pka1), Number(compound.pka2), Number(compound.pka3)].filter(v=>v!=0);


    let ph = arange(0, 14, .05);
    // let ph = arange(Math.floor(Math.min(...pka) - 3), Math.ceil(Math.max(...pka) + 3), .05);

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
    let pKw = 14 

    let a0 = alpha.map(a => a[0])
    let a1 = alpha.map(a => a[1])
    let a2 = alpha.map(a => a[2])
    let a3 = alpha.map(a => a[3])

    // criando o cálculo da carga efetiva
    let alpha_list = [a0,a1,a2,a3]
    let ph_before = [] 
    let wat = 0
    let wat_before = 0
    let each_charge = 0
    let effective_charge = [];


    if (Array.isArray(ph) && ph.length > 0) {
        ph_before = ph.map(ph => ph - 0.05)
        wat = ph.map((ph) => (10**(-ph) - 10**(ph - pKw)))
        wat_before = ph_before.map(ph_before => (10**(-ph_before) - 10**(ph_before - pKw)))

        // calculando a carga efetiva atual
        each_charge = ph.map((ph,phindex) => (alfascharge.map((charge,index) => Number(charge)*Number(alpha_list[index][phindex]))))
        each_charge.forEach( num => {
            effective_charge.push(num.reduce((acc, curr) => acc + curr, 0))   
        })


    }

    let alpha_before = calcAlpha(ph_before,pka)
    let buffer = []
        // // Van Slyke’s buffer


        let a0b = alpha_before.map(a => a[0])
        let a1b= alpha_before.map(a => a[1])
        let a2b = alpha_before.map(a => a[2])
        let a3b = alpha_before.map(a => a[3])
        let alpha_list_before = [a0b,a1b,a2b,a3b]
        let each_charge_before = ph_before.map((_, phindex) => 
            alfascharge.map((charge, index) => Number(charge) * Number(alpha_list_before[index][phindex]))
        );
    
            // calculate effective_charge_before  using forEach() method
            let effective_charge_before = each_charge_before.map(num => 
                num.reduce((acc, curr) => acc + curr, 0)
            );

let water_contribution = []
            for (let i = 1; i < ph.length; i++) {
                water_contribution.push(Math.abs( ( wat[i] - wat_before[i]) )/(ph[i] - ph[i-1]))
                buffer.push(Math.abs(
                    ((effective_charge[i] - effective_charge[i-1]) * chosenconc ) / (ph[i] - ph[i-1]))
                );
            }
let max_default_y_axis = Number(Math.max(...buffer)*1.1)


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
            data: buffer,
            label: "Van Slyke’s buffer value",
            backgroundColor: 'rgba(3, 119, 252, 0.2)',
            borderColor: 'rgba(3, 119, 252, 1)',
            borderWidth: 2,
            fill: false,
          },
          {
            data: water_contribution,
            label: "Contribuição da água",
            backgroundColor: 'rgba(219, 18, 18, 0.2)',
            borderColor: 'rgba(219, 18, 18, 1)',
            borderWidth: 2,
            fill: false,
          },
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
              text: 'Van Slyke’s buffer value',
              color: 'black',
              font: {
                family: 'Inter',
                size: '12px',
              }
            },
            beginAtZero: true,
            max: max_default_y_axis
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

  }, [alpha, ph]); 
    
    
    return(
        <div >
        <p className="graph-title">
          Van Slyke’s buffer value
        </p>
        <div class='graph-container'>
            <canvas ref={chartRef} /> 
        </div>    
        </div>

    );
}

export default VANSYKLE