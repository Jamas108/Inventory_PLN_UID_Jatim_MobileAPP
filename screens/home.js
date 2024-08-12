import React from "react";
import { Box, ScrollView, Image, Text, Heading, VStack, Icon, Button } from "native-base";
import Header from "../components/header";
import { MaterialIcons } from "@expo/vector-icons";

const Home =  ({ navigation }) => {
    return (
        <>
            <Header title={"Home"} />
            <ScrollView>
                <Box p={4} bg="white" minHeight="100%" alignItems="center">
                    <VStack space={4} alignItems="center">
                        <Image
                            size="xl"
                            resizeMode="contain"
                            source={require("../assets/logo.png")} // PLN logo URL
                            alt="PLN Logo"
                            borderRadius="full"
                            mt={4}
                        />
                        <Heading textAlign="center">Selamat Datang </Heading>
                        <Text textAlign="justify" fontSize="md" color="gray.600" px={4}>
                            Sistem Inventaris UID JATIM siap membantu Anda mengelola dan melacak aset dengan mudah dan efisien.
                            Akses data inventaris Anda kapan saja dan di mana saja.
                        </Text>
                        <Button
                            mt={4}
                            size="lg"
                            colorScheme="blue"
                            leftIcon={<Icon as={MaterialIcons} name="inventory" size="sm" />}
                            onPress={() => navigation.navigate('Barang')}
                        >
                            Ajukan Permintaan Barang
                        </Button>
                    </VStack>
                </Box>
            </ScrollView>
        </>
    );
};

export default Home;
