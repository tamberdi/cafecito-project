import { Link, useLocation } from "react-router-dom";

function Nav() {
  const location = useLocation();

  const links = [
    { to: "/browse", label: "Browse", match: "/browse" },
    { to: "/dashboard", label: "Dashboard", match: "/dashboard" },
    { to: "/profile", label: "Profile", match: "/profile" },
  ];

  function isActive(match) {
    return location.pathname.startsWith(match);
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 sm:hidden z-40">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-xs px-2 ${isActive(link.match) ? "text-blue-600 font-medium" : "text-gray-500"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <nav className="hidden sm:flex justify-center gap-6 py-4 border-b mb-6">
        <Link to="/" className="font-bold text-blue-600">Cafecito</Link>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm ${isActive(link.match) ? "text-blue-600 font-medium" : "text-gray-500"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

export default Nav;