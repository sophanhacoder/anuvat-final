import client from "./client";

export const getClassroomAssignments = async (classroomId, type = null) => {
  try {
    let url = `/classrooms/${classroomId}/assignments`;
    if (type === "submission") {
      url += "?type=submission";
    }
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || "Failed to get assignments";
  }
};

export const getPracticeAssignments = async (classroomId) => {
  return getClassroomAssignments(classroomId);
};

export const getSubmissionAssignments = async (classroomId) => {
  return getClassroomAssignments(classroomId, "submission");
};
