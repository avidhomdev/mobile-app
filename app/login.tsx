import { Redirect, router } from "expo-router";
import { View } from "react-native";
import { useSession } from "@/contexts/auth-context";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";

export default function Login() {
  const { signIn, session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    signIn({ email, password });
    router.replace("/");
  };

  if (session) {
    return <Redirect href="/(auth)/(tabs)" />;
  }

  return (
    <View className="flex-1 justify-center p-4 gap-y-6 bg-white">
      <View>
        <Text size="xl">Welcome back!</Text>
        <Text>
          Sign in to view your jobs, manage your schedule and start tracking
          time.
        </Text>
      </View>
      <View className="gap-y-6">
        <FormControl isRequired>
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input variant="outline" size="lg">
            <InputField
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setEmail}
              placeholder="johndoe@exmaple.com"
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>Email is required</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl isRequired>
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input variant="outline" size="lg">
            <InputField onChangeText={setPassword} type="password" />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>Password is required</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <Button onPress={handleLogin}>
          <ButtonText className="text-center font-bold">Sign in</ButtonText>
        </Button>
      </View>
    </View>
  );
}
