import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';

// ==================== CONSTANTS ====================
const MOCK_PROFILE_DATA = {
  name: "Steve Job",
  email: "steve.job@student.edu",
  rank: "2nd rank",
  profileImage: null,
  assignments: {
    "Week 1": [
      {
        id: "1",
        title: "Quiz 1",
        score: 100,
        maxScore: 100,
        dueDate: "Sep 13, 8:30",
        status: "graded",
      },
      {
        id: "2",
        title: "Live Quiz",
        score: 90,
        maxScore: 100,
        dueDate: null,
        status: "not_turned_in",
      },
    ],
    "Week 2": [
      {
        id: "3",
        title: "Quiz 4",
        score: 100,
        maxScore: 100,
        dueDate: "Sep 13, 8:30",
        status: "graded",
      },
      {
        id: "4",
        title: "Live Quiz",
        score: 90,
        maxScore: 100,
        dueDate: null,
        status: "not_turned_in",
      },
      {
        id: "5",
        title: "Live Quiz",
        score: 82,
        maxScore: 100,
        dueDate: null,
        status: "not_turned_in",
      },
    ],
  },
};

// ==================== MAIN COMPONENT ====================
export default function Profile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const classroomId = params.id;
  const classroomName = params.name || "Anouwot";

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // Load fonts
  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  });

  // ==================== LIFECYCLE HOOKS ====================
  useEffect(() => {
    fetchProfileData();
    loadProfileImage();
  }, []);

  // Reload profile data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadProfileImage();
      fetchProfileData();
    }, [])
  );

  // ==================== LOAD PROFILE IMAGE ====================
  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("profileImage");
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.log("Error loading profile image:", error);
    }
  };

  // ==================== API CALLS ====================
  const fetchProfileData = async () => {
    try {
      // Load saved profile data first
      const savedName = await AsyncStorage.getItem("userName");
      
      // Simulate API call
      setTimeout(() => {
        const mockData = { ...MOCK_PROFILE_DATA };
        // Override with saved name if exists
        if (savedName) {
          mockData.name = savedName;
        }
        setProfileData(mockData);
        setLoading(false);
      }, 500);

      // TODO: Replace with actual API call
      // const result = await getStudentProfile(classroomId);
      // setProfileData(result);
    } catch (error) {
      console.log("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data");
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0068F0" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>{classroomName}</Text>
        <View style={styles.menuButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Picture - Read Only */}
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={60} color="#fff" />
              </View>
            )}
          </View>

          {/* Name and Rank */}
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileRank}>{profileData.rank}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Assignments by Week */}
        {Object.entries(profileData.assignments).map(([week, assignments]) => (
          <View key={week} style={styles.weekSection}>
            <Text style={styles.weekTitle}>{week}</Text>
            
            {assignments.map((assignment) => (
              <View key={assignment.id} style={styles.assignmentRow}>
                <View style={styles.assignmentLeft}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  {assignment.dueDate && (
                    <Text style={styles.assignmentDue}>Due {assignment.dueDate}</Text>
                  )}
                  {!assignment.dueDate && assignment.status === "not_turned_in" && (
                    <Text style={styles.assignmentNoDue}>No due date</Text>
                  )}
                </View>
                
                <View style={styles.assignmentRight}>
                  <Text style={styles.assignmentScore}>
                    {assignment.score}/{assignment.maxScore}
                  </Text>
                  {assignment.status === "not_turned_in" && (
                    <Text style={styles.assignmentStatus}>Not turned in</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
    fontFamily: "NunitoSans_400Regular",
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "NunitoSans_600SemiBold",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#fff",
  },
  profileImageContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#D4A373",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: "NunitoSans_700Bold",
  },
  profileRank: {
    fontSize: 18,
    fontWeight: "400",
    color: "#0068F0",
    fontFamily: "NunitoSans_400Regular",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  weekSection: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0068F0",
    marginBottom: 16,
    fontFamily: "NunitoSans_600SemiBold",
  },
  assignmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  assignmentLeft: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: "NunitoSans_600SemiBold",
  },
  assignmentDue: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "NunitoSans_400Regular",
  },
  assignmentNoDue: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "NunitoSans_400Regular",
  },
  assignmentRight: {
    alignItems: "flex-end",
    marginLeft: 16,
  },
  assignmentScore: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: "NunitoSans_700Bold",
  },
  assignmentStatus: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "NunitoSans_400Regular",
  },
});
