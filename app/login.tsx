import Button from "@/components/Button";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { Redirect, router } from "expo-router";
import { View } from "react-native";
import { useSession } from "@/contexts/auth-context";
import { useState } from "react";

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
    <View className="flex-1 justify-center p-4 gap-y-6">
      <View>
        <Text variant="header">Welcome back!</Text>
        <Text>
          Sign in to view your jobs, manage your schedule and start tracking
          time.
        </Text>
      </View>
      <View className="gap-y-6">
        <View className="gap-y-2">
          <Text variant="label">Username</Text>
          <Input
            autoCapitalize="none"
            onChangeText={setEmail}
            placeholder="Email"
          />
        </View>
        <View className="gap-y-2">
          <Text variant="label">Password</Text>
          <Input
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>
        <Button onPress={handleLogin}>
          <Button.Text className="text-center font-bold">Sign in</Button.Text>
        </Button>
      </View>
    </View>
  );
}
