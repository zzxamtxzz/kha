import DeviceDetailPage from "./client";

async function DeviceDetail({ params }: { params: { id: string } }) {
  return (
    <div className="w-full h-screen overflow-y-auto">
      <DeviceDetailPage params={params} />
    </div>
  );
}

export default DeviceDetail;
