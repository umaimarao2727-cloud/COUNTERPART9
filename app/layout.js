import "./globals.css";

export const metadata = {
  title: "Counterpart — Where businesses meet the managers who grow them",
  description: "A matching platform connecting business owners with vetted social media managers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
