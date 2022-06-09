import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../constants";
import { Avatar } from "native-base";
import Moment from "moment";
import { AntDesign } from "@expo/vector-icons";


const RequestCard = ({ containerStyle, request, onPress, isConsumerMode }) => {

  return (
    <View>
           <Text 
          style={{
            flex: 1,
            ...FONTS.h2,
            marginHorizontal: SIZES.padding
          }}
        >
          {request.recipeName}
        </Text>

           { 
               request.users.map((u, iindex) =>
               <TouchableOpacity key={iindex}
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
               <View style={{ width: "100%"}}>
                 <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "stretch" }}>
                   <Avatar bg={COLORS.black} size="sm" source={{ uri: u.avatar }}></Avatar>
                   <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>{u.surName}</Text>
                   <Text style={{color: COLORS.darkGreen,...FONTS.body3}}>Annehmen <AntDesign name="right" size={18} color={COLORS.darkGreen}/></Text>
                 </View>
               </View>
               {/* <View>
                 <Text>test</Text>
               </View> */}
             </TouchableOpacity>)
           }
    </View>
  );
};

export default RequestCard;
