"use client";

import {
  AfendaAppContentRightRail,
  Button,
  Input,
  blockRecipe,
  cn,
} from "@repo/design-system";
import { SendIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { parseOrbitCaseRoute } from "@/lib/app-shell/orbit-case-route-context";

interface LynxMessage {
  readonly content: string;
  readonly id: string;
  readonly role: "assistant" | "user";
}

interface LynxAiContextHint {
  readonly description: string;
  readonly moduleLabel: string;
  readonly prompts: readonly string[];
}

function resolveLynxAiContext(pathname: string): LynxAiContextHint {
  const orbitContext = parseOrbitCaseRoute(pathname);

  if (orbitContext) {
    switch (orbitContext.kind) {
      case "workspace":
        return {
          moduleLabel: "Orbit Case",
          description:
            "Summarize open cases, draft capture text, or suggest next push destinations.",
          prompts: [
            "Summarize my open cases",
            "Draft a case title for a supplier delay",
            "Which morph destination fits a budget approval?",
          ],
        };
      case "case":
        return {
          moduleLabel: "Orbit Case",
          description:
            "Ask about this case, draft comments, or plan a governed push.",
          prompts: [
            "Suggest a push destination for this case",
            "Draft a comment for the assignee",
            "What should I check before closing this case?",
          ],
        };
      case "morph-list":
        return {
          moduleLabel: orbitContext.label,
          description: `Help triage ${orbitContext.label.toLowerCase()} items pushed from cases.`,
          prompts: [
            `Summarize recent ${orbitContext.label.toLowerCase()} items`,
            "What fields should I verify before approval?",
            "Draft a follow-up case from this queue",
          ],
        };
      case "morph-detail":
        return {
          moduleLabel: orbitContext.label,
          description: "Review this request and suggest the next operational step.",
          prompts: [
            "Summarize this request",
            "List missing fields I should fill in",
            "Draft a case comment about this request",
          ],
        };
      case "settings":
        return {
          moduleLabel: "Orbit Case registry",
          description:
            "Explain push destinations, templates, and registry configuration.",
          prompts: [
            "Explain push destinations vs templates",
            "When should I add a custom destination?",
            "How does tenant-scoped routing work?",
          ],
        };
      default:
        break;
    }
  }

  if (pathname.startsWith("/cms")) {
    return {
      moduleLabel: "CMS",
      description: "Draft content, summarize collections, or plan publishing steps.",
      prompts: [
        "Draft a document summary",
        "Suggest SEO improvements for this page",
        "Outline a publishing checklist",
      ],
    };
  }

  if (pathname.startsWith("/dashboard")) {
    return {
      moduleLabel: "Dashboard",
      description: "Interpret workspace signals and suggest operator next steps.",
      prompts: [
        "What should I review first today?",
        "Summarize dashboard priorities",
        "Draft a status update for my team",
      ],
    };
  }

  return {
    moduleLabel: "Workspace",
    description:
      "Policy-aware automation for your tenant — ask Lynx about work, records, and next steps.",
    prompts: [
      "What can Lynx help me with here?",
      "Summarize what I am looking at",
      "Suggest the next action in this module",
    ],
  };
}

function createMessageId(): string {
  return `lynx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function LynxAiRightRail() {
  const pathname = usePathname();
  const context = useMemo(() => resolveLynxAiContext(pathname), [pathname]);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<readonly LynxMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: createMessageId(),
        role: "assistant",
        content: `Hi — I am Lynx. I am context-aware for ${context.moduleLabel}. ${context.description}`,
      },
    ]);
    setDraft("");
  }, [context.description, context.moduleLabel]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: LynxMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: `Lynx received your question in ${context.moduleLabel}. Streaming and tool routing will connect here — for now this panel confirms module context from "${pathname}".`,
        },
      ]);
    }, 300);
  };

  const handlePromptClick = (prompt: string) => {
    setDraft(prompt);
  };

  return (
    <AfendaAppContentRightRail className="p-0">
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex items-center gap-2 border-b border-border-default px-3 py-2.5">
          <Image
            alt=""
            aria-hidden="true"
            className="size-5 shrink-0 dark:invert"
            height={20}
            src="/icons/lynx-operator/lynx-operator.svg"
            width={20}
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-text-primary">Lynx AI</p>
            <p className="truncate text-[length:var(--xforge-font-caption-size)] text-text-secondary">
              {context.moduleLabel}
            </p>
          </div>
          <SparklesIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-text-secondary"
          />
        </header>

        <div className="grid gap-2 border-b border-border-default px-3 py-2">
          <p className="text-[length:var(--xforge-font-caption-size)] leading-snug text-text-secondary">
            {context.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {context.prompts.map((prompt) => (
              <Button
                className="h-auto max-w-full whitespace-normal px-2 py-1 text-left text-[length:var(--xforge-font-caption-size)] leading-snug"
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                size="sm"
                type="button"
                variant="secondary"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        <div
          aria-label="Lynx conversation"
          aria-live="polite"
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3"
          role="log"
        >
          {messages.map((message) => (
            <article
              className={cn(
                "max-w-full rounded-lg px-3 py-2 text-sm leading-relaxed",
                message.role === "user"
                  ? "ml-6 bg-surface-muted text-text-primary"
                  : "mr-2 border border-border-default/70 bg-background text-text-primary"
              )}
              key={message.id}
            >
              {message.content}
            </article>
          ))}
        </div>

        <form
          className="border-t border-border-default p-3"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-2">
            <Input
              aria-label="Message Lynx"
              className="min-w-0 flex-1"
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Ask Lynx about ${context.moduleLabel.toLowerCase()}…`}
              value={draft}
            />
            <Button
              aria-label="Send message"
              disabled={!draft.trim()}
              size="icon-sm"
              type="submit"
              variant="primary"
            >
              <SendIcon aria-hidden="true" className="size-4" />
            </Button>
          </div>
          <p
            className={cn(
              blockRecipe("blockDescription"),
              "mt-2 text-[length:var(--xforge-font-caption-size)]"
            )}
          >
            Tenant-scoped automation surface. Responses will stream here when
            Lynx routing is connected.
          </p>
        </form>
      </div>
    </AfendaAppContentRightRail>
  );
}
