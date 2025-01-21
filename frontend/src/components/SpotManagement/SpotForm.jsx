import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SpotForm.css";

function SpotForm() {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const isUpdate = !!spotId;

  const [formData, setFormData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    description: "",
    name: "",
    price: "",
    previewImage: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isUpdate) {
      (async () => {
        const response = await fetch(`/api/spots/${spotId}`);
        if (response.ok) {
          const spot = await response.json();
          setFormData({
            country: spot.country || "",
            address: spot.address || "",
            city: spot.city || "",
            state: spot.state || "",
            description: spot.description || "",
            name: spot.name || "",
            price: spot.price || "",
            previewImage:
              spot.SpotImages?.find((img) => img.preview)?.url || "",
            image1: spot.SpotImages?.[1]?.url || "",
            image2: spot.SpotImages?.[2]?.url || "",
            image3: spot.SpotImages?.[3]?.url || "",
            image4: spot.SpotImages?.[4]?.url || "",
          });
        }
      })();
    }
  }, [isUpdate, spotId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Street address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 30) {
      newErrors.description = "Description needs 30 or more characters";
    }
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!isUpdate && !formData.previewImage) {
      newErrors.previewImage = "Preview image is required";
    }

    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Get CSRF token from cookies
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    const endpoint = isUpdate ? `/api/spots/${spotId}` : "/api/spots";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Include CSRF token in headers
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const spot = await response.json();
        navigate(`/spots/${spot.id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="spot-form-container">
      <h1>{isUpdate ? "Update your Spot" : "Create a New Spot"}</h1>

      <form onSubmit={onSubmit}>
        <section>
          <label>
            Country
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder="Country"
            />
            {errors.country && <span className="error">{errors.country}</span>}
          </label>

          <label>
            Street Address
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Address"
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </label>

          <label>
            City
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="City"
            />
            {errors.city && <span className="error">{errors.city}</span>}
          </label>

          <label>
            State
            <input
              type="text"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              placeholder="State"
            />
            {errors.state && <span className="error">{errors.state}</span>}
          </label>
        </section>

        <section>
          <label>
            Description
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Please write at least 30 characters"
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </label>
        </section>

        <section>
          <label>
            Name
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Name of your spot"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>
        </section>

        <section>
          <label>
            Price
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Price per night (USD)"
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </label>
        </section>

        <section>
          <label>
            Preview Image URL
            <input
              type="text"
              value={formData.previewImage}
              onChange={(e) =>
                setFormData({ ...formData, previewImage: e.target.value })
              }
              placeholder="Preview Image URL"
            />
            {errors.previewImage && (
              <span className="error">{errors.previewImage}</span>
            )}
          </label>
        </section>

        <button type="submit">
          {isUpdate ? "Update your Spot" : "Create Spot"}
        </button>
        {errors.submit && <span className="error">{errors.submit}</span>}
      </form>
    </div>
  );
}

export default SpotForm;
