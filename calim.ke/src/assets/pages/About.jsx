// About.jsx renders the brand story page,
// explaining CALIM's mission, vision, values, and heritage.
function About() {
  return (
    <section className="about-page">
      <div className="about-container">
        <h1>About CALIM</h1>

        <p className="about-intro">
          CALIM is more than a clothing brand—it's a lifestyle built on
          confidence, creativity, and authenticity. We believe what you wear
          should express who you are while providing comfort and quality for
          every occasion.
        </p>

        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            CALIM is a kenyan-born fashion brand founded by young entrepreneurs with a vision to tap in in creativity without overthinking to much.
            It was founded by  Foley and it grew within the years to become on of kenya's most moving fashion brands.
            Our aim is to work woth creatives to create new clothing pieces including their visions and ideas in order to create ONE of ONE 
            pieces to satisfy our supporters and be able to pass it down to the next generation.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              To create high quality pieces that tell a story and still look fly as ever.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Vision</h2>
            <p>
              To become a globally recognized fashion brand known for
              innovation, sustainability, and exceptional customer experiences.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Values</h2>
            <ul>
              <li>Quality Craftsmanship</li>
              <li>Innovation</li>
              <li>Customer Satisfaction</li>
              <li>Authenticity</li>
              <li>Sustainability</li>
            </ul>
          </div>
        </div>

        <div className="about-closing">
          <h2>Why Choose CALIM?</h2>
          <p>
            Every piece in our collection is thoughtfully designed with
            attention to detail, ensuring you enjoy fashion that feels as good
            as it looks. Whether you're dressing for everyday life or making a
            statement, CALIM helps you wear confidence every day.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;