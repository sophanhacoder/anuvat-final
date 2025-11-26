import client from "./client";

export const joinClassroom = async (classCode) => {
  try {
    const response = await client.post("/classrooms/join", { classCode });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || "Failed to join classroom";
  }
};

export const getClassroomDetails = async (classroomId) => {
  try {
    const response = await client.get(`/classrooms/${classroomId}/details`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || error.message || "Failed to get classroom details"
    );
  }
};

export const getClassroomMaterials = async (classroomId) => {
  try {
    const response = await client.get(`/classrooms/${classroomId}/materials`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || "Failed to get materials";
  }
};
