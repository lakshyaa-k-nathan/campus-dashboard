import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar'; // adjust path if your structure is different


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
