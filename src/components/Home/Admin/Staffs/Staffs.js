import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, Alert } from "react-bootstrap";
import { baseUrl } from "../../../../coreServices/api";
import NavBar from "../../../Shared/NavBar/NavBar";
import SideBar from "../../SideBar/SideBar";

const Staffs = () => {
  const [staffs, setStaff] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    fetch(baseUrl + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "staff" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setErrorMessage("");
          setStaff(data);
        } else {
          setErrorMessage("No Staff exist");
        }
      });
  }, [isUpdated]);

  const toggleStatus = (e, id) => {
    const status = e.target.innerText;

    fetch(baseUrl + "/updateUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResponseMessage("Account status updated");
        setIsUpdated(!isUpdated);
      })
      .catch((err) => {
        setErrorMessage("Something went wrong");
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
              <h3>Staffs</h3>
              <hr />

              {responseMessage ? (
                <Alert variant="success">{responseMessage}</Alert>
              ) : null}
              {errorMessage ? (
                <Alert variant="danger">{errorMessage}</Alert>
              ) : null}

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
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {staffs.map((staff) => (
                        <tr key={staff._id}>
                          <td>{staff.name.split(" ")[0]}</td>
                          <td>{staff.name.split(" ")[1]}</td>
                          <td>{staff.email}</td>
                          <td>
                            {staff.status === 1 ? (
                              <Button
                                onClick={(e) => toggleStatus(e, staff._id)}
                                className="mr-2"
                                variant="danger"
                                size="sm"
                              >
                                Lock
                              </Button>
                            ) : (
                              <Button
                                onClick={(e) => toggleStatus(e, staff._id)}
                                className="mr-2"
                                variant="success"
                                size="sm"
                              >
                                Unlock
                              </Button>
                            )}
                          </td>
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

export default Staffs;
