import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LoggedInUserContext } from "../../../App";
import "./SideBar.css";

const SideBar = () => {
  const { loggedInUser } = useContext(LoggedInUserContext);

  return (
    <div className="sidebar">
      {loggedInUser.role === "admin" && (
        <>
          <Link to="/users">Users</Link>
          <Link to="/staffs">Staffs</Link>
          <Link to="/createEmployee">Create Employee</Link>
          <Link to="/managePosts">Manage Posts</Link>
        </>
      )}

      {loggedInUser.role === "staff" && (
        <>
          <Link to="/users">Users</Link>
          <Link to="/managePosts">Manage Posts</Link>
        </>
      )}
    </div>
  );
};

export default SideBar;
