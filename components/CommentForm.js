import { text } from '@fortawesome/fontawesome-svg-core';
import { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';
import Icon from './Icon';

export default function CommentForm({ type, id, onSubmission }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(false);
  const commentTextarea = useRef(null);

  function handleClick() {
    if (content.trim() === '') {
      setError(true);
      return;
    }
    onSubmission(content);
    setContent('');
    setError(false);
  }

  useEffect(() => {
    commentTextarea.current.style.height = '49px';
    const height = commentTextarea.current.scrollHeight;
    commentTextarea.current.style.height = `${height}px`;
  }, [content]);

  function handleChange(event) {
    setContent(event.target.value);
  }

  return (
    <>
      <FormStyled error={error}>
        <Avatar size="small" img={'./images/avatars/image-juliusomo.png'} />
        <TextareaStyled
          ref={commentTextarea}
          name={`comment_name_${id}`}
          id={`comment_${id}`}
          placeholder={`Add a ${type}...`}
          value={content}
          onChange={handleChange}
        ></TextareaStyled>
        <ButtonStyled type="submit" onClick={handleClick}>
          <Icon icon="send" />
        </ButtonStyled>
      </FormStyled>
      {error && (
        <ErrorStyled error={error}>Comment cannot be empty</ErrorStyled>
      )}
    </>
  );
}

const FormStyled = styled.div`
  display: flex;
  width: 100%;
  box-shadow: 0px 4px 5px 0px rgba(160, 160, 160, 0.5);
  border: 2px solid ${(props) => (props.error ? 'red' : 'transparent')};
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 0.1rem 0.5rem;
  gap: 1rem;
  img {
    margin-top: 0.5rem;
  }
`;

const ButtonStyled = styled.button`
  background-color: transparent;
  color: #fff;
  border: 0;
  transition: opacity 0.2s ease;
  margin-top: 0.85rem;
  margin-bottom: auto;
  svg {
    width: 1.5rem;
    fill: #000;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const TextareaStyled = styled.textarea`
  flex: 1;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 2px solid transparent;
  resize: none;
  transition: height 0.1s ease;
  line-height: 1rem;
  &::-webkit-scrollbar {
    width: 0px;
  }
  &::placeholder {
    font-family: 'Rubik';
    font-size: 0.9rem;
    color: #555;
  }
  &:focus {
    outline: none;
    border: 2px solid hsl(238, 40%, 52%);
  }
`;

const ErrorStyled = styled.p`
  padding: 1rem;
  background: red;
  color: white;
  font-weight: bold;
  width: 100%;
  border-radius: 0.5rem;
  text-align: center;
`;
