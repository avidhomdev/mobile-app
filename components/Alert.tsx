import { TextProps, View } from "react-native";
import Text from "./Text";
import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
} from "react";
import { twMerge } from "tailwind-merge";

const base = {
  sm: "flex-row items-center p-2 rounded-lg gap-x-2",
  base: "flex-row items-center p-4 rounded-lg gap-x-2",
  md: "flex-row items-center p-5 rounded-lg gap-x-2",
  lg: "flex-row items-center p-6 rounded-lg gap-x-2",
};

const textBase = {
  sm: "text-sm font-medium",
  base: "text-base font-medium",
  md: "text-xl font-medium",
  lg: "text-2xl font-bold",
};

const variants = {
  base: {
    background: "",
    text: "",
  },
  red: {
    background: "bg-red-50 dark:bg-gray-800",
    text: "text-red-800 dark:text-red-400",
  },
};

type TVariantKey = keyof typeof variants;

type TAlertTextProps = PropsWithChildren<
  TextProps & { size?: keyof typeof textBase; variant?: TVariantKey }
>;

function AlertText({
  children,
  className = "",
  size = "base",
  variant = "base",
}: TAlertTextProps) {
  const variantBase = variants[variant] ? variants[variant] : variants.base;
  return (
    <Text className={twMerge(textBase[size], variantBase.text, className)}>
      {children}
    </Text>
  );
}

type TAlertProps = PropsWithChildren<{
  className?: string;
  size?: keyof typeof textBase;
  variant?: TVariantKey;
}>;

export default function Alert({
  children,
  className,
  size = "base",
  variant = "base",
}: TAlertProps) {
  const variantBase = variants[variant] ? variants[variant] : variants.base;
  const childrenWithVariantProp = Children.map(children, (child) => {
    if (!isValidElement(child)) return children;
    return cloneElement(child as ReactElement<any>, {
      variant: variant,
      size,
    });
  });
  return (
    <View className={twMerge(base[size], variantBase.background, className)}>
      {childrenWithVariantProp}
    </View>
  );
}

Alert.Text = AlertText;
