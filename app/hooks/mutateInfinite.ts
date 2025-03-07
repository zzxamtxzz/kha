import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutateInfiniteData<
  T extends { id: string; queryKey: QueryKey; new?: true; remove?: true },
>() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: T) => data,
    onSuccess: (data: T) => {
      const existData = queryClient.getQueryData(data.queryKey) as {
        pages: { total: number; data: T[] }[];
        pageParams: number[];
      };
      console.log("new data", data);
      const newAttendances = {
        ...existData,
        pages: data.new
          ? existData.pages.map((page, index) =>
              index === existData.pages.length - 1
                ? { total: page.total + 1, data: [data, ...page.data] }
                : page
            )
          : data.remove
            ? existData.pages.map((page) => ({
                total: page.total - 1,
                data: page.data.filter((s) => s.id !== data.id),
              }))
            : existData.pages.map((page) => ({
                ...page,
                data: page.data.map((s) => (s.id === data.id ? data : s)),
              })),
      };

      if (existData) queryClient.setQueryData(data.queryKey, newAttendances);
    },
  });

  const updateData = (data: T) => mutate(data);

  return { updateData };
}
