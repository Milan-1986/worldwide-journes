import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import styles from "./PageNav.module.css";
import { useFakeAuth } from "../Context/AuthContext";

function PageNav() {
  const { isAuthenticated, logout } = useFakeAuth();
  const navigate = useNavigate();

  function handleClick() {
    if (isAuthenticated) logout();
    navigate;
  }

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <NavLink to="/" className={styles.ctaLink} onClick={handleClick}>
              Logout
            </NavLink>
          ) : (
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
