import apiCall from "@/lib/api-call";
import type { NextRequest } from "next/server";
import { sessionUser } from "@/lib/api-call";

async function call(req: NextRequest, method: string) {
  const user = await sessionUser(req);
  let body = undefined
  try {
    body = await req.json();
  } catch (e) {
  }
  const reqUrl = new URL(req.url);
  const reqParams = reqUrl.searchParams;
  const uri = reqParams.get("uri");

  const res = await apiCall({
    uri: `api/v1/${uri}`,
    method: method,
    data: body,
    token: user?.apiToken,
  });
  return res;
}

export async function POST(req: NextRequest) {
  return await call(req, "POST");
}

export async function PUT(req: NextRequest) {
  return await call(req, "PUT");
}

export async function DELETE(req: NextRequest) {
  return await call(req, "DELETE");
}

export async function GET(req: NextRequest) {
  //get session token
  const user = await sessionUser(req);

  if (!user) {
    const router = require("next/router");
    router.push("/");
  }

  const reqUrl = new URL(req.url);
  const reqParams = reqUrl.searchParams;
  const uri = reqParams.get("uri");
  reqParams.delete("uri");

  const apiUrl = `api/v1/${uri}${
    reqParams.size > 0 ? "?" + reqParams.toString() : ""
  }`;
  const res = await apiCall({ uri: apiUrl.toString(), token: user?.apiToken });

  return res;
}
