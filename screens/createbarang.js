import React, { useState } from 'react';
import Header from '../components/header';
import { ScrollView } from 'react-native';
import { Box, Button, Text, VStack, Input, Select, FormControl, Divider } from 'native-base';

const barangOptions = [
  { id: 1, name: 'Travo', kode: '001', kategori: 'Hardware' },
  { id: 2, name: 'Router Toton', kode: '002', kategori: 'Networking' },
  { id: 3, name: 'Siplox Cable', kode: '003', kategori: 'Hardware' },
  { id: 4, name: 'Box Switchyard', kode: '004', kategori: 'Hardware' },
  { id: 5, name: 'Box Supply Electric', kode: '005', kategori: 'Networking' },
  // Add more items as needed
];

const kategoriPeminjamanOptions = [
  { id: 1, name: 'Insidentil' },
  { id: 2, name: 'Reguler' },
  // Add more categories as needed
];

const CreateBarang = ({ navigation }) => {
  const [items, setItems] = useState([{ id: 1 }]);
  const [formData, setFormData] = useState({
    tanggalPeminjaman: '',
    kategoriPeminjaman: '',
    tanggalKembali: '',
    barangItems: []
  });

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1 }]);
  };

  const handleInputChange = (index, name, value) => {
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);

    if (name === 'namaBarang') {
      const selectedBarang = barangOptions.find(item => item.id === parseInt(value));
      newItems[index].kodeBarang = selectedBarang.kode;
      newItems[index].kategoriBarang = selectedBarang.kategori;
    }
  };

  const handleFormSubmit = () => {
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <>
    <Header withBack="true" title={"CreateBarang"}/>
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
      <Divider h={1} mt={-3} mb={5} bgColor={'black'}/>

      <VStack space={4} width="100%">
        <FormControl>
          <FormControl.Label>Kategori Peminjaman</FormControl.Label>
          <Select
            selectedValue={formData.kategoriPeminjaman}
            onValueChange={(value) => setFormData({ ...formData, kategoriPeminjaman: value })}
          >
            {kategoriPeminjamanOptions.map(option => (
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
            onChange={(event) => setFormData({ ...formData, tanggalPeminjaman: event.target.value })}
          />
        </FormControl>

        {formData.kategoriPeminjaman === '1' && (
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
                  <Select.Item key={option.id} label={option.name} value={option.id.toString()} />
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

        <Button onPress={handleAddItem} mt={3}>Tambah Barang</Button>
        <Button onPress={handleFormSubmit} mt={3} colorScheme="success">Simpan</Button>
      </VStack>
    </ScrollView>
    </>
  );
};

export default CreateBarang;
