"use client";

import {
  cn,
  Field,
  FieldLabel,
  Input,
  recipe,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/design-system";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState, useTransition } from "react";
import {
  createUserOrganization,
  inviteMember,
  listOrganizationMembers,
  renameOrganization,
} from "../actions/organizations";
import {
  ORGANIZATION_ROLES,
  type OrganizationRole,
} from "../organization-roles";
import type { OrganizationMemberRecord } from "../organizations";
import { AuthErrorAlert, AuthSuccessAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import {
  AuthLoadingState,
  AuthSection,
  AuthSectionHeader,
} from "./auth-section";

interface OrganizationSummary {
  id: string;
  name: string;
}

interface OrganizationManagerProperties {
  activeOrganizationId: string | null;
  canManageActiveOrganization: boolean;
  organizations: OrganizationSummary[];
}

export const OrganizationManager = ({
  activeOrganizationId,
  organizations,
  canManageActiveOrganization,
}: OrganizationManagerProperties) => {
  const router = useRouter();
  const createTitleId = useId();
  const renameTitleId = useId();
  const membersTitleId = useId();
  const [isPending, startTransition] = useTransition();
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrganizationRole>("member");
  const [members, setMembers] = useState<OrganizationMemberRecord[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const activeOrganization = organizations.find(
    (organization) => organization.id === activeOrganizationId
  );

  const loadMembers = useCallback(async () => {
    if (!activeOrganizationId) {
      setMembers([]);
      return;
    }

    setLoadingMembers(true);
    setError(null);

    const result = await listOrganizationMembers(activeOrganizationId);

    if (!result.ok) {
      setError(result.error);
      setMembers([]);
      setLoadingMembers(false);
      return;
    }

    setMembers(result.data);
    setLoadingMembers(false);
  }, [activeOrganizationId]);

  useEffect(() => {
    setRenameName(activeOrganization?.name ?? "");
    loadMembers().catch(() => undefined);
  }, [activeOrganization?.name, loadMembers]);

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await createUserOrganization(createName);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setCreateName("");
      setMessage(`Created workspace “${result.data.name}”.`);
      router.refresh();
    });
  };

  const handleRename = (event: React.FormEvent) => {
    event.preventDefault();

    if (!activeOrganizationId) {
      return;
    }

    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await renameOrganization(activeOrganizationId, renameName);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessage(`Renamed workspace to “${result.data.name}”.`);
      router.refresh();
    });
  };

  const handleInvite = (event: React.FormEvent) => {
    event.preventDefault();

    if (!activeOrganizationId) {
      return;
    }

    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await inviteMember(
        activeOrganizationId,
        inviteEmail,
        inviteRole
      );

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.data.kind === "added") {
        setMessage("Existing user added to this workspace.");
      } else {
        setMessage(`Invitation email sent to ${result.data.email}.`);
      }

      setInviteEmail("");
      await loadMembers();
      router.refresh();
    });
  };

  let membersContent = (
    <ul className="flex flex-col gap-2">
      {members.map((member) => (
        <li
          className="flex items-center justify-between gap-3 rounded-[var(--xforge-radius-md)] border border-border-default px-3 py-2"
          key={member.id}
        >
          <div>
            <p className={recipe("bodyMediumText")}>
              {member.displayName ?? member.email ?? member.userId}
            </p>
            <p className={recipe("captionText")}>
              {member.email ?? "No email"} · {member.role}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
  if (members.length === 0) {
    membersContent = <p className={recipe("captionText")}>No members yet.</p>;
  }
  if (loadingMembers) {
    membersContent = <AuthLoadingState label="Loading members…" />;
  }

  return (
    <div className={cn("flex flex-col", recipe("sectionGap"))}>
      {error ? <AuthErrorAlert message={error} /> : null}
      {message ? <AuthSuccessAlert message={message} /> : null}

      <AuthSection aria-labelledby={createTitleId}>
        <AuthSectionHeader
          description="Create another workspace you own."
          title="Create workspace"
          titleId={createTitleId}
        />
        <form
          className={cn("flex flex-col", recipe("fieldGap"))}
          noValidate
          onSubmit={handleCreate}
        >
          <Field>
            <FieldLabel htmlFor={`${createTitleId}-name`}>
              Workspace name
            </FieldLabel>
            <Input
              id={`${createTitleId}-name`}
              onChange={(event) => setCreateName(event.target.value)}
              placeholder="Acme Operations"
              required
              value={createName}
            />
          </Field>
          <AuthPendingButton
            className="w-fit"
            pending={isPending}
            pendingLabel="Creating…"
            type="submit"
            variant="secondary"
          >
            Create workspace
          </AuthPendingButton>
        </form>
      </AuthSection>

      {activeOrganization && canManageActiveOrganization ? (
        <AuthSection aria-labelledby={renameTitleId}>
          <AuthSectionHeader
            description={`Rename ${activeOrganization.name}.`}
            title="Active workspace"
            titleId={renameTitleId}
          />
          <form
            className={cn("flex flex-col", recipe("fieldGap"))}
            noValidate
            onSubmit={handleRename}
          >
            <Field>
              <FieldLabel htmlFor={`${renameTitleId}-name`}>Name</FieldLabel>
              <Input
                id={`${renameTitleId}-name`}
                onChange={(event) => setRenameName(event.target.value)}
                required
                value={renameName}
              />
            </Field>
            <AuthPendingButton
              className="w-fit"
              pending={isPending}
              pendingLabel="Saving…"
              type="submit"
              variant="secondary"
            >
              Save name
            </AuthPendingButton>
          </form>
        </AuthSection>
      ) : null}

      {activeOrganizationId ? (
        <AuthSection
          aria-busy={loadingMembers}
          aria-labelledby={membersTitleId}
        >
          <AuthSectionHeader
            description="Invite teammates by email. New users receive an invitation link."
            title="Members"
            titleId={membersTitleId}
          />

          {membersContent}

          {canManageActiveOrganization ? (
            <form
              className={cn("flex flex-col", recipe("fieldGap"))}
              noValidate
              onSubmit={handleInvite}
            >
              <Field>
                <FieldLabel htmlFor={`${membersTitleId}-email`}>
                  Invite by email
                </FieldLabel>
                <Input
                  autoComplete="email"
                  id={`${membersTitleId}-email`}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="teammate@company.com"
                  required
                  type="email"
                  value={inviteEmail}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${membersTitleId}-role`}>Role</FieldLabel>
                <Select
                  onValueChange={(value) =>
                    setInviteRole(value as OrganizationRole)
                  }
                  value={inviteRole}
                >
                  <SelectTrigger id={`${membersTitleId}-role`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <AuthPendingButton
                className="w-fit"
                pending={isPending}
                pendingLabel="Sending…"
                type="submit"
                variant="primary"
              >
                Invite member
              </AuthPendingButton>
            </form>
          ) : (
            <p className={recipe("captionText")}>
              Only workspace owners can invite or rename members.
            </p>
          )}
        </AuthSection>
      ) : null}
    </div>
  );
};
