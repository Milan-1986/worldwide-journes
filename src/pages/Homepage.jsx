import styles from "./Homepage.module.css";
import PageNav from "../Components/PageNav";
import { Link } from "react-router-dom";
import { useFakeAuth } from "../Context/AuthContext";

export default function Homepage() {
  const { isAuthenticated } = useFakeAuth();
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          You travel the world.
          <br />
          WorldWide keeps track of your adventures.
        </h1>
        <h2>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world.
        </h2>
        {isAuthenticated && (
          <Link to="/app" className="cta">
            Start tracking now
          </Link>
        )}
      </section>
    </main>
  );
}
