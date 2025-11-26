import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Success Modal Component
 * Used to show success messages after actions
 */
export default function SuccessModal({
  visible,
  onClose,
  title,
  subtitle,
  buttonText = "Got it!",
  theme,
  children,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme?.cardBackground || "#fff" }]}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme?.text || "#111827" }]}>
            {title}
          </Text>

          {/* Subtitle */}
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme?.textSecondary || "#6B7280" }]}>
              {subtitle}
            </Text>
          )}

          {/* Additional Content */}
          {children}

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "85%",
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "NunitoSans_700Bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    fontFamily: "NunitoSans_400Regular",
  },
  button: {
    backgroundColor: "#0068F0",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "NunitoSans_600SemiBold",
  },
});
