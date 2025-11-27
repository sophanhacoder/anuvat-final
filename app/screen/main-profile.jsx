import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActionSheetIOS,
  Platform,
  TextInput,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "../../contexts/ThemeContext";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import { showLogoutNotification } from "../../utils/notifications";

// ==================== MAIN COMPONENT ====================
export default function MainProfile() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("Steve Job");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [classroomCount, setClassroomCount] = useState(0);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  });

  // ==================== LIFECYCLE HOOKS ====================
  useEffect(() => {
    loadProfileData();
    loadClassroomCount();
  }, []);

  // Reload profile data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
      loadClassroomCount();
    }, [])
  );

  // ==================== LOAD PROFILE DATA ====================
  const loadProfileData = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("profileImage");
      const savedName = await AsyncStorage.getItem("userName");
      
      if (savedImage) setProfileImage(savedImage);
      if (savedName) setUserName(savedName);
    } catch (error) {
      console.log("Error loading profile data:", error);
    }
  };

  const loadClassroomCount = async () => {
    try {
      const classrooms = await AsyncStorage.getItem("classrooms");
      if (classrooms) {
        const parsed = JSON.parse(classrooms);
        setClassroomCount(parsed.length);
      }
    } catch (error) {
      console.log("Error loading classroom count:", error);
    }
  };

  // ==================== IMAGE PICKER ====================
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return {
      camera: cameraPermission.status === 'granted',
      media: mediaPermission.status === 'granted',
    };
  };

  const pickImageFromCamera = async () => {
    const permissions = await requestPermissions();
    
    if (!permissions.camera) {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem("profileImage", imageUri);
    }
  };

  const pickImageFromLibrary = async () => {
    const permissions = await requestPermissions();
    
    if (!permissions.media) {
      Alert.alert(
        "Permission Required",
        "Photo library permission is required to select photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem("profileImage", imageUri);
    }
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImageFromCamera();
          } else if (buttonIndex === 2) {
            pickImageFromLibrary();
          }
        }
      );
    } else {
      Alert.alert(
        'Profile Picture',
        'Choose an option',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Take Photo',
            onPress: pickImageFromCamera,
          },
          {
            text: 'Choose from Library',
            onPress: pickImageFromLibrary,
          },
        ],
        { cancelable: true }
      );
    }
  };

  // ==================== NAME EDITING ====================
  const startEditingName = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const saveName = async () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      await AsyncStorage.setItem("userName", tempName.trim());
      setIsEditingName(false);
    } else {
      Alert.alert("Error", "Name cannot be empty");
    }
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setTempName("");
  };

  // ==================== LOGOUT ====================
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("classrooms");
      await showLogoutNotification();
      setLogoutModalVisible(false);
      router.replace("/screen/login");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header with Gradient Background */}
        <View style={[styles.profileHeader, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.gradientOverlay}>
            {/* Profile Picture */}
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={showImagePickerOptions}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={64} color="#fff" />
                </View>
              )}
              {/* Camera Icon Overlay */}
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={18} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Name */}
            {isEditingName ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={[styles.nameInput, { 
                    color: theme.text, 
                    borderColor: '#0068F0',
                    backgroundColor: theme.cardBackground 
                  }]}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  placeholder="Enter your name"
                  placeholderTextColor={theme.textSecondary}
                />
                <View style={styles.nameEditButtons}>
                  <TouchableOpacity
                    style={[styles.nameEditButton, styles.cancelButton, { backgroundColor: theme.border }]}
                    onPress={cancelEditingName}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nameEditButton, styles.saveButton]}
                    onPress={saveName}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.nameContainer}
                onPress={startEditingName}
                activeOpacity={0.7}
              >
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {userName}
                </Text>
                <View style={styles.editIconBadge}>
                  <Ionicons name="pencil" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            )}

            {/* Stats Card */}
            <View style={[styles.statsCard, { backgroundColor: theme.background }]}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="school" size={24} color="#0068F0" />
                </View>
                <View style={styles.statContent}>
                  <Text style={[styles.statNumber, { color: theme.text }]}>{classroomCount}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Classes Joined</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PREFERENCES</Text>
          
          <View style={[styles.settingsCard, { backgroundColor: theme.cardBackground }]}>
            {/* Appearance */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { 
                  backgroundColor: isDarkMode ? '#1E3A8A' : '#FEF3C7' 
                }]}>
                  <Ionicons 
                    name={isDarkMode ? "moon" : "sunny"} 
                    size={22} 
                    color={isDarkMode ? '#60A5FA' : '#F59E0B'} 
                  />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: theme.text }]}>
                    Appearance
                  </Text>
                  <Text style={[styles.settingSubtext, { color: theme.textSecondary }]}>
                    {isDarkMode ? 'Dark' : 'Light'} mode
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleSwitch,
                  isDarkMode && styles.toggleSwitchActive,
                ]}
                onPress={toggleTheme}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    isDarkMode && styles.toggleCircleActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Section - Separate Card */}
          <View style={styles.logoutSection}>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: theme.cardBackground }]}
              onPress={() => setLogoutModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.logoutIconContainer}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              </View>
              <Text style={styles.logoutText}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View style={[styles.navBar, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/screen/home")}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Ionicons name="person" size={24} color="#0068F0" />
          <Text style={[styles.navText, { color: '#0068F0' }]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        iconName="log-out-outline"
        iconColor="#DC2626"
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },
  gradientOverlay: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0068F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0068F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  profileName: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "NunitoSans_700Bold",
  },
  editIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0068F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameEditContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 24,
  },
  nameInput: {
    width: '100%',
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "NunitoSans_700Bold",
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 16,
  },
  nameEditButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  nameEditButton: {
    flex: 1,
    maxWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: "NunitoSans_600SemiBold",
  },
  saveButton: {
    backgroundColor: '#0068F0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: "NunitoSans_600SemiBold",
  },
  statsCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: "NunitoSans_700Bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "NunitoSans_400Regular",
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: "NunitoSans_700Bold",
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: "NunitoSans_600SemiBold",
    marginBottom: 2,
  },
  settingSubtext: {
    fontSize: 13,
    fontFamily: "NunitoSans_400Regular",
  },
  toggleSwitch: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1D5DB',
    padding: 3,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#0068F0',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  logoutSection: {
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: "NunitoSans_600SemiBold",
    color: '#EF4444',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: "NunitoSans_600SemiBold",
  },
});
