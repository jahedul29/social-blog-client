import React, { useContext, useState } from "react";
import { Button, Col, Row, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { LoggedInUserContext } from "../../../../App";
import { baseUrl } from "../../../../coreServices/api";
import "./Post.css";

const Post = (props) => {
  const post = props.post;
  const commentsDisabled = props.commentsDisabled;
  const [comment, setComment] = useState("");
  const { loggedInUser } = useContext(LoggedInUserContext);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let history = useHistory();

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (id) => {
    fetch(baseUrl + "/leaveComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, author: loggedInUser.name, text: comment }),
    }).then((res) => {
      if (res.status === 200) {
        setResponseMessage("You commented successfully");
        setErrorMessage("");
      } else {
        setResponseMessage("");
        setErrorMessage("Something went wrong!");
      }
    });
  };

  return (
    <div className="home-post">
      {responseMessage ? (
        <Alert variant="success">{responseMessage}</Alert>
      ) : null}
      {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}

      <h6>
        Posted by <span className="text-primary ">{post.userName}</span>{" "}
      </h6>
      <br />

      <Row>
        <Col xs={5}>
          {post.image && (
            <div className="home-post-image">
              <img src={`data:image/png;base64, ${post.image.img}`} alt="" />
            </div>
          )}
        </Col>

        <Col className="border" xs={7}>
          <div className="home-post-text">
            <p>{post.textPost}</p>
          </div>
        </Col>
      </Row>
      <br />

      {!commentsDisabled && (
        <Row>
          <Col xs={6}></Col>
          <Col xs={6}>
            <Button
              onClick={() => history.push(`/postDetails/${post._id}`)}
              className="form-control"
              variant="outline-primary"
            >
              Comments
            </Button>
          </Col>
        </Row>
      )}
      <br />
      <br />

      <Row>
        <Col xs={10}>
          <input
            onChange={handleChange}
            type="text"
            placeholder="Write your comment"
            className="comment-input"
          />
        </Col>

        <Col xs={2}>
          <Button
            onClick={() => handleSubmit(post._id)}
            className="form-control"
            variant="success"
          >
            Post
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Post;
