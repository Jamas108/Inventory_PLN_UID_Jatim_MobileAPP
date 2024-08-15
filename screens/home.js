import React, { useEffect, useState } from "react";
import { Box, Image, Text, Heading, VStack, Icon, Button } from "native-base";
import Header from "../components/header";
import { MaterialIcons } from "@expo/vector-icons";
import FIREBASE from "../actions/config/FIREBASE";
import { getData } from "../utils";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
    const navigation = useNavigation();
    const [Home, setHome] = useState(null);

    const getUserData = async () => {
        try {
            const userData = await getData("user");

            if (userData) {
                const userRef = FIREBASE.database().ref(`users/${userData.uid}`);
                const snapshot = await userRef.once("value");
                const updatedUserData = snapshot.val();

                if (updatedUserData) {
                    console.log("Updated user data:", updatedUserData);
                    setHome(updatedUserData);
                } else {
                    console.log("User data not found");
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", getUserData);
        return () => {
            unsubscribe();
        };
    }, [navigation]);

    return (
        <>
            <Header title={"Home"} />
                <Box w="100%" h="100%" bg="white" borderTopRadius={40}  pb={40}>
                    <Box bgColor="blue.600" p={5} roundedBottomLeft={40} roundedBottomRight={40} shadow={2}>
                        <Text fontSize={20} color="white" fontWeight="bold">Selamat Datang di Inventory PLN</Text>
                        <Text fontWeight="bold" fontSize={20} color="white"> {Home?.name}</Text>
                    </Box>

                    <Box alignItems="center" mt={5}>
                        <Image
                            size="xl"
                            resizeMode="contain"
                            source={require("../assets/logo.png")}
                            alt="PLN Logo"
                            borderRadius="full"
                            mb={8}
                        />
                        <VStack space={3} alignItems="center">
                            <Heading size="lg" color="blue.800" textAlign="center">Sistem dan Teknologi Informasi</Heading>
                            <Text fontSize="md" color="gray.600" px={8} textAlign="justify">
                                Sistem Inventory UID JATIM siap membantu, mempermudah dan melacak barang dengan mudah dan efisien.
                                Akses data inventaris Anda kapan saja dan di mana saja.
                            </Text>
                            <VStack >
                            <Button
                                mt={4}
                                size="lg"
                                colorScheme="blue"
                                leftIcon={<Icon as={MaterialIcons} name="inventory" size="sm" />}
                                onPress={() => navigation.navigate('Barang')}
                                _text={{ fontSize: "md", fontWeight: "bold" }}
                                shadow={3}
                                borderRadius={20}
                                px={6}
                                py={3}
                            >
                                Ajukan Permintaan Barang
                            </Button>
                            <Button
                                mt={4}
                                size="lg"
                                colorScheme="blue"
                                leftIcon={<Icon as={MaterialIcons} name="inbox" size="sm" />}
                                onPress={() => navigation.navigate('Retur')}
                                _text={{ fontSize: "md", fontWeight: "bold" }}
                                shadow={3}
                                borderRadius={20}
                                px={6}
                                py={3}
                            >
                                Barang Retur
                            </Button>
                            </VStack>
                        </VStack>
                    </Box>
                </Box>
        </>
    );
};

export default Home;
