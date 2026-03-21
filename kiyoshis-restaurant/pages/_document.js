import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>My Website</title>
        {/* favicon link changed */}
        <link rel="icon" href="/kiyoshiIcon.ico" type="image/x-icon" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
