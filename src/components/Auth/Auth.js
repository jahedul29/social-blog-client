import React, { useContext, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { LoggedInUserContext } from "../../App";
import { baseUrl } from "../../coreServices/api";
import "./Auth.css";

const Login = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Hooks for react-form-hooks
  const { register, handleSubmit, errors, getValues } = useForm();
  const { setLoggedInUser } = useContext(LoggedInUserContext);
  let history = useHistory();

  const onSubmit = (data) => {
    const newUser = {
      name: data.firstName + " " + data.lastName,
      email: data.email.toLowerCase(),
      password: data.password,
    };

    isNewUser
      ? createWithEmailAndPassword(
          newUser.name,
          newUser.email,
          newUser.password
        )
      : signInWithEmailAndPassword(newUser.email, newUser.password);
  };

  const createWithEmailAndPassword = (name, email, password) => {
    fetch(baseUrl + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }).then((res) => {
      if (res.status === 200) {
        setResponseMessage("User registered successfully!");
        setErrorMessage("");
        setIsNewUser(false);
      } else if (res.status === 409) {
        setErrorMessage("User already registered!");
        setResponseMessage("");
      } else {
        setErrorMessage("Unknown error");
        setResponseMessage("");
      }
    });
  };

  const signInWithEmailAndPassword = (email, password) => {
    fetch(baseUrl + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 403) {
          setErrorMessage("User Inactive! Please contact admin");
          setResponseMessage("");
        } else if (res.status === 401) {
          setErrorMessage("You entered a wrong password!");
          setResponseMessage("");
        } else if (res.status === 404) {
          setErrorMessage("This email is not registered");
          setResponseMessage("");
        } else {
          setErrorMessage("Unknown error");
          setResponseMessage("");
        }
      })
      .then((data) => {
        if (data) {
          sessionStorage.setItem("loggedInUser", JSON.stringify(data));
          setLoggedInUser(data);
          history.push("/userHome");
        }
      });
  };

  return (
    <Container className="login-container">
      <div className="form-container">
        <div className="m-auto input-form-container">
          <h4>{isNewUser ? "Register" : "Sign In"}</h4>

          {responseMessage ? (
            <Alert variant="success">{responseMessage}</Alert>
          ) : null}
          {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}

          <form id="signing-form" onSubmit={handleSubmit(onSubmit)}>
            {isNewUser && (
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
            )}
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}

            {isNewUser && (
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
            )}
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}

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

            {isNewUser && (
              <input
                placeholder="Confirm password"
                type="password"
                className="form-control"
                name="confirm"
                ref={register({
                  required: true,
                  validate: (val) =>
                    val === getValues("password") || "Password don't match",
                })}
              />
            )}
            {errors.confirm && (
              <span className="error">{errors.confirm.message}</span>
            )}

            <input
              className="form-control submit-btn"
              type="submit"
              value={isNewUser ? "Register" : "Sign In"}
            />
            <input
              onClick={() => {
                document.getElementById("signing-form").reset();
                setIsNewUser(!isNewUser);
                setErrorMessage("");
                setResponseMessage("");
              }}
              type="button"
              className="form-control toggle-btn text-center"
              value={
                isNewUser ? "Already have an account?" : "Create new account"
              }
            />
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Login;
