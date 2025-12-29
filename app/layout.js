import "./globals.css";
import { Toaster } from "react-hot-toast";
import { UnreadProvider } from "@/context/UnreadContext";
import SocketProvider from "@/providers/SocketProvider";

const themeInitScript = `
(function () {
  try {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg)] text-[var(--text)]">
        <UnreadProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </UnreadProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </body>
    </html>
  );
}
