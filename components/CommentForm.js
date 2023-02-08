import { useState, useContext } from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';
import Icon from './Icon';

export default function CommentForm({ type, id, onSubmission }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(false);

  function handleClick() {
    if (content.trim() === '') {
      setError(true);
      return;
    }
    onSubmission(content);
    setContent('');
    setError(false);
  }

  function handleChange(event) {
    setContent(event.target.value);
  }

  return (
    <>
      <FormStyled error={error}>
        <Avatar size="small" img={'./images/avatars/image-juliusomo.png'} />
        <TextareaStyled
          name={`comment_name_${id}`}
          id={`comment_${id}`}
          rows="1"
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
  align-items: center;
  gap: 1rem;
  padding: 0.1rem 0.5rem;
  border-radius: 3rem;
  background-color: #fff;
  width: 100%;
  position: relative;
  box-shadow: 0px 4px 5px 0px rgba(160, 160, 160, 0.5);
  border: 2px solid ${(props) => (props.error ? 'red' : 'transparent')};
  svg {
    width: 1.5rem;
    fill: #555;
  }
`;

const ButtonStyled = styled.button`
  background-color: transparent;
  all: unset;
  color: #fff;
  border: 0;
  line-height: 0.5rem;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.5;
  }
`;

const TextareaStyled = styled.textarea`
  flex: 1;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 2px solid transparent;
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
