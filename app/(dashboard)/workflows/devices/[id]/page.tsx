import DeviceDetailClient from "./client";

function DeviceDetail({ params }: { params: { id: string } }) {
  return <DeviceDetailClient id={params.id} />;
}

export default DeviceDetail;
