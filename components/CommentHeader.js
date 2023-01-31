import styled from 'styled-components';
import Avatar from './Avatar';
import Icon from './Icon';

export default function CommentHeader({
  username,
  img,
  createdAt,
  setVisibility,
  isOwner,
  deleteRequest,
  editRequest,
}) {
  function handleClick() {
    setVisibility();
  }

  createdAt = new Date(createdAt);

  return (
    <CardHeaderStyled>
      <CardUserStyled>
        <Avatar size="xsmall" img={img} />
        <p className="username">
          {username}
          {isOwner && <span>you</span>}
        </p>
        <p className="date">{createdAt.toLocaleString()}</p>
      </CardUserStyled>
      <CardButtonsStyled>
        {isOwner ? (
          <>
            <CommentButtonStyled type="delete" onClick={deleteRequest}>
              <Icon text="Delete" icon="delete" />
            </CommentButtonStyled>
            <CommentButtonStyled onClick={editRequest}>
              <Icon text="Edit" icon="edit" />
            </CommentButtonStyled>
          </>
        ) : (
          <CommentButtonStyled onClick={handleClick}>
            <Icon text="Reply" icon="reply" />
          </CommentButtonStyled>
        )}
      </CardButtonsStyled>
    </CardHeaderStyled>
  );
}

const CardButtonsStyled = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 650px) {
    position: absolute;
    right: 1.2rem;
    bottom: 1.6rem;
  }
`;

const CommentButtonStyled = styled.button`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  transition: opacity 0.2s ease;
  background-color: transparent;
  border: 0;
  color: ${(props) =>
    props.type === 'delete' ? 'hsl(358, 79%, 66%)' : 'hsl(238, 40%, 52%)'};
  &:hover {
    opacity: 0.5;
  }
  svg {
    transform: scale(0.8);
    margin: -1px 3px 0px 0px;
  }
`;

const CardHeaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const CardUserStyled = styled.div`
  display: flex;
  align-items: center;
  .username {
    font-size: 0.8rem;
    font-weight: bold;
    padding: 0rem 1rem;
    span {
      background: hsl(238, 40%, 52%);
      color: white;
      padding: 0.1rem;
      border-radius: 0.2rem;
      margin-left: 0.2rem;
    }
  }

  .date {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;
