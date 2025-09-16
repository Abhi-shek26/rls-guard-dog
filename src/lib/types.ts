export interface ProgressRecord {
  progress_id: number;
  student_name: string;
  classroom_name: string;
  score: number;
  notes: string | null;
}

export interface StudentProgress {
  classrooms: any;
  id: number;
  score: number;
  notes: string | null;
  // Add other fields from your student-specific view if necessary
}

export interface Classroom {
  id: string;
  name: string;
}
