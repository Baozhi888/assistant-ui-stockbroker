import { ThreadState, Client } from "@langchain/langgraph-sdk";
import { LangChainMessage } from "@assistant-ui/react-langgraph";

const createClient = () => {
  const apiUrl = process.env["NEXT_PUBLIC_API_URL"] ?? "/api";
  return new Client({
    apiUrl,
  });
};

export const createAssistant = async (graphId: string) => {
  const client = createClient();
  return client.assistants.create({ graphId });
};

export const createThread = async () => {
  const client = createClient();
  return client.threads.create();
};

export const getThreadState = async (
  threadId: string
): Promise<ThreadState<Record<string, any>>> => {
  const client = createClient();
  return client.threads.getState(threadId);
};

export const updateState = async (
  threadId: string,
  fields: {
    newState: Record<string, any>;
    asNode?: string;
  }
) => {
  const client = createClient();
  return client.threads.updateState(threadId, {
    values: fields.newState,
    asNode: fields.asNode!,
  });
};

export const sendMessage = async (params: {
  threadId: string;
  message: LangChainMessage | null;
}) => {
  const client = createClient();

  let input: Record<string, any> | null = null;
  if (params.message !== null) {
    input = {
      messages: [params.message],
    };
  }
  const config = {
    configurable: {
      model_name: "openai",
    },
  };

  return client.runs.stream(
    params.threadId,
    process.env["NEXT_PUBLIC_LANGGRAPH_GRAPH_ID"]!,
    {
      input,
      config,
      streamMode: "messages",
    }
  );
};