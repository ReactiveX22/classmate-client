"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export type ChatContainerRootProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export type ChatContainerContentProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export type ChatContainerScrollAnchorProps = {
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const ChatContainerRoot = forwardRef<HTMLDivElement, ChatContainerRootProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex overflow-y-auto", className)}
        role="log"
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChatContainerRoot.displayName = "ChatContainerRoot"

const ChatContainerContent = forwardRef<HTMLDivElement, ChatContainerContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex w-full flex-col", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChatContainerContent.displayName = "ChatContainerContent"

const ChatContainerScrollAnchor = forwardRef<HTMLDivElement, ChatContainerScrollAnchorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("h-px w-full shrink-0", className)}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
ChatContainerScrollAnchor.displayName = "ChatContainerScrollAnchor"

export { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor }
