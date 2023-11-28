import { Button, Dropdown, MenuProps, Modal, Space, Switch, Table, TablePaginationConfig, Tag, message } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import { ColumnsType, FilterValue } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { Recording, RequestType } from "../model/recording";
import { formatDateWithSecond } from "../utility/date";
import TabDetailLayout from "./TabDetailLayout";
import { CarryOutOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined, PlayCircleOutlined, ReadOutlined } from "@ant-design/icons";

const baseUrl = "http://localhost:3000";

const headers = { "Content-Type": "application/json" };

interface TableParams {
  pagination?: TablePaginationConfig;
  filters?: Record<string, FilterValue>;
}

const RecordingLayout = () => {
  //

  // untuk message kalau ada error atau info
  const [messageApi, contextHolder] = message.useMessage();

  const [tableItems, setTableItems] = useState<Recording[]>([]);

  const [recordingStatus, setRecordingStatus] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  const [tableHeight, setTableHeight] = useState(540);

  // TABLE PARAM CHANGES
  const handleTableChange = (pagination: TablePaginationConfig) => {
    //
    setTableParams({ pagination });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTableItems([]);
    }
  };

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  const reload = async () => {
    //

    try {
      const url = `${baseUrl}/recording/record?size=${tableParams.pagination?.pageSize}&page=${tableParams.pagination?.current}`;
      const response = await fetch(url, { method: "GET", headers });
      const result = await response.json();

      setTableItems(result.items);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: result.count,
        },
      });

      //
    } catch (err) {
      messageApi.error((err as Error).message, 1);
    }
  };

  const onRecordingStatusSwitchChanged = async (checked: boolean) => {
    try {
      const url = `${baseUrl}/recording/status`;
      await fetch(url, { method: "POST", headers, body: JSON.stringify({ enabled: checked }) });
      setRecordingStatus(checked);
    } catch (err) {
      messageApi.error((err as Error).message, 3);
    }
  };

  const checkRecordingStatus = async () => {
    try {
      const url = `${baseUrl}/recording/status`;
      const response = await fetch(url, { method: "GET", headers });
      const result = await response.json();
      setRecordingStatus(result.enabled);
    } catch (err) {
      messageApi.error((err as Error).message, 3);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Recording[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
  };

  const showModalDetail = async (data: Recording) => {
    const url = `${baseUrl}/recording/record/${data.id}`;
    const response = await fetch(url, { method: "GET", headers });
    const result = await response.json();
    setSelectedRecording(result);
    setIsModalOpen(true);
  };

  const onMenuClick = async (key: string, item: Recording) => {
    if (key === "Delete") {
      const url = `${baseUrl}/recording/record/${item.id}`;
      await fetch(url, {
        method: "DELETE",
        headers,
      });
      reload();
      return;
    }

    if (key === "Test") {
      const url = `${baseUrl}/recording/record/${item.id}/test`;
      const response = await fetch(url, {
        method: "POST",
        headers,
      });

      const result = await response.json();

      messageApi.info(JSON.stringify(result));

      return;
    }

    if (key === "Replay") {
      const url = `${baseUrl}/recording/record/${item.id}/replay`;
      const response = await fetch(url, {
        method: "POST",
        headers,
      });

      const result = await response.json();

      messageApi.info(JSON.stringify(result));

      return;
    }
  };

  const tableColumns: ColumnsType<Recording> = [
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <>
          <ButtonGroup>
            <Dropdown.Button
              menu={{
                items: [
                  { key: "Replay", label: "Replay", icon: <PlayCircleOutlined /> },
                  { key: "Test", label: "Test", icon: <CarryOutOutlined /> },
                  { key: "Download", label: "Download", icon: <DownloadOutlined /> },
                  { key: "Clone", label: "Clone", icon: <CopyOutlined /> },
                  { key: "Delete", label: "Delete", danger: true, icon: <DeleteOutlined /> },
                ],
                onClick: (e) => onMenuClick(e.key, item),
              }}
              onClick={() => showModalDetail(item)}
            >
              <ReadOutlined /> JSON
            </Dropdown.Button>
          </ButtonGroup>
        </>
      ),
      // width: 100,
      // fixed: "left",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <pre style={{ margin: "auto 0px" }}>{text}</pre>,
      // width: 160,
      // fixed: "left",
    },
    {
      title: "Request Type",
      dataIndex: "requestType",
      key: "requestType",
      render: (text) => <Tag color={text === "query" ? "blue" : "red"}>{text}</Tag>,
      // fixed: "left",
    },
    {
      title: "FuncName",
      dataIndex: "funcName",
      key: "funcName",
      // fixed: "left",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Error Message",
      dataIndex: "error",
      key: "error",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (a: Date) => <>{formatDateWithSecond(a)}</>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
  ];

  useEffect(() => {
    //

    checkRecordingStatus();

    // Update table height when the window is resized
    const handleResize = () => {
      setTableHeight(window.innerHeight);
    };

    // Set initial height
    setTableHeight(window.innerHeight);

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    reload();
  }, [JSON.stringify(tableParams)]);

  return (
    <>
      {contextHolder}

      <Modal
        title={`${selectedRecording?.funcName} [${selectedRecording?.id}] `}
        width={600}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose={true}
      >
        {selectedRecording !== null && <TabDetailLayout recording={selectedRecording} />}
      </Modal>

      <Space
        direction="vertical"
        style={{ margin: "10px 20px 20px 20px" }}
      >
        <Space>
          <Button
            onClick={reload}
            style={{ marginRight: "30px" }}
          >
            Reload
          </Button>
          Recording Status
          <Switch
            checked={recordingStatus}
            onChange={onRecordingStatusSwitchChanged}
            checkedChildren={"enabled"}
            unCheckedChildren={"disabled"}
          />
        </Space>

        <Table
          size="small"
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          rowKey={(x) => x.id}
          columns={tableColumns}
          dataSource={tableItems}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          scroll={{ y: tableHeight - 260 }}
        />
      </Space>
    </>
  );
};

export default RecordingLayout;
