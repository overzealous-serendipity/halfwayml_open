import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Convert audio and video to text with 93% accuracy using halfway's AI. Fast, high-quality transcriptions and editing tools for businesses, journalists, and creators."
        />
        <meta
          property="og:title"
          content="halfway: AI-Powered Transcriptions and Subtitles for Audio & Video"
        />
        <meta
          property="og:description"
          content="Convert audio and video to text with 93% accuracy using halfway's AI. Fast, high-quality transcriptions and editing tools for businesses, journalists, and creators."
        />
        <meta property="og:url" content="https://halfwayml.com" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://halfwayml.com/wp-content/uploads/2024/02/Editor.svg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="halfway: AI-Powered Transcriptions and Subtitles for Audio & Video"
        />
        <meta
          name="twitter:description"
          content="Convert audio and video to text with 93% accuracy using halfway's AI. Fast, high-quality transcriptions and editing tools for businesses, journalists, and creators."
        />
        <meta
          name="twitter:image"
          content="https://halfwayml.com/twitter-image.jpg"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="portal"></div>
      </body>
    </Html>
  );
}
