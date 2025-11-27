import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Header Component
 * Reusable header with app name and action buttons
 */
export default function Header({ 
  appName = "Anouwot", 
  onNotification, 
  theme 
}) {
  return (
    <View style={[styles.header, { backgroundColor: theme?.background || "#F5F7FA" }]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.appName, { color: theme?.text || "#1F2937" }]}>
          {appName}
        </Text>
      </View>
      
      <View style={styles.headerIcons}>
        {onNotification && (
          <TouchableOpacity style={styles.iconButton} onPress={onNotification}>
            <Ionicons name="notifications-outline" size={26} color={theme?.text || "#1F2937"} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: "NunitoSans_600SemiBold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
