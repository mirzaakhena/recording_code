import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlayCircleOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, Layout, Menu, MenuProps, Modal, Space, Table, Tag, message } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import { useForm } from "antd/es/form/Form";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

const baseUrl = "http://localhost:3000";

type CreatePlaylistPayload = {
  name: string;
  recordIds: string;
};

type PlaylistItem = {
  id: string;
  funcName: string;
  description: string;
  requestType: "command" | "query";
};

type PlaylistSidebarItem = {
  key: string;
  label: string;
  name: string;
  data: PlaylistItem[];
};

const Playlist = () => {
  //

  const [modalApi, modalContextHolder] = Modal.useModal();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [dataSource, setDataSource] = useState<PlaylistItem[]>([]);

  const [form] = useForm<CreatePlaylistPayload>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [playlist, setPlaylist] = useState<PlaylistSidebarItem[]>([]);

  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistSidebarItem>();

  const [modalInputType, setModalInputType] = useState<"create" | "update">("create");

  const columns: ColumnsType<PlaylistItem> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text) => <pre style={{ margin: "auto 0px" }}>{text}</pre>,
      width: 150,
    },
    {
      title: "Usecase",
      dataIndex: "funcName",
      key: "funcName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "RequestType",
      dataIndex: "requestType",
      key: "requestType",
      render: (text) => <Tag color={text === "query" ? "blue" : "red"}>{text}</Tag>,
      width: 100,
    },
  ];

  const onReload = async () => {
    //

    const config = { method: "GET", headers: { "Content-Type": "application/json" } };
    const response = await fetch(`${baseUrl}/recording/playlist`, config);
    const result = await response.json();

    setPlaylist(
      result.items.map((item: any) => {
        return {
          key: item.id,
          label: `[${item.id}] ${item.name}`,
          name: item.name,
          data: item.records,
        };
      })
    );
  };

  const onFinish = async () => {
    //

    const values: CreatePlaylistPayload = form.getFieldsValue();

    try {
      const body = {
        name: values.name,
        recordIds: values.recordIds?.split("\n").filter((x) => x.length > 0),
      };

      const config = {
        method: modalInputType === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };
      let url = `${baseUrl}/recording/playlist`;
      if (modalInputType === "update") {
        url = `${url}/${selectedPlaylist?.key}`;
      }
      const response = await fetch(url, config);
      const result = await response.json();

      if (response.status !== 200) {
        messageApi.error(result.message);
        return;
      }

      messageApi.info(result.message);
      setIsModalOpen(false);

      await onReload();
    } catch (err: any) {
      messageApi.error(err.message);
    }
  };

  const onSelect: MenuProps["onClick"] = (e) => {
    const p = playlist.find((x: PlaylistSidebarItem) => x.key === e.key);
    setDataSource(p?.data as PlaylistItem[]);
    setSelectedPlaylist(p);
  };

  const createPlaylist = () => {
    form.resetFields();
    setModalInputType("create");
    setIsModalOpen(true);
  };

  const updatePlaylist = () => {
    form.setFieldsValue({ name: selectedPlaylist?.name, recordIds: selectedPlaylist?.data.map((x) => x.id).join("\n") });
    setModalInputType("update");
    setIsModalOpen(true);
  };

  const deletePlaylist = async () => {
    modalApi.confirm({
      title: "Delete Confirmation",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure want to delete playlist with id ${selectedPlaylist?.key}`,
      onOk: async () => {
        try {
          const config = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          };
          const url = `${baseUrl}/recording/playlist/${selectedPlaylist?.key}`;
          const response = await fetch(url, config);
          const result = await response.json();

          if (response.status !== 200) {
            messageApi.error(result.message);
            return;
          }

          messageApi.info(result.message);
          await onReload();
        } catch (e: any) {}
      },
    });
  };

  const replayPlaylist = () => {
    modalApi.confirm({
      title: "Replay Confirmation",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure want to replay playlist with id ${selectedPlaylist?.key}`,
      onOk: async () => {
        try {
          const config = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          };
          const url = `${baseUrl}/recording/playlist/${selectedPlaylist?.key}/replay`;
          const response = await fetch(url, config);
          const result = await response.json();

          if (response.status !== 200) {
            messageApi.error(result.message);
            return;
          }

          messageApi.info(result.message);
        } catch (e: any) {}
      },
    });
  };

  useEffect(() => {
    onReload();
  }, []);

  return (
    <>
      {messageContextHolder}
      {modalContextHolder}
      <Modal
        title="Create new Playlist"
        open={isModalOpen}
        onOk={() => onFinish()}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Playlist"
            name="recordIds"
          >
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>

      <Layout>
        <Space
          direction="vertical"
          style={{ margin: "10px 20px 20px 20px" }}
        >
          <Space>
            <Button onClick={onReload}>
              <ReloadOutlined />
              Reload
            </Button>
            <ButtonGroup>
              <Dropdown.Button
                menu={{
                  items: selectedPlaylist?.key
                    ? [
                        { key: "Update", label: `Update ${selectedPlaylist?.key}`, icon: <EditOutlined />, onClick: () => updatePlaylist() },
                        { key: "Delete", label: `Delete ${selectedPlaylist?.key}`, danger: true, icon: <DeleteOutlined />, onClick: () => deletePlaylist() },
                      ]
                    : [{ key: "no select", label: "Select one of Playlist first", disabled: true }],
                }}
                onClick={createPlaylist}
              >
                <PlusOutlined /> Create New Playlist
              </Dropdown.Button>
            </ButtonGroup>
            <Button
              onClick={replayPlaylist}
              type="primary"
              disabled={selectedPlaylist?.key ? false : true}
            >
              <PlayCircleOutlined /> Replay {selectedPlaylist?.key}
            </Button>
          </Space>
          <Layout>
            <Sider width={600}>
              <Menu
                mode="vertical"
                defaultSelectedKeys={["1"]}
                style={{ height: "calc(100vh - 140px)", borderRight: 0 }}
                items={playlist}
                onClick={onSelect}
              />
            </Sider>
            <Content style={{ padding: "0 10px 24px" }}>
              <Table
                rowKey={(x) => x.id}
                dataSource={dataSource}
                columns={columns}
              />
            </Content>
          </Layout>
        </Space>
      </Layout>
    </>
  );
};

export default Playlist;
