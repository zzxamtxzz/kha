"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useHasUser } from "../contexts/user";
import axios from "@/axios";

function useGetEdit<T>({ title }: { title: string }) {
  const [defaultValues, setDefaultValues] = useState<T>();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");
  const { user } = useHasUser();

  useEffect(() => {
    console.log("edit", edit);
    if (!edit) return;
    const getEdit = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${title}/${edit}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        console.log("response from detail", response.data);
        setDefaultValues(response.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    getEdit();
  }, [edit]);

  return { defaultValues, loading };
}

export default useGetEdit;
