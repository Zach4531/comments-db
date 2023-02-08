import styled from 'styled-components';

export default function Avatar({ size, img }) {
  const users = {
    ar: 'amyrobson',
    ju: 'juliusomo',
    mb: 'maxblagun',
    rs: 'ramsesmiron',
  };

  const sizes = {
    xsmall: '30px',
    small: '35px',
    medium: '50px',
  };

  return (
    <>
      <AvatarStyled src={img} alt="avatar" size={sizes[size]} />
    </>
  );
}

const AvatarStyled = styled.img`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
`;
