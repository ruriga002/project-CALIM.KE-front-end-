// Contact.jsx renders the contact page and a message form.
// It controls form state locally and currently logs submissions to the console.
import { useState } from "react";
import Button from "../components/Button";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(formData);

    // Later:
    // Send formData to your Flask backend

    alert("Thank you for contacting CALIM!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h1>Contact Us</h1>

          <p>
            We'd love to hear from you. Whether you have a question about
            our collections, your order, or simply want to say hello,
            our team is here to help.
          </p>

          <div className="contact-details">
            <p><strong>📍 Address:</strong> Nairobi, Kenya</p>
            <p><strong>📞 Phone:</strong> +254 74880567-</p>
            <p><strong>✉️ Email:</strong> info@calim.co.ke</p>

            <p>
              <strong>Business Hours:</strong><br />
              Monday - Friday: 8:00 AM - 6:00 PM
            </p>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              rows="6"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            />

            <Button text="Send Message" type="submit" />
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;