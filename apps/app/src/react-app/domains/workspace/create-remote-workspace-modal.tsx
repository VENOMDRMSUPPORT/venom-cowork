/** @jsxImportSource react */
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { t } from "../../../i18n";
import {
  errorBannerClass,
} from "./modal-styles";
import { RemoteWorkspaceFields } from "./remote-workspace-fields";
import type { CreateRemoteWorkspaceModalProps } from "./types";

type RemoteWorkspaceFormState = {
  venomcoworkHostUrl: string;
  venomcoworkToken: string;
  venomcoworkTokenVisible: boolean;
  directory: string;
  displayName: string;
};

const emptyRemoteWorkspaceForm: RemoteWorkspaceFormState = {
  venomcoworkHostUrl: "",
  venomcoworkToken: "",
  venomcoworkTokenVisible: false,
  directory: "",
  displayName: "",
};

export function CreateRemoteWorkspaceModal(
  props: CreateRemoteWorkspaceModalProps,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<RemoteWorkspaceFormState>(emptyRemoteWorkspaceForm);
  const { venomcoworkHostUrl, venomcoworkToken, venomcoworkTokenVisible, directory, displayName } = form;

  const showClose = props.showClose ?? true;
  const title = props.title ?? t("dashboard.create_remote_workspace_title");
  const subtitle =
    props.subtitle ?? t("dashboard.create_remote_workspace_subtitle");
  const confirmLabel =
    props.confirmLabel ?? t("dashboard.create_remote_workspace_confirm");
  const submitting = props.submitting ?? false;

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    return venomcoworkHostUrl.trim().length > 0;
  }, [venomcoworkHostUrl, submitting]);

  useEffect(() => {
    if (!props.open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [props.open]);

  useEffect(() => {
    if (!props.open) return;
    const defaults = props.initialValues ?? {};
    setForm({
      venomcoworkHostUrl: defaults.venomcoworkHostUrl?.trim() ?? "",
      venomcoworkToken: defaults.venomcoworkToken?.trim() ?? "",
      venomcoworkTokenVisible: false,
      directory: defaults.directory?.trim() ?? "",
      displayName: defaults.displayName?.trim() ?? "",
    });
  }, [props.initialValues, props.open]);

  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <DialogContent
        showCloseButton={showClose}
        className="flex max-h-[90vh] min-h-0 w-full max-w-xl flex-col overflow-hidden sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <RemoteWorkspaceFields
            hostUrl={venomcoworkHostUrl}
            onHostUrlInput={(value) => setForm((current) => ({ ...current, venomcoworkHostUrl: value }))}
            token={venomcoworkToken}
            tokenVisible={venomcoworkTokenVisible}
            onTokenInput={(value) => setForm((current) => ({ ...current, venomcoworkToken: value }))}
            onToggleTokenVisible={() =>
              setForm((current) => ({ ...current, venomcoworkTokenVisible: !current.venomcoworkTokenVisible }))
            }
            displayName={displayName}
            onDisplayNameInput={(value) => setForm((current) => ({ ...current, displayName: value }))}
            directory={directory}
            onDirectoryInput={(value) => setForm((current) => ({ ...current, directory: value }))}
            showDirectory
            submitting={submitting}
            hostInputRef={inputRef}
            title="Remote server details"
            description="Use the URL your VenomCowork server shared with you. Add a token only if the server needs one."
          />
        </div>

        <DialogFooter className="shrink-0 flex-col gap-3">
          {props.error ? (
            <div className={errorBannerClass}>{props.error}</div>
          ) : null}
          <div className="flex justify-end gap-3">
            {showClose ? (
              <DialogClose
                disabled={submitting}
                render={<Button variant="outline" disabled={submitting} />}
              >
                {t("common.cancel")}
              </DialogClose>
            ) : null}
            <Button
              type="button"
              onClick={() =>
                props.onConfirm({
                  venomcoworkHostUrl: venomcoworkHostUrl.trim(),
                  venomcoworkToken: venomcoworkToken.trim(),
                  directory: directory.trim() ? directory.trim() : null,
                  displayName: displayName.trim() ? displayName.trim() : null,
                })
              }
              disabled={!canSubmit}
              title={
                !venomcoworkHostUrl.trim()
                  ? t("dashboard.remote_base_url_required")
                  : undefined
              }
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
