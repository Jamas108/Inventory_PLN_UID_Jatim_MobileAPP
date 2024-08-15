import React, { useState, useEffect } from "react";
import { StatusBar, Image, Box, Heading, Text, ScrollView, VStack, Button, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Header from '../components/header';
import { clearStorage, getData } from '../utils/localStorage';
import FIREBASE from '../actions/config/FIREBASE';

const Profile = ({ navigation }) => {
    const [Profile, setProfile] = useState(null);

    const getUserData = async () => {
        try {
            const userData = await getData("user");

            if (userData) {
                const userRef = FIREBASE.database().ref(`users/${userData.uid}`);
                const snapshot = await userRef.once("value");
                const updatedUserData = snapshot.val();

                if (updatedUserData) {
                    setProfile(updatedUserData);
                } else {
                    console.log("User data not found");
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const onSubmit = () => {
        if (Profile) {
            FIREBASE.auth()
                .signOut()
                .then(() => {
                    clearStorage();
                    navigation.replace("Login");
                })
                .catch((error) => {
                    alert(error);
                });
        } else {
            navigation.replace("Login");
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", getUserData);
        return () => unsubscribe();
    }, [navigation]);

    return (
        <ScrollView bg="#f5f5f5">
            <Header title="Profile" />
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <Box flex={1} justifyContent="space-between" alignItems="center" p={4}>
                <Box alignSelf="center" width="90%" bg="white" mt={12} shadow={4} borderRadius={10} p={4}>
                    <Box alignItems="center" mt={-12}>
                        <Image
                            source={require("../assets/logo.png")}
                            borderRadius={10}
                            h={150}
                            w={150}
                            alt="Profile Logo"
                        />
                    </Box>
                    <Heading alignSelf="center" fontSize={22} fontWeight="bold" mt={2}>
                        {Profile?.name}
                    </Heading>
                    <Text alignSelf="center" color="gray.500" fontSize={16} mt={1}>
                        {Profile?.email}
                    </Text>
                    <Text alignSelf="center" color="gray.500" fontSize={16} mt={1}>
                        {Profile?.nomorhp}
                    </Text>
                </Box>

                <Box width="100%" px={5} pb={5} mt={6}>
                    <Button
                        mt={4}
                        size="lg"
                        colorScheme="red"
                        leftIcon={<Icon as={MaterialIcons} name="logout" size="sm" />}
                        onPress={onSubmit}
                    >
                        Log Out
                    </Button>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default Profile;
