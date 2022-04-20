import { http } from "@/utils/http";

export interface CourseAuthor {
  id: string;
  author_name: string;
  head_img: string;
  created_at: string;
}

export interface CourseInfo {
  id: number;
  title: string;
  author_id: string;
  cover_img: string;
  media_url: string;
  duration: string;
  is_try: number;
  try_time: string;
  password: string;
  introduction: string;
  sort: number;
  tags: string[];
  author: CourseAuthor;
  created_at: string;
  updated_at: string;
}

export const getCourseList = async (page: number): Promise<CourseInfo[]> => {
  const courseList: CourseInfo[] =
    (await http("/api/v1/class-room/list", {
      data: { page, page_size: 10 },
    })) || {};
  return courseList || [];
};
