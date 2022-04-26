import { http } from "@/utils/http";

export interface ActivityDetail {
  id: number;
  title: string;
  enter_from_json: string;
  remark: string;
}

export interface enterFromItem {
  id: number;
  type: number | undefined;
  required: boolean;
  name: string;
  options: string[] | undefined;
}

export interface ActivityInfo extends Omit<ActivityDetail, "enter_from_json"> {
  enterFromList: enterFromItem[];
}

export const getActivityDetail = async (
  custom_event_id: string
): Promise<ActivityDetail> => {
  const activityDetail: ActivityDetail =
    (await http("/api/v1/enter-apply/custom-event-detail", {
      data: { custom_event_id },
    })) || {};
  return activityDetail;
};

export const uploadFile = async (content: string): Promise<string[]> =>
  await http("/api/v4/user/material", {
    method: "POST",
    data: { "file[content]": content, wxmini: -1 },
  });

export const submitForm = async (
  custom_event_id: string,
  apply_content_json: string
) =>
  await http("/api/v1/enter-apply/custom-event-apply", {
    method: "POST",
    data: { custom_event_id, apply_content_json },
  });
