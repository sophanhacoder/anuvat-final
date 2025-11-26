import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getClassroomDetails, getClassroomAssignments, getClassroomMaterials } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from '@expo/vector-icons/Ionicons';
import { showLeaveClassroomNotification } from "../../utils/notifications";
import { normalizeClassroomData } from "../../utils/classroomHelpers";
import { MOCK_STUDENTS, MOCK_ASSIGNMENTS, MOCK_MATERIALS } from "../../constants/mockData";

// ==================== CONSTANTS ====================
const TABS = {
  STREAM: "stream",
  CLASSWORK: "classwork",
  PEOPLE: "people",
};

// ==================== MAIN COMPONENT ====================
export default function Classroom() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const classroomId = params.id;

  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.STREAM);
  const [leaveClassModalVisible, setLeaveClassModalVisible] = useState(false);

  // ==================== LIFECYCLE HOOKS ====================
  useEffect(() => {
    fetchClassroomData();
  }, []);

  // ==================== ACTION HANDLERS ====================
  const handleLeaveClass = async () => {
    try {
      // Get current classrooms
      const classroomsJson = await AsyncStorage.getItem("classrooms");
      if (classroomsJson) {
        const classrooms = JSON.parse(classroomsJson);
        // Remove this classroom from the list - check multiple possible ID fields
        const updatedClassrooms = classrooms.filter(c => {
          const cId = c?.id || c?.classroomId || c?.classId;
          return cId !== classroomId;
        });
        await AsyncStorage.setItem("classrooms", JSON.stringify(updatedClassrooms));
      }
      
      // Show notification
      if (classroom) {
        await showLeaveClassroomNotification(classroom.name || "Classroom");
      }
      
      // Close modal
      setLeaveClassModalVisible(false);
      
      // Navigate back to home
      router.replace("/screen/home");
    } catch (error) {
      console.log("Leave class error:", error);
      Alert.alert("Error", "Failed to leave class");
    }
  };

  // ==================== API CALLS ====================
  const fetchClassroomData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        Alert.alert("Error", "Please login first");
        router.replace("/screen/login");
        return;
      }

      console.log("Fetching classroom data for ID:", classroomId);

      try {
        const classroomResult = await getClassroomDetails(classroomId);
        console.log("Classroom details:", classroomResult);
        const classroomData = classroomResult?.classroom || classroomResult?.data || classroomResult;
        
        // Normalize and add MOCK_STUDENTS if needed
        const normalizedClassroom = normalizeClassroomData(classroomData);
        if (!normalizedClassroom.students) {
          normalizedClassroom.students = MOCK_STUDENTS;
        }
        setClassroom(normalizedClassroom);

        const assignmentsResult = await getClassroomAssignments(classroomId);
        console.log("Assignments:", assignmentsResult);
        const assignmentsData = assignmentsResult?.assignments || assignmentsResult?.data || assignmentsResult || [];
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);

        const materialsResult = await getClassroomMaterials(classroomId);
        console.log("Materials:", materialsResult);
        const materialsData = materialsResult?.materials || materialsResult?.data || materialsResult || [];
        setMaterials(Array.isArray(materialsData) ? materialsData : []);
      } catch (apiError) {
        console.log("API Error:", apiError, "- Using mock data instead");
        
        setClassroom({
          id: classroomId,
          name: "Mobile Development",
          section: "Class B",
          yearTerm: "Y2 T3",
          className: "Mobile Development",
          term: "Semester 1",
          lecturer: "Ms.Voneat",
          room: "409",
          day: "Friday",
          schedule: "Friday",
          time: "8:30 - 11:30",
          timeSlot: "8:30 - 11:30",
          code: "12345678",
          classCode: "12345678",
          studentCount: 20,
          students: MOCK_STUDENTS,
        });

        setAssignments(MOCK_ASSIGNMENTS);
        setMaterials(MOCK_MATERIALS);
      }
    } catch (error) {
      console.log("Error fetching classroom data:", error);
      Alert.alert("Error", typeof error === 'string' ? error : error.message || "Failed to load classroom");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0068F0" />
        <Text style={styles.loadingText}>Loading classroom...</Text>
      </View>
    );
  }

  if (!classroom) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Classroom not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push({
            pathname: "/screen/profile",
            params: { 
              id: classroomId,
              name: classroom.name || classroom.className || "Anouwot"
            }
          })}
        >
          <Ionicons name="person-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setLeaveClassModalVisible(true)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Classroom Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>
          {classroom.name || classroom.className}
          {classroom.section ? ` - ${classroom.section}` : ""}
        </Text>
        {classroom.yearTerm && (
          <Text style={styles.bannerSection}>
            {classroom.yearTerm}
          </Text>
        )}
        <View style={styles.bannerBottomRow}>
          <Text style={styles.bannerInfo}>
            Lecturer : {classroom.lecturer || classroom.teacher || "N/A"} | {classroom.day || classroom.schedule || "N/A"} | {classroom.time || classroom.timeSlot || "N/A"}
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === TABS.STREAM && styles.activeTab]}
          onPress={() => setActiveTab(TABS.STREAM)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.STREAM && styles.activeTabText,
            ]}
          >
            Stream
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === TABS.CLASSWORK && styles.activeTab]}
          onPress={() => setActiveTab(TABS.CLASSWORK)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.CLASSWORK && styles.activeTabText,
            ]}
          >
            Classwork
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === TABS.PEOPLE && styles.activeTab]}
          onPress={() => setActiveTab(TABS.PEOPLE)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.PEOPLE && styles.activeTabText,
            ]}
          >
            People
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content}>
        {activeTab === TABS.STREAM && (
          <View>
            {/* Upcoming Section */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Upcoming</Text>
              {assignments.length === 0 ? (
                <Text style={styles.emptyText}>No work due soon</Text>
              ) : (
                assignments.slice(0, 3).map((assignment, index) => (
                  <View key={index} style={styles.assignmentItem}>
                    <View style={styles.assignmentIcon}>
                      <Ionicons name="document-text" size={20} color="#0068F0" />
                    </View>
                    <View style={styles.assignmentInfo}>
                      <Text style={styles.assignmentTitle}>
                        {assignment.title || assignment.name}
                      </Text>
                      <Text style={styles.assignmentDue}>
                        <Ionicons name="time-outline" size={12} color="#6B7280" /> Due {assignment.dueDate || "Soon"}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Announcements */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Announcements</Text>
              <Text style={styles.emptyText}>No announcements yet</Text>
            </View>
          </View>
        )}

        {activeTab === TABS.CLASSWORK && (
          <View>
            {/* Classwork List */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>All Assignments</Text>
              {assignments.length === 0 ? (
                <Text style={styles.emptyText}>
                  No assignments posted yet
                </Text>
              ) : (
                assignments.map((assignment, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.assignmentCard}
                    onPress={() => {
                      // Navigate to assignment details
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.assignmentCardHeader}>
                      <View style={styles.assignmentCardIconWrapper}>
                        <Ionicons name="document-text-outline" size={24} color="#0068F0" />
                      </View>
                      <View style={styles.assignmentCardInfo}>
                        <Text style={styles.assignmentCardTitle}>
                          {assignment.title || assignment.name}
                        </Text>
                        <Text style={styles.assignmentCardDue}>
                          <Ionicons name="calendar-outline" size={12} color="#6B7280" /> {assignment.dueDate || "No due date"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.assignmentCardRight}>
                      <Text style={styles.assignmentCardPoints}>
                        {assignment.points || 100} pts
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        )}

        {activeTab === TABS.PEOPLE && (
          <View>
            {/* Teacher Section */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Teacher</Text>
              <View style={styles.personItem}>
                <View style={styles.personAvatar}>
                  <Ionicons name="person" size={24} color="#0068F0" />
                </View>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>
                    {classroom.lecturer || classroom.teacher || "Teacher"}
                  </Text>
                  <Text style={styles.personRole}>Instructor</Text>
                </View>
              </View>
            </View>

            {/* Students Section */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Classmates</Text>
                <Text style={styles.cardCount}>
                  {classroom.students?.length || classroom.studentCount || 0}
                </Text>
              </View>
              {classroom.students && classroom.students.length > 0 ? (
                classroom.students.map((student, index) => (
                  <View key={student.id} style={styles.personItem}>
                    <View style={styles.personAvatar}>
                      <Ionicons name="person" size={24} color="#6B7280" />
                    </View>
                    <View style={styles.personInfo}>
                      <Text style={styles.personName}>{student.name}</Text>
                      <Text style={styles.personRole}>{student.email}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Student list not available
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Leave Class Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={leaveClassModalVisible}
        onRequestClose={() => setLeaveClassModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContent}>
            <View style={styles.logoutIconContainer}>
              <Ionicons name="exit-outline" size={48} color="#DC2626" />
            </View>
            
            <Text style={styles.logoutTitle}>Leave Class</Text>
            <Text style={styles.logoutMessage}>
              Are you sure you want to leave this class?
            </Text>

            <View style={styles.logoutButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setLeaveClassModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLeaveClass}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutButtonText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#0068F0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backIconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    backgroundColor: "#3B82F6",
    padding: 24,
    paddingTop: 100,
    paddingBottom: 24,
    minHeight: 200,
    justifyContent: "space-between",
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    fontFamily: "NunitoSans_700Bold",
  },
  bannerSection: {
    fontSize: 24,
    fontWeight: "400",
    color: "#fff",
    marginBottom: "auto",
    opacity: 0.95,
    fontFamily: "NunitoSans_400Regular",
  },
  bannerBottomRow: {
    marginTop: 40,
  },
  bannerInfo: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.95,
    fontFamily: "NunitoSans_400Regular",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#0068F0",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#0068F0",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  cardCount: {
    fontSize: 16,
    color: "#6B7280",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  assignmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  assignmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  assignmentDue: {
    fontSize: 13,
    color: "#6B7280",
  },
  assignmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  assignmentCardIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  assignmentCardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  assignmentCardInfo: {
    flex: 1,
  },
  assignmentCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  assignmentCardDue: {
    fontSize: 13,
    color: "#6B7280",
  },
  assignmentCardPoints: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0068F0",
  },
  personItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  personAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  personRole: {
    fontSize: 13,
    color: "#6B7280",
  },
  // Logout Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "85%",
    maxWidth: 400,
  },
  logoutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  logoutMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  logoutButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
