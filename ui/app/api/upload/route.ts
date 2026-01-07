import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import apiCall, { sessionUser } from "@/lib/api-call";
import http from "@/services/http";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  console.log("Uploading file", file);

//   const buffer = await (file as File).arrayBuffer();
//   const fileName = (file as File).name;
//   const filePath = path.join("/tmp", fileName);

//   await writeFile(filePath, new Uint8Array(buffer));

//   const apiFormData = new FormData();
//   apiFormData.append("file", new Blob([buffer]), fileName);

  const url = `${process.env.PRATUM_API_URL || ""}/api/v1/admin/upload`;

  const user = await sessionUser(req);

  formData.append("file", file);
  http.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${user?.apiToken}`,
    },
  });

  //   const res = await apiCall({
  //     uri: `api/v1/admin/upload`,
  //     method: "POST",
  //     data: apiFormData,
  //     token: user?.apiToken,
  //     contentType: "multipart/form-data",
  //   });

  return NextResponse.json({ message: "File uploaded successfully" });
};
