import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/api-call";
import http from "@/services/http";
import FormData from "form-data";

export const POST = async (req: NextRequest) => {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const user = await sessionUser(req);
    const url = `${process.env.PRATUM_API_URL || ""}/api/v1/ocupante/exclusao-pontos/arquivos`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const formData = new FormData();
    formData.append("file", buffer, file.name);

    const res = await http.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${user?.apiToken}`,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    console.error("Erro no upload:", err?.response?.data || err.message);

    const status = err?.response?.status || 500;
    const data = err?.response?.data || { error: "Erro interno" };

    return NextResponse.json(data, { status });
  }
};
