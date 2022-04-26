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
  tips: string;
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
