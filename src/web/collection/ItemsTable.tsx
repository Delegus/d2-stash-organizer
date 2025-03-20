import { Item as ItemType } from "../../scripts/items/types/Item";
import { useEffect, useMemo, useState } from "preact/hooks";
import { groupItems } from "../items/groupItems";
import { Pagination } from "../controls/Pagination";
import { Item } from "../items/Item";

enum SortOrder {
  Ascending = "ASC",
  Descending = "DESC",
}

export interface ItemsTableProps {
  items: ItemType[];
  pageSize: number;
  selectable: boolean;
}

export function ItemsTable({ items, pageSize, selectable }: ItemsTableProps) {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      const toolTips = document.querySelectorAll(
        'span[class="tooltip-container"]'
      );
      for (const toolTip of toolTips) {
        toolTip.addEventListener("mouseover", () => {
          const rect = toolTip.getBoundingClientRect();
          const tooltipContent = toolTip.querySelector(
            'div[role="tooltip"]'
          ) as HTMLDivElement;
          if (!tooltipContent) return;

          if (rect.top + tooltipContent.offsetHeight > window.innerHeight) {
            tooltipContent.style.bottom = "auto";
            tooltipContent.style.top = `${
              window.innerHeight - rect.top - tooltipContent.offsetHeight
            }px`;
          }
        });
      }
    }, 1000);
  });
  const [firstItem, setFirstItem] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Ascending);
  const groupedItems = useMemo(() => groupItems(items), [items]);

  const handleSortClick = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(
        sortOrder === SortOrder.Ascending
          ? SortOrder.Descending
          : SortOrder.Ascending
      );
    } else {
      setSortColumn(column);
      setSortOrder(SortOrder.Ascending);
    }
  };

  const sortedGroupedItems = useMemo(() => {
    if (!sortColumn) return groupedItems;

    const comparator = (a: ItemType[], b: ItemType[]) => {
      switch (sortColumn) {
        case "name":
          return a[0].name!.localeCompare(b[0].name!);
        case "location":
          return JSON.stringify(a[0].location).localeCompare(
            JSON.stringify(b[0].location)
          );
        default:
          return 0;
      }
    };

    return [...groupedItems].sort((a, b) =>
      sortOrder === SortOrder.Ascending ? comparator(a, b) : comparator(b, a)
    );
  }, [groupedItems, sortColumn, sortOrder]);

  useEffect(() => {
    setFirstItem(0);
  }, [items]);

  return (
    <>
      <Pagination
        nbEntries={sortedGroupedItems.length}
        pageSize={pageSize}
        currentEntry={firstItem}
        onChange={setFirstItem}
        text={(first, last) => (
          <>
            Items {first} - {last} out of {sortedGroupedItems.length}{" "}
            <span class="sidenote">(with duplicates)</span>
          </>
        )}
      />
      <table id="collection">
        <thead>
          <tr class="sidenote">
            <th>
              <span class="sr-only">Select</span>
            </th>
            <th onClick={() => handleSortClick("name")}>Item</th>
            <th>Characteristics</th>
            <th onClick={() => handleSortClick("location")}>Location</th>
          </tr>
        </thead>
        <tbody>
          {sortedGroupedItems
            .slice(firstItem, firstItem + pageSize)
            .map((items, index) => (
              <Item
                key={items[0].id ?? index}
                item={items[0]}
                duplicates={items}
                selectable={selectable}
                withLocation={true}
              />
            ))}
        </tbody>
      </table>
    </>
  );
}
