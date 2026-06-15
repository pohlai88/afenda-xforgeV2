import { cn, recipe } from "@repo/design-system/design-system";

export const PasswordSecurityTips = () => (
  <ul
    className={cn(
      "list-disc pl-5 text-text-secondary",
      recipe("captionText")
    )}
  >
    <li>Use a password manager to generate and store unique passwords.</li>
    <li>Do not reuse passwords across sites or apps.</li>
    <li>Avoid personal information in passwords.</li>
    <li>
      Enable multi-factor authentication on your account when available.
    </li>
  </ul>
);
