import { Layout, Menu } from "antd";
import RecordingLayout from "./RecordingLayout";
import { Header } from "antd/es/layout/layout";
import { Link, Route, Routes } from "react-router-dom";
import Playlist from "./PlaylistLayout";

const HeaderLayout = () => {
  return (
    <>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ width: "100%", borderRight: 0 }}
            items={[
              { key: "1", label: <Link to="/recording">Recording</Link> },
              { key: "2", label: <Link to="/playlist">Playlist</Link> },
            ]}
          />
        </Header>
        <Routes>
          <Route
            path="/recording"
            element={<RecordingLayout />}
          />
          <Route
            path="/playlist"
            element={<Playlist />}
          />
        </Routes>
      </Layout>
    </>
  );
};

export default HeaderLayout;
