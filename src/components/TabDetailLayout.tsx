import JsonView from "@uiw/react-json-view";
import { Tabs } from "antd";
import { Recording } from "../model/recording";

const collapsedJSONLevel = 2;

interface Props {
  recording: Recording;
}

const TabDetailLayout = (props: Props) => {
  return (
    <Tabs
      defaultActiveKey="input"
      items={[
        {
          key: "input",
          label: "Primary Input",
          children: (
            <>
              {props.recording.input ? (
                <JsonView
                  collapsed={collapsedJSONLevel}
                  displayDataTypes={false}
                  value={props.recording.input}
                />
              ) : (
                <></>
              )}
            </>
          ),
        },
        {
          key: "output",
          label: "Primary Output",
          children: (
            <>
              {props.recording.output ? (
                <JsonView
                  collapsed={collapsedJSONLevel}
                  displayDataTypes={false}
                  value={props.recording.output}
                />
              ) : (
                <></>
              )}
            </>
          ),
        },
        {
          key: "functions",
          label: "Functions",
          children: (
            <>
              {props.recording ? (
                <Tabs
                  tabPosition="left"
                  items={props.recording.functions.map((x: any, i) => {
                    const id = String(i + 1);
                    return {
                      label: `[${x.requestType}] ${x.funcName}`,
                      key: id,
                      children: (
                        <Tabs
                          items={[
                            {
                              label: "Secondary Input",
                              key: "input",
                              children: x.input ? (
                                <JsonView
                                  collapsed={collapsedJSONLevel}
                                  displayDataTypes={false}
                                  value={x.input}
                                />
                              ) : (
                                <></>
                              ),
                            },
                            {
                              label: "Secondary Output",
                              key: "output",
                              children: x.output ? (
                                <JsonView
                                  // collapsed={1}
                                  displayDataTypes={false}
                                  value={x.output}
                                />
                              ) : (
                                <></>
                              ),
                            },
                          ]}
                        />
                      ),
                    };
                  })}
                />
              ) : (
                ""
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default TabDetailLayout;
