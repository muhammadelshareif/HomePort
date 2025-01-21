import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserSpots, deleteSpot } from "../../store/spots";
import SpotTile from "../Spots/SpotTile";
import { useEffect, useState } from "react";
import "./ManageSpots.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userSpots = useSelector((state) =>
    Object.values(state.spots.userSpots || {})
  );
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  const handleDelete = (spotId) => {
    dispatch(deleteSpot(spotId))
      .then(() => {
        setShowDeleteModal(null);
      })
      .catch((error) => {
        console.error("Delete failed", error);
      });
  };

  if (!userSpots.length) {
    return (
      <div className="manage-spots-container">
        <h1>Manage Spots</h1>
        <div className="no-spots-content">
          <p>You have no spots yet.</p>
          <Link to="/spots/new" className="create-new-spot-link">
            Create a New Spot
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-spots-container">
      <h1>Manage Spots</h1>
      <div className="spots-grid">
        {userSpots.map((spot) => (
          <div key={spot.id} className="manage-spot-container">
            <div
              className="spot-tile-wrapper"
              onClick={() => navigate(`/spots/${spot.id}`)}
            >
              <SpotTile spot={spot} />
            </div>
            <div className="manage-spot-actions">
              <button
                onClick={() => navigate(`/spots/${spot.id}/edit`)}
                className="manage-update-btn"
              >
                Update
              </button>
              <button
                onClick={() => setShowDeleteModal(spot.id)}
                className="manage-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal !== null && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <div className="delete-modal-actions">
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="delete-confirm-btn"
              >
                Yes (Delete Spot)
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="delete-cancel-btn"
              >
                No (Keep Spot)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSpots;
