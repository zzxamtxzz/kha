import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Branch from "@/models/branch";
import RadioGroupSkeleton from "./components/radio-group-skeleton";

function ChooseBranch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { data, loading, queryKey, count, lastElementRef } =
    useInfiniteData<Branch>({
      keys: "branches",
      size: 20,
      params: {},
    });

  if (loading) return <RadioGroupSkeleton count={3} />;

  return (
    <RadioGroup
      onValueChange={onChange}
      defaultValue={value}
      className="flex flex-col space-y-1 px-4"
    >
      {data.map((branch, index) => {
        return (
          <FormItem
            key={index}
            className="flex items-center space-x-3 space-y-0"
          >
            <FormControl>
              <RadioGroupItem value={branch.id} />
            </FormControl>
            <FormLabel className="font-normal">{branch.name}</FormLabel>
          </FormItem>
        );
      })}
    </RadioGroup>
  );
}

export default ChooseBranch;
