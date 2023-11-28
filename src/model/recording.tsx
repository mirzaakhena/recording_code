export type RequestType = "command" | "query";

export type Recording = {
  id: string;
  funcName: string;
  date: Date;
  requestType: RequestType;
  error: string;
  description: string;
  input: any;
  output: any;
  functions: [];
};
