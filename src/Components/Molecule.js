import "../assets/molecule.css";
import SmileDrawerContainer from "../Smilescontainer";
import React, { useState, useEffect, useRef } from "react";
import testeImage from '../data/image_molecules/teste.jpg';


const Molecule = ({smiles, url}) => {

  
  return (
    <>
      <div className="SMILES"></div>
      {/* {smiles ? <SmileDrawerContainer smilesStr={smiles} /> : null} */}
      <img className="image-container" src={url} ></img>
    </>
  );
}
export default Molecule;