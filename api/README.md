# API Documentation

## Classroom API Fields

### Expected API Response Structure

The API should return classroom data with the following fields:

```json
{
  "classroom": {
    // Required fields
    "id": "string - Unique classroom identifier",
    "name": "string - Classroom/subject name (e.g., 'Mobile Development')",
    "year": "string - Academic year (e.g., '2024/2025')",
    "term": "string - Semester/term (e.g., 'Semester 1', 'Term 2')",
    "lecturer": "string - Lecturer/teacher name (e.g., 'Ms.Voneat')",
    "room": "string - Room number (e.g., '409')",
    "day": "string - Day of week (e.g., 'Friday')",
    "time": "string - Time slot (e.g., '8:30 - 11:30')",
    "section": "string - Section/class identifier (e.g., 'Y2 T3')",
    "code": "string - Join code (e.g., '3V6P6N')",

    // Optional fields
    "students": [
      {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    ]
  }
}
```

### Alternative Field Names (Supported for Compatibility)

The app will automatically normalize these alternative field names:

| Primary Field | Alternative Names       |
| ------------- | ----------------------- |
| `name`        | `className`, `subject`  |
| `lecturer`    | `teacher`, `instructor` |
| `room`        | `roomNumber`            |
| `day`         | `schedule`, `dayOfWeek` |
| `time`        | `timeSlot`, `hours`     |
| `section`     | `class`                 |
| `code`        | `classCode`, `joinCode` |
| `year`        | `academicYear`          |
| `term`        | `semester`              |

### API Endpoints

#### 1. Join Classroom

```
POST /classrooms/join
```

**Request:**

```json
{
  "classCode": "3V6P6N"
}
```

**Response:**

```json
{
  "classroom": {
    "id": "abc123",
    "name": "Mobile Development",
    "year": "2024/2025",
    "term": "Semester 1",
    "lecturer": "Ms.Voneat",
    "room": "409",
    "day": "Friday",
    "time": "8:30 - 11:30",
    "section": "Y2 T3",
    "code": "3V6P6N"
  }
}
```

#### 2. Get Classroom Details

```
GET /classrooms/:classroomId/details
```

**Response:**

```json
{
  "classroom": {
    "id": "abc123",
    "name": "Mobile Development",
    "year": "2024/2025",
    "term": "Semester 1",
    "lecturer": "Ms.Voneat",
    "room": "409",
    "day": "Friday",
    "time": "8:30 - 11:30",
    "section": "Y2 T3",
    "code": "3V6P6N",
    "students": [
      {
        "id": "1",
        "name": "Alice Johnson",
        "email": "alice.j@student.edu"
      }
    ]
  }
}
```

#### 3. Get Classroom Assignments

```
GET /classrooms/:classroomId/assignments
```

**Response:**

```json
{
  "assignments": [
    {
      "id": "1",
      "title": "Assignment 1: Introduction to Programming",
      "dueDate": "Nov 20, 2025",
      "points": 100,
      "status": "assigned"
    }
  ]
}
```

#### 4. Get Classroom Materials

```
GET /classrooms/:classroomId/materials
```

**Response:**

```json
{
  "materials": [
    {
      "id": "1",
      "title": "Course Syllabus",
      "type": "pdf"
    }
  ]
}
```

## Data Normalization

The app automatically normalizes all API responses to ensure consistent data structure:

### In `home.jsx`

- Function: `normalizeClassroomData()`
- Used when: Joining a classroom
- Ensures all classroom cards display correctly

### In `classroom.jsx`

- Function: `normalizeClassroomData()`
- Used when: Loading classroom details
- Ensures classroom page displays all information

### Mock Data Fallback

If the API doesn't provide certain fields, the app will use mock data:

```javascript
{
  section: "Y2 T3",
  room: "409",
  day: "Friday",
  time: "8:30 - 11:30",
  code: "12345678"
}
```

## Backend Implementation Checklist

To ensure the app works correctly, make sure your API returns:

- ✅ **Classroom name** - Name of the subject/class
- ✅ **Year** - Academic year (e.g., "2024/2025")
- ✅ **Term** - Semester or term (e.g., "Semester 1")
- ✅ **Lecturer** - Teacher's name
- ✅ **Room** - Room number or location
- ✅ **Day** - Day of the week class meets
- ✅ **Time** - Time slot for the class
- ✅ **Section** - Section or class identifier
- ✅ **Code** - Join code for the classroom
- ✅ **Students** - Array of enrolled students (optional)

## Testing

You can test the API normalization with these sample responses:

### Minimal Response (will be enriched with mock data)

```json
{
  "classroom": {
    "id": "abc123",
    "name": "Mobile Development",
    "lecturer": "Ms.Voneat"
  }
}
```

### Full Response (all fields provided)

```json
{
  "classroom": {
    "id": "abc123",
    "name": "Mobile Development",
    "year": "2024/2025",
    "term": "Semester 1",
    "lecturer": "Ms.Voneat",
    "room": "409",
    "day": "Friday",
    "time": "8:30 - 11:30",
    "section": "Y2 T3",
    "code": "3V6P6N",
    "students": [...]
  }
}
```

Both will work correctly in the app!
