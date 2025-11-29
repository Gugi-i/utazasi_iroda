// src/components/Modal.jsx
import React from "react";
import "./Modal.css";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">{title}</h2>
        {children}
        <div className="modal-actions">
          <button className="modal-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
