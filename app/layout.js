export const metadata = {
  title: "PulseAI - AI & Tech News",
  description: "Live AI and tech news aggregator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
