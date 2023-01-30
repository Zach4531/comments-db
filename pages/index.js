import Head from 'next/head';

import supabase from '../utils/supabase';
// import styles from '../styles/Home.module.css'
import { Fragment, useEffect, useState } from 'react';
import data from '../public/data.json';

import { UserContext } from './context/Contexts';

import styled from 'styled-components';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import Alert from '../components/Alert';

export default function Home() {
  const [user, setUser] = useState();
  const [comments, setComments] = useState();
  const [alert, setAlert] = useState({});

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('frontEndComments'));

    if (!local) {
      localStorage.setItem('frontEndComments', JSON.stringify(data));
    }

    setUser(local?.currentUser || data.currentUser);
    setComments(local?.comments || data.comments);
    console.log('ad');
  }, []);

  // useEffect(() => {
  //   const getData = async () => {
  //     const { data: commentData, error: commentError } = await supabase
  //       .from('comments')
  //       .select();

  //     const { data: userData, error: userError } = await supabase
  //       .from('users')
  //       .select();

  //     setComments(commentData);
  //     setUser(userData);
  //   };

  //   getData();
  // }, []);

  function updateData(data) {
    setComments(data);
    localStorage.setItem(
      'frontEndComments',
      JSON.stringify({ currentUser: user, comments: data })
    );
  }

  function showAlert(text) {
    setAlert({ show: true, text: text });
    setTimeout(() => {
      setAlert({ show: false, text: '' });
    }, '4000');
  }

  function addComment(content) {
    const newComment = {
      id: Math.floor(Math.random() * 1000) + 5,
      content: content,
      createdAt: '3 weeks ago',
      score: 0,
      username: user.username,
      replies: [],
    };
    const commentsUpdated = [...comments, newComment];
    updateData(commentsUpdated);
  }

  function addReply(content, id, replyingTo) {
    const newReply = {
      id: Math.floor(Math.random() * 1000) + 5,
      content: content,
      createdAt: '3 weeks ago',
      score: 0,
      replyingTo: replyingTo,
      username: user.username,
    };

    const commentsUpdated = comments.map((comment) => {
      if (comment.id === id) {
        comment.replies = [...comment.replies, newReply];
      }
      return comment;
    });
    updateData(commentsUpdated);
  }

  function editComment(content, id) {
    const commentsUpdated = comments.map((comment) => {
      if (comment.id === id) {
        comment.content = content;
      }
      return comment;
    });
    updateData(commentsUpdated);
    showAlert('Comment successfully updated!');
  }

  function editReply(content, id, parentId) {
    const commentsUpdated = comments.map((comment) => {
      if (comment.id === parentId) {
        if (comment.replies.length > 0) {
          comment.replies.map((reply) => {
            if (reply.id === id) {
              reply.content = content;
            }
            return reply;
          });
        }
      }
      return comment;
    });
    updateData(commentsUpdated);
    showAlert('Comment successfully updated!');
  }

  function deleteComment(id) {
    const commentsUpdated = comments.filter((comment) => {
      return comment.id !== id;
    });
    updateData(commentsUpdated);
    showAlert('Comment deleted!');
  }

  function deleteReply(id, parentId) {
    const commentsUpdated = comments.map((comment) => {
      if (comment.id === parentId) {
        if (comment.replies.length > 0) {
          comment.replies = comment.replies.filter((reply) => {
            return reply.id !== id;
          });
        }
      }
      return comment;
    });
    updateData(commentsUpdated);
    showAlert('Comment deleted!');
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      {comments && (
        <Wrapper>
          {alert.show && <Alert text={alert.text} />}
          {comments.map((comment) => (
            <Fragment key={`${comment.id}`}>
              <Comment
                key={comment.id}
                commentData={comment}
                addReply={addReply}
                editComment={editComment}
                deleteComment={deleteComment}
                parentId={comment.id}
              />
              {comment.replies.length > 0 && (
                <ReplyWrapperStyled>
                  {comment.replies.map((reply) => (
                    <Comment
                      key={`${comment.id}-${reply.id}`}
                      commentData={reply}
                      deleteReply={deleteReply}
                      editReply={editReply}
                      parentId={comment.id}
                    />
                  ))}
                </ReplyWrapperStyled>
              )}
            </Fragment>
          ))}
          <CommentForm onSubmission={addComment} type="comment" />
        </Wrapper>
      )}
    </UserContext.Provider>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem;
  width: 100%;
  max-width: 650px;
  margin: 1rem auto;
  gap: 1.5rem;
`;

const ReplyWrapperStyled = styled.div`
  width: 94%;
  padding-left: 2rem;
  border-left: 2px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 650px) {
    width: 100%;
    padding-left: 0;
    border: 0;
  }
`;
