import { MEDIA_TYPES } from "@/constants/media-types";
import { ILocationCustomerBid } from "@/contexts/user-context";

export function getBidRequirementsForJob(bid: ILocationCustomerBid): {
  [k: string]: { label: string; value: boolean };
} {
  const mediaFieldTypes = bid.media.map((m) => m.type);

  return {
    name: {
      label: "Name",
      value: Boolean(bid.name),
    },
    products: {
      label: "Products",
      value: Boolean(bid.products.length),
    },
    ...(bid.hoa_approval_required && {
      hoa_contact_name: {
        label: "HOA Contact Name",
        value: Boolean(bid.hoa_contact_name),
      },
      hoa_contact_phone: {
        label: "HOA Contact Phone",
        value: Boolean(bid.hoa_contact_phone),
      },
      hoa_contact_email: {
        label: "HOA Contact Email",
        value: Boolean(bid.hoa_contact_email),
      },
    }),
    ...(bid.has_water_rebate && {
      water_rebate_company: {
        label: "Water Rebate Company",
        value: Boolean(bid.water_rebate_company),
      },
    }),
    ...Object.entries(MEDIA_TYPES).reduce<{
      [k: string]: { label: string; value: boolean };
    }>((dictionary, [typeKey, type]) => {
      if (!type.required) return dictionary;
      dictionary[typeKey] = {
        label: `Media: ${type.name} photo`,
        value: mediaFieldTypes.includes(typeKey),
      };
      return dictionary;
    }, {}),
  };
}
