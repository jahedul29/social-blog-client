import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, Alert } from "react-bootstrap";
import { baseUrl } from "../../../coreServices/api";
import NavBar from "../../Shared/NavBar/NavBar";
import SideBar from "../SideBar/SideBar";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    fetch(baseUrl + "/getPosts?withImage=false", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setErrorMessage("");
          setPosts(data);
        } else {
          setErrorMessage("No User exist");
        }
      });
  }, [isUpdated]);

  const approvePost = (e, id) => {
    fetch(baseUrl + "/updatePost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setResponseMessage("Post approved");
          setErrorMessage("");
          setIsUpdated(!isUpdated);
        } else {
          setErrorMessage("Something went wrong");
          setResponseMessage("");
        }
      });
  };

  const deletePost = (id) => {
    fetch(baseUrl + "/deletePost/" + id, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        setResponseMessage("Post deleted successfully");
        setErrorMessage("");
        setIsUpdated(!isUpdated);
      } else {
        setResponseMessage("");
        setErrorMessage("Something went wrong!");
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
              <h3>All Posts</h3>
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
                        <th>Posted By</th>
                        <th>Posted At</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {posts.map((post) => (
                        <tr key={post._id}>
                          <td>{post.userName}</td>
                          <td>
                            {new Date(Date.parse(post.createdAt)).toUTCString()}
                          </td>
                          <td>
                            {post.status === 0 && (
                              <Button
                                onClick={(e) => approvePost(e, post._id)}
                                className="mr-2"
                                variant="success"
                                size="sm"
                              >
                                Approve
                              </Button>
                            )}
                            <Button
                              onClick={() => deletePost(post._id)}
                              className="mr-2"
                              variant="danger"
                              size="sm"
                            >
                              Delete
                            </Button>
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

export default ManagePosts;
