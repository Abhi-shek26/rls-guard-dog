export interface ProgressRecord {
  progress_id: number;
  student_name: string;
  classroom_name: string;
  score: number;
  notes: string | null;
}

export interface StudentProgress {
  classrooms: {
    name: string;
  } | null;
  id: number;
  score: number;
  notes: string | null;
}

export interface Classroom {
  id: string;
  name: string;
}
