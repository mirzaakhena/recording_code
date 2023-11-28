import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";

const Playlist = () => {
  return (
    <>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="vertical"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={[
              {
                key: "1",
                label: "Haha",
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>Content</Layout>
      </Layout>
    </>
  );
};

export default Playlist;
