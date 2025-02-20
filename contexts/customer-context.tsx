import { supabase } from "@/lib/supabase";
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useMemo,
} from "react";
import { ILocationCustomer } from "./user-context";

const CustomerContext = createContext<TCustomerProvider>({
  customer: {} as ILocationCustomer,
  updateCustomer: async () => {},
});

export function useCustomerContext() {
  const value = useContext(CustomerContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error(
        "useCustomerContext must be wrapped in a <CustomerContext />"
      );
    }
  }
  return value;
}

type TCustomerProvider = {
  customer: ILocationCustomer;
  updateCustomer: (
    id: number,
    updates: Partial<ILocationCustomer>
  ) => Promise<void>;
};

async function updateCustomer(id: number, updates: Partial<ILocationCustomer>) {
  await supabase
    .from("business_location_customers")
    .update(updates)
    .eq("id", id);
}

export function CustomerProvider({
  children,
  customer,
}: PropsWithChildren<
  Pick<TCustomerProvider, "customer">
>): ReactElement<TCustomerProvider> {
  const value = useMemo(
    () => ({
      customer,
      updateCustomer,
    }),
    [customer]
  );

  return (
    <CustomerContext.Provider value={value}>
      {customer ? children : "No customer found."}
    </CustomerContext.Provider>
  );
}
