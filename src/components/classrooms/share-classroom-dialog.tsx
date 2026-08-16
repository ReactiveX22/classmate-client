"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Classroom } from "@/lib/api/services/classroom.service";
import { copyToClipboard } from "@/lib/utils";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconHash,
} from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

interface ShareClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: Pick<Classroom, "name" | "classCode">;
}

export function ShareClassroomDialog({
  open,
  onOpenChange,
  classroom,
}: ShareClassroomDialogProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const joinLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/join/${classroom.classCode}`;
  }, [classroom.classCode]);

  const handleCopy = async () => {
    if (!joinLink) return;
    try {
      await copyToClipboard(joinLink);
      setCopied(true);
      toast.success("Class link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the class link");
    }
  };

  const handleCopyCode = async () => {
    try {
      await copyToClipboard(classroom.classCode);
      setCopiedCode(true);
      toast.success("Class code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast.error("Could not copy the class code");
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg || !joinLink) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const size = 1024;
    const padding = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding, size, size);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `class-join-${classroom.classCode}.png`;
      a.click();
      toast.success("QR code downloaded!");
    };
    img.src = `data:image/svg+xml;base64,${btoa(
      unescape(encodeURIComponent(svgData)),
    )}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share Class Link</DialogTitle>
          <DialogDescription>
            Students can scan or open this link to join {classroom.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          <div
            ref={qrRef}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <QRCode
              value={joinLink}
              size={180}
              fgColor="#111827"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Scan to join {classroom.name}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={handleCopy}>
            {copied ? (
              <IconCheck size={16} className="mr-2" />
            ) : (
              <IconCopy size={16} className="mr-2" />
            )}
            {copied ? "Copied!" : "Copy link"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleCopyCode}>
            {copiedCode ? (
              <IconCheck size={16} className="mr-2" />
            ) : (
              <IconHash size={16} className="mr-2" />
            )}
            {copiedCode ? "Code copied!" : "Copy code"}
          </Button>
          <Button className="w-full" onClick={handleDownload}>
            <IconDownload size={16} className="mr-2" />
            Download QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}