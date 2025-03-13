import InvestorDashboard from './Features/Dashboard/Investor/InvestorDashboard'
import { LoginForm, SignupForm } from './Features/Auth/AuthForms'
import StartupDashboard from './Features/Dashboard/Startup/StartupDasboard';
import RoleSelectionForm from './Features/Role/Role';
import { Routes, Route } from "react-router-dom";
import React from "react";
import './App.css'

const App = () => {
  return (
    <>
    <Routes>
      <Route path = "/login" element = { <LoginForm/>}/>
      <Route path = "/signup" element = { <SignupForm/> }/>
      <Route path = "/role-selection" element = {<RoleSelectionForm/>} />
    </Routes>
    </>
  );
};

export default App;
