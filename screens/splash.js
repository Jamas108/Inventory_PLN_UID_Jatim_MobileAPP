import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { getData } from '../utils';

const Splash = ({ navigation }) => {
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userData = await getData('user');
        if (userData) {
          // Navigasi ke halaman utama (karena hanya ada 1 role yaitu user)
          navigation.replace('Tabs');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        navigation.replace('Login');
      }
    };

    // Periksa status user saat komponen di-mount
    checkUserStatus();
  }, [navigation]);

  return (
    <View style={styles.pages}>
      <Image 
        source={require('../assets/icon.png')} 
        style={styles.image} 
        resizeMode="contain" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff', // Warna latar belakang untuk splash screen
  },
  image: {
    width: 200, // Sesuaikan ukuran gambar sesuai kebutuhan
    height: 200,
  },
});

export default Splash;
