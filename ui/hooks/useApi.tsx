import { ApiResponse } from "@/types";
import { th } from "date-fns/locale";
import { useEffect, useState } from "react";

type params = {
  [name: string]: string;
};

export type HttpMethodsType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiGetProps {
  uri: string;
  params?: unknown;
  dependencyList?: any[];
}

interface ApiGetResponse<T> {
  result: T | null;
  loading: boolean;
  error: any;
}

export function useApiGet<T>({
  uri,
  params,
  dependencyList = [],
}: ApiGetProps): ApiGetResponse<T> {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseParams = (params: any): string => {
    if (!params) return "";

    const uriParams = Object.entries(params)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

    return "&" + uriParams
  }

  useEffect(() => {
    fetch("/api/backend?uri=" + uri + parseParams(params))
      .then((res) => {
        if (res.status === 400) {
          //TODO toast here
        }
        setLoading(false);
        return res.json();
      })
      .then((result) => {
        setResult(result);
        setLoading(false);
      })
      .catch((e) => {
        console.log("error", e);
        setError(e);
        setLoading(false);
        //TODO toast here
      });
  }, [uri, ...dependencyList]);

  return {
    result,
    loading,
    error,
  };
}

interface ApiRequest {
  uri: string;
  body?: unknown;
  method?: HttpMethodsType;
}

export async function callApi({
  uri,
  body = {},
  method = "POST",
}: ApiRequest): Promise<ApiResponse> {
  try {
    const res = await fetch(`/api/backend?uri=${uri}`, {
      method: method,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return json as ApiResponse;
  } catch (e) {
    console.log("error", e);
    return {
      message: "Um erro inesperado ocorreu",
      success: false,
    } as ApiResponse;
  }
}
