import './Modal.css'; // Import the CSS file

const Modal = ({ isVisible, onClose, children }:any) => {
    if (!isVisible) return null;

    const handleBackdropClick = (e:any) => {
        // Ensure the click is on the backdrop and not on any child elements
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal-backdrop"
            onClick={handleBackdropClick}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    X
                </button>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;