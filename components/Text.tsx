import { PropsWithChildren } from "react";
import { Text as NativeText, TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

const variants = {
  base: "text-base text-gray-600 dark:text-gray-400 tracking-wide",
  headline: "text-3xl font-bold text-gray-700 dark:text-gray-200 tracking-wide",
  header:
    "text-lg font-semibold text-gray-700 dark:text-gray-200 tracking-wide",
  label: "text-gray-900 dark:text-white text-sm font-medium tracking-wide",
  subheader: "text-sm text-gray-500 dark:text-gray-400",
};

type TVariantKey = keyof typeof variants;

type TTextProps = PropsWithChildren<TextProps & { variant?: TVariantKey }>;

export default function Text({
  children,
  className,
  variant = "base",
  ...props
}: TTextProps) {
  return (
    <NativeText className={twMerge(variants[variant], className)} {...props}>
      {children}
    </NativeText>
  );
}
