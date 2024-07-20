"use client";

import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { CODE_SNIPPETS } from "@/lib/constants";
import { LanguageSelector } from "@/components/LanguageSelector";
import { updateFile } from "@/lib/actions/file.actions";
import { Button } from "@/components/ui/button";
import Output from "@/components/Output";

const CodeEditor = ({ code, fileId }: CodeEditorProps) => {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor: any) => {
    editor.focus();
    setValue(code || "");
  };

  const handleSelect = (language: string) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const handleSave = async () => {
    const res = await updateFile({ fileId: fileId, fileContent: value });
    if (!res) {
      console.error("Error saving file");
      // add toast message
      return;
    }
    console.log("File saved");
    // add toast message
  };

  return (
    <div className={"flex justify-between gap-x-5 border rounded-xl p-5 shadow-2xl bg-gray-50"}>
      <div className={"w-3/5"}>
        <div className={"flex flex-col justify-between gap-y-3"}>
          <div className={"flex flex-row justify-between"}>
            <LanguageSelector onSelect={handleSelect} language={language} />
            <Button onClick={handleSave}>Save</Button>
          </div>
          <Editor
            className={cn("shadow-md", language === "python" && "python-editor-theme")}
            // config options for the editor
            options={{ minimap: { enabled: true } }}
            height="75vh"
            theme="vs-light"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(newValue) => setValue(newValue || "")}
          />
        </div>
      </div>

      <Output code={value} language={language} />
    </div>
  );
};

export default CodeEditor;