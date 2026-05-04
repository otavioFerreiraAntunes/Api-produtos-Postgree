function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} <b>PregShop</b></p>
        <span>O sistema mais rápido do mercado.</span>
      </div>
    </footer>
  );
}

export default Footer;