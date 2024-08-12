import React, { useState, useEffect } from "react";
import { Box, ScrollView, Image, Text, Heading, VStack, Input, Button, Center, Icon } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../components/header";

const Profile = ({ navigation }) => {
    const [nama, setNama] = useState("");
    const [jenisKelamin, setJenisKelamin] = useState("");
    const [noTelepon, setNoTelepon] = useState("");
    const [email, setEmail] = useState("");

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('http://10.0.2.2:3000/users'); // Ensure you have the correct endpoint
            if (!response.ok) { 
                throw new Error('Failed to fetch user profile');
            }
            const user = await response.json();
            setNama(user.Nama || ""); // Ensure fallback values
            setJenisKelamin(user.Jenis_Kelamin || "");
            setNoTelepon(user.No_Telepon || "");
            setEmail(user.email || "");
        } catch (error) {
            console.error('Failed to fetch user profile', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        // Contoh logika untuk logout, seperti menghapus token dari AsyncStorage (jika ada)
        // AsyncStorage.removeItem('userToken');
        console.log("User logged out");

        // Arahkan ke halaman login setelah logout
        navigation.replace('Login'); // Menggunakan 'replace' agar user tidak dapat kembali ke halaman profile setelah logout
    };

    return (
        <>
            <Header title={"Profile"} />
            <ScrollView>
                <Center mt={5}>
                    <Image
                        source={require("../assets/profile.jpg")}
                        alt="Profile Picture"
                        size="xl"
                        borderRadius={100}
                    />
                    <Heading mt={5} fontSize="xl">
                        {nama}
                    </Heading>
                </Center>
                <VStack space={4} mt={4} px={5}>
                    <Box>
                        <Text fontSize="md" color="gray.500">
                            Nama
                        </Text>
                        <Input
                            value={nama}
                            onChangeText={setNama}
                            mt={2}
                            isReadOnly
                        />
                    </Box>
                    <Box>
                        <Text fontSize="md" color="gray.500">
                            Jenis Kelamin
                        </Text>
                        <Input
                            value={jenisKelamin}
                            onChangeText={setJenisKelamin}
                            mt={2}
                            isReadOnly
                        />
                    </Box>
                    {/* <Box>
                        <Text fontSize="md" color="gray.500">
                            No Telepon
                        </Text>
                        <Input
                            value={noTelepon}
                            onChangeText={setNoTelepon}
                            mt={2}
                            isReadOnly
                        />
                    </Box> */}
                    <Box>
                        <Text fontSize="md" color="gray.500">
                            Email
                        </Text>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            mt={2}
                            isReadOnly
                        />
                    </Box>
                    <Button
                        mt={5}
                        colorScheme="red"
                        onPress={handleLogout}
                        leftIcon={<Icon as={FontAwesome} name="sign-out" size="sm" />}
                    >
                        Logout
                    </Button>
                </VStack>
            </ScrollView>
        </>
    );
};

export default Profile;
