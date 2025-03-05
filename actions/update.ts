import BillModel from "@/models/bill";
import Client from "@/models/client";
import Device from "@/models/devices";
import TrashModel from "@/models/trashes";
import UpdateModel from "@/models/updated";

export const saveupdatedData = async ({
  title,
  fromModel,
  content_id,
  user_id,
  data,
}: {
  title: string;
  fromModel: string;
  content_id: string;
  user_id: string;
  data: any;
}) => {
  const updated = await UpdateModel.create({
    title,
    fromModel,
    content_id,
    user_id,
    data,
  });
  return updated;
};

export const saveRemoveData = async ({
  title,
  fromModel,
  content_id,
  user_id,
}: {
  title: string;
  fromModel: string;
  content_id: string;
  user_id: string;
}) => {
  const trash = await TrashModel.create({
    title,
    fromModel,
    content_id,
    user_id,
  });

  return trash;
};
