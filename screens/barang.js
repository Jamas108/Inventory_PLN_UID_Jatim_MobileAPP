import React from "react";
import { ScrollView } from 'react-native';
import Header from "../components/header";
import { Box, Button, Text, VStack, HStack, Card, Center, Divider } from 'native-base';

const data = [
  { id: 1, name: 'Barang 1', quantity: 10 },
  { id: 2, name: 'Barang 2', quantity: 5 },
  // Add more items as needed
];

const Barang = ({ navigation }) => {
  return (
    <>
  <Header title={"Inventory UID JATIM"} />
  <ScrollView contentContainerStyle={{ padding: 10 }}>
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding={4}
      backgroundColor="coolGray.100"
      borderRadius="lg"
      mb={4}
    >
      <Text fontSize="xl" >Silahkan Input Barang</Text>
      <Button mr={1} onPress={() => navigation.navigate('CreateBarang')}>Create Barang</Button>
    </Box>
    <Divider mt={-3} mb={5} />
    <VStack space={4} width="100%">
      {data.length > 0 ? (
        data.map(item => (
          <Card key={item.id} padding={4} borderRadius="lg" backgroundColor="white" shadow={2}>
            <HStack space={3} justifyContent="space-between">
              <Text>Name: {item.name}</Text>
              <Text>Quantity: {item.quantity}</Text>
            </HStack>
          </Card>
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
