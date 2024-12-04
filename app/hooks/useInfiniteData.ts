import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "@/axios";
import { useCallback, useRef } from "react";
import { useHasUser } from "../contexts/user";

let currentController: { [keys: string]: AbortController | null } = {};

const queryFn = async <T>(params: any, keys: string): Promise<T[]> => {
  if (currentController[keys]) {
    currentController[keys]?.abort();
    console.log("cancel", keys);
  }

  currentController[keys] = new AbortController();
  const signal = currentController[keys]?.signal;

  const response = await axios.get(`/api/${keys}`, {
    params,
    signal,
  });

  return response.data;
};

export function useInfiniteData<T>({
  keys,
  size,
  params,
  initialPageParam = 0,
}: {
  keys: string;
  size: number;
  params: any;
  initialPageParam?: number;
}) {
  const { user } = useHasUser();
  const countQueryKey = [keys, "count", ...Object.values(params)];

  const { data: count, refetch: refetchCount } = useQuery({
    retry: false,
    queryKey: countQueryKey,
    queryFn: async () => {
      const response = await axios.get(`/api/${keys}/count`, {
        params,
      });

      return response.data;
    },
  });

  const queryKey: any[] = [keys, ...Object.values(params), user.role];

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    retry: false,
    queryKey,
    queryFn: ({ pageParam }) =>
      queryFn<T>({ ...params, page: pageParam, size }, keys),
    initialPageParam: initialPageParam + 1,
    //@ts-ignore
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = allPages.reduce(
        (total, page) => total + page.length,
        0
      );
      const nextPage = totalItems < count ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    //@ts-ignore
    mutationFn: async (count) => count,
    onSuccess: (count: number) => {
      const infiniteData: number | undefined =
        queryClient.getQueryData(countQueryKey);
      console.log("initial data", data, infiniteData, countQueryKey);
      if (infiniteData) {
        queryClient.setQueryData(countQueryKey, infiniteData + count);
      }
    },
  });

  const changeCount = (count: any) => mutate(count);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: Element | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [observer, data]
  );

  return {
    data: data ? data.pages.flat() : [],
    loading: isLoading,
    lastElementRef,
    fetchNextPage,
    hasNextPage,
    queryKey,
    changeCount,
    isFetchingNextPage,
    params,
    originalData: data,
    count,
    refetch: () => {
      refetchCount();
      refetch();
    },
  };
}
