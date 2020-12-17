import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { LoggedInUserContext } from "../../../../App";
import { baseUrl } from "../../../../coreServices/api";
import NavBar from "../../../Shared/NavBar/NavBar";
import SideBar from "../../SideBar/SideBar";
import Post from "./../Post/Post";

const PostDetails = () => {
  const [post, setPost] = useState("");
  const { loggedInUser } = useContext(LoggedInUserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(baseUrl + "/getPosts?withImage=singlePost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setPost(data[0]);
        } else {
        }
      });
  }, [id]);

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
              <Post key={post._id} post={post} commentsDisabled={true} />

              <div className="p-4 ">
                {post.comments &&
                  post.comments.map((comment) => (
                    <div className="bg-secondary my-2 p-4 rounded text-white">
                      <div>{comment.text}</div>
                      <div className="float-right">
                        Commented by {comment.author}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PostDetails;
