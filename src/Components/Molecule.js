import "../assets/molecule.css";
import SmileDrawerContainer from "../Smilescontainer";
import React, { useState, useEffect, useRef } from "react";
import testeImage from '../data/image_molecules/teste.jpg';


const Molecule = ({smiles}) => {

  
  return (
    <>
      <div className="SMILES"></div>
      {/* {smiles ? <SmileDrawerContainer smilesStr={smiles} /> : null} */}
      <img src={testeImage} ></img>
    </>
  );
}
export default Molecule;