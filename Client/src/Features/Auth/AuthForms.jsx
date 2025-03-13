import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./AuthForms.css";

export const LoginForm = ({ onLogin }) => {
    return (
        <>
      <div className="form-container">
        <h2>Welcome to InvestMatch</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email format").required("Required"),
            password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
          })}
          onSubmit={(values) => onLogin(values)}
        >
          <Form className="auth-form">
            <h2>Login</h2>
            <label>Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" className="error" />
  
            <label>Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" className="error" />
  
            <button type="submit">Login</button>
          </Form>
        </Formik>
      </div>
      </>
    );
  };

export const SignupForm = ({ onSignup }) => {
  return (
    <>
    <div className = "form-container">
    <h2>Welcome to InvestMatch</h2>
    <Formik
      initialValues={{ firstname: "", lastname: "", email: "", password: "" }}
      validationSchema={Yup.object({
        firstname: Yup.string().required("Required"),
        lastname: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email format").required("Required"),
        password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
      })}
      onSubmit={(values) => onSignup(values)}
    >
      <Form className="auth-form">
        <h2>Sign Up</h2>
        <label>First Name</label>
        <Field name="firstname" type="text" />
        <ErrorMessage name="firstname" component="div" className="error" />

        <label>Last Name</label>
        <Field name="lastname" type="text" />
        <ErrorMessage name="lastname" component="div" className="error" />

        <label>Email</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" component="div" className="error" />

        <label>Password</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" component="div" className="error" />

        <button type="submit">Sign Up</button>
      </Form>
    </Formik>
    </div>
    </>
  );
};


