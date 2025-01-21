import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserSpots, deleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal"; // Import the modal context
import "./SpotManagementPage.css";

function SpotManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userSpots = useSelector((state) => state.spots.userSpots);
  const { setModalContent, closeModal } = useModal(); // Get functions to control the modal
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  useEffect(() => {
    dispatch(fetchUserSpots()); // Fetch spots owned by the current user
  }, [dispatch]);

  if (!userSpots) return <div>Loading...</div>;

  const handleDelete = async () => {
    if (selectedSpotId) {
      await dispatch(deleteSpot(selectedSpotId));
      dispatch(fetchUserSpots()); // Refresh user spots after deletion
      closeModal(); // Close the modal after deletion
    }
  };

  const openDeleteModal = (spotId) => {
    setSelectedSpotId(spotId);
    setModalContent(
      <div>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <div>
          <button onClick={handleDelete}>Yes (Delete Spot)</button>
          <button onClick={closeModal}>No (Keep Spot)</button>
        </div>
      </div>
    );
  };

  return (
    <div className="spot-management-container">
      <h1>Manage Your Spots</h1>
      {userSpots.length === 0 ? (
        <p>You don&apos;t have any spots yet. Create one to get started!</p>
      ) : (
        <div className="spot-list">
          {userSpots.map((spot) => (
            <div key={spot.id} className="spot-tile">
              <img
                src={spot.previewImage || "placeholder-image-url"}
                alt={spot.name}
                className="spot-image"
              />
              <div className="spot-details">
                <h2>{spot.name}</h2>
                <p>
                  {spot.city}, {spot.state}
                </p>
                <p>${spot.price} / night</p>
              </div>
              <div className="spot-actions">
                <button
                  className="update-button"
                  onClick={() => navigate(`/spots/${spot.id}/edit`)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => openDeleteModal(spot.id)} // Open modal with the spot ID
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="create-spot-button"
        onClick={() => navigate("/spots/new")}
      >
        Create New Spot
      </button>
    </div>
  );
}

export default SpotManagementPage;
