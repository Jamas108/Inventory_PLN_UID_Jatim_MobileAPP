import React, { useState, useEffect, useCallback } from "react";
import { Box, ScrollView, Image, Text, Heading, VStack, ZStack, Input, HStack, Icon, Button, View, TouchableOpacity } from "native-base";
import Header from "../components/header";



const Profile = () => {
    return (
        <>
            <Header title={"Profile"} />
            <Text alignSelf={"center"} mt={10}>Dang Gudang ini halaman Profile</Text>
        </>
    );
};

export default Profile;
