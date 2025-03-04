import "../assets/systemselection.css";
import "material-symbols";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";

import Select from "react-select";


function SystemSelection({
  setCompound,
  compound,
  data,
  datasets,
  selectedDataset,
  setSelectedDataset,
  needupdate,
  setNeedUpdate,
}) {

  const Checkbox = ({ children, ...props }) => (
    <label style={{ marginRight: '1em' }}>
      <input type="checkbox" {...props} />
      {children}
    </label>
  );

// function WhenChecked() {
//   setSelectedOption(listCategory.map((item) => ({
//     value: item,
//     label: item,
//   })))

// }

// if (isChecked == true) {
//   setSelectedOption(listCategory.map((item) => ({
//     value: item,
//     label: item,
//   })))
// }

const [isChecked,setIsChecked] = useState(false)





  // Compostos que irão aparecer no menu de selecão select
  const [listName, setListName] = useState(
    data.map((compounds, index) => compounds.sistema)
  );
  let initial_list = data.map((compounds, index) => compounds.sistema);
  let listCategory = [...new Set(data.map((item) => item.categoria))];
  listCategory = listCategory.sort()
  let options_object = listCategory.map((item) => ({
    value: item,
    label: item,
  }));
  const [selectedOption, setSelectedOption] = useState(null);

  // listCategory.unshift("Todos");
  const handleId = (i) => {
    let chemical = i ? i.value : null;
    let idx = data.findIndex((item) => item.sistema === chemical);
    setCompound({
      categoria: data[idx].categoria,
      name: data[idx].sistema,
      charge_protonated: data[idx].carga_máxima,
      pka1: data[idx].pK1,
      pka2: data[idx].pK2,
      pka3: data[idx].pK3,
      pka4: data[idx].pK4,
      pka5: data[idx].pK5,
      pka6: data[idx].pK6,
      pka7: data[idx].pK7,
      pka8: data[idx].pK8,
      smiles: data[idx].smiles_string,
      img_url: data[idx].smile_image,
      referencia: data[idx].reference,
    });
    setNeedUpdate(true);
  };
  // modo antigo
  // function handleListName(i) {
  //   if (i !== "Todos") {
  //       setListName((data.map((compounds, index) => ( i === compounds.categoria ?  compounds.sistema : null))).filter((v) => v !== null));

  //   } else {
  //       setListName(data.map((compounds, index) => compounds.sistema).filter((v) => v !== null));
  //       console.log(i)

  //   }
  // }

  let list_dataselect = selectedOption 
    ? selectedOption.map((obj) => obj.value)
    : [];
  let compound_option = list_dataselect.map((i) =>
    data
      .map((compounds, index) =>
        i === compounds.categoria ? compounds.sistema : null
      )
      .filter((v) => v !== null)
  );
  compound_option = compound_option.flat();
  compound_option = compound_option.map((item) => ({
    value: item,
    label: item,
  }));

let default_compound_option = (data.map((compounds,idx) => ( compounds.categoria === "geral" ?  compounds.sistema : null ))).filter((v) => v !== null)
default_compound_option = default_compound_option.map((item) => ({
  value: item,
  label: item,
}));

// options_object = options_object.unshift({value: 'Todos', label: "Todos" })


function handleDataBaseSelection(e) {
  setSelectedOption(e)
  setIsChecked(false)
}


const handleCheckboxChange = (e) => {
  const newChecked = e.target.checked;
  setIsChecked(newChecked);
  let OlderSelectedOption = selectedOption
  if (newChecked) {
    // Se estiver marcado, seleciona todas as categorias

    setSelectedOption(listCategory.map((item) => ({
      value: item,
      label: item,
    })));
  } else {
    // Se estiver desmarcado, limpa a seleção
    setSelectedOption(OlderSelectedOption)
  }
};

  return (
    <>
      {/* <div className="selection-grip">


      </div>
     */}
    <div className="selector">
      <div >
        <div >Seleção de base de dados:</div>
        <div>

        <Select
          // onChange={setSelectedOption}
          onChange={handleDataBaseSelection}
          isMulti
          name="colors"
          options={options_object}
          className="basic-multi-select"
          classNamePrefix="select"

        />
                <div
        style={{
          color: 'hsl(0, 0%, 40%)',
          display: 'inline-block',
          fontSize: 12,
          fontStyle: 'italic',
          marginTop: '1em',
        }}
      >
        <Checkbox
          checked={isChecked}
          onChange={handleCheckboxChange} style={{marginRight: '3px'}}
        > 
           Selecionar todas as bases de dados
        </Checkbox>
      </div>
        </div>
      </div>

      <div >
        <div >Seleção de sistema:</div>
        <div >
        <Select
          
          defaultValue={{value:'cítrico - ácido', label:"cítrico - ácido"}}
          onChange={handleId}
          name="colors"
          options={compound_option}
          className="basic-multi-select"
          classNamePrefix="select"
        />
        </div>
      <div>Fonte: {compound ? compound.referencia : null}</div>
      </div>
    </div>
    </>
  );
}

export default SystemSelection;
