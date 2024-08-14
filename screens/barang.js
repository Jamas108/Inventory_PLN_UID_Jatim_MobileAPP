import React, { useState, useEffect } from "react";
import { ScrollView, Linking } from 'react-native';
import { Box, Button, Text, VStack, HStack, Center, Divider, Icon, Badge } from 'native-base';
import { getDatabase, ref, onValue } from "firebase/database";
import Header from "../components/header";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import FIREBASE from "../actions/config/FIREBASE";
import { getData } from "../utils";

const Barang = ({ navigation }) => {
  const [user, setUser] = useState(null); // Store user information
  const [barangData, setBarangData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({}); // To track which item is expanded

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (!user) return; // Do nothing if user is not set yet

    const database = getDatabase();
    const BarangKeluarRef = ref(database, "Barang_Keluar");

    const unsubscribe = onValue(BarangKeluarRef, (snapshot) => {
      const BarangKeluarData = snapshot.val();
      if (BarangKeluarData) {
        const BarangArray = Object.entries(BarangKeluarData)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .filter(item => item.userId === user.uid) // Filter by user UID
          .map(item => {
            // Tambahkan properti File_BeritaAcara dan Notes jika statusnya 'Accepted'
            if (item.status === 'Accepted') {
              if (!item.File_BeritaAcara) {
                item.File_BeritaAcara = 'URL_TO_PDF'; // Gantilah dengan URL PDF yang benar
              }
              if (!item.Catatan) {
                item.Catatan = 'Catatan terkait barang ini'; // Gantilah dengan catatan yang sesuai
              }
            }
            return item;
          });

        setBarangData(BarangArray);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getUserData = async () => {
    try {
      const userData = await getData("user");

      if (userData) {
        const userRef = FIREBASE.database().ref(`users/${userData.uid}`);
        const snapshot = await userRef.once("value");
        const updatedUserData = snapshot.val();

        if (updatedUserData) {
          setUser(updatedUserData); // Store the entire user data including uid
        } else {
          console.log("User data not found");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleViewPDF = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <>
      <Header title={"Inventory UID JATIM"} />
      <ScrollView contentContainerStyle={{ padding: 15, backgroundColor: "#E5E5E5" }}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding={4}
          backgroundColor="#004aad"
          borderRadius="lg"
          mb={4}
          shadow={2}
        >
          <Text fontSize="xl" color="white" fontWeight="bold">Data Barang Keluar</Text>
          <Button
            onPress={() => navigation.navigate('CreateBarang')}
            backgroundColor="white"
            _text={{ color: "#004aad", fontWeight: "bold" }}
            leftIcon={<Icon as={MaterialIcons} name="add" size="sm" color="#004aad" />}
          >
            Ajukan Barang
          </Button>
        </Box>
        <Divider mt={-3} mb={5} backgroundColor="#004aad" />
        <VStack space={4} width="100%">
          {loading ? (
            <Center>
              <Text>Loading...</Text>
            </Center>
          ) : barangData.length > 0 ? (
            barangData.map(item => (
              <Box key={item.id} padding={4} borderRadius="lg" backgroundColor="white" shadow={3} mb={4}>
                <VStack space={2}>
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    px={4}
                    py={2}
                    borderBottomWidth={1}
                    borderColor="gray.200"
                    rounded="md"
                  >
                    <HStack alignItems="center" ml={-4}>
                      <Text fontWeight="bold" fontSize="lg" color="gray.700" mr={2}>
                        {item.Kategori_Peminjaman}
                      </Text>
                      <Badge
                        colorScheme={item.status === 'Accepted' ? "green" : "red"}
                        variant="solid"
                      >
                        {item.status}
                      </Badge>
                    </HStack>

                    <Button
                      variant="ghost"
                      onPress={() => toggleExpand(item.id)}
                      _text={{ color: "#004aad", fontSize: "md" }}
                      leftIcon={
                        <Icon
                          as={MaterialIcons}
                          name={expanded[item.id] ? "expand-less" : "expand-more"}
                          size="lg"
                          color="#004aad"
                        />
                      }
                      size="sm"
                      _hover={{ bg: "gray.100" }}
                    />
                  </HStack>


                  {item.status === 'Accepted' && (
                    <>
                      <Text>File Berita Acara:</Text>
                      {item.File_BeritaAcara ? (
                        <Button
                          mt={2}
                          backgroundColor="#004aad"
                          _text={{ color: "white" }}
                          onPress={() => handleViewPDF(item.File_BeritaAcara)}
                          leftIcon={<Icon as={MaterialIcons} name="picture-as-pdf" size="sm" color="white" />}
                        >
                          Lihat File
                        </Button>
                      ) : (
                        <Text>Tidak ada File Berita Acara</Text>
                      )}

                      <Text mt={2}>Catatan: {item.Catatan || "Tidak ada catatan"}</Text>
                    </>
                  )}

                  <Text>Pihak Peminjam: {item.Nama_PihakPeminjam}</Text>
                  <Text>Tanggal Pengajuan: {item.tanggal_peminjamanbarang || "Tidak Ada"}</Text>
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
                            onPress={() => navigation.navigate('CreateRetur', {
                              Pihak_Pemohon: item.Nama_PihakPeminjam,
                              Kode_Barang: barang.kode_barang,
                              Kategori_Barang: barang.kategori_barang,
                              Nama_Barang: barang.nama_barang,
                            })}
                            leftIcon={<Icon as={FontAwesome5} name="undo" size="sm" color="white" />}
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

export default Barang;
