"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const SPRING_PANEL = {
  bounce: 0.05,
  duration: 0.25,
  type: "spring" as const,
};

const BACKDROP_DURATION = 0.2;
const STAGGER_DELAY = 0.06;

export interface DialogProps {
  children?: React.ReactNode;
  className?: string;
  description?: string;
  footer?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  showCloseButton?: boolean;
  title?: string;
  trigger?: React.ReactNode;
}

export interface AlertDialogProps {
  children?: React.ReactNode;
  className?: string;
  description?: string;
  footer?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title?: string;
  trigger?: React.ReactNode;
}

const StaggerChild = ({
  children,
  index,
  shouldReduceMotion,
}: {
  children: React.ReactNode;
  index: number;
  shouldReduceMotion: boolean | null;
}) => (
  <motion.div
    animate={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 1, transform: "translateY(0px)" }
    }
    exit={
      shouldReduceMotion
        ? { opacity: 0, transition: { duration: 0 } }
        : {
          opacity: 0,
          transform: "translateY(4px)",
          transition: { duration: 0.12 },
        }
    }
    initial={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 0, transform: "translateY(8px)" }
    }
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
          bounce: 0,
          delay: index * STAGGER_DELAY,
          duration: 0.25,
          type: "spring" as const,
        }
    }
  >
    {children}
  </motion.div>
);

const AnimatedCloseButton = ({
  onClick,
  shouldReduceMotion,
}: {
  onClick: () => void;
  shouldReduceMotion: boolean | null;
}) => (
  <motion.button
    aria-label="Close dialog"
    className="absolute top-4 end-4 cursor-pointer rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
    onClick={onClick}
    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    type="button"
    whileHover={shouldReduceMotion ? {} : { rotate: 90 }}
  >
    <X aria-hidden="true" className="pointer-events-none size-4 shrink-0" />
    <span className="sr-only">Close</span>
  </motion.button>
);

export default function Dialog({
  open,
  onOpenChange,
  title,
  description,
  showCloseButton = true,
  className,
  children,
  trigger,
  footer,
}: DialogProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const [showContent, setShowContent] = useState(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) setShowContent(true);
    prevOpenRef.current = !!isOpen;
  }, [isOpen]);

  const handleAnimationComplete = useCallback(() => {
    if (!isOpen) setShowContent(false);
  }, [isOpen]);

  return (
    <DialogPrimitive.Root
      open={isOpen || showContent}
      onOpenChange={handleOpenChange}
    >
      {trigger ? <DialogTrigger render={<span />}>{trigger}</DialogTrigger> : null}

      <AnimatePresence onExitComplete={() => setShowContent(false)}>
        {isOpen ? (
          <DialogPrimitive.Portal>
            <DialogPrimitive.Backdrop
              render={
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                  data-slot="dialog-overlay"
                  exit={{ opacity: 0 }}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : BACKDROP_DURATION,
                  }}
                />
              }
            />

            <DialogPrimitive.Popup
              render={
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                  }
                  className={cn(
                    "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
                    className
                  )}
                  data-slot="dialog-content"
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : {
                        opacity: 0,
                        transform: "translate(-50%, -50%) scale(0.95)",
                        transition: { duration: 0.15 },
                      }
                  }
                  initial={
                    shouldReduceMotion
                      ? {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                      : {
                        opacity: 0,
                        transform: "translate(-50%, -48%) scale(0.95)",
                      }
                  }
                  onAnimationComplete={handleAnimationComplete}
                  transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
                />
              }
            >
              {title || description ? (
                <StaggerChild
                  index={0}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  <DialogHeader>
                    {title ? <DialogTitle>{title}</DialogTitle> : null}
                    {description ? (
                      <DialogDescription>{description}</DialogDescription>
                    ) : null}
                  </DialogHeader>
                </StaggerChild>
              ) : null}

              {children ? (
                <StaggerChild
                  index={title || description ? 1 : 0}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  {children}
                </StaggerChild>
              ) : null}

              {footer ? (
                <StaggerChild
                  index={(title || description ? 1 : 0) + (children ? 1 : 0)}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  <DialogFooter>{footer}</DialogFooter>
                </StaggerChild>
              ) : null}

              {showCloseButton ? (
                <AnimatedCloseButton
                  onClick={() => handleOpenChange(false)}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ) : null}
            </DialogPrimitive.Popup>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
  trigger,
  footer,
}: AlertDialogProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const [showContent, setShowContent] = useState(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) setShowContent(true);
    prevOpenRef.current = !!isOpen;
  }, [isOpen]);

  const handleAnimationComplete = useCallback(() => {
    if (!isOpen) setShowContent(false);
  }, [isOpen]);

  return (
    <AlertDialogPrimitive.Root
      open={isOpen || showContent}
      onOpenChange={handleOpenChange}
    >
      {trigger ? (
        <AlertDialogTrigger render={<span />}>{trigger}</AlertDialogTrigger>
      ) : null}

      <AnimatePresence onExitComplete={() => setShowContent(false)}>
        {isOpen ? (
          <AlertDialogPrimitive.Portal>
            <AlertDialogPrimitive.Backdrop
              render={
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                  data-slot="alert-dialog-overlay"
                  exit={{ opacity: 0 }}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : BACKDROP_DURATION,
                  }}
                />
              }
            />

            <AlertDialogPrimitive.Popup
              render={
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                  }
                  className={cn(
                    "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
                    className
                  )}
                  data-slot="alert-dialog-content"
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : {
                        opacity: 0,
                        transform: "translate(-50%, -50%) scale(0.95)",
                        transition: { duration: 0.15 },
                      }
                  }
                  initial={
                    shouldReduceMotion
                      ? {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                      : {
                        opacity: 0,
                        transform: "translate(-50%, -48%) scale(0.95)",
                      }
                  }
                  onAnimationComplete={handleAnimationComplete}
                  transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
                />
              }
            >
              {title || description ? (
                <StaggerChild
                  index={0}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  <AlertDialogHeader className="place-items-start text-left">
                    {title ? (
                      <AlertDialogTitle>{title}</AlertDialogTitle>
                    ) : null}
                    {description ? (
                      <AlertDialogDescription>
                        {description}
                      </AlertDialogDescription>
                    ) : null}
                  </AlertDialogHeader>
                </StaggerChild>
              ) : null}

              {children ? (
                <StaggerChild
                  index={title || description ? 1 : 0}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  {children}
                </StaggerChild>
              ) : null}

              {footer ? (
                <StaggerChild
                  index={(title || description ? 1 : 0) + (children ? 1 : 0)}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  <AlertDialogFooter className="mx-0 mb-0 rounded-none border-0 bg-transparent p-0">
                    {footer}
                  </AlertDialogFooter>
                </StaggerChild>
              ) : null}
            </AlertDialogPrimitive.Popup>
          </AlertDialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </AlertDialogPrimitive.Root>
  );
}

export {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
