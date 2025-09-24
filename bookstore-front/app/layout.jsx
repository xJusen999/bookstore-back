import "./globals.css";

export const metadata = {
  title: "Bookstore",
  description: "CRUD · Autores · Libros · Premios",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          <nav className="nav">
            <a className="brand" href="/">BOOKSTORE</a>

            {}
            <a className="navlink" href="/home">Home</a>
            <a className="navlink" href="/admin/activity">Actividad</a>

            <span style={{ marginLeft: "auto" }} />

            {}
            <a className="navlink" href="/prizes/create">Crear premio</a>
            <a className="navlink" href="/authors/create">Crear autor</a>
            <a className="navlink" href="/books/create">Crear libro</a>

            {}
            <a className="navlink" href="/books">Books</a>
            <a className="navlink" href="/authors">Autores</a>
          </nav>
        </header>

        <main className="container">{children}</main>
      </body>
    </html>
  );
}
