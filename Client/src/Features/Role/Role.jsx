import React, { useState } from "react";
import "./Role.css";

const RoleSelectionForm = ({ onSubmit }) => {
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role) {
      onSubmit(role);
    }
  };

  return (
    <div className="role-form-container">
      <h2>Please choose your role</h2>
      <form onSubmit={handleSubmit} className="role-form">
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select your role</option>
          <option value="Investor">Investor</option>
          <option value="Startup">Startup</option>
        </select>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default RoleSelectionForm;