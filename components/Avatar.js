import styled from 'styled-components';

export default function Avatar({ size, avatar }) {
  const users = {
    ar: 'amyrobson',
    ju: 'juliusomo',
    mb: 'maxblagun',
    rs: 'ramsesmiron',
  };

  const sizes = {
    xsmall: '25px',
    small: '45px',
    medium: '55px',
  };

  return (
    <>
      <AvatarStyled src={avatar} alt="avatar" size={sizes[size]} />
    </>
  );
}

const AvatarStyled = styled.img`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
`;
