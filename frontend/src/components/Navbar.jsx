import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">🛒 PregShop's</div>
      <div className="links">
        <Link to="/">Início</Link>
        <Link to="/produtos">Meus Produtos</Link>
      </div>
    </nav>
  );
}

export default Navbar;