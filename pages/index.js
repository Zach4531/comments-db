import supabase from '../utils/supabase';
import { Fragment, useEffect, useState } from 'react';
import data from '../public/data.json';

import { UserContext } from './context/Contexts';

import styled from 'styled-components';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import Alert from '../components/Alert';
import UserLogin from '../components/UserLogin';

export async function getServerSideProps() {
  const { data: allComments } = await supabase
    .from('comments')
    .select(
      '*, replies(*, user:users(username, image)), user:users(username, image)'
    );

  return {
    props: {
      allComments,
    },
  };
}

export default function Home({ allComments }) {
  const [currentUser, setCurrentUser] = useState('juliusomo');
  const [comments, setComments] = useState(allComments);
  const [alert, setAlert] = useState({});
  const [login, setLogin] = useState(true);

  function authenticateUser() {
    setLogin(true);
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select(
        '*, replies(*, user:users(username, image)), user:users(username, image)'
      );
    setComments(data);
  }

  function showAlert(text) {
    setAlert({ show: true, text: text });
    setTimeout(() => {
      setAlert({ show: false, text: '' });
    }, '4000');
  }

  async function addComment(content) {
    const { data, error } = await supabase
      .from('comments')
      .insert({ content: content, user_id: 1 });

    fetchComments();
  }

  async function addReply(content, id, replyingTo) {
    const { data, error } = await supabase.from('replies').insert({
      content: content,
      user_id: 1,
      comment_id: id,
      replyingTo: replyingTo,
    });

    fetchComments();
  }
  async function editReply(content, id) {
    const { data, error } = await supabase
      .from('replies')
      .update({
        content: content,
      })
      .eq('id', id);

    fetchComments();
  }
  async function deleteReply(id) {
    const { repliesData, repliesError } = await supabase
      .from('replies')
      .delete()
      .eq('id', id);

    fetchComments();
  }
  async function editComment(content, id) {
    const { data, error } = await supabase
      .from('comments')
      .update({
        content: content,
      })
      .eq('id', id);

    fetchComments();
  }
  async function deleteComment(id) {
    const { commentsData, commentsError } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    const { repliesData, repliesError } = await supabase
      .from('replies')
      .delete()
      .eq('comment_id', id);

    fetchComments();
  }

  if (!login) {
    return <UserLogin authenticate={authenticateUser} />;
  }

  return (
    <UserContext.Provider value={[currentUser, setCurrentUser]}>
      <>
        {alert.show && <Alert text={alert.text} />}
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            commentData={comment}
            addReply={addReply}
            editComment={editComment}
            deleteComment={deleteComment}
          >
            {comment.replies.length > 0 && (
              <ReplyWrapperStyled>
                {comment.replies.map((reply) => (
                  <Comment
                    key={`${comment.id}-${reply.id}`}
                    commentData={reply}
                    deleteReply={deleteReply}
                    editReply={editReply}
                  />
                ))}
              </ReplyWrapperStyled>
            )}
          </Comment>
        ))}
        <CommentForm onSubmission={addComment} type="comment" />
      </>
    </UserContext.Provider>
  );
}

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
