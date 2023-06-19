import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { fetchUser } from "../utils/spotifyFunctions";

const Profile = ({ token }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    async function loadUser() {
      const data = await fetchUser(token);
      setUser(data);
    }
    loadUser();
  }, []);
  return (
    <Container>
      {user && (
        <Row className="justify-content-center">
          <Col xs={12} md={6} className="text-center">
            {user.images.length > 0 && (
              <Image src={user.images[0].url} roundedCircle fluid />
            )}
            <div className="d-flex align-items-center justify-content-center">
              <p className="p-1 mt-3">Username:</p>{" "}
              <h2>{user?.display_name}</h2>
            </div>
            <p>Followers: {user.followers.total}</p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Profile;
