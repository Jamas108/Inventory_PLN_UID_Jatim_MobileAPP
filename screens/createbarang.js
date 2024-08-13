import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Box, Button, Text, VStack, Input, Select, FormControl, HStack, Modal } from 'native-base';
import FIREBASE from '../actions/config/FIREBASE';
import Header from '../components/header';
import * as DocumentPicker from 'expo-document-picker';
import { getData } from '../utils';

const CreateBarang = ({ navigation }) => {
  const [items, setItems] = useState([{ id: 1, namaBarang: '', kodeBarang: '', kategoriBarang: '', jumlahBarang: '' }]);
  const [formData, setFormData] = useState({
    tanggalPeminjaman: '',
    Id_Kategori_Peminjaman: '',
    tanggalKembali: '',
  });
  const [barangOptions, setBarangOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [fileSurat, setFileSurat] = useState(null);
  const [user, setUser] = useState(null); // Store the entire user data
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const Id_Kategori_PeminjamanOptions = [
    { id: 'Insidentil', name: 'Insidentil' },
    { id: 'Reguler', name: 'Reguler' },
  ];

  useEffect(() => {
    getBarangMasuk();
    getUserData();
  }, []);

  const getBarangMasuk = async () => {
    try {
      const userRef = FIREBASE.database().ref('barang_masuk');
      const snapshot = await userRef.once('value');
      const barangMasukData = snapshot.val();

      if (barangMasukData) {
        setBarangOptions(Object.values(barangMasukData));
      } else {
        console.log('Data barang masuk tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching barang masuk data:', error);
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
          setUser(updatedUserData); // Store the entire user data including uid
        } else {
          console.log("User data not found");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result && !result.canceled) {
        const selectedFile = result.assets ? result.assets[0] : result; // Handle both cases
        setFileSurat(selectedFile);
        Alert.alert('File Terpilih', `File terpilih: ${selectedFile.name}`);
      } else {
        Alert.alert('Error', 'Tidak ada file yang dipilih.');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memilih file.');
    }
  };

  const uploadFileSurat = async (barang_keluar_id, fileSurat) => {
    if (fileSurat) {
      try {
        const response = await fetch(fileSurat.uri);
        const blob = await response.blob();

        const fileName = `${barang_keluar_id}_${fileSurat.name}`;
        const reference = FIREBASE.storage().ref(`surat_jalan/${fileName}`);

        await reference.put(blob);

        const downloadURL = await reference.getDownloadURL();
        return downloadURL;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }
    return null;
  };

  const addBarang_Keluar = async () => {
    if (!formData.tanggalPeminjaman || !formData.Id_Kategori_Peminjaman ||
        (formData.Id_Kategori_Peminjaman === 'Insidentil' && !formData.tanggalKembali) ||
        items.some(item => !item.namaBarang || !item.jumlahBarang)) {
        setFormError('Semua field wajib diisi.');
        setModalVisible(true); // Show modal when there's an error
        return;
    }

    try {
        const newRef = FIREBASE.database().ref('Barang_Keluar').push();
        const barang_keluar_id = newRef.key;

        const fileSuratURL = await uploadFileSurat(barang_keluar_id, fileSurat);

        const data = {
            id: barang_keluar_id,
            userId: user.uid, // Store the user UID
            tanggal_peminjamanbarang: formData.tanggalPeminjaman || null,
            Kategori_Peminjaman: formData.Id_Kategori_Peminjaman,
            No_SuratJalanBK: '',
            File_BeritaAcara: '',
            Nama_PihakPeminjam: user.name || '', // Take name from the stored user data
            Catatan: '',
            Tanggal_PengembalianBarang: formData.tanggalKembali || null,
            File_Surat: fileSuratURL,
            status: 'Pending', // Set status automatically to 'Pending'
            barang: items.map(item => {
                const barang_id = FIREBASE.database().ref().push().key;
                return {
                    id: barang_id,
                    nama_barang: item.namaBarang || null,
                    kode_barang: item.kodeBarang || null,
                    kategori_barang: item.kategoriBarang || null,
                    jumlah_barang: item.jumlahBarang || null,
                };
            }),
        };

        await newRef.set(data);

        Alert.alert('Berhasil', `Barang berhasil diajukan`);
        navigation.goBack();
    } catch (error) {
        console.error('Error saving data:', error);
        Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, namaBarang: '', kodeBarang: '', kategoriBarang: '', jumlahBarang: '' }]);
  };

  const handleInputChange = (index, name, value) => {
    const newItems = [...items];

    if (name === 'namaBarang') {
      const selectedBarang = barangOptions.find(item => item.Kode_Barang === value);
      if (selectedBarang) {
        newItems[index].namaBarang = selectedBarang.Nama_Barang;
        newItems[index].kodeBarang = selectedBarang.Kode_Barang;
        newItems[index].kategoriBarang = selectedBarang.Jenis_Barang;
      }
    } else {
      newItems[index][name] = value;
    }

    setItems(newItems);
  };

  return (
    <>
      <Header title={"Barang Keluar"} withBack={true} />
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <VStack space={4} width="100%">
          <FormControl>
            <FormControl.Label>Kategori Pengajuan</FormControl.Label>
            <Select
              selectedValue={formData.Id_Kategori_Peminjaman}
              onValueChange={(value) => setFormData({ ...formData, Id_Kategori_Peminjaman: value })}
            >
              {Id_Kategori_PeminjamanOptions.map(option => (
                <Select.Item key={option.id} label={option.name} value={option.id} />
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormControl.Label>Tanggal Pengajuan</FormControl.Label>
            <Input
              placeholder="Masukan Rencana Tanggal Pengajuan Barang"
              value={formData.tanggalPeminjaman}
              onChangeText={(value) => setFormData({ ...formData, tanggalPeminjaman: value })}
            />
          </FormControl>

          {formData.Id_Kategori_Peminjaman === 'Insidentil' && (
            <FormControl>
              <FormControl.Label>Tanggal Kembali</FormControl.Label>
              <Input
                placeholder="Masukan Tanggal Kembali Barang"
                value={formData.tanggalKembali}
                onChangeText={(value) => setFormData({ ...formData, tanggalKembali: value })}
              />
            </FormControl>
          )}

          <FormControl>
            <FormControl.Label>Upload Surat Jalan (PDF)</FormControl.Label>
            <Button onPress={pickDocument}>Pilih File PDF</Button>

            {fileSurat ? (
              <Text mt={2} color="green.500">File terpilih: {fileSurat.name}</Text>
            ) : (
              <Text mt={2} color="red.500">Belum ada file yang dipilih</Text>
            )}
          </FormControl>

          {items.map((item, index) => (
            <Box key={index} bg="white" p={4} borderRadius="lg" shadow={2} mb={4}>
              <Text fontSize="md" mb={2} fontWeight="bold">Barang {index + 1}</Text>
              <FormControl>
                <FormControl.Label>Nama Barang</FormControl.Label>
                <Select
                  selectedValue={item.kodeBarang}
                  onValueChange={(value) => handleInputChange(index, 'namaBarang', value)}
                >
                  {barangOptions.map(option => (
                    <Select.Item key={option.Kode_Barang} label={option.Nama_Barang} value={option.Kode_Barang} />
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={3}>
                <FormControl.Label>Kode Barang</FormControl.Label>
                <Input
                  value={item.kodeBarang}
                  isDisabled
                />
              </FormControl>

              <FormControl mt={3}>
                <FormControl.Label>Kategori Barang</FormControl.Label>
                <Input
                  value={item.kategoriBarang}
                  isDisabled
                />
              </FormControl>

              <FormControl mt={3}>
                <FormControl.Label>Jumlah Barang</FormControl.Label>
                <Input
                  type="number"
                  value={item.jumlahBarang}
                  onChangeText={(value) => handleInputChange(index, 'jumlahBarang', value)}
                />
              </FormControl>
            </Box>
          ))}

          <HStack space={3} justifyContent="space-between" mt={4}>
            <Button onPress={handleAddItem} flex={1}>Tambah Barang</Button>
            <Button onPress={addBarang_Keluar} flex={1} colorScheme="success">Simpan</Button>
          </HStack>

          <Text alignSelf="center" fontSize="sm" mt={4} color="gray.500">
            Harap mengisikan Data diri dengan baik dan benar!
          </Text>
        </VStack>
      </ScrollView>

      {/* Modal for displaying errors */}
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
    </>
  );
};

export default CreateBarang;
