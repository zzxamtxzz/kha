import { Skeleton } from "../ui/skeleton";

const getRandomWidth = (possibleWidths: number[]) => {
  const randomIndex = Math.floor(Math.random() * possibleWidths.length);
  return possibleWidths[randomIndex];
};

const possibleWidths = [110, 130, 150, 210, 120];

function ProfileLoading({ ref }: { ref?: any }) {
  return (
    <div className="mb-2 rounded-lg w-full h-20" ref={ref}>
      <div className="py-4 flex items-center justify-between px-2">
        <div className="max-w-[250px] w-auto text-md cursor-pointer items-center">
          <div className="flex">
            <Skeleton className="min-w-[56px] min-h-[56px] rounded-full mr-1" />
            <div className="p-2">
              <Skeleton
                className="w-40 h-[10px] rounded-xl mb-2"
                style={{ width: `${getRandomWidth(possibleWidths)}px` }}
              />
              <Skeleton className={`w-20 h-[10px] rounded-xl`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileLoading;
