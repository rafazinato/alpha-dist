import Nav from "../Components/Nav.js";
import Footer from "../Components/Footer.js";
import "../assets/about.css";
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
              <p>
                Todo o mecanismo do AlphaDistWeb segue a óptica do método XXI,
                criado por André Fernando Oliveira, Uma de suas grandes
                vantagens dessa é a possibilidade de descrever a força de
                sistemas tamponantes utilizando apenas parâmetros do próprio
                sistema. Atualmente é professor do Departamento de Química na
                Universidade Federal de Viçosa, sendo a química analítica uma de
                suas principais áreas de pesquisa
              </p>
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
              <p>
                Essa ferramenta foi desenvolvida por Rafaela Zinato Pereira,
                atualmente estudante de Engenharia Química na Universidade
                Federal de Viçosa (UFV). Atualmente estagiária, no Laboratório
                de química analítica da UFV, sua principal atuação consiste em
                simular sistemas químicos por meio de linguagens de programação.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default About;
