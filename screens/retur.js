import React, { useState, useEffect } from "react";
import { ScrollView } from 'react-native';
import { Box, Button, Text, VStack, HStack, Center, Divider, Icon, Image } from 'native-base';
import { getDatabase, ref, onValue, push } from "firebase/database";
import { getData } from "../utils";
import Header from "../components/header";
import { MaterialIcons } from '@expo/vector-icons';
import FIREBASE from "../actions/config/FIREBASE";

const Retur = ({ navigation }) => {
    const [Nama, setNama] = useState(null);
    const [barangData, setBarangData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({}); // To track which item is expanded

    useEffect(() => {
        const database = getDatabase();
        const BarangKeluarRef = ref(database, "Barang_Keluar");

        const unsubscribe = onValue(BarangKeluarRef, (snapshot) => {
            const BarangKeluarData = snapshot.val();
            if (BarangKeluarData) {
                const BarangArray = Object.entries(BarangKeluarData).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));
                setBarangData(BarangArray);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleExpand = (id) => {
        setExpanded((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const handleReturn = (item, barang) => {
        const database = getDatabase();
        const ReturRef = ref(database, "Barang_Retur");

        const returData = {
            Kode_Barang: barang.kode_barang,
            Nama_Barang: barang.nama_barang,
            Jumlah_Barang: barang.jumlah_barang,
            Kategori_Barang: barang.kategori_barang,
            Pihak_Peminjam: item.Nama,
            Tanggal_Retur: new Date().toISOString(),
        };

        push(ReturRef, returData)
            .then(() => {
                alert("Barang berhasil diretur!");
            })
            .catch((error) => {
                console.error("Error returning barang:", error);
                alert("Terjadi kesalahan saat melakukan retur.");
            });
    };

    return (
        <>
            <Header title={"Retur Barang"} withBack="true" />
            <ScrollView contentContainerStyle={{ padding: 15, backgroundColor: "#F4F4F4" }}>
                <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    padding={4}
                    backgroundColor="#004aad"
                    borderRadius="lg"
                    mb={4}
                >
                    <Text fontSize="xl" color="white">Data Barang Retur</Text>
                    <Image
                        source={require("../assets/logo.png")}
                        w="12"
                        h="12"
                        alt="PLN LOGO"
                        mr={"3"}
                    />
                </Box>
                <Divider mt={-3} mb={5} backgroundColor="#004aad" />
                <VStack space={4} width="100%">
                    {loading ? (
                        <Center>
                            <Text>Loading...</Text>
                        </Center>
                    ) : barangData.length > 0 ? (
                        barangData.map(item => (
                            <Box key={item.id} padding={4} borderRadius="lg" backgroundColor="white" shadow={2} mb={4}>
                                <VStack space={2}>
                                    <HStack justifyContent="space-between">
                                        <Text fontWeight="bold">No. Surat Jalan: {item.no_surat_jalan || "Tidak Ada"}</Text>
                                        <Button
                                            variant="ghost"
                                            onPress={() => toggleExpand(item.id)}
                                            _text={{ color: "#004aad" }}
                                            leftIcon={
                                                <Icon
                                                    as={MaterialIcons}
                                                    name={expanded[item.id] ? "expand-less" : "expand-more"}
                                                    size="sm"
                                                    color="#004aad"
                                                />
                                            }
                                        >
                                            {expanded[item.id] ? "Kurangi" : "Lebih"}
                                        </Button>
                                    </HStack>
                                    <Text>Pihak Peminjam: {item.Nama}</Text>
                                    <Text>Tanggal Pengajuan: {item.Tanggal_Keluar || item.tanggal_peminjamanbarang}</Text>
                                    <Text>Total Barang: {item.barang ? item.barang.length : 0}</Text>

                                    {expanded[item.id] && (
                                        <VStack space={2} mt={2} pl={4} borderLeftWidth={2} borderLeftColor="#004aad">
                                            <Text fontWeight="bold">Daftar Barang:</Text>
                                            {item.barang ? item.barang.map((barang, index) => (
                                                <Box key={index} borderBottomWidth={1} borderBottomColor="coolGray.200" pb={2} mb={2}>
                                                    <Text>Kode Barang: {barang.kode_barang}</Text>
                                                    <Text>Nama Barang: {barang.nama_barang}</Text>
                                                    <Text>Kuantitas: {barang.jumlah_barang}</Text>
                                                    <Text>Kategori Barang: {barang.kategori_barang}</Text>
                                                    <Button
                                                        mt={2}
                                                        backgroundColor="orange.400"
                                                        _text={{ color: "white" }}
                                                        onPress={() => handleReturn(item, barang)}
                                                    >
                                                        Retur Barang
                                                    </Button>
                                                </Box>
                                            )) : <Text>No items found</Text>}
                                        </VStack>
                                    )}
                                </VStack>
                            </Box>
                        ))
                    ) : (
                        <Center>
                            <Text>No items found</Text>
                        </Center>
                    )}
                </VStack>
            </ScrollView>
        </>
    );
};

export default Retur;
