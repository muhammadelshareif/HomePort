import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSpotDetails, updateSpot } from "../../store/spots";
import "./SpotForm.css";

function EditSpotForm() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector((state) => state.spots.currentSpot);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch spot details when component mounts
  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  // Populate form when spot data is available
  useEffect(() => {
    if (spot) {
      setFormData({
        country: spot.country || "",
        address: spot.address || "",
        city: spot.city || "",
        state: spot.state || "",
        description: spot.description || "",
        name: spot.name || "",
        price: spot.price || "",
        previewImage: spot.SpotImages?.find((img) => img.preview)?.url || "",
        image1: spot.SpotImages?.[1]?.url || "",
        image2: spot.SpotImages?.[2]?.url || "",
        image3: spot.SpotImages?.[3]?.url || "",
        image4: spot.SpotImages?.[4]?.url || "",
      });
    }
  }, [spot]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Street address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (formData.description.length < 30) {
      newErrors.description = "Description needs 30 or more characters";
    }
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.previewImage)
      newErrors.previewImage = "Preview image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedSpot = await dispatch(
        updateSpot({
          id: spotId,
          ...formData,
        })
      );
      navigate(`/spots/${updatedSpot.id}`);
    } catch (error) {
      setErrors(error.errors || { form: "Failed to update spot" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!spot) return <div>Loading...</div>;

  return (
    <div className="spot-form-container">
      <h1>Update your Spot</h1>

      <form onSubmit={handleSubmit} className="spot-form">
        <section>
          <h2>Wheres your place located?</h2>
          <p>
            Guests will only get your exact address once they book a
            reservation.
          </p>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country"
            />
            {errors.country && <span className="error">{errors.country}</span>}
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
            />
            {errors.city && <span className="error">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
            />
            {errors.state && <span className="error">{errors.state}</span>}
          </div>
        </section>

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
              rows="5"
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
        </section>

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
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
        </section>

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
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>
        </section>

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
            {errors.previewImage && (
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

        <button type="submit" disabled={isSubmitting} className="submit-button">
          Update your Spot
        </button>
      </form>
    </div>
  );
}

export default EditSpotForm;
