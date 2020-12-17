import React, { useContext, useEffect, useState } from "react";
import { Col, Alert, Container, Form, Row, Button } from "react-bootstrap";
import { LoggedInUserContext } from "../../../App";
import { baseUrl } from "../../../coreServices/api";
import NavBar from "../../Shared/NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import Post from "./Post/Post";
import "./UserHome.css";

const UserHome = () => {
  const [posts, setPosts] = useState([]);
  const [textPost, setTextPost] = useState("");
  const [file, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { loggedInUser } = useContext(LoggedInUserContext);

  useEffect(() => {
    fetch(baseUrl + "/getPosts?withImage=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loggedInUser.email }),
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
  }, [loggedInUser.email]);

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
  };

  const handleBlur = (e) => {
    setTextPost(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userName", loggedInUser.name);
    formData.append("email", loggedInUser.email);
    formData.append("textPost", textPost);
    formData.append("image", file);

    fetch(baseUrl + "/leavePost", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === 200) {
        setResponseMessage("Your post is waiting for admin approval");
        setErrorMessage("");
        document.getElementById("create-post-form").reset();
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
            {loggedInUser.role === "admin" || loggedInUser.role === "staff" ? (
              <SideBar />
            ) : null}
          </Col>

          <Col xs={8}>
            <div className="middleContainer">
              {responseMessage ? (
                <Alert variant="success">{responseMessage}</Alert>
              ) : null}
              {errorMessage ? (
                <Alert variant="danger">{errorMessage}</Alert>
              ) : null}

              <div className="create-post mb-5">
                <Form id="create-post-form">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onBlur={handleBlur}
                      type="text"
                      placeholder="Write what's on your mind?"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.File
                      onChange={handleFileChange}
                      name="image"
                      type="file"
                      label="Upload Image"
                    />
                  </Form.Group>

                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    type="submit"
                  >
                    POST
                  </Button>
                </Form>
              </div>

              {posts.map((post) => (
                <Post key={post._id} post={post} commentsDisabled={false} />
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserHome;
