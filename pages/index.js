import supabase from '../utils/supabase';
import { Fragment, useEffect, useState } from 'react';
import data from '../public/data.json';

import { UserContext } from './context/Contexts';

import styled from 'styled-components';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import Alert from '../components/Alert';

export async function getServerSideProps() {
  let { data: allComments } = await supabase
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

  // useEffect(() => {
  //   const local = JSON.parse(localStorage.getItem('frontEndComments'));

  //   if (!local) {
  //     localStorage.setItem('frontEndComments', JSON.stringify(data));
  //   }

  //   setUser(local?.currentUser || data.currentUser);
  //   setComments(local?.comments || data.comments);
  //   console.log('ad');
  // }, []);

  // useEffect(() => {
  //   const getData = async () => {
  //     const { data: commentData, error: commentError } = await supabase
  //       .from('comments')
  //       .select(
  //         '*, replies(*, users(username, image)), users(username, image)'
  //       );

  //     setComments(commentData);
  //     setUser('juliusomo');
  //   };

  //   getData();
  // }, []);

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
  async function editReply(content, id, parentId) {
    const { data, error } = await supabase
      .from('replies')
      .update({
        content: content,
      })
      .eq('id', id);

    fetchComments();
  }
  async function deleteReply(id, parentId) {
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

  // function addComment(content) {
  //   const newComment = {
  //     id: Math.floor(Math.random() * 1000) + 5,
  //     content: content,
  //     createdAt: '3 weeks ago',
  //     score: 0,
  //     username: user.username,
  //     replies: [],
  //   };
  //   const commentsUpdated = [...comments, newComment];
  //   updateData(commentsUpdated);
  // }

  // function addReply(content, id, replyingTo) {
  //   const newReply = {
  //     id: Math.floor(Math.random() * 1000) + 5,
  //     content: content,
  //     createdAt: '3 weeks ago',
  //     score: 0,
  //     replyingTo: replyingTo,
  //     username: user.username,
  //   };

  //   const commentsUpdated = comments.map((comment) => {
  //     if (comment.id === id) {
  //       comment.replies = [...comment.replies, newReply];
  //     }
  //     return comment;
  //   });
  //   updateData(commentsUpdated);
  // }

  // function editComment(content, id) {
  //   const commentsUpdated = comments.map((comment) => {
  //     if (comment.id === id) {
  //       comment.content = content;
  //     }
  //     return comment;
  //   });
  //   updateData(commentsUpdated);
  //   showAlert('Comment successfully updated!');
  // }

  // function editReply(content, id, parentId) {
  //   const commentsUpdated = comments.map((comment) => {
  //     if (comment.id === parentId) {
  //       if (comment.replies.length > 0) {
  //         comment.replies.map((reply) => {
  //           if (reply.id === id) {
  //             reply.content = content;
  //           }
  //           return reply;
  //         });
  //       }
  //     }
  //     return comment;
  //   });
  //   updateData(commentsUpdated);
  //   showAlert('Comment successfully updated!');
  // }

  // function deleteComment(id) {
  //   const commentsUpdated = comments.filter((comment) => {
  //     return comment.id !== id;
  //   });
  //   updateData(commentsUpdated);
  //   showAlert('Comment deleted!');
  // }

  // function deleteReply(id, parentId) {
  //   const commentsUpdated = comments.map((comment) => {
  //     if (comment.id === parentId) {
  //       if (comment.replies.length > 0) {
  //         comment.replies = comment.replies.filter((reply) => {
  //           return reply.id !== id;
  //         });
  //       }
  //     }
  //     return comment;
  //   });
  //   updateData(commentsUpdated);
  //   showAlert('Comment deleted!');
  // }

  return (
    <UserContext.Provider value={[currentUser, setCurrentUser]}>
      {comments && (
        <Wrapper>
          {alert.show && <Alert text={alert.text} />}
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              commentData={comment}
              addReply={addReply}
              editComment={editComment}
              deleteComment={deleteComment}
              parentId={comment.id}
            >
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
            </Comment>
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
