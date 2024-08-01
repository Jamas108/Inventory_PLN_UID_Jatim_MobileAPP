import React, { useState, useEffect, useCallback } from "react";
import { Box, ScrollView, Image, Text, Heading, VStack, ZStack, Input, HStack, Icon, Button, View, TouchableOpacity } from "native-base";
import Header from "../components/header";



const Barang = () => {
    return (
        <>
            <Header title={"Barang"} />
            <Text alignSelf={"center"} mt={10}>Dang Gudang ini halaman Barang</Text>
        </>
    );
};

export default Barang;
