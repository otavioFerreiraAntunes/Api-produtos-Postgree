import { Link } from "react-router-dom";
import urlImagemDoGrupo from "../assests/Os Preguicinhas.jpg";

function Home() {
  return (
    <>
      <div className="home-container">
        <h1>Bem-vindo ao PregShop</h1>
        <p>O sistema de gestão de produtos mais rápido do mercado.</p>
        <Link to="/produtos" className="btn-primary">Acessar Produtos</Link>
      </div>
      <div className="home-image-container">
        <img src={urlImagemDoGrupo} alt="Membros do grupo PregShop sorrindo e trabalhando" className="group-image" />
        <p> Nossa equipe dedicada </p>
      </div>
    </>
  );
}

export default Home;