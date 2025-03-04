import { useEffect,useState } from "react";
import Nav from "../Components/Nav.js";
import Footer from "../Components/Footer.js";
import YouTube from 'react-youtube';
import "../assets/tutorial.css";
function Tutorial() {

        const opts = {
          height: '700',
          width: '1100',
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
          },
        };

    return (
      <>
        <div>
          <Nav />
        </div>
        <div className="title">Vídeo explicativo</div>
        <div className="video-container">
        <YouTube videoId="VSGyiYLQwhY" opts={opts}  />
        </div>
        <Footer />
      </>
    );
  }
  
  export default Tutorial;
