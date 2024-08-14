import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Box, Button, Text, VStack, Input, FormControl, HStack, Modal } from 'native-base';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import FIREBASE from '../actions/config/FIREBASE';
import Header from '../components/header';
import { getData } from '../utils';

const CreateRetur = ({ route, navigation }) => {
  const { Pihak_Pemohon, Kode_Barang, Kategori_Barang, Nama_Barang } = route.params;

  const [jumlahBarang, setJumlahBarang] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalRetur, setTanggalRetur] = useState('');
  const [formError, setFormError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [fileSurat, setFileSurat] = useState(null);
  const [image, setImage] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    requestPermission(); // Request permission for accessing the gallery
    getUserData(); // Fetch user data
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
        Kode_Barang: Kode_Barang,
        Kategori_Barang: Kategori_Barang,
        Kategori_Retur: '',
        Nama_Barang: Nama_Barang,
        Tanggal_Retur: tanggalRetur,
        Jumlah_Barang: jumlahBarang,
        Deskripsi: deskripsi,
        Surat_Retur: fileSuratUrl,
        Gambar_Retur : imageUrl,
        status: 'Pending',
        Created_At: new Date().toISOString(),
      };

      await returRef.set(data);

      setSuccessModalVisible(true);
    } catch (error) {
      setFormError('Terjadi kesalahan saat menyimpan data.');
      setModalVisible(true);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    navigation.goBack(); // Navigate back to the retur page
  };

  return (
    <>
      <Header title={"Retur Barang"} withBack={true} />
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <VStack space={4} width="100%">

          <Box bg="white" p={4} borderRadius="lg" shadow={2} mb={4}>
            <Text fontSize="md" mb={2} fontWeight="bold">Detail Barang</Text>

            <FormControl mt={3}>
              <FormControl.Label>Nama Barang</FormControl.Label>
              <Input
                value={Nama_Barang}
                isDisabled
              />
            </FormControl>

            <FormControl mt={3}>
              <FormControl.Label>Kode Barang</FormControl.Label>
              <Input
                value={Kode_Barang}
                isDisabled
              />
            </FormControl>

            <FormControl mt={3}>
              <FormControl.Label>Kategori Barang</FormControl.Label>
              <Input
                value={Kategori_Barang}
                isDisabled
              />
            </FormControl>

            <FormControl mt={3}>
              <FormControl.Label>Tanggal Retur</FormControl.Label>
              <Input
                placeholder="Masukkan Tanggal Retur"
                value={tanggalRetur}
                onChangeText={(value) => setTanggalRetur(value)}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormControl.Label>Jumlah Barang</FormControl.Label>
              <Input
                type="number"
                value={jumlahBarang}
                onChangeText={(value) => setJumlahBarang(value)}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormControl.Label>Catatan</FormControl.Label>
              <Input
                value={deskripsi}
                onChangeText={(value) => setDeskripsi(value)}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormControl.Label>Upload Surat Jalan (PDF)</FormControl.Label>
              <Button onPress={pickDocument}>Pilih File PDF</Button>
              {fileSurat ? (
                <Text mt={2} color="green.500">File terpilih: {fileSurat.name}</Text>
              ) : (
                <Text mt={2} color="red.500">Belum ada file yang dipilih</Text>
              )}
            </FormControl>

            <FormControl mt={3}>
              <FormControl.Label>Upload Gambar</FormControl.Label>
              <Button onPress={pickImage}>Pilih Gambar</Button>
              {image ? (
                <Text mt={2} color="green.500">Gambar terpilih: {image.split('/').pop()}</Text>
              ) : (
                <Text mt={2} color="red.500">Belum ada gambar yang dipilih</Text>
              )}
            </FormControl>
          </Box>

          <HStack space={3} justifyContent="space-between" mt={4}>
            <Button onPress={addRetur_Barang} flex={1} colorScheme="success">Submit</Button>
          </HStack>

          <Text alignSelf="center" fontSize="sm" mt={4} color="gray.500">
            Harap mengisikan Data dengan baik dan benar!
          </Text>
        </VStack>
      </ScrollView>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Error</Modal.Header>
          <Modal.Body>
            <Text>{formError}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => setModalVisible(false)}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={successModalVisible} onClose={handleSuccessClose}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Berhasil</Modal.Header>
          <Modal.Body>
            <Text>Retur barang berhasil diajukan</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={handleSuccessClose}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateRetur;
