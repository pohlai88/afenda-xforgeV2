"use client";

import Editor from "@monaco-editor/react";

type MdxEditorPanelProperties = {
  value: string;
  onChange: (value: string) => void;
};

export const MdxEditorPanel = ({
  value,
  onChange,
}: MdxEditorPanelProperties) => (
  <div className="overflow-hidden rounded-lg border">
    <Editor
      defaultLanguage="markdown"
      height="420px"
      onChange={(nextValue) => onChange(nextValue ?? "")}
      options={{
        minimap: { enabled: false },
        wordWrap: "on",
        fontSize: 14,
        scrollBeyondLastLine: false,
      }}
      theme="vs-dark"
      value={value}
    />
  </div>
);
