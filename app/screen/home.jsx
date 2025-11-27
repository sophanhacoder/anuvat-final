import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { joinClassroom } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from '@expo/vector-icons/Ionicons';

// Components
import ClassroomCard from "../components/cards/ClassroomCard";
import Header from "../components/common/Header";
import JoinClassroomCard from "../components/cards/JoinClassroomCard";
import SuccessModal from "../components/modals/SuccessModal";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import ClassroomInfoCard from "../components/cards/ClassroomInfoCard";

// Utils
import { showJoinClassroomNotification } from "../../utils/notifications";
import { useTheme } from "../../contexts/ThemeContext";
import { normalizeClassroomData } from "../../utils/classroomHelpers";

// ==================== MAIN COMPONENT ====================
export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [joinedClassroom, setJoinedClassroom] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [removeClassModalVisible, setRemoveClassModalVisible] = useState(false);
  const [classroomToRemove, setClassroomToRemove] = useState(null);

  // ==================== LIFECYCLE HOOKS ====================
  useEffect(() => {
    loadClassrooms();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadClassrooms();
    }, [])
  );

  // ==================== STORAGE FUNCTIONS ====================
  const loadClassrooms = async () => {
    try {
      const saved = await AsyncStorage.getItem("classrooms");
      let classroomsList = [];
      
      if (saved) {
        classroomsList = JSON.parse(saved);
      }
      
      setClassrooms(classroomsList);
    } catch (error) {
      console.log("Error loading classrooms:", error);
    }
  };

  /**
   * Save classrooms to AsyncStorage
   */
  const saveClassrooms = async (updatedClassrooms) => {
    try {
      await AsyncStorage.setItem("classrooms", JSON.stringify(updatedClassrooms));
    } catch (error) {
      console.log("Error saving classrooms:", error);
    }
  };

  // ==================== ACTION HANDLERS ====================
  const handleJoinClassroom = async () => {
    if (!classCode.trim()) {
      Alert.alert("Error", "Please enter a class code");
      return;
    }

    // Check if already joined this classroom
    const alreadyJoined = classrooms.some(c => 
      (c.code === classCode.toUpperCase()) || 
      (c.classCode === classCode.toUpperCase())
    );
    
    if (alreadyJoined) {
      Alert.alert("Already Joined", "You have already joined this classroom");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        Alert.alert("Error", "Please login first");
        router.replace("/screen/login");
        return;
      }
      
      const result = await joinClassroom(classCode);
      console.log("Join classroom result:", result);
      
      const classroomData = result?.classroom || result?.data || result;
      const enrichedClassroom = normalizeClassroomData(classroomData);
      
      setJoinedClassroom(enrichedClassroom);
      setModalVisible(true);
      
      // Show notification
      await showJoinClassroomNotification(
        enrichedClassroom.name || "Classroom",
        enrichedClassroom.lecturer || "Lecturer"
      );
      
      const updatedClassrooms = [...classrooms, enrichedClassroom];
      setClassrooms(updatedClassrooms);
      await saveClassrooms(updatedClassrooms);
      
      setClassCode("");
    } catch (error) {
      console.log("Join classroom error:", error);
      Alert.alert("Error", typeof error === 'string' ? error : error.message || "Failed to join classroom");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setJoinedClassroom(null);
  };

  const handleRemoveClassroom = async () => {
    if (!classroomToRemove) return;
    
    try {
      const updatedClassrooms = classrooms.filter(c => {
        const cId = c?.id || c?.classroomId || c?.classId;
        const removeId = classroomToRemove?.id || classroomToRemove?.classroomId || classroomToRemove?.classId;
        return cId !== removeId;
      });
      
      setClassrooms(updatedClassrooms);
      await saveClassrooms(updatedClassrooms);
      
      setRemoveClassModalVisible(false);
      setClassroomToRemove(null);
    } catch (error) {
      console.log("Remove classroom error:", error);
      Alert.alert("Error", "Failed to remove classroom");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <Header
          appName="Anouwot"
          onNotification={() => router.push("/screen/notification")}
          theme={theme}
        />

      {/* Join Classroom Card */}
      <JoinClassroomCard
        classCode={classCode}
        onChangeCode={(text) => setClassCode(text.toUpperCase())}
        onJoin={handleJoinClassroom}
        loading={loading}
      />

      {/* My Classroom Section */}
      <View style={styles.myClassroomSection}>
        <View style={styles.myClassroomHeader}>
          <Ionicons name="school" size={22} color="#0068F0" style={styles.classroomIcon} />
          <Text style={styles.myClassroomTitle}>My classroom</Text>
        </View>

        {classrooms.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyClassroomCard}>
            <Text style={styles.emptyClassroomText}>
              You haven't joined any classroom yet.
            </Text>
          </View>
        ) : (
          /* Classroom Cards */
          classrooms.map((classroom, index) => {
            if (!classroom) return null;
            
            const classId = classroom?.id || classroom?.classroomId || classroom?.classId || `temp-${index}`;
            
            return (
              <ClassroomCard
                key={classroom.id || index}
                classroom={classroom}
                index={index}
                onPress={() => router.push(`/screen/classroom?id=${classId}`)}
                onMenuPress={() => {
                  setClassroomToRemove(classroom);
                  setRemoveClassModalVisible(true);
                }}
              />
            );
          })
        )}
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={modalVisible}
        onClose={closeModal}
        title="Successfully Joined!"
        subtitle="You have been added to the classroom"
        theme={theme}
      >
        {joinedClassroom && (
          <ClassroomInfoCard classroom={joinedClassroom} theme={theme} />
        )}
      </SuccessModal>

      {/* Remove Classroom Modal */}
      <ConfirmationModal
        visible={removeClassModalVisible}
        onClose={() => {
          setRemoveClassModalVisible(false);
          setClassroomToRemove(null);
        }}
        onConfirm={handleRemoveClassroom}
        title="Remove Classroom"
        message="Are you sure you want to remove this classroom?"
        confirmText="Remove"
        cancelText="Cancel"
        iconName="trash"
        iconColor="#DC2626"
        theme={theme}
      >
        {classroomToRemove && (
          <ClassroomInfoCard classroom={classroomToRemove} theme={theme} />
        )}
      </ConfirmationModal>
      </ScrollView>

      {/* Navigation Bar */}
      <View style={[styles.navBar, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Ionicons name="home" size={24} color="#0068F0" />
          <Text style={[styles.navText, { color: '#0068F0' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/screen/main-profile")}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  myClassroomSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  myClassroomHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  classroomIcon: {
    marginRight: 8,
  },
  myClassroomTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0068F0",
    fontFamily: "NunitoSans_600SemiBold",
  },
  emptyClassroomCard: {
    backgroundColor: "#0068F0",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  emptyClassroomText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
    fontFamily: "NunitoSans_400Regular",
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navButton: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    fontFamily: "NunitoSans_600SemiBold",
  },
});
