import React, { useState, useEffect } from "react";
import { ScrollView, Linking } from 'react-native';
import { Box, Button, Text, VStack, HStack, Center, Divider, Icon } from 'native-base';
import { getDatabase, ref, onValue, push } from "firebase/database";
import Header from "../components/header";
import { MaterialIcons } from '@expo/vector-icons';
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
            // Tambahkan properti File_BeritaAcara jika statusnya 'accepted'
            if (item.status === 'Accepted' && !item.File_BeritaAcara) {
              item.File_BeritaAcara = 'URL_TO_PDF'; // Gantilah dengan URL PDF yang benar
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

  const handleReturn = (item, barang) => {
    const database = getDatabase();
    const ReturRef = ref(database, "Barang_Retur");

    const returData = {
      Kode_Barang: barang.kode_barang,
      Nama_Barang: barang.nama_barang,
      Jumlah_Barang: barang.jumlah_barang,
      Kategori_Barang: barang.kategori_barang,
      Pihak_Peminjam: item.Nama_PihakPeminjam,
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

  const handleViewPDF = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <>
      <Header title={"Inventory UID JATIM"} />
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
          <Text fontSize="xl" color="white">Data Barang Keluar</Text>
          <Button 
            onPress={() => navigation.navigate('CreateBarang')} 
            backgroundColor="white"
            _text={{ color: "#004aad" }}
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
              <Box key={item.id} padding={4} borderRadius="lg" backgroundColor="white" shadow={2} mb={4}>
                <VStack space={2}>
                  <HStack justifyContent="space-between">
                    <Text fontWeight="bold">Status Pengajuan: {item.status || "Tidak Ada"}</Text>
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

                  {item.status === 'Accepted' && item.File_BeritaAcara && (
                    <>
                      <Text>File Berita Acara:</Text>
                      <Button 
                        mt={2}
                        backgroundColor="#004aad"
                        _text={{ color: "white" }}
                        onPress={() => handleViewPDF(item.File_BeritaAcara)}
                        leftIcon={<Icon as={MaterialIcons} name="picture-as-pdf" size="sm" color="white" />}
                      >
                        Lihat File
                      </Button>
                    </>
                  )}

                  <Text>Pihak Peminjam: {item.Nama_PihakPeminjam}</Text>
                  <Text>Tanggal Pengajuan: {item.tanggal_peminjamanbarang || item.tanggal_peminjamanbarang}</Text>
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

export default Barang;
