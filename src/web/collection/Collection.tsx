import "./Collection.css";
import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import "../controls/Controls.css";
import { Search, searchItems } from "../controls/Search";
import {
  FilterItemsByQuality,
  QualityFilter,
  QualityFilterValue,
} from "../controls/QualityFilter";
import {
  filterItemsByType,
  TypeFilter,
  TypeFilterValue,
} from "../controls/TypeFilter";
import { ItemsTable } from "./ItemsTable";
import { SelectAll } from "../controls/SelectAll";
import { SettingsContext } from "../settings/SettingsContext";

export function Collection() {
  const { allItems } = useContext(CollectionContext);
  const [search, setSearch] = useState("");
  const [quality, setQuality] = useState<QualityFilterValue>("all");
  const [type, setType] = useState<TypeFilterValue>("all");
  const { pageSize } = useContext(SettingsContext);

  const filteredItems = useMemo(
    () =>
      FilterItemsByQuality(
        searchItems(
          filterItemsByType(searchItems(allItems, search), type),
          search
        ),
        quality
      ),
    [allItems, search, quality, type]
  );

  return (
    <>
      <div class="controls">
        <Search value={search} onChange={setSearch}>
          Search for an item:
        </Search>
        <QualityFilter value={quality} onChange={setQuality} />
        <TypeFilter value={type} onChange={setType} />
        <SelectAll items={filteredItems} />
      </div>

      <ItemsTable items={filteredItems} selectable={true} pageSize={pageSize} />
    </>
  );
}
