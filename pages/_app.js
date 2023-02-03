import '../styles/globals.css';
import styled from 'styled-components';

function MyApp({ Component, pageProps }) {
  return (
    <Container>
      <Component {...pageProps} />
    </Container>
  );
}

export default MyApp;

const Container = styled.div`
  background-color: hsl(228, 33%, 97%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 650px;
  height: 100%;
  gap: 1.5rem;
  margin: 1rem auto;
`;
