import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';

// ==================== CONSTANTS ====================
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    teacherName: "Joe Mama",
    title: "New assignment from Joe Mama",
    message: "Submit the report",
    time: "1:46",
    profileImage: null,
    read: false,
  },
  {
    id: "2",
    teacherName: "Joe Mama",
    title: "New assignment from Joe Mama",
    message: "Submit the report",
    time: "1:46",
    profileImage: null,
    read: false,
  },
  {
    id: "3",
    teacherName: "Joe Mama",
    title: "New assignment from Joe Mama",
    message: "Submit the report",
    time: "1:46",
    profileImage: null,
    read: false,
  },
  {
    id: "4",
    teacherName: "Joe Mama",
    title: "New assignment from Joe Mama",
    message: "Submit the report",
    time: "1:46",
    profileImage: null,
    read: false,
  },
  {
    id: "5",
    teacherName: "Joe Mama",
    title: "New assignment from Joe Mama",
    message: "Submit the report",
    time: "1:46",
    profileImage: null,
    read: false,
  },
];

// ==================== MAIN COMPONENT ====================
export default function Notification() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Load fonts
  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNotificationPress = (notification) => {
    // Mark as read and navigate to assignment
    console.log("Notification pressed:", notification);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Notification List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.notificationItemUnread,
              ]}
              onPress={() => handleNotificationPress(notification)}
              activeOpacity={0.7}
            >
              {/* Profile Image */}
              <View style={styles.profileImageContainer}>
                {notification.profileImage ? (
                  <Image
                    source={{ uri: notification.profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="person" size={24} color="#fff" />
                  </View>
                )}
              </View>

              {/* Notification Content */}
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
              </View>

              {/* Time */}
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: "NunitoSans_700Bold",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 16,
    fontFamily: "NunitoSans_400Regular",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  notificationItemUnread: {
    backgroundColor: "#F9FAFB",
  },
  profileImageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  profileImagePlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#D4A373",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: "NunitoSans_600SemiBold",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "NunitoSans_400Regular",
  },
  notificationTime: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "NunitoSans_400Regular",
  },
});
