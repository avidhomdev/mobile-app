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
import { HStack } from "@/components/ui/hstack";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectSectionHeaderText,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { MEDIA_TYPES, MEDIA_TYPES_KEYS } from "@/constants/media-types";
import { useCustomerContext } from "@/contexts/customer-context";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { IFormState } from "@/hooks/useFormState";
import {
  IProduct,
  useLocationProductsData,
} from "@/hooks/useLocationProductsData";
import { supabase } from "@/lib/supabase";
import { formatAsCurrency } from "@/utils/format-as-currency";
import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  Construction,
  Eye,
  EyeOff,
  Info,
  Minus,
  Plus,
  UploadCloud,
} from "lucide-react-native";
import {
  createContext,
  Fragment,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

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

function AddProductBottomSheet() {
  const { dispatch, formState, products } = useNewBidContext();
  const { products: selectedProducts } = formState.fields;
  const { bottom } = useSafeAreaInsets();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);

  const handleCloseAndAddProduct = (product: IProduct) => {
    dispatch({
      type: FormReducerActionType.SET_PRODUCTS,
      payload: [
        ...selectedProducts,
        {
          ...product,
          units: product.min_units,
        },
      ],
    });

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

function BidProducts() {
  const { dispatch, formState } = useNewBidContext();
  const { products: selectedProducts } = formState.fields;
  const setSelectedProducts = (payload: IProduct[]) =>
    dispatch({
      type: FormReducerActionType.SET_PRODUCTS,
      payload,
    });

  return (
    <Fragment>
      <View className="flex-row items-end justify-between">
        <Text>Products*</Text>
        <AddProductBottomSheet />
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

function Totals() {
  const { formState, preview } = useNewBidContext();
  const { commission, discount } = formState.fields;
  const calculatedTotal =
    formState.fields.products.reduce((acc, product) => {
      return acc + Number(product.unit_price) * Number(product.units ?? 0);
    }, 0) + discount;

  const bidTotal = calculatedTotal + commission - discount;

  return (
    <Card className="border border-gray-200 gap-y-2">
      <Heading size="sm">Total</Heading>
      <Divider />
      <View className="gap-y-2">
        {!preview && (
          <Fragment>
            <View className="flex-row items-center justify-between">
              <Text>Products Total</Text>
              <Text>{formatAsCurrency(calculatedTotal)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text>Commission</Text>
              <Text>{formatAsCurrency(commission)}</Text>
            </View>
          </Fragment>
        )}
        <View className="flex-row items-center justify-between">
          <Text>Discount</Text>
          <Text>
            {`${discount > 0 ? "-" : ""} ${formatAsCurrency(discount)}`}
          </Text>
        </View>
        <Divider />
        <View className="flex-row items-center justify-between bord">
          <Text bold>Bid Total</Text>
          <Text bold>{formatAsCurrency(bidTotal)}</Text>
        </View>
      </View>
    </Card>
  );
}

interface IBidFields {
  commission: number;
  discount: number;
  lead_type: string;
  media: { id: string; path: string; type: MEDIA_TYPES_KEYS }[];
  name: string;
  notes: string;
  products: IProduct[];
}

enum FormReducerActionType {
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

type TAction =
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
  | IUPDATE_MEDIA_ACTION;

function formReducer(products: IProduct[]) {
  return (
    state: IFormState<IBidFields>,
    action: TAction
  ): IFormState<IBidFields> => {
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

function BidMedia() {
  const { dispatch, formState } = useNewBidContext();
  const { media } = formState.fields;
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
                filePath: `${fileRootPath}/${dayjs().unix()}_${asset.fileName}`,
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

          dispatch({
            type: FormReducerActionType.ADD_MEDIA,
            payload: {
              ...storageFile,
              type: "GENERAL",
            },
          });
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
          {media.map((m, i) => {
            return (
              <VStack
                key={m.id}
                className="rounded-lg overflow-hidden relative"
                space="sm"
              >
                <SupabaseSignedImage
                  size="2xl"
                  path={m.path}
                  cacheInSeconds={3600}
                />
                <Pressable
                  className="absolute top-1 right-1 rounded-full p-1 bg-background-50"
                  onPress={() =>
                    dispatch({
                      type: FormReducerActionType.REMOVE_MEDIA,
                      payload: m.id,
                    })
                  }
                >
                  <Icon as={CloseIcon} size="xl" />
                </Pressable>
                <Select
                  defaultValue={m.type}
                  initialLabel={MEDIA_TYPES[m.type as MEDIA_TYPES_KEYS].name}
                  onValueChange={(newType) =>
                    dispatch({
                      type: FormReducerActionType.UPDATE_MEDIA,
                      payload: media.map((item, idx) => {
                        if (i !== idx) return item;
                        return {
                          ...item,
                          type: newType as MEDIA_TYPES_KEYS,
                        };
                      }),
                    })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectInput
                      placeholder="Select option"
                      className="flex-1"
                    />
                    <SelectIcon className="mr-3" as={ChevronDown} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent
                      className="max-h-80"
                      style={{ paddingBottom: bottom }}
                    >
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectSectionHeaderText>
                        Select a category
                      </SelectSectionHeaderText>
                      <ScrollView className="w-full">
                        {Object.entries(MEDIA_TYPES).map(
                          ([typeValue, type]) => (
                            <SelectItem
                              label={type.name}
                              key={typeValue}
                              value={typeValue}
                            />
                          )
                        )}
                      </ScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>
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

function LeadSelector() {
  const { dispatch, formState } = useNewBidContext();
  const actionPropValue = (opt: string) =>
    formState.fields.lead_type === opt ? "primary" : "secondary";

  return (
    <HStack className="bg-white" space="xs">
      <Button
        action={actionPropValue("setter")}
        className="grow"
        onPress={() =>
          dispatch({
            type: FormReducerActionType.SET_LEAD_TYPE,
            payload: "setter",
          })
        }
      >
        <ButtonText>Setter</ButtonText>
      </Button>
      <Button
        action={actionPropValue("self_gen")}
        className="grow"
        onPress={() =>
          dispatch({
            type: FormReducerActionType.SET_LEAD_TYPE,
            payload: "self_gen",
          })
        }
      >
        <ButtonText>Self Gen</ButtonText>
      </Button>
      <Button
        action={actionPropValue("paid")}
        className="grow"
        onPress={() =>
          dispatch({
            type: FormReducerActionType.SET_LEAD_TYPE,
            payload: "paid",
          })
        }
      >
        <ButtonText>Paid</ButtonText>
      </Button>
    </HStack>
  );
}

function BidForm() {
  const { dispatch, formState, handleSubmit } = useNewBidContext();

  return (
    <Fragment>
      {formState.error && (
        <Alert action="error">
          <AlertIcon as={Info} />
          <AlertText>{formState.error}</AlertText>
        </Alert>
      )}
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Lead</FormControlLabelText>
        </FormControlLabel>
        <LeadSelector />
      </FormControl>
      <FormControl isRequired>
        <FormControlLabel>
          <FormControlLabelText>Name</FormControlLabelText>
        </FormControlLabel>
        <Input className="bg-white" variant="outline" size="lg">
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
      <BidMedia />
      <BidProducts />

      <HStack space="lg">
        <FormControl className="grow" isRequired>
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

        <FormControl className="grow">
          <FormControlLabel>
            <FormControlLabelText>Discount</FormControlLabelText>
          </FormControlLabel>
          <Input className="bg-white" size="lg">
            <InputField
              keyboardType="numeric"
              autoCorrect={false}
              onChangeText={(discount) =>
                dispatch({
                  type: FormReducerActionType.SET_DISCOUNT,
                  payload: Number(discount),
                })
              }
              defaultValue={formState.fields.discount.toString()}
            />
          </Input>
        </FormControl>
      </HStack>
      <Totals />
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Notes</FormControlLabelText>
        </FormControlLabel>
        <Textarea className="bg-white" size="md">
          <TextareaInput
            defaultValue={formState.fields.notes}
            onChangeText={(text) =>
              dispatch({
                type: FormReducerActionType.SET_NOTES,
                payload: text,
              })
            }
          />
        </Textarea>
      </FormControl>
      <Button onPress={handleSubmit}>
        <ButtonText>Submit Bid</ButtonText>
      </Button>
    </Fragment>
  );
}

function Preview() {
  const { formState } = useNewBidContext();
  const { products } = formState.fields;
  return (
    <VStack space="sm">
      <Heading>{formState.fields.name}</Heading>
      {products.map((product) => (
        <Card key={product.id}>
          <Text size="lg">{product.name}</Text>
          <Text size="sm">{`${product.units} x ${product.unit}`}</Text>
        </Card>
      ))}
      {formState.fields.notes && (
        <Card className="border border-gray-200 gap-y-2">
          <Heading size="sm">Notes</Heading>
          <Divider />
          <Text>{formState.fields.notes}</Text>
        </Card>
      )}
      <Totals />
    </VStack>
  );
}

const NewBidContext = createContext<{
  formState: IFormState<IBidFields>;
  dispatch: React.Dispatch<TAction>;
  handleSubmit: () => void;
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
    },
    isSubmitting: false,
  },
  dispatch: () => {},
  handleSubmit: () => {},
  preview: false,
  products: [],
  togglePreview: () => {},
});

function useNewBidContext() {
  const value = useContext(NewBidContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error(
        "useNewBidContext must be wrapped in a <NewBidProvider />"
      );
    }
  }

  return value;
}

function NewBidProvider(props: PropsWithChildren) {
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

    if (formState.fields.media.length === 0) {
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: "Media is required",
      });
    }

    const formStateMediaTypes = formState.fields.media.map((m) => m.type);
    const missingRequiredMediaTypes = Object.entries(MEDIA_TYPES).flatMap(
      ([typeKey, type]) => {
        if (!type.required) return [];
        if (formStateMediaTypes.includes(typeKey as MEDIA_TYPES_KEYS))
          return [];
        return typeKey;
      }
    );

    if (missingRequiredMediaTypes.length) {
      const missingRequiredMediaTypeStringParts = missingRequiredMediaTypes.map(
        (type) => MEDIA_TYPES[type as MEDIA_TYPES_KEYS].name
      );

      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: `Missing media: ${missingRequiredMediaTypeStringParts.join(
          ", "
        )} is required`,
      });
    }

    dispatch({ type: FormReducerActionType.SET_IS_SUBMITTING, payload: true });

    const insertFields = {
      business_id: customer?.business_id,
      commission: formState.fields.commission,
      creator_id: profile?.id,
      customer_id: customer?.id,
      lead_type: formState.fields.lead_type,
      location_id: customer?.location_id,
      name: formState.fields.name,
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
  }, [formState]);

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
    <NewBidContext.Provider value={value}>
      {props.children}
    </NewBidContext.Provider>
  );
}

function ScreenHeader() {
  const { customer } = useCustomerContext();
  const { preview } = useNewBidContext();
  return (
    <View className="flex-row items-center gap-x-2">
      <Icon as={Construction} className="text-typography-500" size="lg" />
      <View className="w-0.5 h-full bg-typography-100" />
      <View>
        <Heading size="md">{`${preview ? "Previewing" : "New"} Bid`}</Heading>
        <Text size="xs">{`Start a new bid for ${customer?.full_name}`}</Text>
      </View>
    </View>
  );
}

function ScreenContent() {
  const { preview } = useNewBidContext();
  return preview ? <Preview /> : <BidForm />;
}

function ScreenHeaderActions() {
  const { preview, togglePreview } = useNewBidContext();
  const { top } = useSafeAreaInsets();

  return (
    <View className="p-4 gap-x-4" style={{ paddingBlockStart: top }}>
      <View className="flex-row items-center gap-x-4 justify-between">
        <BackHeaderButton />
        <Pressable onPress={togglePreview}>
          <Icon
            as={preview ? EyeOff : Eye}
            className={twMerge(
              preview ? "text-typography-500" : "text-primary-400"
            )}
            size="2xl"
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function Screen() {
  return (
    <NewBidProvider>
      <ScreenHeaderActions />
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerClassName="gap-y-6 p-6 pt-0">
          <ScreenHeader />
          <ScreenContent />
          <ScreenEnd />
        </ScrollView>
      </KeyboardAvoidingView>
    </NewBidProvider>
  );
}
