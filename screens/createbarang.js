import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { ScrollView, Alert } from 'react-native';
import { Box, Button, Text, VStack, Input, Select, FormControl, Divider } from 'native-base';

const Id_Kategori_PeminjamanOptions = [
  { id: 1, name: 'Insidentil' },
  { id: 2, name: 'Reguler' },
  // Tambahkan kategori lainnya jika diperlukan
];

const CreateBarang = ({ navigation }) => {
  const [items, setItems] = useState([{ id: 1 }]);
  const [formData, setFormData] = useState({
    tanggalPeminjaman: '',
    Id_Kategori_Peminjaman: '',
    tanggalKembali: '',
    barangItems: []
  });
  const [barangOptions, setBarangOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data barang masuk from API
  const fetchBarangMasuk = async () => {
    try {
      let response = await fetch('http://10.0.2.2:3000/barang_masuk');
      let data = await response.json();
      setBarangOptions(data);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Unable to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  // Panggil API saat komponen pertama kali di-mount
  useEffect(() => {
    fetchBarangMasuk();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1 }]);
  };

  const handleInputChange = (index, name, value) => {
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);

    if (name === 'namaBarang') {
      const selectedBarang = barangOptions.find(item => item.Kode_Barang === value);
      if (selectedBarang) {
        newItems[index].kodeBarang = selectedBarang.Kode_Barang;
        newItems[index].jenisBarang = selectedBarang.Jenis_Barang;
      }
    }
  };


  const handleFormSubmit = async () => {
    const dataToSubmit = {
      tanggal_BarangKeluar: formData.tanggalPeminjaman,
      Id_Kategori_Peminjaman: formData.Id_Kategori_Peminjaman,
      tanggal_PengembalianBarang: formData.tanggalKembali,
      Id_User: 1, 
    Id_StatusBarangKeluar: 1,
      barangItems: items.map(item => ({
        Nama_Barang: item.namaBarang,
        Kode_BarangKeluar: item.kodeBarang,
        Kategori_Barang: item.jenisBarang,
        Jumlah_Barang: item.jumlahBarang
      }))
    };

    try {
      let response = await fetch('http://10.0.2.2:3000/barang_keluar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      let result = await response.json();
      if (result.success) {
        Alert.alert('Success', result.message);
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save data');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Unable to save data to the server.');
    }
  };


  return (
    <>
      <Header withBack="true" title={"CreateBarang"} />
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding={4}
          backgroundColor="coolGray.100"
          borderRadius="lg"
          mb={1}
          ml={-4}
        >
          <Text fontSize="xl" fontWeight="bold">Pengajuan Peminjaman Barang</Text>
        </Box>
        <Divider h={1} mt={-3} mb={5} bgColor={'black'} />

        <VStack space={4} width="100%">
          <FormControl>
            <FormControl.Label>Kategori Peminjaman</FormControl.Label>
            <Select
              selectedValue={formData.Id_Kategori_Peminjaman}
              onValueChange={(value) => setFormData({ ...formData, Id_Kategori_Peminjaman: value })}
            >
              {Id_Kategori_PeminjamanOptions.map(option => (
                <Select.Item key={option.id} label={option.name} value={option.id.toString()} />
              ))}
            </Select>
          </FormControl>



          <FormControl>
            <FormControl.Label>Tanggal Peminjaman</FormControl.Label>
            <Input
              type="date"
              placeholder="Masukan Rencana Tanggal Peminjaman Barang"
              value={formData.tanggalPeminjaman}
              onChangeText={(value) => setFormData({ ...formData, tanggalPeminjaman: value })}
            />
          </FormControl>

          {formData.Id_Kategori_Peminjaman === '1' && (
            <FormControl>
              <FormControl.Label>Tanggal Kembali</FormControl.Label>
              <Input
                type="date"
                placeholder="Masukan Tanggal Kembali Barang"
                value={formData.tanggalKembali}
                onChange={(event) => setFormData({ ...formData, tanggalKembali: event.target.value })}
              />
            </FormControl>
          )}

          {items.map((item, index) => (
            <Box key={index} bg="white" p={4} borderRadius="lg" shadow={2} mb={4}>
              <Text fontSize="md" mb={2} fontWeight="bold">Barang {index + 1}</Text>
              <FormControl>
                <FormControl.Label>Nama Barang</FormControl.Label>
                <Select
                  selectedValue={item.namaBarang}
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
                <FormControl.Label>Jenis Barang</FormControl.Label>
                <Input
                  value={item.jenisBarang}
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

          <Button onPress={handleAddItem} mt={3}>Tambah Barang</Button>
          <Button onPress={handleFormSubmit} mt={3} colorScheme="success">Simpan</Button>
        </VStack>
      </ScrollView>
    </>
  );
};

export default CreateBarang;
