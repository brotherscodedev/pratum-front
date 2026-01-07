import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function sessionUser(req: NextRequest) {
  const user = await getToken({ req, secret });
  return user;
}

// api request interface
export interface apiCallParams {
  uri: string;
  method?: string;
  token?: string;
  data?: any;
  contentType?: string;
}

const apiCall = async ({
  uri,
  method = "GET",
  data,
  token,
  contentType = "application/json",
}: apiCallParams) => {
  const headers = {
    "Content-Type": contentType,
    Authorization: `Bearer ${token}`,
  };

  let body = undefined;

  if (data && contentType === "application/json") {
    body = JSON.stringify(data);
  }

  const url = `${process.env.PRATUM_API_URL || ""}/${uri}`;
  try {
    const res = await fetch(url, {
      method,
      headers: headers,
      body,
    });
    return res;
  } catch (e) {
    console.log("apiCall:", e);
    throw e;
  }
};

export default apiCall;
