import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Box, Button, Text, VStack, Input, FormControl, HStack, Modal, Icon, Card, Divider, Center, useToast, } from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import FIREBASE from '../actions/config/FIREBASE';
import Header from '../components/header';
import { getData } from '../utils';

const CreateRetur = ({ route, navigation }) => {
  const { Pihak_Pemohon, Kode_Barang, Kategori_Barang, Nama_Barang, Garansi_Barang_Awal, Garansi_Barang_Akhir } = route.params;

  const [jumlahBarang, setJumlahBarang] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalRetur, setTanggalRetur] = useState('');
  const [formError, setFormError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [fileSurat, setFileSurat] = useState(null);
  const [image, setImage] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const toast = useToast();

  useEffect(() => {
    requestPermission();
    getUserData();
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setFormError('Sorry, we need camera roll permissions to make this work!');
      setModalVisible(true);
    }
  };

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
          setFormError("User data not found");
          setModalVisible(true);
        }
      }
    } catch (error) {
      setFormError("Error fetching user data");
      setModalVisible(true);
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result && !result.canceled) {
        const selectedFile = result.assets ? result.assets[0] : result;
        setFileSurat(selectedFile);
      } else {
        setFormError('Tidak ada file yang dipilih.');
        setModalVisible(true);
      }
    } catch (error) {
      setFormError('Terjadi kesalahan saat memilih file.');
      setModalVisible(true);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        const selectedImageUri = result.assets ? result.assets[0].uri : result.uri;
        setImage(selectedImageUri);
      } else {
        setFormError('Tidak ada gambar yang dipilih.');
        setModalVisible(true);
      }
    } catch (error) {
      setFormError('Terjadi kesalahan saat memilih gambar.');
      setModalVisible(true);
    }
  };

  const uploadFile = async (uri, storagePath) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = FIREBASE.storage().ref().child(storagePath);
      await ref.put(blob);
      return await ref.getDownloadURL();
    } catch (error) {
      setFormError('Failed to upload file');
      setModalVisible(true);
      throw new Error('Failed to upload file');
    }
  };

  const addRetur_Barang = async () => {
    if (!jumlahBarang || !deskripsi || !tanggalRetur || !fileSurat || !image) {
      setFormError('Semua field wajib diisi.');
      setModalVisible(true);
      return;
    }

    try {
      const returRef = FIREBASE.database().ref('Retur_Barang').push();
      const retur_id = returRef.key;

      const fileSuratUrl = await uploadFile(fileSurat.uri, `Retur_Barang/${retur_id}/SuratJalan.pdf`);
      const imageUrl = await uploadFile(image, `Retur_Barang/${retur_id}/Image.jpg`);

      const data = {
        id: retur_id,
        userId: user.uid,
        Pihak_Pemohon: Pihak_Pemohon,
        kode_Barang: Kode_Barang,
        kategori_barang: Kategori_Barang,
        garansi_barang_awal: Garansi_Barang_Awal,
        garansi_barang_akhir: Garansi_Barang_Akhir,
        Kategori_Retur: '',
        nama_Barang: Nama_Barang,
        Tanggal_Retur: tanggalRetur,
        jumlah_barang: jumlahBarang,
        Deskripsi: deskripsi,
        Surat_Retur: fileSuratUrl,
        Gambar_Retur: imageUrl,
        status: 'Pending',
      };

      await returRef.set(data);

      const notificationData = {
        title: 'Pending Pengajuan Retur Barang',
        message: `Pengajuan Retur dari ${user.name} berhasil, menunggu konfirmasi dari admin`,
        status: 'unread',
    };
    await FIREBASE.database().ref('notifications').push(notificationData);

      setSuccessModalVisible(true);
    } catch (error) {
      setFormError('Terjadi kesalahan saat menyimpan data.');
      setModalVisible(true);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    navigation.goBack();
  };

  return (
    <>
      <Header title={"Retur Barang"} withBack={true} />
      <ScrollView contentContainerStyle={{ padding: 15, backgroundColor: '#f7f8fc' }}>
        <VStack space={5} width="100%">
          <Card borderRadius="lg" shadow={2}>
            <Box p={4}>
              <Text fontSize="lg" fontWeight="bold" mb={4}>Silahkan Input Data Barangnya :</Text>
              <Divider my={2} />
              <VStack space={4}>
                <FormControl>
                  <FormControl.Label>Nama Barang</FormControl.Label>
                  <Input
                    value={Nama_Barang}
                    isDisabled
                    bg="gray.100"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Kode Barang</FormControl.Label>
                  <Input
                    value={Kode_Barang}
                    isDisabled
                    bg="gray.100"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Kategori Barang</FormControl.Label>
                  <Input
                    value={Kategori_Barang}
                    isDisabled
                    bg="gray.100"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Tanggal Retur</FormControl.Label>
                  <Input
                    placeholder="Masukkan Tanggal Retur"
                    value={tanggalRetur}
                    onChangeText={(value) => setTanggalRetur(value)}
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Jumlah Barang</FormControl.Label>
                  <Input
                    type="number"
                    value={jumlahBarang}
                    onChangeText={(value) => setJumlahBarang(value)}
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Catatan</FormControl.Label>
                  <Input
                    value={deskripsi}
                    onChangeText={(value) => setDeskripsi(value)}
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Upload Surat Jalan (PDF)</FormControl.Label>
                  <Button 
                    leftIcon={<Icon as={Ionicons} name="document-attach-outline" size="sm" />} 
                    onPress={pickDocument}
                    borderRadius="md"
                    colorScheme="primary"
                    variant="outline"
                    >
                    Pilih File PDF
                  </Button>
                  {fileSurat ? (
                    <Text mt={2} color="green.500">File terpilih: {fileSurat.name}</Text>
                  ) : (
                    <Text mt={2} color="red.500">Belum ada file yang dipilih</Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormControl.Label>Upload Gambar</FormControl.Label>
                  <Button 
                    leftIcon={<Icon as={Ionicons} name="image-outline" size="sm" />} 
                    onPress={pickImage}
                    borderRadius="md"
                    colorScheme="primary"
                    variant="outline"
                    >
                    Pilih Gambar
                  </Button>
                  {image ? (
                    <Text mt={2} color="green.500">Gambar terpilih: {image.split('/').pop()}</Text>
                  ) : (
                    <Text mt={2} color="red.500">Belum ada gambar yang dipilih</Text>
                  )}
                </FormControl>
              </VStack>
            </Box>
          </Card>

          <Center mt={3}>
            <Button 
              onPress={addRetur_Barang} 
              colorScheme="success" 
              borderRadius="md"
              leftIcon={<Icon as={MaterialIcons} name="send" size="sm" />}>
              Submit
            </Button>
          </Center>

          <Text alignSelf="center" fontSize="sm" mt={2} mb={4} color="gray.600">
            Harap mengisikan Data dengan baik dan benar!
          </Text>
        </VStack>
      </ScrollView>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Error</Modal.Header>
          <Modal.Body>
            <Text>{formError}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => setModalVisible(false)} borderRadius="md">
              Ok
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={successModalVisible} onClose={handleSuccessClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Berhasil</Modal.Header>
          <Modal.Body>
            <Text>Retur barang berhasil diajukan</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={handleSuccessClose} borderRadius="md">
              Ok
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateRetur;
