import Nav from "../Components/Nav.js";
import Footer from "../Components/Footer.js";
import "../assets/about.css";
import { FaLinkedin, FaEnvelope } from "react-icons/fa6";
function About() {
  return (
    <>
      {/* NAV BAR */}
      <div>
        <Nav />
      </div>
      <div>
        <section>
          <div className="section-container">
            <div className="grid-item">
              <img
                src={process.env.PUBLIC_URL + "/logoalpha.png"}
                width="300px"
                alt=" "
              />
              <p>
                Assim como as versões do AlphaDist em planilha de Excel, o
                AlphaDistWeb tem como objetivo caracterizar sistemas de ácido
                base de Bronsted sob diferentes parâmetros. Seu grande
                diferencial é sua capacidade de descrever de diferentes bases de
                dados e concomitantemente descrever sistemas que são fornecidos
                pelo usuário. Além disso, destacam-se a sua flexibilidade e
                interatividade para configuração do sistema em diferentes
                parâmetros, como concentração e pH.
              </p>
            </div>
          </div>
        </section>
        <section>
          <div className="section-container">
            <div className="grid-item">
              <div>
                <p>
                  Todo o mecanismo do AlphaDistWeb segue a óptica do método XXI,
                  criado por André Fernando Oliveira, Uma de suas grandes
                  vantagens dessa é a possibilidade de descrever a força de
                  sistemas tamponantes utilizando apenas parâmetros do próprio
                  sistema. Atualmente é professor do Departamento de Química na
                  Universidade Federal de Viçosa, sendo a química analítica uma
                  de suas principais áreas de pesquisa
                </p>
                <div className="icons-container">
                  <a
                    href="https://www.linkedin.com/in/andre-fernando-oliveira-35887514/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin color="#014087" size={"1.5em"} />
                  </a>
                  <a href="mailto:andref.oliveira@ufv.br" className="link-without-style">
                    <FaEnvelope size={"1.5em"} />
                  </a>
                  <a
                    href="http://lattes.cnpq.br/6431782934661974"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  <img
                    src={process.env.PUBLIC_URL + "/images/latteslogo.png"}
                    width="21px"
                    alt="LATTES"
                  />
                  </a>
                </div>
              </div>
              <img
                className="rounded-image"
                src={process.env.PUBLIC_URL + "/images/andrefernando.jpg"}
                width="250px"
                alt=" "
              />
            </div>
          </div>
        </section>
        <section>
          <div className="section-container">
            <div className="grid-item">
            <img
                className="rounded-image"
                src={process.env.PUBLIC_URL + "/images/rafaelazinato.jpg"}
                width="250px"
                alt=" "
              />
              <div>

              <p>
                Essa ferramenta foi desenvolvida por Rafaela Zinato Pereira,
                atualmente estudante de Engenharia Química na Universidade
                Federal de Viçosa (UFV). Atualmente estagiária, no Laboratório
                de química analítica da UFV, sua principal atuação consiste em
                simular sistemas químicos por meio de linguagens de programação.
              </p>
              <div className="icons-container" style={{justifyContent: 'left'}}>
                  <a
                    href="https://www.linkedin.com/in/rafaela-zinato-b98614314/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin color="#014087" size={"1.5em"} />
                  </a>
                  <a href="mailto:rafaela.pereira1@ufv.br" className="link-without-style">
                    <FaEnvelope size={"1.5em"} />
                  </a>
                  <a
                    href="https://lattes.cnpq.br/0450526743496999"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  <img
                    src={process.env.PUBLIC_URL + "/images/latteslogo.png"}
                    width="21px"
                    alt="LATTES"
                  />
                  </a>
                </div>
              </div>
          </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default About;
