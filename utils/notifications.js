import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission not granted");
      return false;
    }

    return true;
  } catch (error) {
    console.log("Error requesting notification permissions:", error);
    return false;
  }
};

/**
 * Schedule a local notification
 */
export const scheduleNotification = async ({ title, body, data = {} }) => {
  try {
    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) {
      console.log("No notification permission");
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Show immediately
    });

    return notificationId;
  } catch (error) {
    console.log("Error scheduling notification:", error);
    return null;
  }
};

/**
 * Show login success notification
 */
export const showLoginNotification = async (userEmail) => {
  return await scheduleNotification({
    title: "✅ Login Successful",
    body: `Welcome back! You're now logged in as ${userEmail}`,
    data: { type: "login" },
  });
};

/**
 * Show join classroom success notification
 */
export const showJoinClassroomNotification = async (className, lecturer) => {
  return await scheduleNotification({
    title: "🎓 Joined Classroom",
    body: `You've successfully joined ${className} with ${lecturer}`,
    data: { type: "join_classroom" },
  });
};

/**
 * Show logout notification
 */
export const showLogoutNotification = async () => {
  return await scheduleNotification({
    title: "👋 Logged Out",
    body: "You have been logged out successfully",
    data: { type: "logout" },
  });
};

/**
 * Show leave classroom notification
 */
export const showLeaveClassroomNotification = async (className) => {
  return await scheduleNotification({
    title: "📤 Left Classroom",
    body: `You have left ${className}`,
    data: { type: "leave_classroom" },
  });
};
