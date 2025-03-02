"use client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "@/axios";
import { useCallback, useRef } from "react";

let currentController: { [keys: string]: AbortController | null } = {};

const queryFn = async <T>(
  params: any,
  keys: string
): Promise<{ data: T[]; total: number }> => {
  if (currentController[keys]) {
    currentController[keys]?.abort();
    console.log("cancel", keys);
  }
  currentController[keys] = new AbortController();
  const signal = currentController[keys]?.signal;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${keys}`,
    {
      params,
      signal,
      // headers: { Authorization: `Bearer ${token}` },
    }
  );

  console.log("response", response.data);
  return { total: response.data.total, data: response.data.data };
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
  const countQueryKey = [keys, "count", ...Object.values(params)];

  const queryKey: any[] = [keys, ...Object.values(params)];

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
      queryFn<T>({ page: pageParam, size, ...params }, keys),
    initialPageParam: initialPageParam + 1,
    //@ts-ignore
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = allPages.reduce(
        (total, page) => total + (page.data?.length || 0),
        0
      );
      const nextPage =
        totalItems < lastPage.total ? allPages.length + 1 : undefined;
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
    data: data?.pages.map((page) => page.data).flat() || [],
    loading: isLoading,
    lastElementRef,
    fetchNextPage,
    hasNextPage,
    queryKey,
    changeCount,
    count: data?.pages[0]?.total,
    isFetchingNextPage,
    params,
    originalData: data,
    refetch,
  };
}
