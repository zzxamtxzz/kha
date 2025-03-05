"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useHasUser } from "../contexts/user";
import axios from "@/axios";

const useGetEdit = ({
  title,
  defaultValues: d,
  employee_id,
}: {
  title: string;
  defaultValues: any;
  employee_id?: string;
}) => {
  const [defaultValues, setDefaultValues] = useState<any>(d);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");
  const { user } = useHasUser();

  useEffect(() => {
    if (!edit) return;
    const getEdit = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${title}/${edit}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        console.log("response", response.data);
        setDefaultValues(response.data);
        setEmployee(response.data.employee);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    getEdit();
  }, [edit]);

  useEffect(() => {
    if (!employee_id) return;
    const getEmployee = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${employee_id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setEmployee(response.data);
        setDefaultValues({ ...defaultValues, employee_id });
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    getEmployee();
  }, [employee_id]);

  return { defaultValues, loading, employee };
};

export default useGetEdit;
