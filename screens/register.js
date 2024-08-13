import {
  Button,
  Box,
  VStack,
  Input,
  Center,
  Image,
  Heading,
  Pressable,
  StatusBar,
  ScrollView,
  Text,
  HStack,
  useTheme, 
} from "native-base";
import { registerUser } from "../actions/AuthAction";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [nomorhp, setNomorhp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { colors } = useTheme();

  const onRegister = async () => {
    if (name && email && nomorhp && password) {
      const data = {
        name: name,
        email: email,
        nomorhp: nomorhp,
        password: password,
        status: "user",
      };
  
      try {
        console.log("Registering user:", data);
        const user = await registerUser(data, password);
        console.log("User registered successfully:", user);
        navigation.replace("Tabs");
      } catch (error) {
        console.log("Registration error:", error.message);
        setFormError(error.message);
      }
    } else {
      setFormError("All fields are required.");
      console.log("Form error: All fields are required.");
    }
  };
  
  
  return (
    <>
      <SafeAreaView>
        <ScrollView h="full">
          <StatusBar barStyle="dark-content" />
          <Pressable activeOpacity={0.5} onPress={() => navigation.goBack()}>
            <Box p={4} bgColor={colors.primary[50]}>
              <HStack alignItems="center">
                <Ionicons name="arrow-back-outline" size={24} color={colors.primary[800]} />
                <Text ml={2} bold fontSize="lg" color={colors.primary[800]}>
                  Login
                </Text>
              </HStack>
            </Box>
          </Pressable>

          <Box bgColor={colors.primary[50]} pt={6} px={4} flex={1} alignItems="center">
            <Center>
              <Image
                source={require("../assets/logo.png")}
                borderRadius="full"
                w={100}
                h={100}
                alt="PLN Logo"
              />
            </Center>

            <Heading fontSize="2xl" mt={4} color={colors.primary[800]}>
              Registrasi
            </Heading>

            <VStack space={4} mt={8} w="full">
              <Input
                borderColor={colors.primary[300]}
                bgColor={colors.primary[50]}
                borderWidth={2}
                borderRadius={10}
                fontSize="md"
                placeholder="Masukan Nama"
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <Input
                borderColor={colors.primary[300]}
                bgColor={colors.primary[50]}
                borderWidth={2}
                borderRadius={10}
                fontSize="md"
                placeholder="Masukan No Telepon"
                value={nomorhp}
                onChangeText={(text) => setNomorhp(text)}
                keyboardType="numeric"
              />
              <Input
                borderColor={colors.primary[300]}
                bgColor={colors.primary[50]}
                borderWidth={2}
                borderRadius={10}
                fontSize="md"
                placeholder="Masukan Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <Input
                borderColor={colors.primary[300]}
                bgColor={colors.primary[50]}
                borderWidth={2}
                borderRadius={10}
                fontSize="md"
                placeholder="Masukan Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />

              <Button
                bgColor={colors.primary[600]}
                borderRadius={10}
                _text={{ fontSize: "xl", fontWeight: "bold", color: "white" }}
                onPress={onRegister}
              >
                Sign Up
              </Button>
            </VStack>

            <Text alignSelf="center" fontSize="sm" mt={4} color={colors.red[600]}>
              {formError ? `Error: ${formError}` : "Harap mengisikan Datadiri dengan baik dan benar!"}
            </Text>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Register;
