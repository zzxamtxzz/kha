import BillModel from "@/models/bill";
import Client from "@/models/client";
import DeviceModel from "@/models/devices";
import TrashModel from "@/models/trashes";
import UpdateModel from "@/models/updated";

export const saveUpdateData = async ({
  title,
  fromModel,
  contentId,
  userId,
  data,
}: {
  title: string;
  fromModel: string;
  contentId: string;
  userId: string;
  data: any;
}) => {
  const updated = await UpdateModel.create({
    title,
    fromModel,
    contentId,
    userId,
    data,
  });
  return updated;
};

export const saveRemoveData = async ({
  title,
  fromModel,
  contentId,
  userId,
}: {
  title: string;
  fromModel: string;
  contentId: string;
  userId: string;
}) => {
  const trash = await TrashModel.create({
    title,
    fromModel,
    contentId,
    userId,
  });

  return trash;
};
