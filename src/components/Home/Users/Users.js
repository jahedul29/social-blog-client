import React, { useContext, useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Table,
  Button,
  Alert,
  Form,
} from "react-bootstrap";
import { LoggedInUserContext } from "../../../App";
import { baseUrl } from "../../../coreServices/api";
import NavBar from "../../Shared/NavBar/NavBar";
import SideBar from "../SideBar/SideBar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [query, setQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState([]);
  const { loggedInUser } = useContext(LoggedInUserContext);

  useEffect(() => {
    let status;

    if (loggedInUser.role === "staff") {
      status = 1;
    }

    fetch(baseUrl + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user", status }),
    })
      .then((res) => res.json())
      .then((data) => {
        setErrorMessage("");
        setUsers(data);
        setTableData(data);
      })
      .catch((err) => {
        setErrorMessage("No User exist");
      });
  }, [isUpdated, loggedInUser.role]);

  const toggleStatus = (e, id) => {
    const status = e.target.innerText;

    fetch(baseUrl + "/updateUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseMessage("Account status updated");
        setIsUpdated(!isUpdated);
      })
      .catch((err) => {
        setErrorMessage("Something went wrong");
      });
  };

  const checkboxChange = (e) => {
    setSearchColumn((columns) =>
      e.target.checked
        ? [...searchColumn, e.target.name]
        : searchColumn.filter((sc) => sc !== e.target.name)
    );
  };

  const searchQuery = (rows, query) => {
    if (searchColumn.length === 0) {
      setTableData(rows);
    } else {
      setTableData(
        rows.filter((user) =>
          searchColumn.some((column) => {
            return (
              user[column]
                .toString()
                .toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            );
          })
        )
      );
    }
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
              <h3>Users</h3>
              <hr />

              {responseMessage ? (
                <Alert variant="success">{responseMessage}</Alert>
              ) : null}
              {errorMessage ? (
                <Alert variant="danger">{errorMessage}</Alert>
              ) : null}

              <div className="my-2 px-3 d-flex justify-content-between align-items-center">
                <Form>
                  <Form.Control
                    value={query}
                    type="text"
                    placeholder="Search"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      searchQuery(users, e.target.value);
                    }}
                  />
                </Form>
                <h5>By</h5>
                <Form>
                  <Form.Check
                    inline
                    name="name"
                    type="checkbox"
                    label="Name"
                    onChange={checkboxChange}
                  />
                  <Form.Check
                    inline
                    name="email"
                    type="checkbox"
                    label="Email"
                    onChange={checkboxChange}
                  />
                </Form>
              </div>

              <div className="px-3">
                {errorMessage ? (
                  <h1>No User exist.</h1>
                ) : (
                  <Table striped bordered hover>
                    <thead className="bg-secondary">
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        {loggedInUser.role === "admin" && <th>Action</th>}
                      </tr>
                    </thead>

                    <tbody>
                      {tableData.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name.split(" ")[0]}</td>
                          <td>{user.name.split(" ")[1]}</td>
                          <td>{user.email}</td>

                          {loggedInUser.role === "admin" && (
                            <td>
                              {user.status === 1 ? (
                                <Button
                                  onClick={(e) => toggleStatus(e, user._id)}
                                  className="mr-2"
                                  variant="danger"
                                  size="sm"
                                >
                                  Lock
                                </Button>
                              ) : (
                                <Button
                                  onClick={(e) => toggleStatus(e, user._id)}
                                  className="mr-2"
                                  variant="success"
                                  size="sm"
                                >
                                  Unlock
                                </Button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Users;
