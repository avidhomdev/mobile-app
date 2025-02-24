import BackHeaderButton from "@/components/BackHeaderButton";
import ScreenEnd from "@/components/ScreenEnd";
import SupabaseSignedImage from "@/components/SupabaseSignedImage";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetSectionHeaderText,
} from "@/components/ui/actionsheet";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useCustomerContext } from "@/contexts/customer-context";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { IFormState } from "@/hooks/useFormState";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import { formatAsCurrency } from "@/utils/format-as-currency";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  Info,
  Minus,
  Plus,
  UploadCloud,
} from "lucide-react-native";
import { Fragment, useCallback, useEffect, useReducer, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

interface IProduct extends Tables<"business_products"> {
  locations: Tables<"business_product_locations">[];
  units: number;
}

const useProductsData = ({ locationId }: { locationId: number }) => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () =>
      supabase
        .from("business_products")
        .select(
          `
          *,
          locations: business_product_locations!inner(*)
          `
        )
        .match({
          "business_product_locations.status": 1,
          "business_product_locations.location_id": locationId,
        })
        .returns<IProduct[]>()
        .then(({ data }) => data || []);

    fetchProducts().then(setProducts);
  }, []);

  return {
    products,
  };
};

function ProductItem({
  product,
  remove,
  updateProduct,
}: {
  product: IProduct;
  remove: () => void;
  updateProduct: (field: keyof IProduct, value: unknown) => void;
}) {
  const units = product.units ?? 0;
  const calculatedProductTotal = Number(product.unit_price) * Number(units);

  return (
    <Card className="gap-y-2 bg-white" variant="filled">
      <Text>{product.name}</Text>
      <View className="flex-row justify-between items-center gap-x-4 ">
        <Button action="negative" onPress={remove} size="xs">
          <ButtonText>Remove</ButtonText>
        </Button>
        <View className="flex-row border border-gray-300 px-2 rounded-full items-center gap-x-1 shrink">
          <Pressable
            disabled={Number(product.units) <= 0}
            onPress={() => updateProduct("units", Number(units) - 1)}
          >
            <Icon as={Minus} />
          </Pressable>
          <FormControl className="grow">
            <Input
              className="border-transparent"
              size="sm"
              variant="underlined"
            >
              <InputField
                className="text-right"
                keyboardType="numeric"
                onChangeText={(text) => updateProduct("units", Number(text))}
                placeholder="0"
                value={Number(units).toString()}
              />
              <InputSlot className="pl-2 pr-1">
                <Text size="xs">{product.unit}</Text>
              </InputSlot>
            </Input>
          </FormControl>
          <Pressable
            onPress={() => updateProduct("units", Number(units) + 1)}
            onLongPress={() => updateProduct("units", Number(units) + 100)}
          >
            <Icon as={Plus} />
          </Pressable>
        </View>
      </View>
      <Divider />
      <View className="flex-row justify-between items-center">
        <Text size="sm">{`${formatAsCurrency(
          product.unit_price ?? 0
        )} x ${units} ${product.unit}`}</Text>
        <Text bold>{formatAsCurrency(calculatedProductTotal)}</Text>
      </View>
    </Card>
  );
}

function AddProductBottomSheet({
  locationId,
  selectedProducts,
  setSelectedProducts,
}: {
  locationId: number;
  selectedProducts: IProduct[];
  setSelectedProducts: (payload: IProduct[]) => void;
}) {
  const { bottom } = useSafeAreaInsets();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const { products } = useProductsData({
    locationId,
  });

  const handleCloseAndAddProduct = (product: IProduct) => {
    setSelectedProducts([...selectedProducts, product]);
    handleClose();
  };

  return (
    <Fragment>
      <Button
        action="secondary"
        size="xs"
        onPress={() => setShowActionsheet(true)}
      >
        <ButtonText>Add</ButtonText>
      </Button>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>
              Select a product
            </ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          {products.map((product) => {
            const productIsSelected = selectedProducts.some(
              (p) => p.id === product.id
            );
            return (
              <ActionsheetItem
                disabled={productIsSelected}
                key={product.id}
                onPress={() => handleCloseAndAddProduct(product)}
              >
                <ActionsheetItemText
                  className={twMerge(
                    productIsSelected
                      ? "text-typography-200"
                      : "text-typography-600"
                  )}
                >
                  {product.name}
                </ActionsheetItemText>
              </ActionsheetItem>
            );
          })}
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

function Products({
  locationId,
  selectedProducts,
  setSelectedProducts,
}: {
  locationId: number;
  selectedProducts: IProduct[];
  setSelectedProducts: (payload: IProduct[]) => void;
}) {
  return (
    <Fragment>
      <View className="flex-row items-end justify-between">
        <Text>Products*</Text>
        <AddProductBottomSheet
          locationId={locationId}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </View>
      {selectedProducts.length > 0 ? (
        <View className="gap-y-2">
          {selectedProducts.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              updateProduct={(field: keyof IProduct, value: unknown) =>
                setSelectedProducts(
                  selectedProducts.map((p, i) => {
                    if (index !== i) return p;

                    return {
                      ...p,
                      [field]: value,
                    };
                  })
                )
              }
              remove={() =>
                setSelectedProducts(
                  selectedProducts.filter((prev) => prev.id !== product.id)
                )
              }
            />
          ))}
        </View>
      ) : (
        <Box className="bg-gray-200 p-6">
          <Text className="text-center" size="sm">
            Start by adding products
          </Text>
        </Box>
      )}
    </Fragment>
  );
}

function Totals({
  hideCommissions = false,
  formState,
}: {
  hideCommissions?: boolean;
  formState: IFormState<IBidFields>;
}) {
  const calculatedTotal = formState.fields.products.reduce((acc, product) => {
    return acc + Number(product.unit_price) * Number(product.units ?? 0);
  }, 0);

  const commission = formState.fields.commission;
  const bidTotal = calculatedTotal + commission;

  return (
    <Card className="border border-gray-200 gap-y-2">
      <Heading size="sm">Total</Heading>
      <Divider />
      <View className="gap-y-2">
        {!hideCommissions && (
          <Fragment>
            <View className="flex-row items-center justify-between">
              <Text>Products Total</Text>
              <Text>{formatAsCurrency(calculatedTotal)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text>Commission</Text>
              <Text>{formatAsCurrency(commission)}</Text>
            </View>
            <Divider />
          </Fragment>
        )}
        <View className="flex-row items-center justify-between bord">
          <Text bold>Bid Total</Text>
          <Text bold>{formatAsCurrency(bidTotal)}</Text>
        </View>
      </View>
    </Card>
  );
}

interface IBidFields {
  name: string;
  products: IProduct[];
  notes: string;
  commission: number;
  media: { id: string; path: string }[];
}

enum FormReducerActionType {
  SET_ERROR = "SET_ERROR",
  SET_NAME = "SET_NAME",
  SET_PRODUCTS = "SET_PRODUCTS",
  SET_MEDIA = "SET_MEDIA",
  REMOVE_MEDIA = "REMOVE_MEDIA",
  SET_NOTES = "SET_NOTES",
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_COMMISSION = "SET_COMMISSION",
}

interface IREMOVE_MEDIA_ACTION {
  type: FormReducerActionType.REMOVE_MEDIA;
  payload: string;
}

interface ISET_MEDIA_ACTION {
  type: FormReducerActionType.SET_MEDIA;
  payload: { id: string; path: string };
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

type TAction =
  | ISET_NAME_ACTION
  | ISET_PRODUCTS_ACTION
  | ISET_NOTES_ACTION
  | ISET_COMMISSION_ACTION
  | ISET_IS_SUBMITTING_ACTION
  | ISET_ERROR_ACTION
  | ISET_MEDIA_ACTION
  | IREMOVE_MEDIA_ACTION;

function formReducer(
  state: IFormState<IBidFields>,
  action: TAction
): IFormState<IBidFields> {
  switch (action.type) {
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
      return {
        ...state,
        fields: {
          ...state.fields,
          products: action.payload,
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
    case FormReducerActionType.SET_MEDIA: {
      return {
        ...state,
        fields: {
          ...state.fields,
          media: [...state.fields.media, action.payload],
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
    default:
      return state;
  }
}
function BidMedia({
  media,
  removeMedia,
  setSelectedMedia,
}: {
  media: { id: string; path: string }[];
  removeMedia: (id: string) => void;
  setSelectedMedia: (p: { id: string; path: string }) => void;
}) {
  const { customer } = useCustomerContext();
  const { location } = useLocationContext();
  const { bottom } = useSafeAreaInsets();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [selected, setSelected] = useState<
    { filePath: string; file: string; fileName: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const handleClose = () => setShowActionsheet(false);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const fileRootPath = `${location.business_id}/locations/${location.id}/customers/${customer.id}`;
      setSelected([
        ...selected,
        ...result.assets.flatMap((asset) =>
          asset.fileName
            ? {
                filePath: `${fileRootPath}/${asset.fileName}`,
                file: asset.uri,
                fileName: asset.fileName,
              }
            : []
        ),
      ]);
    }
  };

  const handleUploadSelected = async () => {
    setIsUploading(true);

    for (const file of selected) {
      const blob = await fetch(file.file).then((r) => r.blob());
      const arrayBuffer = await new Response(blob).arrayBuffer();

      await supabase.storage
        .from("business")
        .upload(file.filePath, arrayBuffer, {
          cacheControl: "3600",
          upsert: true,
        })
        .then(async ({ data: storageFile }) => {
          if (!storageFile) return;

          setSelectedMedia(storageFile);
        })
        .catch(() => {
          alert("Error uploading file");
        });
    }

    setIsUploading(false);
    setShowActionsheet(false);
    setSelected([]);
  };

  return (
    <>
      <View className="flex-row items-end justify-between">
        <Text>Media*</Text>
        <Button
          action="secondary"
          onPress={() => setShowActionsheet(true)}
          size="xs"
        >
          <ButtonText>Add</ButtonText>
        </Button>
      </View>
      {media.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-2"
        >
          {media.map((m) => {
            return (
              <Box
                key={m.id}
                className="rounded-lg overflow-hidden relative"
                style={{ marginBottom: 10 }}
              >
                <SupabaseSignedImage
                  size="2xl"
                  path={m.path}
                  cacheInSeconds={3600}
                />
                <Pressable
                  className="absolute top-1 right-1 rounded-full p-1 bg-background-50"
                  onPress={() => removeMedia(m.id)}
                >
                  <Icon as={CloseIcon} size="xl" />
                </Pressable>
              </Box>
            );
          })}
        </ScrollView>
      ) : (
        <Box className="bg-gray-200 p-6">
          <Text className="text-center" size="sm">
            Start by adding photos for the bid
          </Text>
        </Box>
      )}
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View className="flex-row justify-between w-full mt-3">
            <View>
              <Text className="font-semibold">
                Upload your photos for the bid
              </Text>
              <Text size="sm">JPG, PDF, PNG supported</Text>
            </View>
            <Pressable onPress={handleClose}>
              <Icon
                as={UploadCloud}
                size="lg"
                className="stroke-background-500"
              />
            </Pressable>
          </View>
          {selected.length > 0 ? (
            <ScrollView
              contentContainerClassName="p-6 items-start flex-row gap-2 flex-wrap"
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {selected.map((file, index) => (
                <Box key={index}>
                  <Image
                    alt={file.fileName}
                    size="xl"
                    source={{ uri: file.file }}
                  />
                  <Pressable
                    onPress={() =>
                      setSelected(selected.filter((i) => i.file !== file.file))
                    }
                    className="absolute top-3 right-3 rounded-full p-1 bg-background-50"
                  >
                    <Icon as={CloseIcon} size="xl" />
                  </Pressable>
                </Box>
              ))}
            </ScrollView>
          ) : (
            <View className="my-[18px] items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[130px] w-full">
              <Icon
                as={UploadCloud}
                className="h-[62px] w-[62px] stroke-background-200"
              />
              <Text size="sm">No files uploaded yet</Text>
            </View>
          )}

          <ButtonGroup className="w-full">
            <Button
              action="secondary"
              variant="outline"
              className="w-full"
              onPress={handleImagePicker}
            >
              <ButtonText>Browse photos</ButtonText>
            </Button>
            <Button
              className="w-full"
              isDisabled={selected.length === 0 || isUploading}
              onPress={handleUploadSelected}
            >
              <ButtonText>Upload</ButtonText>
            </Button>
          </ButtonGroup>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

function BidForm({
  formState,
  dispatch,
}: {
  formState: IFormState<IBidFields>;
  dispatch: React.Dispatch<TAction>;
}) {
  const { customer } = useCustomerContext();

  return (
    <ScrollView contentContainerClassName="gap-y-6 p-6">
      {formState.error && (
        <Alert action="error">
          <AlertIcon as={Info} />
          <AlertText>{formState.error}</AlertText>
        </Alert>
      )}
      <FormControl isRequired>
        <FormControlLabel>
          <FormControlLabelText>Name</FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size="lg">
          <InputField
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(name) =>
              dispatch({
                type: FormReducerActionType.SET_NAME,
                payload: name,
              })
            }
            defaultValue={formState.fields.name}
          />
        </Input>
      </FormControl>
      <BidMedia
        media={formState.fields.media}
        removeMedia={(id) =>
          dispatch({
            type: FormReducerActionType.REMOVE_MEDIA,
            payload: id,
          })
        }
        setSelectedMedia={(payload) =>
          dispatch({
            type: FormReducerActionType.SET_MEDIA,
            payload,
          })
        }
      />
      {/* <Text>nearmap integration? or upload?</Text> */}
      <Products
        locationId={Number(customer?.location_id)}
        selectedProducts={formState.fields.products}
        setSelectedProducts={(payload) =>
          dispatch({
            type: FormReducerActionType.SET_PRODUCTS,
            payload,
          })
        }
      />

      <FormControl isRequired>
        <FormControlLabel>
          <FormControlLabelText>Commission</FormControlLabelText>
        </FormControlLabel>
        <Input className="bg-white" size="lg">
          <InputField
            keyboardType="numeric"
            autoCorrect={false}
            onChangeText={(commission) =>
              dispatch({
                type: FormReducerActionType.SET_COMMISSION,
                payload: Number(commission),
              })
            }
            defaultValue={formState.fields.commission.toString()}
          />
        </Input>
      </FormControl>
      <Totals formState={formState} />
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Notes</FormControlLabelText>
        </FormControlLabel>
        <Textarea className="bg-white" size="md">
          <TextareaInput
            defaultValue={formState.fields.notes}
            onChangeText={(text) =>
              dispatch({ type: FormReducerActionType.SET_NOTES, payload: text })
            }
          />
        </Textarea>
      </FormControl>
      <ScreenEnd />
    </ScrollView>
  );
}

function Preview({ formState }: { formState: IFormState<IBidFields> }) {
  const totalNumberOfUnits = formState.fields.products.reduce(
    (acc, product) => {
      return acc + Number(product.units ?? 0);
    },
    0
  );
  const commissionPerUnit =
    formState.fields.commission / (totalNumberOfUnits || 1);

  return (
    <ScrollView contentContainerClassName="gap-y-4 p-6">
      <Heading>{formState.fields.name}</Heading>
      {formState.fields.products.map((product) => {
        const units = product.units ?? 0;
        const unitPrice = product.unit_price ?? 0;
        const calculatedUnitPrice = unitPrice + commissionPerUnit;
        const calculatedProductTotal =
          Number(calculatedUnitPrice) * Number(units);

        return (
          <Card className="gap-y-2" key={product.id} variant="filled">
            <Text>{product.name}</Text>
            <Divider />
            <View className="flex-row justify-between items-center">
              <Text size="sm">{`${formatAsCurrency(
                calculatedUnitPrice
              )} x ${units} ${product.unit}`}</Text>
              <Text bold>{formatAsCurrency(calculatedProductTotal)}</Text>
            </View>
          </Card>
        );
      })}
      {formState.fields.notes && (
        <Card className="border border-gray-200 gap-y-2">
          <Heading size="sm">Notes</Heading>
          <Divider />
          <Text>{formState.fields.notes}</Text>
        </Card>
      )}
      <Totals hideCommissions formState={formState} />
      <ScreenEnd />
    </ScrollView>
  );
}

export default function Screen() {
  const { profile, refreshData } = useUserContext();
  const [preview, setPreview] = useState(false);
  const { top, bottom } = useSafeAreaInsets();
  const { customer } = useCustomerContext();
  const router = useRouter();

  const [formState, dispatch] = useReducer(formReducer, {
    error: null,
    fields: {
      commission: 0,
      name: "Bid",
      notes: "",
      media: [],
      products: [],
    },
    isSubmitting: false,
  });

  const handleSubmit = useCallback(async () => {
    if (!formState.fields.name) {
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: "Name is required",
      });
    }
    if (!formState.fields.products.length) {
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: "At least one product is required",
      });
    }
    if (!formState.fields.commission) {
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: "Commission is required",
      });
    }
    dispatch({ type: FormReducerActionType.SET_IS_SUBMITTING, payload: true });

    const insertFields = {
      business_id: customer?.business_id,
      creator_id: profile?.id,
      customer_id: customer?.id,
      location_id: customer?.location_id,
      name: formState.fields.name,
      commission: formState.fields.commission,
      notes: formState.fields.notes,
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
      location_id: customer?.location_id,
      customer_id: customer?.id,
      path: m.path,
      name: m.id,
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
  }, [formState]);

  return (
    <Fragment>
      <View
        className="p-4 gap-x-4 border-b-8 border-gray-500"
        style={{ paddingBlockStart: top }}
      >
        <View className="flex-row items-center gap-x-4 justify-between">
          <BackHeaderButton />
          <Pressable onPress={() => setPreview(!preview)}>
            <Icon
              as={preview ? EyeOff : Eye}
              className={twMerge(
                preview ? "text-typography-500" : "text-primary-400"
              )}
              size="2xl"
            />
          </Pressable>
        </View>
        <Heading className="text-typography-800 mt-2" size="xl">
          New Bid
        </Heading>
        <Text className="text-typography-400">
          {`Start a new bid for ${customer?.full_name}`}
        </Text>
      </View>
      {preview ? (
        <Preview formState={formState} />
      ) : (
        <BidForm formState={formState} dispatch={dispatch} />
      )}
      <View className="px-4 bg-transparent absolute w-full" style={{ bottom }}>
        <Button onPress={handleSubmit}>
          <ButtonText>Submit Bid</ButtonText>
        </Button>
      </View>
    </Fragment>
  );
}
