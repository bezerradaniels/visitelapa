import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Epilogue } from "next/font/google";
import ShellAplicacao from "@/componentes/layouts/shell-aplicacao";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-epilogue",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://visitelapa.com.br"),
  title: {
    default: "Visite Lapa — Portal Turístico de Bom Jesus da Lapa",
    template: "%s | Visite Lapa",
  },
  description:
    "Descubra hotéis, restaurantes, eventos, negócios e experiências turísticas em Bom Jesus da Lapa, Bahia. O portal inteligente da cidade.",
  keywords: [
    "Bom Jesus da Lapa",
    "turismo",
    "hotéis",
    "restaurantes",
    "eventos",
    "negócios",
    "Bahia",
    "romaria",
    "santuário",
    "guia turístico",
  ],
  authors: [{ name: "Visite Lapa" }],
  creator: "Visite Lapa",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://visitelapa.com.br",
    siteName: "Visite Lapa",
    title: "Visite Lapa — Portal Turístico de Bom Jesus da Lapa",
    description:
      "Descubra hotéis, restaurantes, eventos, negócios e experiências turísticas em Bom Jesus da Lapa, Bahia.",
    images: [
      {
        url: "/imagens/img/comercio-local-bom-jesus-da-lapa.webp",
        width: 1200,
        height: 630,
        alt: "Visite Lapa — Bom Jesus da Lapa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visite Lapa — Portal Turístico de Bom Jesus da Lapa",
    description:
      "Descubra hotéis, restaurantes, eventos, negócios e experiências turísticas em Bom Jesus da Lapa, Bahia.",
    images: ["/imagens/img/comercio-local-bom-jesus-da-lapa.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://visitelapa.com.br",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const GTM_ID = "GTM-W79MKJLV";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className={`${epilogue.variable} font-sans bg-page text-main antialiased`} >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ShellAplicacao>{children}</ShellAplicacao>
      </body>
    </html>
  );
}
