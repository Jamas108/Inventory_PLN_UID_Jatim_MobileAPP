// import { StyleSheet, View, ImageBackground } from 'react-native';
// import React, { Component } from 'react';
// import { getData } from '../utils/localStorage';

// export default class Splash extends Component {
//   componentDidMount() {
//     // Menambahkan setTimeout untuk menunda navigasi selama 3 detik
//     setTimeout(() => {
//       this.checkUserStatus();
//     }, 3000); // Durasi splash dalam milidetik (3 detik dalam contoh ini)
//   }

//   checkUserStatus = async () => {
//     const userData = await getData("user");

//     if (userData) {
//       if (userData.role === 'admin') {
//         this.props.navigation.replace('AdminTabs');
//       } else if (userData.role === 'mitra') {
//         this.props.navigation.replace('MekanikTabs');
//       } else {
//         this.props.navigation.replace('Tabs');
//       }
//     } else {
//       this.props.navigation.replace('Login');
//     }
//   };

//   render() {
//     return (
//       <>
//         <ImageBackground
//           source={require("../assets/splash.png")} // Replace with your actual image path
//           style={styles.backgroundImage}
//         >
//           <View style={styles.pages}></View>
//         </ImageBackground>
//       </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   pages: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover', // or 'stretch' or 'contain'
// },
// });
