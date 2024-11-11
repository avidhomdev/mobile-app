import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
} from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { twMerge } from "tailwind-merge";

const base = {
  xs: "py-1 px-1.5 rounded",
  sm: "p-2 rounded",
  base: "p-3 rounded-lg shadow shadow-gray-300",
  md: "p-4 rounded-lg",
  lg: "p-4 rounded-lg",
};

const textBase = {
  xs: "text-xs font-medium",
  sm: "text-md font-medium",
  base: "text-base font-medium",
  md: "text-xl font-medium",
  lg: "text-2xl font-bold",
};

const variants = {
  default: {
    background:
      "bg-primary-500 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 focus:outline-none dark:focus:ring-primary-800",
    text: "text-white",
  },
  secondary: {
    background:
      "bg-secondary-700 focus:ring-4 focus:ring-secondary-300 dark:bg-secondary-600 focus:outline-none dark:focus:ring-secondary-800",
    text: "text-white",
  },
  outline: {
    background:
      "focus:outline-none bg-white border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800  dark:border-gray-600",
    text: "text-gray-900 dark:text-gray-400",
  },
};

type TVariantKeys = keyof typeof variants;
type TSizeKeys = keyof typeof base;

type TButtonTextProps = PropsWithChildren<{
  className?: string;
  size?: TSizeKeys;
  variant?: TVariantKeys;
}>;

function ButtonText({
  children,
  className = "",
  size = "base",
  variant = "default",
}: TButtonTextProps) {
  const variantBase = variants[variant] ? variants[variant] : variants.default;

  return (
    <Text className={twMerge(textBase[size], variantBase.text, className)}>
      {children}
    </Text>
  );
}

type TButtonProps = TouchableOpacityProps &
  PropsWithChildren<{
    size?: TSizeKeys;
    variant?: TVariantKeys;
  }>;

export default function Button({
  children,
  className = "",
  size = "base",
  variant = "default",
  ...props
}: TButtonProps) {
  const childrenWithVariantProp = Children.map(children, (child) => {
    if (!isValidElement(child)) return children;
    return cloneElement(child as ReactElement<any>, {
      variant: variant,
      size,
    });
  });

  const variantBase = variants[variant] ? variants[variant] : variants.default;

  return (
    <TouchableOpacity
      className={twMerge(base[size], variantBase.background, className)}
      {...props}
    >
      {childrenWithVariantProp}
    </TouchableOpacity>
  );
}

Button.Text = ButtonText;
