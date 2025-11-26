import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Reusable Confirmation Modal Component
 * Used for logout, delete, remove actions
 */
export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  iconName = "alert-circle-outline",
  iconColor = "#DC2626",
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
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={64} color={iconColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme?.text || "#111827" }]}>
            {title}
          </Text>

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: theme?.textSecondary || "#6B7280" }]}>
              {message}
            </Text>
          )}

          {/* Additional Content */}
          {children}

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.buttonOutline, { borderColor: theme?.border || "#D1D5DB" }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonOutlineText, { color: theme?.text || "#1F2937" }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonDanger}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
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
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    fontFamily: "NunitoSans_400Regular",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  buttonOutline: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "NunitoSans_600SemiBold",
  },
  buttonDanger: {
    flex: 1,
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "NunitoSans_600SemiBold",
  },
});
