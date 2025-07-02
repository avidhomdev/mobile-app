import { PropsWithChildren } from "react";
import { Text } from "./ui/text";
import { ActivityIndicator } from "react-native";

type ResultsWithLoaderProps = PropsWithChildren<{
  isFetching?: boolean;
  hasResults: boolean;
}>;

function Results({
  children,
  hasResults,
}: PropsWithChildren<{ hasResults: boolean }>) {
  return hasResults ? children : <Text>No results</Text>;
}

export function ResultsWithLoader({
  children,
  isFetching,
  hasResults,
}: ResultsWithLoaderProps) {
  return isFetching ? (
    <ActivityIndicator />
  ) : (
    <Results hasResults={hasResults}>{children}</Results>
  );
}
