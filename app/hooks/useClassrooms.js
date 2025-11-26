import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { joinClassroom as joinClassroomAPI } from "../../api";
import {
  showJoinClassroomNotification,
  showLogoutNotification,
} from "../../utils/notifications";
import { normalizeClassroomData } from "../../utils/classroomHelpers";

/**
 * Custom Hook for Classroom Management
 * Handles classroom data, join/remove operations, and AsyncStorage
 */
export default function useClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==================== LOAD CLASSROOMS ====================
  const loadClassrooms = async () => {
    try {
      const saved = await AsyncStorage.getItem("classrooms");
      let classroomsList = [];

      if (saved) {
        classroomsList = JSON.parse(saved);
      }

      setClassrooms(classroomsList);
      return classroomsList;
    } catch (error) {
      console.log("Error loading classrooms:", error);
      return [];
    }
  };

  // ==================== SAVE CLASSROOMS ====================
  const saveClassrooms = async (updatedClassrooms) => {
    try {
      await AsyncStorage.setItem(
        "classrooms",
        JSON.stringify(updatedClassrooms)
      );
      setClassrooms(updatedClassrooms);
    } catch (error) {
      console.log("Error saving classrooms:", error);
    }
  };

  // ==================== JOIN CLASSROOM ====================
  const joinClassroom = async (classCode, router) => {
    if (!classCode.trim()) {
      Alert.alert("Error", "Please enter a class code");
      return null;
    }

    // Check if already joined
    const alreadyJoined = classrooms.some(
      (c) =>
        c.code === classCode.toUpperCase() ||
        c.classCode === classCode.toUpperCase()
    );

    if (alreadyJoined) {
      Alert.alert("Already Joined", "You have already joined this classroom");
      return null;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Error", "Please login first");
        router.replace("/screen/login");
        return null;
      }

      const result = await joinClassroomAPI(classCode);
      const classroomData = result?.classroom || result?.data || result;
      const enrichedClassroom = normalizeClassroomData(classroomData);

      // Show notification
      await showJoinClassroomNotification(
        enrichedClassroom.name || "Classroom",
        enrichedClassroom.lecturer || "Lecturer"
      );

      const updatedClassrooms = [...classrooms, enrichedClassroom];
      await saveClassrooms(updatedClassrooms);

      return enrichedClassroom;
    } catch (error) {
      console.log("Join classroom error:", error);
      Alert.alert(
        "Error",
        typeof error === "string"
          ? error
          : error.message || "Failed to join classroom"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==================== REMOVE CLASSROOM ====================
  const removeClassroom = async (classroomToRemove) => {
    if (!classroomToRemove) return false;

    try {
      const updatedClassrooms = classrooms.filter((c) => {
        const cId = c?.id || c?.classroomId || c?.classId;
        const removeId =
          classroomToRemove?.id ||
          classroomToRemove?.classroomId ||
          classroomToRemove?.classId;
        return cId !== removeId;
      });

      await saveClassrooms(updatedClassrooms);
      return true;
    } catch (error) {
      console.log("Remove classroom error:", error);
      Alert.alert("Error", "Failed to remove classroom");
      return false;
    }
  };

  // ==================== LOGOUT ====================
  const logout = async (router) => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("classrooms");

      // Show logout notification
      await showLogoutNotification();

      router.replace("/screen/login");
      return true;
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
      return false;
    }
  };

  return {
    classrooms,
    loading,
    loadClassrooms,
    joinClassroom,
    removeClassroom,
    logout,
  };
}
