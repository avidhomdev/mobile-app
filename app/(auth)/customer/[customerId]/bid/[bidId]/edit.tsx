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
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { MEDIA_TYPES, MEDIA_TYPES_KEYS } from "@/constants/media-types";
import {
  CustomerBidEditFormContextProvider,
  useCustomerBidEditFormContext,
} from "@/contexts/customer-bid-edit-form-context";
import { FormReducerActionType } from "@/contexts/customer-bid-form-context";
import { useCustomerContext } from "@/contexts/customer-context";
import { useLocationContext } from "@/contexts/location-context";
import { IProduct } from "@/hooks/useLocationProductsData";
import { supabase } from "@/lib/supabase";
import { formatAsCurrency } from "@/utils/format-as-currency";
import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
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
import { Fragment, useState } from "react";
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
    </Card>
  );
}

function AddProductBottomSheet() {
  const { dispatch, formState, products } = useCustomerBidEditFormContext();
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
  const { dispatch, formState } = useCustomerBidEditFormContext();
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
                supabase
                  .from("business_location_customer_bid_products")
                  .delete()
                  .match({
                    bid_id: formState.fields.id,
                    product_id: product.id,
                  })
                  .then(({ error }) => {
                    if (error) {
                      return dispatch({
                        type: FormReducerActionType.SET_ERROR,
                        payload: error.message,
                      });
                    }
                    setSelectedProducts(
                      selectedProducts.filter((prev) => prev.id !== product.id)
                    );
                  })
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
  const { formState, preview } = useCustomerBidEditFormContext();
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

function BidMedia() {
  const { dispatch, formState } = useCustomerBidEditFormContext();
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
                className="overflow-hidden relative items-center"
                space="sm"
              >
                <SupabaseSignedImage
                  size="xl"
                  path={m.path}
                  cacheInSeconds={3600}
                />
                <Pressable
                  className="absolute top-1 right-1 p-1 bg-background-200"
                  onPress={() =>
                    supabase
                      .from("business_location_customer_bid_media")
                      .delete()
                      .eq("id", m.id)
                      .then(({ error }) => {
                        if (error)
                          dispatch({
                            type: FormReducerActionType.SET_ERROR,
                            payload: error.message,
                          });

                        dispatch({
                          type: FormReducerActionType.REMOVE_MEDIA,
                          payload: m.id,
                        });
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
                          id: item.id,
                          path: item.path,
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
  const { dispatch, formState } = useCustomerBidEditFormContext();
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
  const { dispatch, formState, handleSubmit } = useCustomerBidEditFormContext();

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
      <BidProducts />
      <BidMedia />
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
      <FormControl>
        <FormControlLabel>
          <HStack className="justify-between items-center w-full" space="md">
            <FormControlLabelText>HOA Approval Needed</FormControlLabelText>
            <Switch
              value={formState.fields.hoa_approval_required}
              onToggle={(payload: boolean) =>
                dispatch({
                  type: FormReducerActionType.SET_HOA_APPROVAL_NEEDED,
                  payload,
                })
              }
            />
          </HStack>
        </FormControlLabel>
      </FormControl>
      {formState.fields.hoa_approval_required && (
        <Card>
          <VStack space="sm">
            <FormControl
              isRequired
              isInvalid={
                formState.fields.hoa_approval_required &&
                !formState.fields.hoa_contact_name
              }
            >
              <FormControlLabel>
                <FormControlLabelText>Contact Name</FormControlLabelText>
              </FormControlLabel>
              <Input className="bg-white" variant="outline" size="lg">
                <InputField
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_HOA_CONTACT_NAME,
                      payload,
                    })
                  }
                  defaultValue={formState.fields.hoa_contact_name}
                />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Contact Email</FormControlLabelText>
              </FormControlLabel>
              <Input className="bg-white" variant="outline" size="lg">
                <InputField
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_HOA_CONTACT_EMAIL,
                      payload,
                    })
                  }
                  defaultValue={formState.fields.hoa_contact_email}
                />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Contact Phone</FormControlLabelText>
              </FormControlLabel>
              <Input className="bg-white" variant="outline" size="lg">
                <InputField
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_HOA_CONTACT_PHONE,
                      payload,
                    })
                  }
                  defaultValue={formState.fields.hoa_contact_phone}
                />
              </Input>
            </FormControl>
          </VStack>
        </Card>
      )}
      <FormControl>
        <FormControlLabel>
          <HStack className="justify-between items-center w-full" space="md">
            <FormControlLabelText>Water Rebate</FormControlLabelText>
            <Switch
              value={formState.fields.has_water_rebate}
              onToggle={(payload: boolean) =>
                dispatch({
                  type: FormReducerActionType.SET_HAS_WATER_REBATE,
                  payload,
                })
              }
            />
          </HStack>
        </FormControlLabel>
      </FormControl>
      {formState.fields.has_water_rebate && (
        <Card>
          <FormControl
            isInvalid={
              formState.fields.has_water_rebate &&
              !formState.fields.water_rebate_company
            }
            isRequired
          >
            <FormControlLabel>
              <FormControlLabelText>Company</FormControlLabelText>
            </FormControlLabel>
            <Input className="bg-white" variant="outline" size="lg">
              <InputField
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(payload) =>
                  dispatch({
                    type: FormReducerActionType.SET_HOA_WATER_REBATE_COMPANY,
                    payload,
                  })
                }
                defaultValue={formState.fields.water_rebate_company}
              />
            </Input>
          </FormControl>
        </Card>
      )}

      <HStack space="lg">
        <FormControl className="grow">
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
      <Button action="primary" onPress={handleSubmit}>
        <ButtonText>Update Bid</ButtonText>
      </Button>
    </Fragment>
  );
}

function Preview() {
  const { formState } = useCustomerBidEditFormContext();
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

function ScreenHeader() {
  const { customer } = useCustomerContext();
  const { bid, preview } = useCustomerBidEditFormContext();
  return (
    <View className="flex-row items-center gap-x-2">
      <Icon as={Construction} className="text-typography-500" size="lg" />
      <View className="w-0.5 h-full bg-typography-100" />
      <View>
        <Heading size="md">{`${preview ? "Previewing" : "Edit"} ${
          bid.name
        }`}</Heading>
        <Text size="xs">{`Start a new bid for ${customer?.full_name}`}</Text>
      </View>
    </View>
  );
}

function ScreenContent() {
  const { preview } = useCustomerBidEditFormContext();
  return preview ? <Preview /> : <BidForm />;
}

function ScreenHeaderActions() {
  const { preview, togglePreview } = useCustomerBidEditFormContext();
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
  const { customer } = useCustomerContext();
  const { bidId } = useLocalSearchParams();
  const bid = customer?.bids.find((bid) => bid.id === Number(bidId));

  if (!bid) {
    return (
      <View>
        <Text>Bid not found.</Text>
      </View>
    );
  }

  return (
    <CustomerBidEditFormContextProvider bid={bid}>
      <ScreenHeaderActions />
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerClassName="gap-y-6 p-6 pt-0">
          <ScreenHeader />
          <ScreenContent />
          <ScreenEnd />
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomerBidEditFormContextProvider>
  );
}
