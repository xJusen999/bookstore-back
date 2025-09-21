import "./globals.css";  

export const metadata = { title: "Bookstore · Admin", description: "CRUD Autores" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          <nav className="nav">
            <a className="brand" href="/">BOOKSTORE</a>
            <a className="navlink" href="/">Home</a>
            <a className="navlink" href="/authors">Autores</a>
            <a className="navlink" href="/create">Crear</a>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
