import { ForwardedRef, forwardRef, RefObject } from "react";
import { TextInput, TextInputProps } from "react-native";
import { twMerge } from "tailwind-merge";

type TInput = TextInputProps & {
  withSendIcon?: boolean;
};

export default forwardRef(function Input(
  props: TInput,
  ref: ForwardedRef<TextInput>
) {
  const { withSendIcon, className, ...remainingProps } = props;
  return (
    <TextInput
      className={twMerge(
        "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        withSendIcon && "pr-10",
        className
      )}
      ref={ref}
      {...remainingProps}
    />
  );
});
