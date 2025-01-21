import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateSpotForm.css"; // Import the styles

function CreateSpotForm() {
  const navigate = useNavigate();
  const [navbarHeight, setNavbarHeight] = useState(0); // State to hold navbar height

  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    country: "",
    lat: "",
    lng: "",
  });

  // Adjust the padding-top dynamically based on navbar height
  useEffect(() => {
    const navbar = document.querySelector(".navigation-container");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the new spot's detail page
        navigate(`/spots/${data.id}`);
      } else {
        console.error("Error creating spot:", data);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div
      className="create-spot-form"
      style={{ paddingTop: `${navbarHeight}px` }} // Apply dynamic padding-top
    >
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          State:
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Latitude:
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Longitude:
          <input
            type="number"
            name="lng"
            value={formData.lng}
            onChange={handleInputChange}
            required
          />
        </label>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
