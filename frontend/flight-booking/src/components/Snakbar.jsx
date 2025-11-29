import React, { useEffect } from 'react';
import './Snackbar.css';

const Snackbar = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`snackbar ${type}`}>
            {message}
        </div>
    );
};

export default Snackbar;