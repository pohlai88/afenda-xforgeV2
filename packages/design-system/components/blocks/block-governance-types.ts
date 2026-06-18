import type { ReactNode } from "react";

type BlockDensity = "compact" | "default" | "comfortable";

type BlockIntent =
  | "approval"
  | "audit"
  | "configuration"
  | "operation"
  | "overview"
  | "risk"
  | "setup";

type BlockRuntimeState =
  | "empty"
  | "error"
  | "forbidden"
  | "loading"
  | "readonly"
  | "ready";

type BlockTone = "neutral" | "info" | "success" | "warning" | "critical";

type ErpSaveState =
  | "conflict"
  | "error"
  | "idle"
  | "offline"
  | "saved"
  | "saving";

type ErpRiskLevel = "none" | "watch" | "breach" | "critical";

interface BlockBaseProps {
  readonly blockId?: string;
  readonly density?: BlockDensity;
  readonly intent?: BlockIntent;
  readonly state?: BlockRuntimeState;
  readonly tone?: BlockTone;
}

interface BlockAction {
  readonly "aria-label"?: string;
  readonly auditEvent?: string;
  readonly auditScope?: string;
  readonly capability?: string;
  readonly confirmationLabel?: string;
  readonly critical?: boolean;
  readonly disabled?: boolean;
  readonly governanceCode?: string;
  readonly governanceStatus?: "allowed" | "denied" | "hidden";
  readonly href?: string;
  readonly icon?: ReactNode;
  readonly key: string;
  readonly label: string;
  readonly onClick?: React.MouseEventHandler<HTMLButtonElement>;
  readonly permission?: string;
  readonly reason?: string;
  readonly roles?: readonly string[];
  readonly variant?: string;
}

export type {
  BlockAction,
  BlockBaseProps,
  BlockDensity,
  BlockIntent,
  BlockRuntimeState,
  BlockTone,
  ErpRiskLevel,
  ErpSaveState,
};
