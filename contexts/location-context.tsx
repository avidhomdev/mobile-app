import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { ILocation, ILocationProfile } from "./user-context";

const LocationContext = createContext({
  changeLocation: () => {},
  location: {} as Partial<ILocation & ILocationProfile>,
  refreshData: () => {},
});

export function useLocationContext() {
  const value = useContext(LocationContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error(
        "useLocationContext must be wrapped in a <LocationContext />"
      );
    }
  }
  return value;
}

type TLocationProviderType = {
  locations: ILocation[];
  profile_id: string;
};

export function LocationProvider({
  children,
  locations,
  profile_id,
}: PropsWithChildren<TLocationProviderType>) {
  const [selectedLocationId, setSelectedLocationId] = useState(
    locations[0]?.id
  );

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);
  const selectedLocationProfile = selectedLocation?.profiles.find(
    (lP) => lP.profile_id === profile_id
  );

  const value = useMemo(
    () => ({
      location: { ...selectedLocation, ...selectedLocationProfile },
      refreshData: () => {},
      changeLocation: (id?: number) => setSelectedLocationId(id),
    }),
    [selectedLocation, selectedLocationProfile, setSelectedLocationId]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
