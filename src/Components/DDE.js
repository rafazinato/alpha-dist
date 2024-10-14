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

function DDE({compound}) {

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null); // Ref para armazenar a instância do gráfico    
    const pka = [Number(compound.pka1), Number(compound.pka2), Number(compound.pka3)].filter(v=>v!=0);

    // console.log(pka)

    // let ph = arange(0, 14, .05);
    let ph = arange(Math.floor(Math.min(...pka) - 3), Math.ceil(Math.max(...pka) + 3), .05);

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
            label: 'Alfa 0',
            data: a0,
            backgroundColor: 'rgba(3, 119, 252, 0.2)',
            borderColor: 'rgba(3, 119, 252, 1)',
            borderWidth: 2,
            fill: false,
          },{
            label: 'Alfa 1',
            data: a1,
            backgroundColor: 'rgba(252, 177, 3, 0.2)',
            borderColor: 'rgba(252, 177, 3, 1)',
            borderWidth: 2,
            fill: false,
          },{
            label: 'Alfa 2',
            data: a2,
            backgroundColor: 'rgba(11, 158, 45, 0.2)',
            borderColor: 'rgba(11, 158, 45, 1)',
            borderWidth: 2,
            fill: false,
          },{
            label: 'Alfa 3',
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
          },
          title: {
            display: true,
            text: 'Gráfico de Seleção de Compostos',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
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
        <>
        <p>
            Diagrama de distribuição de espécies
        </p>
        <div  class='graph'>
            <canvas  ref={chartRef} width={7} height={3.7} />
        </div>    
        </>

    );
}

export default DDE