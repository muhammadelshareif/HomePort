import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";

function DeleteReviewModal({ onConfirm }) {
  const { closeModal } = useModal();

  const handleDelete = () => {
    onConfirm();
    closeModal();
  };

  return (
    <div className="delete-review-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="delete-review-buttons">
        <button onClick={handleDelete} className="delete-button">
          Yes (Delete Review)
        </button>
        <button onClick={closeModal} className="cancel-button">
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
