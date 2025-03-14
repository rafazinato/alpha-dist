import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../assets/graphs.css";
import zoomPlugin from "chartjs-plugin-zoom";
import { useMemo } from "react";
import GraphComponent from "./GraphComponent";

Chart.register(zoomPlugin); // REGISTER PLUGIN

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}

function VANSYKLE({
  compound,
  alfascharge,
  chosenconc,
  needupdate,
  setNeedUpdate,
  alfascharge_user,
  pkauser,
  showInput,
}) {
  // State que contém dados usados no gráfico

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Ref para armazenar a instância do gráfico
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

  let ph = arange(0, 14, 0.1);
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
  let a4 = alpha.map((a) => a[4]);
  let a5 = alpha.map((a) => a[5]);
  let a6 = alpha.map((a) => a[6]);
  let a7 = alpha.map((a) => a[7]);
  let a8 = alpha.map((a) => a[8]);

  // criando o cálculo da carga efetiva
  let alpha_list = [a0, a1, a2, a3, a4, a5, a6, a7, a8];
  let ph_before = [];
  let wat = 0;
  let wat_before = 0;
  let each_charge = 0;
  // let effective_charge = [];

  if (Array.isArray(ph) && ph.length > 0) {
    ph_before = ph.map((ph) => ph - 0.1);
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
  let a4b = alpha_before.map((a) => a[4]);
  let a5b = alpha_before.map((a) => a[5]);
  let a6b = alpha_before.map((a) => a[6]);
  let a7b = alpha_before.map((a) => a[7]);
  let a8b = alpha_before.map((a) => a[8]);
  let alpha_list_before = [a0b, a1b, a2b, a3b, a4b, a5b, a6b, a7b, a8b];
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
  
  let phbuffer = arange(0.1, 14, 0.1);
  // phbuffer.shift()
  // console.log(buffer)
  // console.log(ph)
  const [showKoltOff, setShowKoltoff] = useState(true);
  const [graph_title, setGraphTitle] = useState([
    "Van Slyke's buffer power",
  ]);

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
  const [max_default_y_axis, setMaxDefaultYaxis] = useState(
    Number(Math.max(...buffer) * 1.1)
  );
  const [initial_limits, setInitialLimits] = useState([
    0,
    14,
    0,
    max_default_y_axis,
  ]);
  const [initial_limits_user, setInitialLimitsUser] = useState([
    0,
    14,
    0,
    max_default_y_axis,
  ]);
  //           initial_limits={[0, 14, 0, max_default_y_axis]}

  // calculando koltoff
  let ph_koltoff = ph.map((ph) => ph - 1);
  let koltoff_alpha = ph_koltoff.map((ph) => calcAlpha(ph, pka));

  let a0k = koltoff_alpha.map((a) => a[0]);
  let a1k = koltoff_alpha.map((a) => a[1]);
  let a2k = koltoff_alpha.map((a) => a[2]);
  let a3k = koltoff_alpha.map((a) => a[3]);
  let a4k = koltoff_alpha.map((a) => a[4]);
  let a5k = koltoff_alpha.map((a) => a[5]);
  let a6k = koltoff_alpha.map((a) => a[6]);
  let a7k = koltoff_alpha.map((a) => a[7]);
  let a8k = koltoff_alpha.map((a) => a[8]);
  let alpha_list_koltoff = [a0k, a1k, a2k, a3k, a4k, a5k, a6k, a7k, a8k];
  // let ph_koltoff_wat = arange(0.5, 14.5, 0.1)
  // let water_contribution_koltoff = ph.map((ph) => Math.abs((10**(-ph) - 10**(ph - pKw)) - (10 **(-(ph-1)) - 10 ** (ph-1 - pKw))) )
  
  let water_contribution_koltoff = ph.map((ph) => Math.abs((10**(-ph+1) - 10**(ph + 1 - pKw)) - (10 **(-(ph)) - 10 ** (ph - pKw))) )

  let each_charge_koltoff = ph_koltoff.map((ph, phindex) =>
    alfascharge.map(
      (charge, index) =>
        Number(charge) * Number(alpha_list_koltoff[index][phindex])
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
  let koltoff = ph.map((ph, idx) =>
    Math.abs(
      effective_charge[idx] * chosenconc -
        effective_charge_koltoff[idx] * chosenconc
    )
  );
  // Calculando τ (Buffering Fuction)

  let buffering_funtion = effective_charge.map(
    (e, idx) => chosenconc * e + wat[idx]
  );
  //  buffering_funtion = buffering_funtion.map(e => Math.abs(e))
  // Criando o gráfico

  const [graph_data, setGraphData] = useState();

  let buffer_total = buffer.map((e,idx) => e + water_contribution[idx])
  let koltoff_total = koltoff.map((e,idx) => e + water_contribution_koltoff[idx])
  // console.log(ph)
  


  let initial_sum_water_buffer = [];
  let sum_water_buffer = [];
  if (buffer && water_contribution) {
    initial_sum_water_buffer = water_contribution.map(
      (element, idx) => element + buffer[idx]
    );
  }
  if (buffer && water_contribution) {
    sum_water_buffer = buffer.map(
      (element, idx) => element + water_contribution[idx]
    );
  }

  // Código de variaveis para o gráfico do user

  let alpha_user = ph.map((ph) => calcAlpha(ph, pkauser));
  let a0_user = alpha_user.map((a) => a[0]);
  let a1_user = alpha_user.map((a) => a[1]);
  let a2_user = alpha_user.map((a) => a[2]);
  let a3_user = alpha_user.map((a) => a[3]);
  let a4_user = alpha_user.map((a) => a[4]);
  let a5_user = alpha_user.map((a) => a[5]);
  let a6_user = alpha_user.map((a) => a[6]);
  let a7_user = alpha_user.map((a) => a[7]);
  let a8_user = alpha_user.map((a) => a[8]);

  let alpha_list_user = [
    a0_user,
    a1_user,
    a2_user,
    a3_user,
    a4_user,
    a5_user,
    a6_user,
    a7_user,
    a8_user,
  ];
  let each_charge_user = [];
  if (Array.isArray(alfascharge_user)) {
    each_charge_user = ph.map((ph, phindex) =>
      alfascharge_user.map(
        (charge, index) =>
          Number(charge) * Number(alpha_list_user[index][phindex])
      )
    );
  }

  let effective_charge_user = useMemo(() => {
    const tempReference = [];
    each_charge_user.forEach((num) => {
      tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
    });
    return tempReference;
  }, [each_charge_user]);

  let buffer_user = useMemo(() => {
    const tempReference = [];
    for (let i = 1; i < ph.length; i++) {
      tempReference.push(
        Math.abs(
          ((effective_charge_user[i] - effective_charge_user[i - 1]) * chosenconc) /
            (ph[i] - ph[i - 1])
        )
      );
    }
    return tempReference;
  }, [chosenconc, ph, effective_charge_user]);

  let ph_koltoff_user = ph.map((ph) => ph - 1);
  let koltoff_alpha_user = ph_koltoff_user.map((ph) => calcAlpha(ph, pkauser));

  let a0k_user = koltoff_alpha_user.map((a) => a[0]);
  let a1k_user = koltoff_alpha_user.map((a) => a[1]);
  let a2k_user = koltoff_alpha_user.map((a) => a[2]);
  let a3k_user = koltoff_alpha_user.map((a) => a[3]);
  let a4k_user = koltoff_alpha_user.map((a) => a[4]);
  let a5k_user = koltoff_alpha_user.map((a) => a[5]);
  let a6k_user = koltoff_alpha_user.map((a) => a[6]);
  let a7k_user = koltoff_alpha_user.map((a) => a[7]);
  let a8k_user = koltoff_alpha_user.map((a) => a[8]);
  let alpha_list_koltoff_user = [
    a0k_user,
    a1k_user,
    a2k_user,
    a3k_user,
    a4k_user,
    a5k_user,
    a6k_user,
    a7k_user,
    a8k_user,
  ];
  let each_charge_koltoff_user = [];
  if (Array.isArray(alfascharge_user)) {
    each_charge_koltoff_user = ph.map((ph, phindex) =>
      alfascharge_user.map(
        (charge, index) =>
          Number(charge) * Number(alpha_list_koltoff_user[index][phindex])
      )
    );
  }
  
  let effective_charge_koltoff_user = useMemo(() => {
    let tempReference = [];
    each_charge_koltoff_user.forEach((num) => {
      tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
    });
    return tempReference;
  }, [each_charge_koltoff_user]);

  let koltoff_user = ph.map((ph, idx) =>
    Math.abs(
      effective_charge_user[idx] * chosenconc -
        effective_charge_koltoff_user[idx] * chosenconc
    )
  );

  let buffering_funtion_user = effective_charge_user.map(
    (e, idx) => chosenconc * e + wat[idx]
  );
  let sum_water_buffer_user = [];
  if (buffer_user && water_contribution) {
    initial_sum_water_buffer = water_contribution.map(
      (element, idx) => element + buffer_user[idx]
    );
  }
  if (buffer_user && water_contribution) {
    sum_water_buffer_user = water_contribution.map(
      (element, idx) => element + buffer_user[idx]
    );
  }
  
  let buffer_total_user = buffer_user.map((e,idx) => e + water_contribution[idx])
  let koltoff_user_total = koltoff_user.map((e,idx) => e + water_contribution_koltoff[idx])
  const [graph_data_user, setGraphData_user] = useState([buffer_total_user, buffer_user,water_contribution]);
 
  // buffer_total_user.forEach(element => {
  //   if (element >  initial_limits_user[3]) {
  //     setInitialLimitsUser([0, 14, 0, 1.1 * buffer_user.reduce((a, b) => Math.max(a, b), -Infinity)])
  //   }
  // });
  useEffect(() => {
    if (graph_data !== ([buffer_total_user, buffer_user, water_contribution]) && graph_title[0] === "Van Slyke's buffer power") {
      setInitialLimitsUser([0, 14, 0, 1.1 * buffer_user.reduce((a, b) => Math.max(a, b), -Infinity)])
    };
    if (graph_data !== ([koltoff_user_total, koltoff_user, water_contribution]) && graph_title[0] === "Kolthoff's buffer capacity") {
      setInitialLimitsUser([0, 14, 0, 1.1 * koltoff_user.reduce((a, b) => Math.max(a, b), -Infinity)])
    }
    if (graph_data !== ([buffering_funtion_user]) && graph_title[0] === "Buffering Function") {
      setInitialLimitsUser([0, 14, Math.min(buffering_funtion_user), 1.1 * buffering_funtion_user.reduce((a, b) => Math.max(a, b), -Infinity)])

    };
  },[pkauser])

  useEffect(() => {
    changeGraphToVanSykle()
  },[chosenconc])
  
  console.log(koltoff.reduce((a, b) => Math.max(a, b), -Infinity))
  function changeGraphToKoltoff() {
    setGraphData(koltoff);
    setGraphData_user(koltoff_user)
  
    setMaxDefaultYaxis(1.1 * koltoff.reduce((a, b) => Math.max(a, b), -Infinity));
    setInitialLimits([0, 14, 0, 1.1 * koltoff.reduce((a, b) => Math.max(a, b), -Infinity)]);
    setInitialLimitsUser([0, 14, 0, 1.1 * koltoff_user.reduce((a, b) => Math.max(a, b), -Infinity)])

    setGraphTitle(["Kolthoff's buffer capacity"]);
  }

  function changeGraphToVanSykle() {
    setGraphData(buffer);
    setGraphData_user(buffer_user)
    setMaxDefaultYaxis(1.2 * Math.max(koltoff));
    setInitialLimits([0, 14, 0, 1.1 * buffer.reduce((a, b) => Math.max(a, b), -Infinity)]);
    setInitialLimitsUser([0, 14, 0, 1.1 * buffer_user.reduce((a, b) => Math.max(a, b), -Infinity)])
    setGraphTitle(["Van Slyke's buffer power"]);
  }
  function changeGraphToSumVanSykle() {
    setGraphData(buffer.map((e,idx) => (e + water_contribution[idx])));
    setGraphData_user(sum_water_buffer_user);
    setMaxDefaultYaxis(1.2 * Math.max(sum_water_buffer));
    setInitialLimits([0, 14, 0, max_default_y_axis]);
    setGraphTitle(["Capacity of Buffer + Water contribuition"]);
  }

  function changeGraphBufferingFunction() {
    setGraphData(buffering_funtion);
    setGraphData_user(buffering_funtion_user);
    setMaxDefaultYaxis(1.1 * Math.max(buffering_funtion));
    setInitialLimits([0, 14, Math.min(buffering_funtion), 1.1 * buffering_funtion.reduce((a, b) => Math.max(a, b), -Infinity)]);
    setInitialLimitsUser([0, 14, Math.min(buffering_funtion_user), 1.1 * buffering_funtion_user.reduce((a, b) => Math.max(a, b), -Infinity)])
    setGraphTitle(["Buffering Function"]);
  }
  

  const getCalculatedData_user = () => {
    if (showInput) {
      if (graph_data !== ([buffer_total_user, buffer_user, water_contribution]) && graph_title[0] === "Van Slyke's buffer power") return ([buffer_total_user, buffer_user, water_contribution]);
      if (graph_data !== ([koltoff_user_total, koltoff_user, water_contribution]) && graph_title[0] === "Kolthoff's buffer capacity") return ([koltoff_user_total, koltoff_user, water_contribution]);
      if (graph_data !== ([buffering_funtion_user]) && graph_title[0] === "Buffering Function") return [buffering_funtion_user,null,null];

    }
    return graph_data_user; // Retorna o estado atual se nada mudou
  };
  
  const graphDataToRender_user = getCalculatedData_user();

  
  const getCalculatedDataTotal = () => {

      if (graph_data !== ([buffer_total, buffer, water_contribution]) && graph_title[0] === "Van Slyke's buffer power") return ([buffer_total, buffer, water_contribution]);
      if (graph_data !== ([koltoff_total, koltoff, water_contribution_koltoff]) && graph_title[0] === "Kolthoff's buffer capacity") return ([koltoff_total, koltoff, water_contribution_koltoff]);
      if (graph_data !== ([buffering_funtion]) && graph_title[0] === "Buffering Function") return [buffering_funtion,null,null];

    return graph_data; // Retorna o estado atual se nada mudou
  };
  
  const graphDataToRender = getCalculatedDataTotal();
  let y_data = [
    {
      label: "Total",
      data: graphDataToRender[0],
      backgroundColor: "rgba(219, 18, 18, 0.2)",
      borderColor: "rgba(219, 18, 18, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "Sistema",
      data: graphDataToRender[1],
      backgroundColor: "rgba(11, 158, 45, 0.2)",
      borderColor: "rgba(11, 158, 45, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "Água",
      data: graphDataToRender[2],
      backgroundColor: "rgba(3, 119, 252, 0.2)",
      borderColor: "rgba(3, 119, 252, 1)",
      borderWidth: 2,
      fill: false,
    },
  ];

y_data = y_data.filter(item => item.data)
  let y_data_user = [
    {
      label: "Total",
      data: graphDataToRender_user[0],
      backgroundColor: "rgba(219, 18, 18, 0.2)",
      borderColor: "rgba(219, 18, 18, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "Sistema",
      data: graphDataToRender_user[1],
      backgroundColor: "rgba(11, 158, 45, 0.2)",
      borderColor: "rgba(11, 158, 45, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "Água",
      data: graphDataToRender_user[2],
      backgroundColor: "rgba(3, 119, 252, 0.2)",
      borderColor: "rgba(3, 119, 252, 1)",
      borderWidth: 2,
      fill: false,
    },
  ];
  y_data_user = y_data_user.filter(item => item.data)
  useEffect(() => {
    if (needupdate) {
      if (buffer) {
        setGraphData(buffer);
        setGraphData_user(buffer_user)
        setMaxDefaultYaxis(1.2 * Math.max(buffer));
        setInitialLimits([0, 14, 0, max_default_y_axis]);
        setGraphTitle(["Van Slyke's buffer power"]);
      } 
      // else {
      //   setGraphData(buffer);
      // }
      setNeedUpdate(false);
    }
  },[needupdate, buffer, setNeedUpdate, buffer_user]);
  
  return (
    <div>
      {/* <div style={{display: 'flex', justifyContent: 'center'}}>
        <p className="graph-title">{graph_title[0]}</p>
      </div> */}

      <div class="graph-container">
        {/* <canvas ref={chartRef} /> */}
        {showInput ? (
        <GraphComponent
        x_data={(Array.isArray(graphDataToRender) && 
          graphDataToRender.length === 3 &&
          graphDataToRender[0] === buffer_total_user &&
          graphDataToRender[1] === buffer_user &&
          graphDataToRender[2] === water_contribution) ? phbuffer : ph}
        y_data={y_data_user}
        y_title={graph_title}
        initial_limits={initial_limits_user}
        graph_title={graph_title}
        depedency={chosenconc}
      />
        ) : (
          <GraphComponent
          x_data={(Array.isArray(graphDataToRender) && 
            graphDataToRender.length === 3 &&
            graphDataToRender[0] === buffer_total &&
            graphDataToRender[1] === buffer &&
            graphDataToRender[2] === water_contribution) ? phbuffer : ph}
          // x_data={ph}
          y_data={y_data}
          y_title={graph_title}
          initial_limits={initial_limits}
          graph_title={graph_title}
          depedency={chosenconc}
        />
        )}

      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="grid-buttons">
          <button
            className="change-graph-button"
            onClick={() => changeGraphToVanSykle()}
          >
            Van Slyke's buffer power
          </button>
          <button
            className="change-graph-button"
            onClick={() => changeGraphToKoltoff()}
          >
            Kolthoff's buffer capacity
          </button>
          {/* <button
            className="change-graph-button"
            onClick={() => changeGraphToSumVanSykle()}
          >
            Capacity of Buffer + Water contribuition
          </button> */}
          <button
            className="change-graph-button"
            onClick={() => changeGraphBufferingFunction()}
          >
            Buffering Funtion
          </button>
        </div>
      </div>
    </div>
  );
}

export default VANSYKLE;
