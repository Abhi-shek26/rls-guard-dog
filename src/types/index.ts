export interface School {
  id: string;
  name: string;
}

export interface Classroom {
  id: string;
  name: string;
  school_id: string;
}

export interface Student {
  id: string; // This will be the auth.users.id
  full_name: string;
  school_id: string;
}

export interface Progress {
  id: number;
  student_id: string;
  class_id: string;
  score: number;
  notes: string;
}
