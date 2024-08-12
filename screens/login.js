import React, { useState } from "react";
import { Box, VStack, Input, Button, Heading, Text, Icon, Pressable } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../components/header";
import axios from 'axios'; 

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:3000/login', {
                email: email,
                password: password,
            });

            if (response.data.success) {
                // Store user data or token if needed
                navigation.navigate('Home'); // Navigate to the home screen on successful login
            } else {
                setErrorMessage(response.data.message); // Set error message from the response
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred. Please try again.'); // Set generic error message
        }
    };

    return (
        <>
            <Header title="Login" />
            <Box flex={1} p={4} bg="white" justifyContent="center" alignItems="center">
                <VStack space={4} width="90%" maxW="300px">
                    <Heading size="lg" textAlign="center" color="blue.500">
                        Selamat Datang Kembali
                    </Heading>
                    <Text textAlign="center" color="gray.500">
                        Silakan masuk untuk melanjutkan
                    </Text>
                    <Input
                        placeholder="Email"
                        variant="outline"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        InputLeftElement={
                            <Icon as={<MaterialIcons name="email" />} size={5} ml="2" color="gray.500" />
                        }
                    />
                    <Input
                        placeholder="Password"
                        variant="outline"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        type={showPassword ? "text" : "password"}
                        InputLeftElement={
                            <Icon as={<MaterialIcons name="lock" />} size={5} ml="2" color="gray.500" />
                        }
                        InputRightElement={
                            <Pressable onPress={() => setShowPassword(!showPassword)}>
                                <Icon
                                    as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />}
                                    size={5}
                                    mr="2"
                                    color="gray.500"
                                />
                            </Pressable>
                        }
                    />
                    {errorMessage ? (
                        <Text color="red.500" textAlign="center">
                            {errorMessage}
                        </Text>
                    ) : null}
                    <Button mt={4} size="lg" colorScheme="blue" onPress={handleLogin}>
                        Masuk
                    </Button>
                </VStack>
            </Box>
        </>
    );
};

export default Login;
