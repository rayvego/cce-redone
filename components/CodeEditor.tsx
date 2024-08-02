"use client";

import { useState, useCallback, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { CODE_SNIPPETS } from "@/lib/constants";
import { LanguageSelector } from "@/components/LanguageSelector";
import Output from "@/components/Output";
// collaborative part imports

import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import ActiveCollaborators from "@/components/ActiveCollaborators";
import ShareModal from "@/components/ShareModal";

const CodeEditor = ({ users, currentUserType, roomMetadata }: CodeEditorProps) => {
  // Collaborative code editor with undo/redo, live cursors, and live avatars
  const room = useRoom();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();

  const [language, setLanguage] = useState("javascript");

  // Set up Liveblocks Yjs provider and attach Monaco editor
  useEffect(() => {
    let yProvider: LiveblocksYjsProvider;
    let yDoc: Y.Doc;
    let binding: MonacoBinding;

    if (editorRef) {
      yDoc = new Y.Doc();
      const yText = yDoc.getText("monaco");
      yProvider = new LiveblocksYjsProvider(room, yDoc);
      setProvider(yProvider);

      // Attach Yjs to Monaco
      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        yProvider.awareness as unknown as Awareness,
      );
    }

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
      binding?.destroy();
    };
  }, [editorRef, room]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  const handleSelect = (language: string) => {
    setLanguage(language);
    if (editorRef && editorRef.getValue().trim() === "") {
      // Check for empty editor
      editorRef.setValue(CODE_SNIPPETS[language]);
    }
  };

  return (
    <div className={"flex justify-between gap-x-5 border rounded-xl p-5 shadow-2xl bg-gray-50"}>
      <div className={"w-3/5"}>
        <div className={"flex flex-col justify-between gap-y-3"}>
          <div className={"flex flex-row justify-between"}>
            <LanguageSelector onSelect={handleSelect} language={language} />
            <div className={"flex justify-between items-center gap-x-2"}>
              <ActiveCollaborators />
              <ShareModal
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
                roomId={room.id}
              />
            </div>
          </div>
          <Editor
            className={cn("shadow-md", language === "python" && "python-editor-theme")}
            // config options for the editor
            options={{
              minimap: { enabled: true },
              readOnly: currentUserType === "viewer", // Read-only if user doesn't have write access
            }}
            height="75vh"
            theme="vs-light"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={handleOnMount}
          />
          {currentUserType === "viewer" && ( // Conditionally render the overlay
            <div className="absolute inset-0 flex justify-center bg-black bg-opacity-40 z-20 pt-5 text-white font-bold text-2xl">
              <p>You only have permission to view 🥲</p>
            </div>
          )}
        </div>
      </div>

      <Output language={language} />
    </div>
  );
};

export default CodeEditor;