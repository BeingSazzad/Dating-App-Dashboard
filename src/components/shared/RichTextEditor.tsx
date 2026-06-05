import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}

interface ToolButton {
  cmd: string;
  arg?: string;
  icon: React.ElementType;
  label: string;
}

const TOOLS: ToolButton[] = [
  { cmd: "bold", icon: Bold, label: "Bold" },
  { cmd: "italic", icon: Italic, label: "Italic" },
  { cmd: "underline", icon: Underline, label: "Underline" },
  { cmd: "formatBlock", arg: "h2", icon: Heading2, label: "Heading" },
  { cmd: "insertUnorderedList", icon: List, label: "Bulleted list" },
  { cmd: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { cmd: "undo", icon: Undo, label: "Undo" },
  { cmd: "redo", icon: Redo, label: "Redo" },
];

/**
 * Lightweight contentEditable rich-text editor (no external dependency).
 * For richer needs (tables, images, markdown) swap in TipTap — the
 * `value`/`onChange` contract stays the same.
 */
export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const exec = (tool: ToolButton) => {
    ref.current?.focus();
    document.execCommand(tool.cmd, false, tool.arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  return (
    <div className={cn("rounded-lg border border-input bg-card", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-1.5">
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(tool);
            }}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <tool.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="prose-sm min-h-[260px] max-w-none px-4 py-3 text-sm leading-relaxed focus:outline-none [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc"
        suppressContentEditableWarning
      />
    </div>
  );
}
