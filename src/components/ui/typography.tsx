import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariants = cva(
  "text-foreground antialiased",
  {
    variants: {
      variant: {
        h1: "text-2xl font-semibold tracking-tight leading-tight",
        h2: "text-lg font-semibold tracking-tight leading-tight",
        h3: "text-base font-semibold tracking-tight leading-tight",
        h4: "text-sm font-semibold tracking-tight leading-snug",
        p: "text-sm leading-6",
        lead: "text-lg font-medium text-muted-foreground",
        large: "text-base font-semibold",
        small: "text-[13px] font-medium leading-snug",
        muted: "text-sm text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "p",
    },
  },
);

const defaultTags: Record<
  Exclude<VariantProps<typeof typographyVariants>["variant"], null | undefined>,
  keyof React.JSX.IntrinsicElements
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  lead: "p",
  large: "p",
  small: "span",
  muted: "span",
};

type TypographyProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof typographyVariants>;

function Typography({
  className,
  variant = "p",
  render,
  ...props
}: TypographyProps) {
  return useRender({
    defaultTagName: defaultTags[variant ?? "p"],
    props: mergeProps<"span">(
      {
        className: cn(typographyVariants({ variant, className })),
      },
      props,
    ),
    render,
    state: {
      slot: "typography",
      variant,
    },
  });
}

function H1(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h1" {...props} />;
}

function H2(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h2" {...props} />;
}

function H3(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h3" {...props} />;
}

function H4(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h4" {...props} />;
}

function Lead(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="lead" {...props} />;
}

function Large(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="large" {...props} />;
}

function Small(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="small" {...props} />;
}

function Muted(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="muted" {...props} />;
}

export {
  Typography,
  H1,
  H2,
  H3,
  H4,
  Lead,
  Large,
  Small,
  Muted,
  typographyVariants,
  type TypographyProps,
};