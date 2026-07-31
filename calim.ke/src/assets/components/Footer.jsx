// Footer.jsx renders the site footer with branding
// and copyright text that appears on every page.
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>CALIM / KE</h2>
          <p>Wear confidence. Move with intent.</p>
          <p>Streetwear-born essentials shaped for the city and the coast.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} CALIM. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer;