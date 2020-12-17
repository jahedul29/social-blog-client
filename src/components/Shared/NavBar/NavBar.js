import React, { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap";
import "./NavBar.css";
import { LoggedInUserContext } from "../../../App";
import { useHistory } from "react-router-dom";

const NavBar = () => {
  const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext);
  let history = useHistory();

  const logOut = () => {
    setLoggedInUser({});
    sessionStorage.removeItem("loggedInUser");
    history.push("/auth");
  };

  return (
    <Navbar className="px-5" collapseOnSelect expand="lg" bg="white">
      <Navbar.Brand onClick={() => history.push("/userHome")} href="#home">
        SocialBlog
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {loggedInUser && loggedInUser.email ? (
            <Nav.Link>Welcome {loggedInUser.name}</Nav.Link>
          ) : null}
          {loggedInUser && loggedInUser.email ? (
            <Nav.Link onClick={logOut}>Logout</Nav.Link>
          ) : (
            <Nav.Link onClick={() => history.push("/auth")}>Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
