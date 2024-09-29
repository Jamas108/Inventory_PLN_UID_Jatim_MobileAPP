import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Box, Button, Text, VStack, Input, Select, FormControl, HStack, Modal } from 'native-base';
import FIREBASE from '../actions/config/FIREBASE';
import Header from '../components/header';
import * as DocumentPicker from 'expo-document-picker';
import { getData } from '../utils';

const CreateBarang = ({ navigation }) => {
  const [items, setItems] = useState([{ id: 1, namaBarang: '', kodeBarang: '', jenisBarang: '', jumlahBarang: '' }]);
  const [formData, setFormData] = useState({
    tanggalPeminjaman: '',
    Id_Kategori_Peminjaman: '',
    tanggalKembali: '',
  });
  const [barangOptions, setBarangOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [fileSurat, setFileSurat] = useState(null);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const Id_Kategori_PeminjamanOptions = [
    { id: 'Insidentil', name: 'Insidentil' },
    { id: 'Reguler', name: 'Reguler' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const barangMasukData = await getBarangMasuk();
      const returBarangData = await getReturBarang();

      // Tambahkan awalan yang mengidentifikasi sumber data
      const combinedData = [
        ...barangMasukData.map(item => ({ ...item, source: 'masuk' })),
        ...returBarangData.map(item => ({ ...item, source: 'retur' }))
      ];

      setBarangOptions(combinedData);
      setLoading(false);
    };

    fetchData();
    getUserData();
  }, []);


  const getBarangMasuk = async () => {
    try {
      const userRef = FIREBASE.database().ref('barang_masuk');
      const snapshot = await userRef.once('value');
      const barangMasukData = snapshot.val();

      if (barangMasukData) {
        const acceptedBarang = [];

        Object.values(barangMasukData).forEach(item => {
          if (item.barang && Array.isArray(item.barang)) {
            const filteredBarang = item.barang.filter(barangItem => barangItem.Status === 'Accept');
            if (filteredBarang.length > 0) {
              acceptedBarang.push(...filteredBarang);
            }
          }
        });
        return acceptedBarang;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching barang masuk data:', error);
      showModal('Error', 'Terjadi kesalahan saat mengambil data barang masuk.');
      return [];
    }
  };

  const getReturBarang = async () => {
    try {
      const returRef = FIREBASE.database().ref('Retur_Barang');
      const snapshot = await returRef.once('value');
      const returBarangData = snapshot.val();

      if (returBarangData) {
        const returBarang = [];

        Object.values(returBarangData).forEach(item => {
          // Filter barang dengan kategori_retur "Bekas Handal"
          if (item.Kategori_Retur === "Bekas Handal") {
            returBarang.push(item);
          }
        });
        return returBarang;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching retur barang data:', error);
      showModal('Error', 'Terjadi kesalahan saat mengambil data retur barang.');
      return [];
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
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showModal('Error', 'Terjadi kesalahan saat mengambil data pengguna.');
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
        showModal('File Terpilih', `File terpilih: ${selectedFile.name}`);
      } else {
        showModal('Error', 'Tidak ada file yang dipilih.');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      showModal('Error', 'Terjadi kesalahan saat memilih file.');
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
      setModalVisible(true);
      setModalMessage('Semua field wajib diisi.');
      return;
    }

    try {
      const newRef = FIREBASE.database().ref('Barang_Keluar').push();
      const barang_keluar_id = newRef.key;

      const fileSuratURL = await uploadFileSurat(barang_keluar_id, fileSurat);

      const data = {
        id: barang_keluar_id,
        userId: user.uid,
        tanggal_peminjamanbarang: formData.tanggalPeminjaman || null,
        Kategori_Peminjaman: formData.Id_Kategori_Peminjaman,
        No_SuratJalanBK: '',
        File_BeritaAcara: '',
        Nama_PihakPeminjam: user.name || '',
        Catatan: '',
        Tanggal_PengembalianBarang: formData.tanggalKembali || null,
        File_Surat: fileSuratURL,
        status: 'Pending',
        barang: items.map(item => {
          const selectedBarang = barangOptions.find(option => option.kode_barang === item.kodeBarang);
          const barang_id = FIREBASE.database().ref().push().key;
          return {
            id: barang_id,
            nama_barang: item.namaBarang || null,
            kode_barang: item.kodeBarang || null,
            jenis_barang: item.jenisBarang || null,
            kategori_barang: item.kategoriBarang || null,
            jumlah_barang: item.jumlahBarang || null,
            garansi_barang_awal: selectedBarang ? selectedBarang.garansi_barang_awal || null : null, // Menangani undefined
            garansi_barang_akhir: selectedBarang ? selectedBarang.garansi_barang_akhir || null : null, // Menangani undefined
          };
        }),
      };

      await newRef.set(data);

      // Fungsi untuk mengirim notifikasi setelah pengajuan barang keluar berhasil
      const sendBarangKeluarNotification = async (user) => {
        // Data notifikasi
        const notificationData = {
          title: 'Pending Pengajuan Barang Keluar',
          message: `Pengajuan Barang dari ${user.name} berhasil, menunggu konfirmasi dari admin`,
          created_at: new Date().toISOString(),
          user_status: {
            [`user_2`]: { status: 'unread' },   // Status untuk user yang mengajukan
            [`admin_1`]: { status: 'unread' }            // Status untuk admin (disesuaikan dengan ID admin)
          }
        };

        // Push notifikasi ke database Firebase
        await FIREBASE.database().ref('notifications').push(notificationData);
      };

      // Panggil fungsi setelah pengajuan barang keluar berhasil
      sendBarangKeluarNotification(user);

      showModal('Berhasil', 'Barang berhasil diajukan.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving data:', error);
      showModal('Error', 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, namaBarang: '', kodeBarang: '', jenisBarang: '', jumlahBarang: '' }]);
  };
  const handleInputChange = (index, name, value) => {
    const newItems = [...items];

    if (index >= 0 && index < newItems.length) {
      if (name === 'namaBarang') {
        const selectedBarang = barangOptions.find(option => option.kode_barang === value); // Gunakan kode_barang untuk menemukan barang yang dipilih
        if (selectedBarang) {
          newItems[index].namaBarang = selectedBarang.nama_barang;
          newItems[index].kodeBarang = selectedBarang.kode_barang;
          newItems[index].jenisBarang = selectedBarang.jenis_barang;
          newItems[index].kategoriBarang = selectedBarang.kategori_barang;
          newItems[index].jumlahBarang = ''; // Reset jumlah barang
          newItems[index].maxJumlahBarang = selectedBarang.jumlah_barang; // Set max jumlah barang
        }
      } else if (name === 'jumlahBarang') {
        const maxJumlahBarang = newItems[index].maxJumlahBarang;
        if (Number(value) > maxJumlahBarang) {
          showModal('Error', `Jumlah barang yang diinput melebihi stok yang tersedia (${maxJumlahBarang} unit).`);
          newItems[index].jumlahBarang = maxJumlahBarang.toString();
        } else {
          newItems[index].jumlahBarang = value;
        }
      } else {
        newItems[index][name] = value;
      }

      setItems(newItems);
    } else {
      console.error(`Item dengan indeks ${index} tidak ditemukan di array items.`);
    }
  };

  const showModal = (title, message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    <>
      <Header title={"Barang Keluar"} withBack={true} />
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <Box w={'full'} bgColor={'#005DAA'} p={4} borderRadius="md" shadow={3} mb={5}>
          <Text color="white" fontSize="lg" fontWeight="bold">Input Barang yang Ingin Diajukan</Text>
        </Box>

        <Box p={3} bg="white" borderRadius="md" shadow={1} mb={5}>
          <VStack space={4} width="100%">

            <FormControl>
              <FormControl.Label>Kategori Pengajuan</FormControl.Label>
              <Select
                selectedValue={formData.Id_Kategori_Peminjaman}
                onValueChange={(value) => setFormData({ ...formData, Id_Kategori_Peminjaman: value })}
                placeholder="Pilih Kategori Pengajuan"
              >
                {Id_Kategori_PeminjamanOptions.map(option => (
                  <Select.Item key={option.id} label={option.name} value={option.id} />
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormControl.Label>Tanggal Pengajuan</FormControl.Label>
              <Input
                placeholder="Format DD-MM-YYY"
                value={formData.tanggalPeminjaman}
                onChangeText={(value) => setFormData({ ...formData, tanggalPeminjaman: value })}

              />
            </FormControl>

            {formData.Id_Kategori_Peminjaman === 'Insidentil' && (
              <FormControl>
                <FormControl.Label>Tanggal Kembali</FormControl.Label>
                <Input
                  placeholder="Format DD-MM-YYY"
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

            {barangOptions.length > 0 ? (
              items.map((item, index) => (
                <Box key={index} bg="gray.50" p={4} borderRadius="lg" shadow={1} mb={4}>
                  <Text fontSize="md" mb={2} fontWeight="bold">Barang {index + 1}</Text>

                  <FormControl mb={3}>
                    <FormControl.Label>Nama Barang</FormControl.Label>
                    <Select
                      selectedValue={item.kodeBarang}
                      onValueChange={(value) => handleInputChange(index, 'namaBarang', value)}
                      placeholder="Pilih Nama Barang"
                      bg="white"
                    >
                      {barangOptions.map(option => (
                        <Select.Item
                          key={`${option.source}-${option.kode_barang}`} // Pastikan key unik
                          label={`${option.nama_barang} -${option.kategori_barang} - ${option.jumlah_barang} unit ${option.Kategori_Retur ? `(${option.Kategori_Retur})` : `(Baru)`}`}
                          value={option.kode_barang} // Gunakan kode_barang sebagai value
                        />
                      ))}
                    </Select>

                  </FormControl>


                  <HStack space={3} mt={3}>
                    <FormControl flex={1}>
                      <FormControl.Label>Kode Barang</FormControl.Label>
                      <Input
                        value={item.kodeBarang}
                        isDisabled
                        bg="gray.100"
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormControl.Label>Jenis Barang</FormControl.Label>
                      <Input
                        value={item.jenisBarang}
                        isDisabled
                        bg="gray.100"
                      />
                    </FormControl>
                  </HStack>

                  <FormControl mt={3}>
                    <FormControl.Label>Kategori Barang</FormControl.Label>
                    <Input
                      value={item.kategoriBarang}
                      isDisabled
                      bg="gray.100"
                    />
                  </FormControl>

                  <FormControl mt={3}>
                    <FormControl.Label>Jumlah Barang</FormControl.Label>
                    <Input
                      type="number"
                      value={item.jumlahBarang}
                      onChangeText={(value) => handleInputChange(index, 'jumlahBarang', value)}
                      placeholder="Masukkan Jumlah Barang"
                      bg="white"
                      keyboardType='numeric'
                    />
                  </FormControl>
                </Box>
              ))
            ) : (
              <Text color="red.500" textAlign="center" mt={5}>Tidak ada barang</Text>
            )}

            <HStack space={3} justifyContent="space-between" mt={1}>
              <Button onPress={handleAddItem} flex={1} colorScheme="blue">Tambah Barang</Button>
              <Button onPress={addBarang_Keluar} flex={1} colorScheme="green">Simpan</Button>
            </HStack>

            <Text alignSelf="center" fontSize="sm" mt={2} mb={2} bold color="gray.600">
              Harap mengisikan data diri dengan baik dan benar!
            </Text>
          </VStack>
        </Box>
      </ScrollView>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Informasi</Modal.Header>
          <Modal.Body>
            <Text>{modalMessage}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => setModalVisible(false)} colorScheme="blue">
              Ok
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateBarang;
