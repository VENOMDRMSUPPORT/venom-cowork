/** @jsxImportSource react */
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// No operator support contact is wired in this vanilla build. Set
// VENOMCOWORK_SUPPORT_CONTACT (or VITE_VENOMCOWORK_SUPPORT_CONTACT at build
// time) to enable the help dialog. The string is used as a plain mailto
// address when it contains '@', or as a full URL otherwise.
const SUPPORT_CONTACT =
  (typeof import.meta !== "undefined" &&
    typeof import.meta.env?.VITE_VENOMCOWORK_SUPPORT_CONTACT === "string"
    ? import.meta.env.VITE_VENOMCOWORK_SUPPORT_CONTACT.trim()
    : "") ||
  (typeof process !== "undefined" && typeof process.env?.VENOMCOWORK_SUPPORT_CONTACT === "string"
    ? process.env.VENOMCOWORK_SUPPORT_CONTACT.trim()
    : "");
const SUPPORT_MAILTO = SUPPORT_CONTACT.includes("@")
  ? `mailto:${SUPPORT_CONTACT}?subject=VenomCowork%20Den%20remote%20worker%20upgrade`
  : SUPPORT_CONTACT;

/**
 * Small inline link rendered inside the remote-worker error card. When clicked,
 * it opens a dialog explaining the VenomCowork Den upgrade situation and how to
 * reach support.
 */
export function VenomCoworkDenHelpLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mt-2 inline-flex items-center text-[11px] font-medium text-blue-11 underline-offset-2 hover:underline"
        onClick={() => setOpen(true)}
      >
        Using VenomCowork Den Remote Workers? Click here
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
          <DialogTitle>VenomCowork Den remote workers</DialogTitle>
          <DialogDescription>
            If your remote worker is no longer compatible with the current
            VenomCowork app, ask your administrator to upgrade it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-[13px] leading-5 text-gray-11">
          <p>To get back online:</p>
          <ul className="ml-4 list-disc space-y-2">
            {SUPPORT_CONTACT ? (
              <li>
                Contact{" "}
                <a
                  href={SUPPORT_MAILTO}
                  className="font-medium text-blue-11 hover:underline"
                >
                  {SUPPORT_CONTACT}
                </a>{" "}
                and ask them to upgrade your worker.
              </li>
            ) : (
              <li>Ask your VenomCowork administrator to upgrade the worker.</li>
            )}
            <li>
              Use the in-app{" "}
              <span className="font-medium text-dls-text">Feedback</span>{" "}
              button to file a note for your admin.
            </li>
          </ul>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Close
          </DialogClose>
          {SUPPORT_CONTACT ? (
            <Button
              type="button"
              onClick={() => {
                window.location.href = SUPPORT_MAILTO;
              }}
            >
              Contact support
            </Button>
          ) : null}
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
