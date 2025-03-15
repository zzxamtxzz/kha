import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Currency from "@/models/currency";

function ChooseCurrency({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value?: string;
}) {
  const { data, loading, queryKey, lastElementRef, count, refetch } =
    useInfiniteData<Currency>({
      keys: "currencies",
      size: 20,
      params: {},
    });

  return (
    <Select
      disabled={loading}
      onValueChange={onChange}
      value={value || undefined}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data.map((currency) => (
          <SelectItem key={currency.id} value={currency.id}>
            {currency.name} ({currency.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ChooseCurrency;
