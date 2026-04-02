import axios from "axios";

export type ApiResponse<TData> = {
  status: boolean;
  message: string;
  data: TData;
};

export function getApiErrorDetails(error: unknown) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return {
      message: error.response?.data?.message ?? error.message,
      status: error.response?.status ?? null,
      data: error.response?.data?.data ?? null,
      response: error.response?.data ?? null,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: null,
      data: null,
      response: null,
    };
  }

  return {
    message: null,
    status: null,
    data: null,
    response: null,
  };
}
