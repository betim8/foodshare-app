import React from "react";
import { View, TouchableOpacity, Alert, Modal, Text, Pressable, StyleSheet } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants";
import { Avatar } from "native-base";
import { CustomButton } from "../components";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../App';


import { AntDesign } from "@expo/vector-icons";

const RequestCard = ({ containerStyle, request, isConsumerMode }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [confirmedUser, setConfirmedUser] = React.useState(null);

  function onPressUser(user) {
    console.log(user);
    console.log(request);
    setModalVisible(true);
    setConfirmedUser(user);
  }

  async function confirmRequest() {
    await setDoc(doc(db, 'orders', request.id), { toUserUid: confirmedUser.id, status: 'progress' }, { merge: true });
    setModalVisible(false);

  }

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{
          flex: 1,
          ...FONTS.h2,
          marginHorizontal: SIZES.padding - 20,
        }}>Mahlzeit an {confirmedUser?.surName} anbieten</Text>
            <CustomButton
          buttonText="Ja"
          buttonContainerStyle={{
            paddingVertical: 5,
            marginVertical: 10,
            borderRadius: 20,
            width: 80,
          }}
          colors={[COLORS.darkGreen, COLORS.darkGreen]}
          onPress={confirmRequest}
          textColor={COLORS.white}
          fontStyle={FONTS.body3}
        />
            <CustomButton
          buttonText="Nein"
          buttonContainerStyle={{
            paddingVertical: 5,
            marginVertical: 1,
            borderRadius: 20,
            width: 80,
          }}
          colors={[COLORS.lightGray, COLORS.lightGray]}
          onPress={()=>setModalVisible(false)}
          textColor={COLORS.black}
          fontStyle={FONTS.body3}
        />
          </View>
        </View>
      </Modal>
      <Text
        style={{
          flex: 1,
          ...FONTS.h2,
          marginHorizontal: SIZES.padding,
        }}
      >
        {request.recipeName}
      </Text>
      {request.users.length > 0 ? (
        request.users.map((u, iindex) => (
          <TouchableOpacity
            key={iindex}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              marginTop: 10,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.gray2,
              marginHorizontal: SIZES.padding,
            }}
            onPress={() => onPressUser(u)}
          >
            <View style={{ width: "100%" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "stretch" }}>
                <Avatar bg={COLORS.black} size="sm" source={{ uri: u.avatar }}></Avatar>
                <Text key={1} style={{ color: COLORS.gray, ...FONTS.body3 }}>
                  {u.surName}
                </Text>
                <Text key={2} style={{ color: COLORS.darkGreen, ...FONTS.body3 }}>
                  Annehmen <AntDesign name="right" size={18} color={COLORS.darkGreen} />
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text
          style={{
            flex: 1,
            ...FONTS.b2,
            marginHorizontal: SIZES.padding,
          }}
        >
          Noch keine Anfragen erhalten
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
export default RequestCard;
