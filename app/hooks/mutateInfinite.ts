import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

type updatedDataType<T> = T & {
  queryKey: QueryKey;
  new?: true;
  remove?: true;
};

export function useMutateInfiniteData<T extends { id: string }>() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: updatedDataType<T>) => data,
    onSuccess: (data: updatedDataType<T>) => {
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
              page.filter((s) => s.id !== data.id)
            )
          : infiniteData.pages.map((page) =>
              page.map((s) =>
                s.id.toString() === data.id.toString() ? data : s
              )
            ),
      };

      if (infiniteData) queryClient.setQueryData(data.queryKey, newAttendances);
    },
  });
  const updatedData = (data: updatedDataType<T>) => mutate(data);

  return { updatedData };
}
