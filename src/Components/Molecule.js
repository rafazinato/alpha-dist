import "../assets/molecule.css";
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";



const Molecule = ({smiles, url,showInput}) => {
  const [showeditor, setShowEditor] = useState(false);



function image() {
  return(
    <img className="image-container"  onClick={() => setShowEditor(true)} src={url} ></img>
  ) 
 
}
  return (
    <>
      <div className="SMILES"></div>
      {/* {smiles ? <SmileDrawerContainer smilesStr={smiles} /> : null} */}
      {showInput ? <p></p> : image() }
     <Modal
        onHide={() => setShowEditor(false)}
        show={showeditor}
        dialogClassName="modal-editor"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Imagem
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-image-container">
                <img className="image-container"  src={url} ></img>
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

    </>
  );
}
export default Molecule;