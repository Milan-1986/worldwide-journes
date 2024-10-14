import Sidebar from "../Components/SideBar";
import Map from "../Components/Map";
import styles from "./AppLayout.module.css";
import User from "../Components/User";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
