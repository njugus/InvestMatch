import React from "react";
import "./InvestorDashboard.css";

const InvestorDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2 className="logo">Investor Hub</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Search Startups</li>
            <li>Recommendations</li>
            <li>Portfolio</li>
            <li>Messages</li>
            <li>Notifications</li>
            <li>Profile & Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-nav">
          <input type="text" placeholder="Search startups..." className="search-bar" />
          <div className="nav-icons">
            <span className="notification-icon">🔔</span>
            <span className="profile-icon">👤</span>
          </div>
        </header>

        <section className="overview">
          <div className="overview-card">Total Matches: 12</div>
          <div className="overview-card">Pending Requests: 3</div>
          <div className="overview-card">Active Investments: 5</div>
        </section>

        <section className="search-startups">
          <h3>Search & Discover Startups</h3>
          <div className="startup-list">
            <div className="startup-card">Startup A</div>
            <div className="startup-card">Startup B</div>
            <div className="startup-card">Startup C</div>
          </div>
        </section>

        <section className="recommendations">
          <h3>Investor Recommendations</h3>
          <div className="recommendation-list">
            <div className="recommendation-card">Startup X</div>
            <div className="recommendation-card">Startup Y</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InvestorDashboard;