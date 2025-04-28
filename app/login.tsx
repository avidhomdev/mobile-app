import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Text } from "@/components/ui/text";
import { useSession } from "@/contexts/auth-context";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";

import { Alert, AlertText } from "@/components/ui/alert";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AlertCircleIcon } from "lucide-react-native";

export default function Login() {
  const { signIn, session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () =>
    signIn!({ email, password }).then(({ error: signInError }) => {
      if (!signInError) router.replace("/");
      setError(signInError!.message);
    });

  if (session) {
    return <Redirect href="/(auth)/(tabs)" />;
  }

  return (
    <VStack
      className="bg-background-light dark:bg-background-dark flex-1 justify-center px-6"
      space="lg"
    >
      <VStack space="xs">
        <Heading className="text-typography-800 text-center" size="3xl">
          Welcome back!
        </Heading>
        <Text className="text-typography-500 text-center">
          Sign in to view your jobs, manage your schedule and start tracking
          time.
        </Text>
      </VStack>
      <KeyboardAvoidingView behavior="padding">
        <VStack space="lg">
          {error && (
            <Alert action="error">
              <AlertText>{error}</AlertText>
            </Alert>
          )}
          <FormControl isRequired>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
              <InputField
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setEmail}
                placeholder="johndoe@exmaple.com"
                value={email}
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
              <InputField
                onChangeText={setPassword}
                type="password"
                value={password}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Password is required</FormControlErrorText>
            </FormControlError>
          </FormControl>
          <Button onPress={handleLogin}>
            <ButtonText className="text-center font-bold">Sign in</ButtonText>
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </VStack>
  );
}
