import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateDataType<T> = T & {
  queryKey: QueryKey;
  new?: true;
  remove?: true;
};

export function useMutateInfiniteData<T extends { _id: string }>() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: UpdateDataType<T>) => data,
    onSuccess: (data: UpdateDataType<T>) => {
      const infiniteData = queryClient.getQueryData(data.queryKey) as {
        pages: T[][];
        pageParams: number[];
      };
      console.log("new data", data);
      const newAttendances = {
        ...infiniteData,
        pages: data.new
          ? infiniteData.pages.map((page, index) =>
              index === infiniteData.pages.length - 1 ? [data, ...page] : page
            )
          : data.remove
          ? infiniteData.pages.map((page) =>
              page.filter((s) => s._id !== data._id)
            )
          : infiniteData.pages.map((page) =>
              page.map((s) =>
                s._id.toString() === data._id.toString() ? data : s
              )
            ),
      };

      if (infiniteData) queryClient.setQueryData(data.queryKey, newAttendances);
    },
  });
  const updateData = (data: UpdateDataType<T>) => mutate(data);

  return { updateData };
}
