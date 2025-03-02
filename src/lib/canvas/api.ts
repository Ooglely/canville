import axios from "axios";

type UserInfo = {
  id: number;
  name: string;
};

type CourseInfo = {
  id: number;
  name: string;
};

type AssignmentInfo = {
  id: number;
  name: string;
  points_possible: number;
  due_at: string;
};

type GradedAssignment = {
  id: number;
  name: string;
  points_possible: number;
  due_at: string;
  grade: number | null | undefined;
};

type CompleteCourse = {
  id: number;
  name: string;
  assignments: UserAssignments;
};

type UserAssignments = {
  due: GradedAssignment[];
  to_do: AssignmentInfo[];
};

export type UserData = {
  id: number;
  name: string;
  courses: CompleteCourse[];
};

export class CanvasApi {
  private access_token: string;

  constructor(access_token: string) {
    //
    this.access_token = access_token;
    if (!this.access_token) {
      throw new Error("Access token is required");
    }
    try {
      this.getUserInfo();
    } catch (error) {
      throw new Error("Access token is invalid");
    }
  }

  async getUserInfo(): Promise<UserInfo> {
    const response = await axios.get("https://umsystem.instructure.com/api/v1/users/self", {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      return {
        id: data.id,
        name: data.name,
      };
    } else {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }
  }

  async getUserCourses(): Promise<CourseInfo[]> {
    const response = await axios.get("https://umsystem.instructure.com/api/v1/courses?enrollment_state=active&enrollment_type=student", {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      return data.map((course: any) => ({
        id: course.id,
        name: course.name,
      }));
    } else {
      throw new Error(`Failed to fetch user courses: ${response.status}`);
    }
  }

  async getClassAssignments(course: CourseInfo): Promise<AssignmentInfo[]> {
    const response = await axios.get(`https://umsystem.instructure.com/api/v1/courses/${course.id}/assignments`, {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      return data.map((assignment: any) => ({
        id: assignment.id,
        name: assignment.name,
        points_possible: assignment.points_possible,
        due_at: assignment.due_at,
      }));
    } else {
      throw new Error(`Failed to fetch class assignments: ${response.status}`);
    }
  }

  async getCourseSubmissions(course: CourseInfo): Promise<any[]> {
    const response = await axios.get(`https://umsystem.instructure.com/api/v1/courses/${course.id}/students/submissions`, {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      return data.map((submission: any) => submission);
    } else {
      throw new Error(`Failed to fetch user submissions: ${response.status}`);
    }
  }

  async getAssignmentSubmissions(course: CourseInfo, assignment: AssignmentInfo): Promise<any[]> {
    const response = await axios.get(`https://umsystem.instructure.com/api/v1/courses/${course.id}/students/submissions?assignment_ids=${assignment.id}`, {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      return data.map((submission: any) => submission);
    } else {
      throw new Error(`Failed to fetch assignment submissions: ${response.status}`);
    }
  }

  async getUserData(): Promise<UserData> {
    const user = await this.getUserInfo();
    const courses = await this.getUserCourses();
    var course_list: CompleteCourse[] = [];
    for (const course of courses) {
      let due_list = [];
      let to_do_list = [];
      const assignments = await this.getClassAssignments(course);
      const due_assignments = assignments.filter((assignment) => assignment.due_at && new Date(assignment.due_at) < new Date() && assignment.points_possible > 0);
      const to_do_assignments = assignments.filter((assignment) => assignment.due_at && new Date(assignment.due_at) > new Date() && assignment.points_possible > 0);

      for (const assignment of due_assignments) {
        var assignment_data: GradedAssignment = {
          id: assignment.id,
          name: assignment.name,
          due_at: assignment.due_at,
          points_possible: assignment.points_possible,
          grade: null,
        };
        const assignment_submissions = await this.getAssignmentSubmissions(course, assignment);
        for (const submission of assignment_submissions) {
          const submission_assignment = assignments.find((assignment) => assignment.id === submission.assignment_id);
          if (!submission_assignment) continue;
          assignment_data.grade = submission.score;
          console.log(submission_assignment.name, submission.score);
        }
        due_list.push(assignment_data);
      }

      to_do_list = to_do_assignments.map((assignment) => {
        var assignment_data: AssignmentInfo = {
          id: assignment.id,
          name: assignment.name,
          due_at: assignment.due_at,
          points_possible: assignment.points_possible,
        };
        return assignment_data;
      });

      if (due_list.length != 0 || to_do_list.length != 0) {
        course_list.push({
          id: course.id,
          name: course.name,
          assignments: {
            due: due_list,
            to_do: to_do_list,
          },
        });
      }
    }
    return {
      id: user.id,
      name: user.name,
      courses: course_list,
    };
  }
}
