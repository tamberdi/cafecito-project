import { Link, useLocation, useSearchParams } from "react-router-dom";

function Nav() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const suffix = userId ? `?userId=${userId}` : "";

  const links = [
    { to: `/browse${suffix}`, label: "Browse", match: "/browse" },
    { to: `/sessions${suffix}`, label: "Sessions", match: "/sessions" },
    { to: `/dashboard${suffix}`, label: "Dashboard", match: "/dashboard" },
    { to: `/profile${suffix}`, label: "Profile", match: "/profile" },
  ];

  function isActive(match) {
    return location.pathname.startsWith(match);
  }

  return (
    <>
      {/* Mobile: bottom tab bar */}
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

      {/* Desktop: top nav */}
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