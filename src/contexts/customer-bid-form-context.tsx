import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useUserContext } from "./user-context";
import { useRouter } from "expo-router";
import { useCustomerContext } from "./customer-context";
import {
  IProduct,
  useLocationProductsData,
} from "@/src/hooks/useLocationProductsData";
import { IFormState } from "@/src/hooks/useFormState";
import { MEDIA_TYPES_KEYS } from "@/src/constants/media-types";
import { supabase } from "@/src/lib/supabase";

export interface IBidFields {
  commission: number;
  discount: number;
  lead_type: string;
  media: { id: string; path: string; type: MEDIA_TYPES_KEYS }[];
  name: string;
  notes: string;
  products: IProduct[];
  has_water_rebate: boolean;
  hoa_approval_required: boolean;
  hoa_contact_email: string;
  hoa_contact_name: string;
  hoa_contact_phone: string;
  water_rebate_company: string;
}

export enum FormReducerActionType {
  SET_ERROR = "SET_ERROR",
  SET_NAME = "SET_NAME",
  SET_PRODUCTS = "SET_PRODUCTS",
  ADD_MEDIA = "ADD_MEDIA",
  REMOVE_MEDIA = "REMOVE_MEDIA",
  SET_NOTES = "SET_NOTES",
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_COMMISSION = "SET_COMMISSION",
  SET_LEAD_TYPE = "SET_LEAD_TYPE",
  SET_DISCOUNT = "SET_DISCOUNT",
  UPDATE_MEDIA = "UPDATE_MEDIA",
  SET_HAS_WATER_REBATE = "SET_HAS_WATER_REBATE",
  SET_HOA_APPROVAL_NEEDED = "SET_HOA_APPROVAL_NEEDED",
  SET_HOA_CONTACT_EMAIL = "SET_HOA_CONTACT_EMAIL",
  SET_HOA_CONTACT_NAME = "SET_HOA_CONTACT_NAME",
  SET_HOA_CONTACT_PHONE = "SET_HOA_CONTACT_PHONE",
  SET_HOA_WATER_REBATE_COMPANY = "SET_HOA_WATER_REBATE_COMPANY",
}

interface ISET_HOA_WATER_REBATE_COMPANY_ACTION {
  type: FormReducerActionType.SET_HOA_WATER_REBATE_COMPANY;
  payload: string;
}

interface ISET_HOA_CONTACT_EMAIL_ACTION {
  type: FormReducerActionType.SET_HOA_CONTACT_EMAIL;
  payload: string;
}
interface ISET_HOA_CONTACT_NAME_ACTION {
  type: FormReducerActionType.SET_HOA_CONTACT_NAME;
  payload: string;
}
interface ISET_HOA_CONTACT_PHONE_ACTION {
  type: FormReducerActionType.SET_HOA_CONTACT_PHONE;
  payload: string;
}

interface ISET_HOA_APPROVAL_NEEDED_ACTION {
  type: FormReducerActionType.SET_HOA_APPROVAL_NEEDED;
  payload: boolean;
}

interface ISET_HAS_WATER_REBATE_ACTION {
  type: FormReducerActionType.SET_HAS_WATER_REBATE;
  payload: boolean;
}

interface ISET_LEAD_TYPE_ACTION {
  type: FormReducerActionType.SET_LEAD_TYPE;
  payload: string;
}

interface IREMOVE_MEDIA_ACTION {
  type: FormReducerActionType.REMOVE_MEDIA;
  payload: string;
}

interface IADD_MEDIA_ACTION {
  type: FormReducerActionType.ADD_MEDIA;
  payload: { id: string; path: string; type: MEDIA_TYPES_KEYS };
}

interface IUPDATE_MEDIA_ACTION {
  type: FormReducerActionType.UPDATE_MEDIA;
  payload: { id: string; path: string; type: MEDIA_TYPES_KEYS }[];
}

interface ISET_ERROR_ACTION {
  type: FormReducerActionType.SET_ERROR;
  payload: string | null;
}

interface ISET_IS_SUBMITTING_ACTION {
  type: FormReducerActionType.SET_IS_SUBMITTING;
  payload: boolean;
}

interface ISET_COMMISSION_ACTION {
  type: FormReducerActionType.SET_COMMISSION;
  payload: number;
}

interface ISET_DISCOUNT_ACTION {
  type: FormReducerActionType.SET_DISCOUNT;
  payload: number;
}

interface ISET_NAME_ACTION {
  type: FormReducerActionType.SET_NAME;
  payload: string;
}

interface ISET_PRODUCTS_ACTION {
  type: FormReducerActionType.SET_PRODUCTS;
  payload: IProduct[];
}

interface ISET_NOTES_ACTION {
  type: FormReducerActionType.SET_NOTES;
  payload: string;
}

export type TCustomerBidFormAction =
  | ISET_NAME_ACTION
  | ISET_PRODUCTS_ACTION
  | ISET_NOTES_ACTION
  | ISET_COMMISSION_ACTION
  | ISET_IS_SUBMITTING_ACTION
  | ISET_ERROR_ACTION
  | IADD_MEDIA_ACTION
  | IREMOVE_MEDIA_ACTION
  | ISET_LEAD_TYPE_ACTION
  | ISET_DISCOUNT_ACTION
  | IUPDATE_MEDIA_ACTION
  | ISET_HAS_WATER_REBATE_ACTION
  | ISET_HOA_APPROVAL_NEEDED_ACTION
  | ISET_HOA_CONTACT_EMAIL_ACTION
  | ISET_HOA_CONTACT_NAME_ACTION
  | ISET_HOA_CONTACT_PHONE_ACTION
  | ISET_HOA_WATER_REBATE_COMPANY_ACTION;

function formReducer(products: IProduct[]) {
  return (
    state: IFormState<IBidFields>,
    action: TCustomerBidFormAction
  ): IFormState<IBidFields> => {
    switch (action.type) {
      case FormReducerActionType.SET_HOA_CONTACT_EMAIL: {
        return {
          ...state,
          fields: {
            ...state.fields,
            hoa_contact_email: action.payload,
          },
        };
      }
      case FormReducerActionType.SET_HOA_WATER_REBATE_COMPANY: {
        return {
          ...state,
          fields: {
            ...state.fields,
            water_rebate_company: action.payload,
          },
        };
      }
      case FormReducerActionType.SET_HOA_CONTACT_NAME: {
        return {
          ...state,
          fields: {
            ...state.fields,
            hoa_contact_name: action.payload,
          },
        };
      }
      case FormReducerActionType.SET_HOA_CONTACT_PHONE: {
        return {
          ...state,
          fields: {
            ...state.fields,
            hoa_contact_phone: action.payload,
          },
        };
      }
      case FormReducerActionType.SET_HOA_APPROVAL_NEEDED: {
        return {
          ...state,
          fields: {
            ...state.fields,
            hoa_approval_required: action.payload,
            hoa_contact_name: action.payload
              ? state.fields.hoa_contact_name
              : "",
            hoa_contact_email: action.payload
              ? state.fields.hoa_contact_email
              : "",
            hoa_contact_phone: action.payload
              ? state.fields.hoa_contact_phone
              : "",
          },
        };
      }
      case FormReducerActionType.SET_HAS_WATER_REBATE: {
        return {
          ...state,
          fields: {
            ...state.fields,
            has_water_rebate: action.payload,
            water_rebate_company: action.payload
              ? state.fields.water_rebate_company
              : "",
          },
        };
      }
      case FormReducerActionType.SET_ERROR: {
        return {
          ...state,
          error: action.payload,
        };
      }
      case FormReducerActionType.SET_IS_SUBMITTING:
        return {
          ...state,
          isSubmitting: action.payload,
        };
      case FormReducerActionType.SET_NAME:
        return {
          ...state,
          fields: {
            ...state.fields,
            name: action.payload,
          },
        };
      case FormReducerActionType.SET_PRODUCTS: {
        const isSetter = state.fields.lead_type === "setter";
        return {
          ...state,
          fields: {
            ...state.fields,
            products: action.payload.map((product) => {
              const { unit_price, lead_price } =
                products.find((p) => p.id === product.id) || {};

              return {
                ...product,
                unit_price: isSetter
                  ? Number(unit_price) + Number(lead_price)
                  : Number(unit_price),
              };
            }),
          },
        };
      }
      case FormReducerActionType.SET_NOTES: {
        return {
          ...state,
          fields: { ...state.fields, notes: action.payload },
        };
      }
      case FormReducerActionType.SET_COMMISSION: {
        return {
          ...state,
          fields: { ...state.fields, commission: action.payload },
        };
      }
      case FormReducerActionType.SET_DISCOUNT: {
        return {
          ...state,
          fields: { ...state.fields, discount: action.payload },
        };
      }
      case FormReducerActionType.ADD_MEDIA: {
        return {
          ...state,
          fields: {
            ...state.fields,
            media: [...state.fields.media, action.payload],
          },
        };
      }
      case FormReducerActionType.UPDATE_MEDIA: {
        return {
          ...state,
          fields: {
            ...state.fields,
            media: action.payload,
          },
        };
      }
      case FormReducerActionType.REMOVE_MEDIA: {
        return {
          ...state,
          fields: {
            ...state.fields,
            media: state.fields.media.filter((m) => m.id !== action.payload),
          },
        };
      }
      case FormReducerActionType.SET_LEAD_TYPE: {
        return {
          ...state,
          fields: {
            ...state.fields,
            lead_type: action.payload,
            products: state.fields.products.map((product) => {
              const { unit_price: baseUnitPrice, lead_price: baseLeadPrice } =
                products.find((p) => p.id === product.id) || {};
              const isSetter = action.payload === "setter";
              return {
                ...product,
                unit_price: isSetter
                  ? Number(baseUnitPrice) + Number(baseLeadPrice)
                  : Number(baseUnitPrice),
              };
            }),
          },
        };
      }
      default:
        return state;
    }
  };
}

const CustomerBidFormContext = createContext<{
  formState: IFormState<IBidFields>;
  dispatch: React.Dispatch<TCustomerBidFormAction>;
  handleSubmit: () => void;
  isFormInvalid?: string;
  preview: boolean;
  products: IProduct[];
  togglePreview: () => void;
}>({
  formState: {
    error: null,
    fields: {
      commission: 0,
      discount: 0,
      lead_type: "SETTER",
      media: [],
      name: "Bid",
      notes: "",
      products: [],
      has_water_rebate: false,
      hoa_approval_required: false,
      hoa_contact_email: "",
      hoa_contact_name: "",
      hoa_contact_phone: "",
      water_rebate_company: "",
    },
    isSubmitting: false,
  },
  dispatch: () => {},
  handleSubmit: () => {},
  preview: false,
  products: [],
  togglePreview: () => {},
});

export function useCustomerBidFormContext() {
  const value = useContext(CustomerBidFormContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error(
        "useCustomerBidFormContext must be wrapped in a <CustomerBidFormContextProvider />"
      );
    }
  }

  return value;
}

export function CustomerBidFormContextProvider(props: PropsWithChildren) {
  const [preview, setPreview] = useState(false);
  const { profile, refreshData } = useUserContext();
  const router = useRouter();
  const { customer } = useCustomerContext();
  const { products } = useLocationProductsData({
    locationId: customer.location_id,
  });
  const [formState, dispatch] = useReducer(formReducer(products), {
    error: null,
    fields: {
      commission: 0,
      discount: 0,
      lead_type: "setter",
      media: [],
      name: "Bid",
      notes: "",
      products: [],
      has_water_rebate: false,
      hoa_approval_required: false,
      hoa_contact_email: "",
      hoa_contact_name: "",
      hoa_contact_phone: "",
      water_rebate_company: "",
    },
    isSubmitting: false,
  });

  const handleSubmit = useCallback(async () => {
    dispatch({ type: FormReducerActionType.SET_IS_SUBMITTING, payload: true });

    const insertFields = {
      business_id: customer?.business_id,
      commission: formState.fields.commission,
      creator_id: profile?.id,
      customer_id: customer?.id,
      discount: formState.fields.discount,
      has_water_rebate: formState.fields.has_water_rebate,
      hoa_approval_required: formState.fields.hoa_approval_required,
      hoa_contact_email: formState.fields.hoa_contact_email,
      hoa_contact_name: formState.fields.hoa_contact_name,
      hoa_contact_phone: formState.fields.hoa_contact_phone,
      lead_type: formState.fields.lead_type,
      location_id: customer?.location_id,
      name: formState.fields.name,
      notes: formState.fields.notes,
      status: "active",
      water_rebate_company: formState.fields.water_rebate_company,
    };

    const { data, error } = await supabase
      .from("business_location_customer_bids")
      .insert(insertFields)
      .select("id")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Bid not created");

    const mediaInsert = formState.fields.media.map((m) => ({
      bid_id: data.id,
      business_id: customer?.business_id,
      creator_id: profile?.id,
      customer_id: customer?.id,
      location_id: customer?.location_id,
      name: m.id,
      path: m.path,
      type: m.type,
    }));

    const { error: mediaError } = await supabase
      .from("business_location_customer_bid_media")
      .insert(mediaInsert);

    if (mediaError) throw mediaError;

    const productsInsert = formState.fields.products.map((product) => ({
      bid_id: data.id,
      business_id: customer?.business_id,
      customer_id: customer?.id,
      location_id: customer?.location_id,
      product_id: product.id,
      unit_price: product.unit_price,
      units: product.units,
    }));

    const { error: productsError } = await supabase
      .from("business_location_customer_bid_products")
      .insert(productsInsert);

    if (productsError) throw productsError;

    dispatch({
      type: FormReducerActionType.SET_IS_SUBMITTING,
      payload: false,
    });

    await refreshData();
    router.back();
  }, [
    customer?.business_id,
    customer?.id,
    customer?.location_id,
    formState.fields.commission,
    formState.fields.discount,
    formState.fields.has_water_rebate,
    formState.fields.hoa_approval_required,
    formState.fields.hoa_contact_email,
    formState.fields.hoa_contact_name,
    formState.fields.hoa_contact_phone,
    formState.fields.lead_type,
    formState.fields.media,
    formState.fields.name,
    formState.fields.notes,
    formState.fields.products,
    formState.fields.water_rebate_company,
    profile?.id,
    refreshData,
    router,
  ]);

  const value = useMemo(
    () => ({
      dispatch,
      formState,
      handleSubmit,
      preview,
      products,
      togglePreview: () => setPreview((prevState) => !prevState),
    }),
    [dispatch, formState, handleSubmit, products, preview]
  );

  return (
    <CustomerBidFormContext.Provider value={value}>
      {props.children}
    </CustomerBidFormContext.Provider>
  );
}
