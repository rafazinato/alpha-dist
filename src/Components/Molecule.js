import "../assets/molecule.css";
import SmileDrawerContainer from "../Smilescontainer";
import React, { useState, useEffect, useRef } from "react";
import testeImage from '../data/image_molecules/teste.jpg';


const Molecule = ({smiles, url,showInput}) => {

function image() {
  return(
    <img className="image-container" src={url} ></img>
  ) 
 
}
  return (
    <>
      <div className="SMILES"></div>
      {/* {smiles ? <SmileDrawerContainer smilesStr={smiles} /> : null} */}
      {showInput ? <p></p> : image() }
    </>
  );
}
export default Molecule;