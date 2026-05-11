"use client"

import { Button } from "@/components/ui/button"
import { cn, copyToClipboard } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { codeToHtml } from "shiki"

export type CodeBlockProps = {
  children?: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose relative flex w-full flex-col overflow-clip border",
        "border-border bg-card text-card-foreground rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type CodeBlockCodeProps = {
  code: string
  language?: string
  theme?: string
  className?: string
} & React.HTMLProps<HTMLDivElement>

function CodeBlockCode({
  code,
  language = "tsx",
  theme = "github-light",
  className,
  ...props
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()
  const resolvedShikiTheme =
    resolvedTheme === "dark" ? "github-dark" : theme

  useEffect(() => {
    async function highlight() {
      if (!code) {
        setHighlightedHtml("<pre><code></code></pre>")
        return
      }

      const html = await codeToHtml(code, {
        lang: language,
        theme: resolvedShikiTheme,
      })
      setHighlightedHtml(html)
    }
    highlight()
  }, [code, language, resolvedShikiTheme])

  async function handleCopy() {
    try {
      await copyToClipboard(code)
      setCopied(true)
      toast.success("Code copied")
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Could not copy code")
    }
  }

  const classNames = cn(
    "w-full overflow-x-auto text-[13px] [&>pre]:px-4 [&>pre]:py-4",
    className
  )

  // SSR fallback: render plain code if not hydrated yet
  return highlightedHtml ? (
    <>
      <div className="absolute right-2 top-2 z-10">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="bg-background/80 hover:bg-background border-border/70 shadow-sm backdrop-blur"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
      </div>
      <div
        className={classNames}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        {...props}
      />
    </>
  ) : (
    <>
      <div className="absolute right-2 top-2 z-10">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="bg-background/80 hover:bg-background border-border/70 shadow-sm backdrop-blur"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
      </div>
      <div className={classNames} {...props}>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </>
  )
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>

function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock }
