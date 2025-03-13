import React from "react";
import "./StartupDashboard.css";
import { FiSearch, FiBell } from "react-icons/fi";

const StartupDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">InvestMatch</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Search Investors</li>
            <li>My Profile</li>
            <li>Notifications</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="search-bar">
            <FiSearch className="icon" />
            <input type="text" placeholder="Search investors..." />
          </div>
          <div className="notifications">
            <FiBell className="icon" />
          </div>
        </header>

        <section className="dashboard-section">
          <h2>Recommended Investors</h2>
          <div className="investor-list">
            {/* Sample investor cards */}
            <div className="investor-card">
              <h3>Investor Name</h3>
              <p>Industry: Tech</p>
              <p>Funding Stage: Series A</p>
              <button>View Profile</button>
            </div>

            <div className="investor-card">
              <h3>Investor Name</h3>
              <p>Industry: Health</p>
              <p>Funding Stage: Seed</p>
              <button>View Profile</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StartupDashboard;