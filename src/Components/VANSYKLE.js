import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../assets/graphs.css";
import zoomPlugin from "chartjs-plugin-zoom";
import { useMemo } from "react";
Chart.register(zoomPlugin); // REGISTER PLUGIN

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}

function VANSYKLE({ compound, alfascharge, chosenconc }) {

  // State que contém dados usados no gráfico


  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Ref para armazenar a instância do gráfico
  const pka = [
    Number(compound.pka1),
    Number(compound.pka2),
    Number(compound.pka3),
  ].filter((v) => v !== 0);

  let ph = arange(0, 14, 0.05);

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

  let alpha = ph.map((ph) => calcAlpha(ph, pka));
  let pKw = 14;

  let a0 = alpha.map((a) => a[0]);
  let a1 = alpha.map((a) => a[1]);
  let a2 = alpha.map((a) => a[2]);
  let a3 = alpha.map((a) => a[3]);

  // criando o cálculo da carga efetiva
  let alpha_list = [a0, a1, a2, a3];
  let ph_before = [];
  let wat = 0;
  let wat_before = 0;
  let each_charge = 0;
  // let effective_charge = [];

  if (Array.isArray(ph) && ph.length > 0) {
    ph_before = ph.map((ph) => ph - 0.05);
    wat = ph.map((ph) => 10 ** -ph - 10 ** (ph - pKw));
    wat_before = ph_before.map(
      (ph_before) => 10 ** -ph_before - 10 ** (ph_before - pKw)
    );

    // calculando a carga efetiva atual
    each_charge = ph.map((ph, phindex) =>
      alfascharge.map(
        (charge, index) => Number(charge) * Number(alpha_list[index][phindex])
      )
    );

    // Calculando cada carga sem utilizar o useMemo
    // each_charge.forEach((num) => {
    //   effective_charge.push(num.reduce((acc, curr) => acc + curr, 0));
    // });
  }
  let effective_charge = useMemo(() => {
    let tempReference = [];
    each_charge.forEach((num) => {
      tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
    });
    return tempReference;
  }, [each_charge]);
  let alpha_before = calcAlpha(ph_before, pka);

  // Van Slyke’s buffer

  let a0b = alpha_before.map((a) => a[0]);
  let a1b = alpha_before.map((a) => a[1]);
  let a2b = alpha_before.map((a) => a[2]);
  let a3b = alpha_before.map((a) => a[3]);
  let alpha_list_before = [a0b, a1b, a2b, a3b];
  let each_charge_before = ph_before.map((_, phindex) =>
    alfascharge.map(
      (charge, index) =>
        Number(charge) * Number(alpha_list_before[index][phindex])
    )
  );

  // calculate effective_charge_before  using forEach() method
  let effective_charge_before = each_charge_before.map((num) =>
    num.reduce((acc, curr) => acc + curr, 0)
  );

  // let water_contribution = [];
  // let buffer = [];
  let water_contribution = useMemo(() => {
    const tempReference = [];
    for (let i = 1; i < ph.length; i++) {
      tempReference.push(
        Math.abs(wat[i] - wat_before[i]) / (ph[i] - ph[i - 1])
      );
    }
    return tempReference;
  }, [ph, wat, wat_before]);
  let buffer = useMemo(() => {
    const tempReference = [];
    for (let i = 1; i < ph.length; i++) {
      tempReference.push(
        Math.abs(
          ((effective_charge[i] - effective_charge[i - 1]) * chosenconc) /
            (ph[i] - ph[i - 1])
        )
      );
    }
    return tempReference;
  }, [chosenconc, ph, effective_charge]);

  const [graph_data, setGraphData] = useState()
  const [showKoltOff, setShowKoltoff] = useState(true)
  const [graph_title, setGraphTitle] = useState(["Van Slyke’s buffer value","Kolthoff"])
  // useEffect(() => {
  // setGraphData(buffer)
  // },[buffer]
  // )


  // for (let i = 1; i < ph.length; i++) {
  //   water_contribution.push(
  //     Math.abs(wat[i] - wat_before[i]) / (ph[i] - ph[i - 1])
  //   );
  //   buffer.push(
  //     Math.abs(
  //       ((effective_charge[i] - effective_charge[i - 1]) * chosenconc) /
  //         (ph[i] - ph[i - 1])
  //     )
  //   );
  // }
  let max_default_y_axis = Number(Math.max(...buffer) * 1.1);


  // calculando koltoff
  let ph_koltoff = ph.map(ph => ph -1) 
  let koltoff_alpha = ph_koltoff.map((ph) => calcAlpha(ph, pka));

  let a0k = koltoff_alpha.map((a) => a[0]);
  let a1k = koltoff_alpha.map((a) => a[1]);
  let a2k = koltoff_alpha.map((a) => a[2]);
  let a3k = koltoff_alpha.map((a) => a[3]);
  let alpha_list_koltoff = [a0k, a1k, a2k, a3k];

  let each_charge_koltoff = ph_koltoff.map((ph, phindex) =>
    alfascharge.map(
      (charge, index) => Number(charge) * Number(alpha_list_koltoff[index][phindex])
    )
  );
  let effective_charge_koltoff = useMemo(() => {
    let tempReference = [];
    each_charge_koltoff.forEach((num) => {
      tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
    });
    return tempReference;
  }, [each_charge_koltoff]);
  // let koltoff = ((wat + effective_charge*chosenconc) -(10**(-(chosenph-1) - 10**(chosenph -1 - pKw) + effective_charge_koltoff*chosenconc)))
  // let koltoff = ph.map((ph,idx) => Math.abs(wat[idx] + effective_charge[idx]*chosenconc -((10**(-(ph -0.5))) - 10**(ph -0.5 - pKw) + effective_charge_koltoff[idx]*chosenconc)))
  let koltoff = ph.map((ph,idx) => Math.abs( effective_charge[idx]*chosenconc - effective_charge_koltoff[idx]*chosenconc))

  // Criando o gráfico
  console.log(koltoff)

  // Efeito para criar ou atualizar o gráfico sempre que 'text' for atualizado
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroi o gráfico anterior antes de criar o novo
    }

    const ctx = chartRef.current.getContext("2d");

    // Cria o novo gráfico de linha
    chartInstanceRef.current = new Chart(ctx, {
      type: "line", // Tipo de gráfico
      data: {
        labels: ph ? ph : [0],
        datasets: [
          {
            data: graph_data || buffer,
            label: graph_title[0],
            backgroundColor: "rgba(3, 119, 252, 0.2)",
            borderColor: "rgba(3, 119, 252, 1)",
            borderWidth: 2,
            fill: false,
          },
          {
            data: water_contribution,
            label: "Contribuição da água",
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
          zoom: {
            pan: {
              enabled: false,
              mode: "xy",
              modifierKey: "shift",
              scaleMode: "xy",
            },
            zoom: {
              wheel: {
                enabled: false,
              },
              pinch: {
                enabled: false,
              },
              mode: "xy",
            },
          },

          legend: {
            display: true,
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
              text: "Van Slyke’s buffer value",
              color: "black",
              font: {
                family: "Inter",
                size: "12px",
              },
            },
            beginAtZero: true,
            max: max_default_y_axis,
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
  }, [alpha, ph, buffer, max_default_y_axis, water_contribution,graph_data,graph_title]);
// criando função que muda entre van slke e koltoff

function changeGraphType() {
  if (showKoltOff) {
    setGraphData(koltoff)
    setShowKoltoff(!showKoltOff)
    setGraphTitle(["Kolthoff’ buffer value","Van Slyke"])
  }
  if (!showKoltOff) {
    setGraphData(buffer)
    setShowKoltoff(!showKoltOff)
    setGraphTitle(["Van Slyke’s buffer value","Kolthoff"])
  }

  
}
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <p className="graph-title">{graph_title[0]}</p>
        <button onClick={() => changeGraphType()}>{graph_title[1]}</button>
      </div>

      <div class="graph-container">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}

export default VANSYKLE;
