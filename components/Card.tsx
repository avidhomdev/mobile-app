import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

type TCardProps = PropsWithChildren<ViewProps>;

export default function Card({ children, className, ...props }: TCardProps) {
  return (
    <View
      className={twMerge(
        "p-6 bg-white border border-gray-200 rounded-lg shadow shadow-gray-200 dark:shadow-gray-700 dark:bg-gray-800 dark:border-gray-700 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
