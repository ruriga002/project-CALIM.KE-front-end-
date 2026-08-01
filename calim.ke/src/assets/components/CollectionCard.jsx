// CollectionCard.jsx renders CALIM collection cards for the homepage.
// It is used to display the brand's signature pieces and hero items.
import Button from "../components/Button";

function Collections() {
  const collections = [
    {
      id: 1,
      name: "CALIM Beanie",
      description: "A rugged street-ready beanie designed for comfort and warmth.",
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhbmllcyUyMHdpdGglMjByaXZldHN8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      name: "CALIM Jeans",
      description: "Durable denim cut for everyday movement and a sharp urban edge.",
      image: "https://images.unsplash.com/photo-1697678207628-6758ecf9a2cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN1c3RvbSUyMGJhZ2d5JTIwamVhbnN8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 3,
      name: "CALIM Leather Jacket",
      description: "A statement outer layer built for confidence, texture, and utility.",
      image: "https://plus.unsplash.com/premium_photo-1731950912462-9caa3905627d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3VzdG9tJTIwbGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  return (
    <section className="collections-page calim-collections">
      <div className="collections-header">
        <h1>CALIM Collection</h1>
        <p>
          Highlighting our core pieces crafted for comfort, movement, and bold style.
        </p>
      </div>

      <div className="collections-grid">
        {collections.map((collection) => (
          <div className="collection-card" key={collection.id}>
            <img src={collection.image} alt={collection.name} />
            <h2>{collection.name}</h2>
            <p>{collection.description}</p>
            <Button text="Shop CALIM" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Collections;
