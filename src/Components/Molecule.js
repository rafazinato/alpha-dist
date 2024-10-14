import "../assets/molecule.css";
import SmileDrawerContainer from "../Smilescontainer";
import React, { useState, useEffect, useRef } from "react";


const Molecule = ({smiles}) => {

  
  return (
    <>
      <div className="SMILES">Estrutura mais protonada</div>
      {smiles ? <SmileDrawerContainer smilesStr={smiles} /> : null}
    </>
  );
}
export default Molecule;