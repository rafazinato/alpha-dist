import "../assets/molecule.css";
import SmileDrawerContainer from "../Smilescontainer";
import data1 from "../data/Pasta1.csv";
import * as Papa from "papaparse";
import React, { useState, useEffect, useRef } from "react";


const Molecule = ({smiles}) => {
  
  return (
    <>
        <div className="SMILES">Estrutura mais protonada</div>
        <SmileDrawerContainer smilesStr={smiles} />
    </>

  );
};

export default Molecule;