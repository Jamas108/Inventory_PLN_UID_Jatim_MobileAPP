import { Text, Button, Box, VStack, Input, Heading, FormControl, Pressable, StatusBar, Image, Center } from "native-base";
import { useState } from "react";
import { loginUser } from "../actions/AuthAction";
import { storeData } from "../utils";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const login = async () => {
    if (email && password) {
      try {
        const user = await loginUser(email, password);
        if (user.status === 'admin') {
          await storeData('adminStatus', true);
          navigation.replace('AdminTabs');
        } else {
          await storeData('adminStatus', false);
          navigation.replace('Tabs');
        }
      } catch (error) {
        setFormError('Email atau Password salah, Harap masukan Email atau Password dengan benar');
      }
    } else {
      setFormError('Harap isi form login dengan lengkap dan benar');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" />
      <Center flex={1} mb={10}>
        <Image
          source={require("../assets/logo.png")}
          w={100}
          h={100}
          alt="Logo"
          mb={8}
        />
        <Box
          width="85%"
          borderRadius={10}
          bgColor="#fff"
          shadow={2}
          p={8}
          alignItems="center"
        >
          <Heading fontSize="xl" color="#004aad" mb={4}>
            Login
          </Heading>
          <VStack space={5} width="100%">
            <FormControl isInvalid={!!formError}>
              <FormControl.Label>
                <Text fontSize="md" color="#004aad">Email</Text>
              </FormControl.Label>
              <Input
                h={12}
                borderRadius={8}
                borderWidth={1}
                fontSize="md"
                bgColor="#E1E8F0"
                borderColor="#004aad"
                placeholder="Masukkan Email"
                value={email}
                onChangeText={setEmail}
              />
            </FormControl>

            <FormControl isInvalid={!!formError}>
              <FormControl.Label>
                <Text fontSize="md" color="#004aad">Password</Text>
              </FormControl.Label>
              <Input
                h={12}
                borderRadius={8}
                borderWidth={1}
                fontSize="md"
                bgColor="#E1E8F0"
                borderColor="#004aad"
                placeholder="Masukkan Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {formError ? (
                <FormControl.ErrorMessage>{formError}</FormControl.ErrorMessage>
              ) : null}
            </FormControl>

            <Button
              h={12}
              borderRadius={8}
              bgColor="#FFCC00"
              _text={{ color: "#004aad", fontWeight: "bold" }}
              onPress={login}
            >
              Login
            </Button>

            {/* <Pressable onPress={() => navigation.navigate("Register")}>
              <Text color="#004aad" fontSize="sm" textAlign="center" mt={2}>
                Belum memiliki akun? <Text fontWeight="bold" underline>Registrasi</Text>
              </Text>
            </Pressable> */}
          </VStack>
        </Box>
      </Center>
    </SafeAreaView>
  );
};

export default Login;
