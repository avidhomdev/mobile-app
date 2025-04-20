export function toggleState(
  stateSetter: React.Dispatch<React.SetStateAction<boolean>>
) {
  return () => {
    stateSetter((prevState) => !prevState);
  };
}
