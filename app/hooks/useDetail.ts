"use client";
import pluralize from "pluralize";
import axios from "@/axios";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { useHasUser } from "../contexts/user";

let currentController: { [keys: string]: AbortController | null } = {};

const queryFn = async <T>(
  id: string | undefined,
  title: string,
  params: any,
  token: string
): Promise<T> => {
  if (currentController[title]) {
    currentController[title]?.abort();
    console.log("cancel", title);
  }
  currentController[title] = new AbortController();
  const signal = currentController[title]?.signal;
  try {
    const response = await axios.get(
      id
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${title}/${id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${title}`,
      {
        params,
        // signal,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("response from", title, response.data);
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export function useDetail<T>({
  id,
  title,
  params,
  keys = [],
}: {
  id?: string;
  title: string;
  params?: any;
  keys?: QueryKey;
}) {
  const queryKey: any[] = [`${pluralize.singular(title)}-detail`, id, ...keys];
  const { user } = useHasUser();

  const data = useQuery({
    retry: false,
    queryKey,
    queryFn: () => queryFn<T>(id, title, params, user.token!),
  });

  return { ...data, queryKey };
}
