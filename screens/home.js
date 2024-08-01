import React, { useState, useEffect, useCallback } from "react";
import { Box, ScrollView, Image, Text, Heading, VStack, ZStack, Input, HStack, Icon, Button, View, TouchableOpacity } from "native-base";
import Header from "../components/header";



const Home = () => {
    return (
        <>
            <Header title={"Home"} />
            <Text alignSelf={"center"} mt={10}>dang gudang ini halaman home</Text>
        </>
    );
};

export default Home;
