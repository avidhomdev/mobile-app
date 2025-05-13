import { MEDIA_TYPES_KEYS } from "@/src/constants/media-types";
import { IFormState } from "@/src/hooks/useFormState";
import {
  IProduct,
  useLocationProductsData,
} from "@/src/hooks/useLocationProductsData";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/supabase";
import { useRouter } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useCustomerContext } from "./customer-context";
import { ILocationCustomerBid, useUserContext } from "./user-context";

interface IBidFieldsMediaItem {
  id: string | number;
  path: string;
  type: MEDIA_TYPES_KEYS;
}
export interface IBidFields {
  id: number;
  commission: number;
  discount: number;
  lead_type: string;
  media: IBidFieldsMediaItem[];
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
  payload: string | number;
}

interface IADD_MEDIA_ACTION {
  type: FormReducerActionType.ADD_MEDIA;
  payload: { id: string; path: string; type: MEDIA_TYPES_KEYS };
}

interface IUPDATE_MEDIA_ACTION {
  type: FormReducerActionType.UPDATE_MEDIA;
  payload: { id: string | number; path: string; type: MEDIA_TYPES_KEYS }[];
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
          isSubmitting: false,
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

type CustomerContextType = {
  bid: ILocationCustomerBid;
  formState: IFormState<IBidFields>;
  dispatch: React.Dispatch<TCustomerBidFormAction>;
  handleSubmit: () => void;
  isFormInvalid?: string;
  preview: boolean;
  products: IProduct[];
  togglePreview: () => void;
};

const CustomerBidFormContext = createContext<CustomerContextType | null>(null);

export function useCustomerBidEditFormContext(): CustomerContextType {
  const value = useContext(CustomerBidFormContext);
  if (!value) {
    throw new Error(
      "useCustomerBidEditFormContext must be wrapped in a <CustomerBidEditFormContextProvider />"
    );
  }

  return value;
}

type CustomerBidEditFormContextProviderProps = PropsWithChildren<{
  bid: ILocationCustomerBid;
}>;

export function CustomerBidEditFormContextProvider(
  props: CustomerBidEditFormContextProviderProps
) {
  const { bid } = props;

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
      id: bid.id,
      commission: bid.commission,
      discount: bid.discount,
      lead_type: bid.lead_type,
      media: bid.media.map((m) => ({
        id: m.id,
        path: m.path,
        type: m.type as MEDIA_TYPES_KEYS,
      })),
      name: bid.name,
      notes: bid.notes ?? "",
      products: bid.products.map((product) => ({
        ...product.product,
        locations: [
          { location_id: bid.location_id, product_id: product.product.id },
        ] as Tables<"business_product_locations">[],
        units: product.units,
      })),
      has_water_rebate: bid.has_water_rebate,
      hoa_approval_required: bid.hoa_approval_required,
      hoa_contact_email: bid.hoa_contact_email ?? "",
      hoa_contact_name: bid.hoa_contact_name ?? "",
      hoa_contact_phone: bid.hoa_contact_phone ?? "",
      water_rebate_company: bid.water_rebate_company ?? "",
    },
    isSubmitting: false,
  });

  const handleSubmit = useCallback(async () => {
    if (formState.isSubmitting) return;
    dispatch({ type: FormReducerActionType.SET_IS_SUBMITTING, payload: true });

    const updateFields = {
      commission: formState.fields.commission,
      discount: formState.fields.discount,
      has_water_rebate: formState.fields.has_water_rebate,
      hoa_approval_required: formState.fields.hoa_approval_required,
      hoa_contact_email: formState.fields.hoa_contact_email,
      hoa_contact_name: formState.fields.hoa_contact_name,
      hoa_contact_phone: formState.fields.hoa_contact_phone,
      lead_type: formState.fields.lead_type,
      name: formState.fields.name,
      notes: formState.fields.notes,
      water_rebate_company: formState.fields.water_rebate_company,
    };

    const { data, error } = await supabase
      .from("business_location_customer_bids")
      .update(updateFields)
      .eq("id", bid.id)
      .select("id")
      .single();

    if (error) {
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: error.message,
      });
    }

    if (!data)
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: "No bid found to update.",
      });

    const { mediaInsert, mediaUpsert } = formState.fields.media.reduce<{
      mediaInsert: Omit<
        Tables<"business_location_customer_bid_media">,
        "id" | "created_at"
      >[];
      mediaUpsert: IBidFieldsMediaItem[];
    }>(
      (dictionary, m) => {
        const existingMedia = bid.media.find((bM) => bM.id === m.id);
        if (existingMedia) {
          if (m.type !== existingMedia.type) {
            dictionary.mediaUpsert = dictionary.mediaUpsert.concat({
              ...existingMedia,
              type: m.type as MEDIA_TYPES_KEYS,
            });
          }
        } else {
          dictionary.mediaInsert = dictionary.mediaInsert.concat({
            bid_id: Number(bid.id),
            business_id: bid.business_id,
            creator_id: profile.id,
            customer_id: bid.customer_id,
            location_id: bid.location_id,
            name: m.id.toString(),
            path: m.path,
            type: m.type as MEDIA_TYPES_KEYS,
          });
        }

        return dictionary;
      },
      { mediaInsert: [], mediaUpsert: [] }
    );

    if (mediaUpsert.length) {
      const { error: mediaError } = await supabase
        .from("business_location_customer_bid_media")
        .upsert(mediaUpsert);

      if (mediaError) {
        return dispatch({
          type: FormReducerActionType.SET_ERROR,
          payload: mediaError.message,
        });
      }
    }

    if (mediaInsert.length) {
      const { error: mediaError } = await supabase
        .from("business_location_customer_bid_media")
        .insert(mediaInsert);

      if (mediaError) {
        return dispatch({
          type: FormReducerActionType.SET_ERROR,
          payload: mediaError.message,
        });
      }
    }

    const { productsInsert, productsUpsert } =
      formState.fields.products.reduce<{
        productsInsert: Omit<
          Tables<"business_location_customer_bid_products">,
          "created_at"
        >[];
        productsUpsert: Omit<
          Tables<"business_location_customer_bid_products">,
          "created_at"
        >[];
      }>(
        (dictionary, p) => {
          const existingProduct = bid.products.find(
            (bP) => bP.product_id === p.id
          );
          if (existingProduct) {
            if (p.units !== existingProduct.units) {
              dictionary.productsUpsert = dictionary.productsUpsert.concat({
                bid_id: existingProduct.bid_id,
                business_id: existingProduct.business_id,
                customer_id: existingProduct.customer_id,
                location_id: existingProduct.location_id,
                product_id: existingProduct.product_id,
                unit_price: existingProduct.unit_price,
                units: p.units,
              });
            }
          } else {
            dictionary.productsInsert = dictionary.productsInsert.concat({
              bid_id: bid.id,
              business_id: bid.business_id,
              customer_id: bid.customer_id,
              location_id: bid.location_id,
              product_id: p.id,
              unit_price: Number(p.unit_price),
              units: p.units,
            });
          }

          return dictionary;
        },
        { productsInsert: [], productsUpsert: [] }
      );

    if (productsUpsert.length) {
      const { error: productsUpsertError } = await supabase
        .from("business_location_customer_bid_products")
        .upsert(productsUpsert);

      if (productsUpsertError) {
        return dispatch({
          type: FormReducerActionType.SET_ERROR,
          payload: productsUpsertError.message,
        });
      }
    }

    if (productsInsert.length) {
      const { error: productsInsertError } = await supabase
        .from("business_location_customer_bid_products")
        .insert(productsInsert);

      if (productsInsertError) {
        return dispatch({
          type: FormReducerActionType.SET_ERROR,
          payload: productsInsertError.message,
        });
      }
    }

    await refreshData();
    router.back();
  }, [
    bid.business_id,
    bid.customer_id,
    bid.id,
    bid.location_id,
    bid.media,
    bid.products,
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
    formState.isSubmitting,
    profile.id,
    refreshData,
    router,
  ]);

  const value = useMemo(
    () => ({
      bid,
      dispatch,
      formState,
      handleSubmit,
      preview,
      products,
      togglePreview: () => setPreview((prevState) => !prevState),
    }),
    [bid, dispatch, formState, handleSubmit, products, preview]
  );

  return (
    <CustomerBidFormContext.Provider value={value}>
      {props.children}
    </CustomerBidFormContext.Provider>
  );
}
