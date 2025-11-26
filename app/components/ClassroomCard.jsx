import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Helper function to get classroom color
const getClassroomColor = (index) => {
  const colors = [
    "#3B82F6",
    "#1E88E5",
    "#43A047",
    "#FB8C00",
    "#8E24AA",
    "#E53935",
  ];
  return colors[index % colors.length];
};

export default function ClassroomCard({ classroom, index, onPress, onMenuPress }) {
  if (!classroom) return null;

  return (
    <TouchableOpacity
      style={[styles.classroomCard, { backgroundColor: getClassroomColor(index) }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        {/* Class Name and Section */}
        <View style={styles.titleSection}>
          <Text style={styles.classroomName} numberOfLines={1}>
            {classroom?.name || classroom?.className || "Classroom"}
            {classroom?.section ? ` - ${classroom.section}` : ""}
          </Text>
          {classroom?.yearTerm && (
            <Text style={styles.section}>{classroom.yearTerm}</Text>
          )}
        </View>

        {/* Menu Dots */}
        <TouchableOpacity style={styles.menuDotsButton} onPress={onMenuPress}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Lecturer and Schedule - Google Classroom format */}
        <Text style={styles.bottomInfo} numberOfLines={1}>
          Lecturer : {classroom?.lecturer || classroom?.teacher || "N/A"} | {classroom?.day || classroom?.schedule || "N/A"} | {classroom?.time || classroom?.timeSlot || "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  classroomCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 140,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "auto",
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  classroomName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 32,
    fontFamily: "NunitoSans_700Bold",
    marginBottom: 2,
  },
  section: {
    fontSize: 18,
    fontWeight: "400",
    color: "#fff",
    opacity: 0.95,
    fontFamily: "NunitoSans_400Regular",
  },
  menuDotsButton: {
    padding: 4,
    marginTop: -4,
  },
  bottomSection: {
    marginTop: 36,
  },
  bottomInfo: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
    opacity: 0.95,
    fontFamily: "NunitoSans_400Regular",
  },
});
