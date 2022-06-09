import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../constants";
import { Avatar } from "native-base";
import Moment from "moment";

const RequestCard = ({ containerStyle, requests, onPress, isConsumerMode }) => {
  const date = new Date(categoryItem.pickUpTime.seconds * 1000);
  const pickupTime = Moment(date).format("HH:mm");
  return (
    <View>
      {requests.map((req, index) => (
           <View>
           <Text 
        key={index}
          style={{
            flex: 1,
            ...FONTS.h2,
          }}
        >
          {req.recipeName}
        </Text>

           { 
               req.users.map((u, iindex) =>
               <TouchableOpacity
               style={{
                 flexDirection: "row",
                 alignItems: "center",
                 padding: 10,
                 marginTop: 10,
                 borderRadius: SIZES.radius,
                 backgroundColor: COLORS.gray2,
                 marginHorizontal: SIZES.padding,
               }}
               onPress={() => onPress}
             >
               <View style={{ width: "70%", paddingLeft: 20 }}>
                 <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "stretch" }}>
                   <Avatar bg={COLORS.black} size="sm" source={{ uri: req.avatar }}></Avatar>
                   <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>Anfrage von {req.surName}</Text>
                 </View>
               </View>
               {/* <View>
                 <Text>test</Text>
               </View> */}
             </TouchableOpacity>)
           }

       </View>)


        )}

      
    </View>
  );
};

export default RequestCard;
