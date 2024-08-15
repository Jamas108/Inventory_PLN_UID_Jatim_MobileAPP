import { Alert } from "react-native";
import FIREBASE from "./config/FIREBASE";
import { getData, clearStorage, storeData } from "../utils";

export const registerUser = async (data, password) => {
  try {
    const success = await FIREBASE.auth().createUserWithEmailAndPassword(data.email, password);

    const dataBaru = {
      ...data,
      uid: success.user.uid,
    };

    await FIREBASE.database()
      .ref("users/" + success.user.uid)
      .set(dataBaru);

    storeData("user", dataBaru); // Local storage
    return dataBaru;
  } catch (error) {
    throw error;
  }
};


export const loginUser = async (email, password) => {
  try {
    const success = await FIREBASE.auth().signInWithEmailAndPassword(email, password);
    
    // Retrieve user data from the database
    const userRef = FIREBASE.database().ref(`/users/${success.user.uid}`);
    const userSnapshot = await userRef.once("value");
    const userData = userSnapshot.val();

    if (userData) {
      // Local storage (Async Storage)
      await storeData("user", userData);
      
      return userData;
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    throw error;
  }
};


export const logoutUser = () => {
  FIREBASE.auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      clearStorage();
    })
    .catch((error) => {
      // An error happened.
      Alert.alert("Error", error.message);
    });
};


export const updateUserData = async (uid, updatedData) => {
  try {
    const userRef = FIREBASE.database().ref(`users/${uid}`);
    const snapshot = await userRef.once("value");
    const existingUserData = snapshot.val();

    if (existingUserData) {
      const updatedUser = {
        ...existingUserData,
        ...updatedData,
      };

      await userRef.update(updatedUser);
      console.log("User data updated successfully");
    } else {
      console.log("User data not found");
    }
  } catch (error) {
    throw error;
  }
};

export const getBarang_KeluarData = () => {
  const obatRef = FIREBASE.database().ref("BarangKeluar");

  obatRef.once("value")
    .then((snapshot) => {
      // The data is available in snapshot.val()
      const data = snapshot.val();
      console.log("Data retrieved successfully:", data);
      // You can update your React component state with the retrieved data here
    })
    .catch((error) => {
      console.error("Error retrieving data: ", error);
    });
};




// export const getObatData = () => {
//   const obatRef = FIREBASE.database().ref("obat");

//   obatRef.once("value")
//     .then((snapshot) => {
//       // The data is available in snapshot.val()
//       const data = snapshot.val();
//       console.log("Data retrieved successfully:", data);
//       // You can update your React component state with the retrieved data here
//     })
//     .catch((error) => {
//       console.error("Error retrieving data: ", error);
//     });
// };




// export const getHospital = async () => {
//   const hospitalRef = FIREBASE.database().ref("hospitals");

//   return hospitalRef
//     .once("value")
//     .then((snapshot) => {
//       const hospitalsData = snapshot.val();
//       if (hospitalsData) {
//         const hospitalsArray = Object.entries(hospitalsData).map(([hospitalId, hospitalData]) => ({
//           hospitalId,
//           ...hospitalData,
//         }));
//         return hospitalsArray;
//       } else {
//         return [];
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching hospitals data:", error);
//       return [];
//     });
// };

// export const editHospital = async (hospitalId, updatedData) => {
//   try {
//     await FIREBASE.database()
//       .ref(`hospitals/${hospitalId}`)
//       .update(updatedData);

//     console.log("Hospital updated successfully");
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteHospital = async (hospitalId) => {
//   try {
//     await FIREBASE.database()
//       .ref(`hospitals/${hospitalId}`)
//       .remove();

//     console.log("Hospital deleted successfully");
//   } catch (error) {
//     throw error;
//   }
// };

