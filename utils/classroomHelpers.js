// ==================== MOCK DATA ====================
export const MOCK_CLASSROOM_DATA = {
  section: "Class B",
  yearTerm: "Y2 T3",
  room: "409",
  day: "Friday",
  time: "8:30 - 11:30",
  code: "12345678",
};

// ==================== HELPER FUNCTIONS ====================
/**
 * Normalize classroom data from API to ensure consistent field names
 */
export const normalizeClassroomData = (classroomData) => {
  const name =
    classroomData.name ||
    classroomData.className ||
    classroomData.subject ||
    "Classroom";
  const section =
    classroomData.section || classroomData.class || MOCK_CLASSROOM_DATA.section;
  const yearTerm =
    classroomData.yearTerm ||
    classroomData.year ||
    classroomData.academicYear ||
    MOCK_CLASSROOM_DATA.yearTerm;
  const term = classroomData.term || classroomData.semester || "Semester 1";
  const lecturer =
    classroomData.lecturer ||
    classroomData.teacher ||
    classroomData.instructor ||
    "Lecturer";
  const room =
    classroomData.room || classroomData.roomNumber || MOCK_CLASSROOM_DATA.room;
  const day =
    classroomData.day ||
    classroomData.schedule ||
    classroomData.dayOfWeek ||
    MOCK_CLASSROOM_DATA.day;
  const time =
    classroomData.time ||
    classroomData.timeSlot ||
    classroomData.hours ||
    MOCK_CLASSROOM_DATA.time;
  const code =
    classroomData.code ||
    classroomData.classCode ||
    classroomData.joinCode ||
    MOCK_CLASSROOM_DATA.code;

  // Ensure consistent ID field
  const id =
    classroomData.id ||
    classroomData.classroomId ||
    classroomData.classId ||
    classroomData._id;

  return {
    ...classroomData,
    id, // Always use 'id' as the primary identifier
    name,
    section,
    yearTerm,
    term,
    lecturer,
    room,
    day,
    time,
    code,
    className: name,
    teacher: lecturer,
    schedule: day,
    timeSlot: time,
    classCode: code,
  };
};
