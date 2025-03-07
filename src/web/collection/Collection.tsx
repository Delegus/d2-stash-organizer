import "./Collection.css";
import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import "../controls/Controls.css";
import { Search, searchItems } from "../controls/Search";
import {
  filterItemsByQuality,
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

export function Collection() {
  const { allItems } = useContext(CollectionContext);
  const [search, setSearch] = useState("");
  const [quality, setQuality] = useState<QualityFilterValue>("all");
  const [type, setType] = useState<TypeFilterValue>("all");
  const [pageSize, setPageSize] = useState(20);

  const filteredItems = useMemo(
    () =>
      filterItemsByQuality(
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
        <div>
          <p>
            <label for="page-size-select">Items per page:</label>
          </p>
          <p>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={({ currentTarget }) =>
                setPageSize(Number(currentTarget.value))
              }
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </p>
        </div>
        <SelectAll items={filteredItems} />
      </div>

      <ItemsTable items={filteredItems} selectable={true} pageSize={pageSize} />
    </>
  );
}
