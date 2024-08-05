import React, { useState } from "react";
import { Box, ScrollView, Image, Text, Heading, VStack, ZStack, Input, HStack, Icon, Button, View, Center } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../components/header";

const Profile = () => {
    const [username, setUsername] = useState("Satrio Tegar Nurwicaksono");
    const [name, setName] = useState("UP3 Surabaya Selatan");
    const [email, setEmail] = useState("admin@gmail.com");
    const [phone, setPhone] = useState("0812-3456-7890");

    const handleLogout = () => {
        // Logic for logout
        console.log("User logged out");
    };

    return (
        <>
            <Header title={"Profile"} />
            <ScrollView>
                <Center mt={10}>
                    <Image
                        source={require("../assets/logo.png")}
                        alt="Profile Picture"
                        size="xl"
                        borderRadius={100}
                    />
                    <Heading mt={5} fontSize="xl">
                        {name}
                    </Heading>
                </Center>
                <VStack space={4} mt={10} px={5}>
                    <Box>
                        <Text fontSize="md" color="gray.500">
                            Username
                        </Text>
                        <Input
                            value={username}
                            onChangeText={setUsername}
                            mt={2}
                            isReadOnly
                        />
                    </Box>
                    <Box>
                        <Text fontSize="md" color="gray.500">
                            Email Address
                        </Text>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            mt={2}
                            isReadOnly
                        />
                    </Box>
                    <Box>
                        <Text fontSize="md" color="gray.500">
                            Phone Number
                        </Text>
                        <Input
                            value={phone}
                            onChangeText={setPhone}
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
