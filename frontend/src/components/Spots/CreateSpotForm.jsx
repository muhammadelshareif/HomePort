import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewSpot } from "../../store/spots";
import "./CreateSpotForm.css";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(true);
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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sessionUser) {
      navigate("/login");
      return;
    }
    setIsLoading(false);
  }, [sessionUser, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Street address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.description || formData.description.length < 30) {
      newErrors.description = "Description needs 30 or more characters";
    }
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price per night is required";
    }
    if (!formData.previewImage) {
      newErrors.previewImage = "Preview image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }

    try {
      const newSpot = await dispatch(createNewSpot(formData));
      navigate(`/spots/${newSpot.id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorData = (await error.response?.json?.()) || {
        errors: { submit: "Failed to create spot" },
      };
      setErrors(errorData.errors || { submit: "Failed to create spot" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Rest of your JSX remains exactly the same
  return (
    <div className="spot-form-container">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        {/* Section 1: Location */}
        <section>
          <h2>Wheres your place located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>

          <div className="form-group">
            <label>
              Country
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country"
              />
              {submitted && errors.country && (
                <span className="error">{errors.country}</span>
              )}
            </label>
          </div>

          <div className="form-group">
            <label>
              Street Address
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
              />
              {submitted && errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </label>
          </div>

          <div className="form-group">
            <label>
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
              />
              {submitted && errors.city && (
                <span className="error">{errors.city}</span>
              )}
            </label>
          </div>

          <div className="form-group">
            <label>
              State
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
              />
              {submitted && errors.state && (
                <span className="error">{errors.state}</span>
              )}
            </label>
          </div>
        </section>

        {/* Section 2: Description */}
        <section>
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>

          <div className="form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please write at least 30 characters"
            />
            {submitted && errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
        </section>

        {/* Section 3: Title */}
        <section>
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests attention with a spot title that highlights what makes
            your place special.
          </p>

          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name of your spot"
            />
            {submitted && errors.name && (
              <span className="error">{errors.name}</span>
            )}
          </div>
        </section>

        {/* Section 4: Price */}
        <section>
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>

          <div className="form-group">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price per night (USD)"
              min="0"
              step="0.01"
            />
            {submitted && errors.price && (
              <span className="error">{errors.price}</span>
            )}
          </div>
        </section>

        {/* Section 5: Photos */}
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>

          <div className="form-group">
            <input
              type="text"
              name="previewImage"
              value={formData.previewImage}
              onChange={handleInputChange}
              placeholder="Preview Image URL"
            />
            {submitted && errors.previewImage && (
              <span className="error">{errors.previewImage}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="image1"
              value={formData.image1}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="image2"
              value={formData.image2}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="image3"
              value={formData.image3}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="image4"
              value={formData.image4}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
          </div>
        </section>

        {errors.submit && (
          <div className="error submit-error">{errors.submit}</div>
        )}

        <button type="submit" className="submit-button">
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
