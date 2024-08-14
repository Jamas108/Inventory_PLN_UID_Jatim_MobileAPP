import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Box, Button, Text, VStack, HStack, Center, Icon } from "native-base";
import { getDatabase, ref, onValue } from "firebase/database";
import Header from "../components/header";
import { MaterialIcons } from "@expo/vector-icons";
import FIREBASE from "../actions/config/FIREBASE";
import { getData } from "../utils";

const Retur = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [returData, setReturData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (!user) return;

    const database = getDatabase();
    const ReturBarangRef = ref(database, "Retur_Barang");

    const unsubscribe = onValue(ReturBarangRef, (snapshot) => {
      const returBarangData = snapshot.val();
      if (returBarangData) {
        const returArray = Object.entries(returBarangData)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .filter((item) => item.userId === user.uid);

        setReturData(returArray);
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
          setUser(updatedUserData);
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

  return (
    <>
      <Header title={"Retur Barang"} withBack="true"/>
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
          <Text fontSize="xl" color="white">Data Retur Barang</Text>
        </Box>
        <VStack space={4} width="100%">
          {loading ? (
            <Center>
              <Text>Loading...</Text>
            </Center>
          ) : returData.length > 0 ? (
            returData.map((item) => (
              <Box key={item.id} padding={4} borderRadius="lg" backgroundColor="white" shadow={2} mb={4}>
                <VStack space={2}>
                  <HStack justifyContent="space-between">
                    <Text fontWeight="bold">Status Retur: {item.status || "Tidak Ada"}</Text>
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
                    />
                  </HStack>

                  <Text>Pihak Pemohon: {item.Pihak_Pemohon}</Text>
                  <Text>Tanggal Retur: {item.Tanggal_Retur}</Text>
                  <Text>Jumlah Barang: {item.Jumlah_Barang}</Text>
                  <Text>Catatan: {item.Deskripsi || "Tidak ada catatan"}</Text>

                  {expanded[item.id] && (
                    <VStack space={2} mt={2} pl={4} borderLeftWidth={2} borderLeftColor="#004aad">
                      <Text fontWeight="bold">Detail Barang:</Text>
                      <Text>Nama Barang: {item.Nama_Barang}</Text>
                      <Text>Kode Barang: {item.Kode_Barang}</Text>
                      <Text>Kategori Barang: {item.Kategori_Barang}</Text>
                    </VStack>
                  )}
                </VStack>
              </Box>
            ))
          ) : (
            <Center>
              <Text>No return items found</Text>
            </Center>
          )}
        </VStack>
      </ScrollView>
    </>
  );
};

export default Retur;
