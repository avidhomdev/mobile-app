import { CheckCircle, CircleIcon } from "lucide-react-native";
import { twMerge } from "tailwind-merge";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

type BidRequirementsListProps = {
  requirements: {
    [k: string]: {
      value: boolean;
      label: string;
    };
  };
};

export function BidRequirementsList({
  requirements,
}: BidRequirementsListProps) {
  return Object.values(requirements)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((requirement) => {
      const RequirementIcon = requirement.value ? CheckCircle : CircleIcon;
      return (
        <HStack className="items-center" key={requirement.label} space="sm">
          <Icon
            as={RequirementIcon}
            className={twMerge(
              requirement.value ? "text-success-500" : "text-typography-500"
            )}
            size="sm"
          />
          <Text>{requirement.label}</Text>
        </HStack>
      );
    });
}
