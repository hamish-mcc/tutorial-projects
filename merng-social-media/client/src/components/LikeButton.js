import React, { useEffect, useState } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link } from "react-router-dom";

import MyPopup from "../util/MyPopup";

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const LikeButton = user ? (
    liked ? (
      <Button filled color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button basic color="teal">
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" basic color="teal">
      <Icon name="heart" />
    </Button>
  );

  return (
    <MyPopup content={liked ? "Unlike post" : "Like post"}>
      <Button as="div" labelPosition="right" onClick={likePost}>
        {LikeButton}
        <Label basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
};

export default LikeButton;
