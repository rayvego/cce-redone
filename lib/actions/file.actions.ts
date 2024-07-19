import { parseStringify } from "@/lib/utils";
import { LANGUAGE_VERSIONS } from "@/lib/constants";
import { getUserInfo } from "@/lib/actions/user.actions";
import connectToDatabase from "@/lib/mongoose";
import File from "@/models/File";

export const executeCode = async ({ language, sourceCode }: ExecuteCodeProps) => {
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: LANGUAGE_VERSIONS[language],
        files: [{ content: sourceCode }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "External API error");
    }

    return parseStringify(data);
  } catch (error: any) {
    console.error("Code execution error:", error);
  }
};

export const getFiles = async () => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();
    const files = await File.find({ externalUserId: user.id });
    return parseStringify(files);
  } catch (error: any) {
    console.error("Error: ", error);
  }
};