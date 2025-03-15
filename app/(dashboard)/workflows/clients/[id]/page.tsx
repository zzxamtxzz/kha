"use client";
import { useDetail } from "@/app/hooks/useDetail";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import Client from "@/models/client";
import { useParams, useRouter } from "next/navigation";
import { CustomerDetail } from "./design";

function ClientDetail() {
  const { id } = useParams();
  const { data, isLoading } = useDetail<Client>({
    id: id as string,
    title: "clients",
  });
  if (isLoading) return <SpinLoading />;
  if (!data) return <ShowNoText>No data found</ShowNoText>;

  const router = useRouter();

  return <CustomerDetail onClose={() => router.back()} data={data} />;
}

export default ClientDetail;
