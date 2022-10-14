import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      const { getPosts } = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      const newData = getPosts.filter((p) => p.id !== postId);
      if (!commentId) {
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: {
              newData,
            },
          },
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <MyPopup content={commentId ? "Delete Comment" : "Delete Post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      ></Confirm>
    </>
  );
};

export default DeleteButton;
