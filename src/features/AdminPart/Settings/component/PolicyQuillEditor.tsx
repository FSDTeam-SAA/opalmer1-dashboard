"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ align: [] }, { color: [] }, { background: [] }],
    ["link", "clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "align",
  "color",
  "background",
  "link",
];

export default function PolicyQuillEditor({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange: (html: string) => void;
  readOnly: boolean;
}) {
  return (
    <div className="policy-editor mt-4 min-w-0">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        useSemanticHTML
        placeholder="Write the content that will appear in the app..."
      />
    </div>
  );
}
