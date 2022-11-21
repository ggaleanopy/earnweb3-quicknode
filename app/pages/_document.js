import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.6.95/css/materialdesignicons.css" rel="stylesheet"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}