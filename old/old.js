useEffect(() => {
  const local = JSON.parse(localStorage.getItem('frontEndComments'));

  if (!local) {
    localStorage.setItem('frontEndComments', JSON.stringify(data));
  }

  setUser(local?.currentUser || data.currentUser);
  setComments(local?.comments || data.comments);
  console.log('ad');
}, []);

useEffect(() => {
  const getData = async () => {
    const { data: commentData, error: commentError } = await supabase
      .from('comments')
      .select('*, replies(*, users(username, image)), users(username, image)');

    setComments(commentData);
    setUser('juliusomo');
  };

  getData();
}, []);

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
