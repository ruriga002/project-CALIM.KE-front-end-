// CollectionCard.jsx renders a set of collection highlight cards.
// It is used to display featured product categories with images and CTA buttons.
import Button from "../components/Button";

function Collections() {
  const collections = [
    {
      id: 1,
      name: "Streetwear",
      description: "Bold everyday fashion inspired by modern urban culture.",
      image: "https://via.placeholder.com/350x400",
    },
    {
      id: 2,
      name: "Essentials",
      description: "Minimal, timeless pieces designed for everyday comfort.",
      image: "https://via.placeholder.com/350x400",
    },
    {
      id: 3,
      name: "Summer Collection",
      description: "Lightweight clothing perfect for warm weather.",
      image: "https://via.placeholder.com/350x400",
    },
    {
      id: 4,
      name: "New Arrivals",
      description: "Discover the latest styles from CALIM.",
      image: "https://via.placeholder.com/350x400",
    },
  ];

  return (
    <section className="collections-page">
      <div className="collections-header">
        <h1>Our Collections</h1>
        <p>
          Discover premium clothing collections designed for confidence,
          comfort, and everyday style.
        </p>
      </div>

      <div className="collections-grid">
        {collections.map((collection) => (
          <div className="collection-card" key={collection.id}>
            <img src={collection.image} alt={collection.name} />
            <h2>{collection.name}</h2>
            <p>{collection.description}</p>

            <Button text="Explore Collection" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Collections;