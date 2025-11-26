import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * Classroom Info Card Component
 * Displays classroom details in modals and screens
 */
export default function ClassroomInfoCard({ classroom, theme }) {
  if (!classroom) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme?.inputBackground || "#F3F4F6" }]}>
      <Text style={[styles.title, { color: theme?.text || "#1F2937" }]}>
        {classroom.name || classroom.className || "Classroom"}
      </Text>
      
      {classroom.yearTerm && (
        <Text style={[styles.text, { color: theme?.textSecondary || "#6B7280" }]}>
          {classroom.yearTerm}
        </Text>
      )}
      
      {classroom.lecturer && (
        <Text style={[styles.text, { color: theme?.textSecondary || "#6B7280" }]}>
          Lecturer: {classroom.lecturer}
        </Text>
      )}
      
      {(classroom.day || classroom.time) && (
        <Text style={[styles.text, { color: theme?.textSecondary || "#6B7280" }]}>
          {classroom.day || "N/A"} | {classroom.time || "N/A"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F3F4F6",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "NunitoSans_600SemiBold",
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "NunitoSans_400Regular",
  },
});
