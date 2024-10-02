import React, { useState } from "react";
import "../assets/molecule.css";
import SmileDrawerContainer from "../Smilescontainer";


const Molecule = () => {
 

  return (
    <>
        <div className="SMILES">Estrutura mais protonada</div>
        <SmileDrawerContainer smilesStr={'cccccccccc'} />
    </>

  );
};

export default Molecule;