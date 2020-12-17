import React, { useState } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { baseUrl } from "../../../../coreServices/api";
import NavBar from "../../../Shared/NavBar/NavBar";
import SideBar from "../../SideBar/SideBar";
import "./CreateEmployee.css";

const CreateEmployee = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Hooks for react-form-hooks
  const { register, handleSubmit, errors, getValues } = useForm();

  const onSubmit = (data) => {
    const newUser = {
      name: data.firstName + " " + data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
    };
    createEmployee(newUser.name, newUser.email, newUser.password, newUser.role);
  };

  const createEmployee = (name, email, password, role) => {
    fetch(baseUrl + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    }).then((res) => {
      if (res.status === 200) {
        setResponseMessage("Registered successfully!");
        setErrorMessage("");

        document.getElementById("register-form").reset();
      } else if (res.status === 409) {
        setErrorMessage("Already registered!");
        setResponseMessage("");
      } else {
        setErrorMessage("Unknown error");
        setResponseMessage("");
      }
    });
  };

  return (
    <>
      <NavBar />
      <Container>
        <Row>
          <Col xs={2}>
            <SideBar />
          </Col>
          <Col xs={8}>
            <div className="middleContainer">
              <h3>Create employee</h3>
              <hr />

              {responseMessage ? (
                <Alert variant="success">{responseMessage}</Alert>
              ) : null}
              {errorMessage ? (
                <Alert variant="danger">{errorMessage}</Alert>
              ) : null}

              <div>
                <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-group">
                    <input
                      placeholder="First Name"
                      className="form-control"
                      name="firstName"
                      ref={register({
                        required: "Name is required",
                        pattern: {
                          value: /[A-Za-z]{3}/,
                          message:
                            "Name must contain minimum 3 letter and only letter", // <p>error message</p>
                        },
                      })}
                    />
                    {errors.firstName && (
                      <span className="error">{errors.firstName.message}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      placeholder="Last Name"
                      className="form-control"
                      name="lastName"
                      ref={register({
                        required: "Name is required",
                        pattern: {
                          value: /[A-Za-z]{3}/,
                          message:
                            "Name must contain minimum 3 letter and only letter", // <p>error message</p>
                        },
                      })}
                    />
                    {errors.lastName && (
                      <span className="error">{errors.lastName.message}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      placeholder="Your Email"
                      className="form-control"
                      name="email"
                      ref={register({
                        required: "Email required",
                        pattern: {
                          value: /^([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9_\-\\.]+)\.([a-zA-Z]{2,5})$/,
                          message: "Enter a valid email",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="error">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      placeholder="Enter a password"
                      type="password"
                      className="form-control"
                      name="password"
                      ref={register({
                        required: "Password required",
                        pattern: {
                          value: /^([a-zA-Z0-9@*#]{8,15})$/,
                          message:
                            "Password must contain Small and capital letter, Number and any character. It should be 8-15 char long",
                        },
                      })}
                    />
                    {errors.password && (
                      <span className="error">{errors.password.message}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      placeholder="Confirm password"
                      type="password"
                      className="form-control"
                      name="confirm"
                      ref={register({
                        required: true,
                        validate: (val) =>
                          val === getValues("password") ||
                          "Password don't match",
                      })}
                    />
                    {errors.confirm && (
                      <span className="error">{errors.confirm.message}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      name="role"
                      type="radio"
                      value="staff"
                      ref={register({ required: true })}
                    />
                    &nbsp; Staff&nbsp;&nbsp;
                    <input
                      name="role"
                      type="radio"
                      value="admin"
                      ref={register({ required: true })}
                    />
                    &nbsp; Admin&nbsp;&nbsp;
                  </div>

                  <input
                    className="submit-btn form-control"
                    type="submit"
                    value="Save"
                  />
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateEmployee;
