import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/knife.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/knife.ico" type="image/x-icon" />
        <link
          rel="preload"
          as="image"
          href="/stab-cult.webp"
          type="image/webp"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
