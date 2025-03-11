import { Item } from "../../scripts/items/types/Item";
import { TYPES_MAP } from "../../scripts/grail/list/uniquesOrder";

const keys = Object.keys(TYPES_MAP);

export type TypeFilterValue = typeof keys[number];

export interface TypeFilterProps {
  value: string;
  onChange: (value: TypeFilterValue) => void;
}

const options = Object.entries(TYPES_MAP).map(([key, value]) => (
  <option key={key} value={key}>
    {value}
  </option>
));
export function TypeFilter({ value, onChange }: TypeFilterProps) {
  return (
    <div>
      <p>
        <label for="type-select">Filter by type:</label>
      </p>
      <p>
        <select
          id="type-select"
          value={value}
          onChange={({ currentTarget }) => onChange(currentTarget.value)}
        >
          {options}
          <option value="all">All</option>
        </select>
      </p>
    </div>
  );
}
export function filterItemsByType(items: Item[], type: TypeFilterValue) {
  if (type === "all") {
    return items;
  }

  return items.filter((item) => {
    return type.includes(item.itemType!);
  });
}
