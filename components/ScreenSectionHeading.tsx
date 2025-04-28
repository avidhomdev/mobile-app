import { ElementType, PropsWithChildren } from "react";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Divider } from "./ui/divider";
import { VStack } from "./ui/vstack";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

type ScreenSectionHeadingProps = PropsWithChildren<{
  icon?: ElementType;
  heading: string;
  subHeading?: string;
}>;

export function ScreenSectionHeading({
  children,
  icon,
  heading,
  subHeading,
}: ScreenSectionHeadingProps) {
  return (
    <HStack className="items-center" space="sm">
      {icon && (
        <>
          <Icon as={icon} className="text-typography-500" size="lg" />
          <Divider orientation="vertical" />
        </>
      )}
      <VStack className="grow">
        <Heading size="md">{heading}</Heading>
        {subHeading && (
          <Text className="text-typography-500" size="xs">
            {subHeading}
          </Text>
        )}
      </VStack>
      {children}
    </HStack>
  );
}
