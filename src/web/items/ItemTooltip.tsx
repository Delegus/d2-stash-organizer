import { Item } from "../../scripts/items/types/Item";

import "./ItemTooltip.css";
import { colorClass } from "../collection/utils/colorClass";
import { getBase } from "../../scripts/items/getBase";
import { useState } from "preact/hooks";
import { SET_ITEMS, UniqueSetItem } from "../../game-data";
import { generateFixedMods } from "../../scripts/items/post-processing/generateFixedMods";

import { consolidateMods } from "../../scripts/items/post-processing/consolidateMods";
import { addSetMods } from "../../scripts/items/post-processing/addSetModifiers";

import { describeMods } from "../../scripts/items/post-processing/describeMods";
let UNIQUE_ID = 0;

function Range({ range }: { range?: [number, number] }) {
  if (!range) {
    return null;
  }
  return <span class="sidenote"> [{range.join(" - ")}]</span>;
}

export function ItemTooltip({
  item,
  noItem,
}: {
  item: Item;
  noItem?: UniqueSetItem;
}) {
  const [tooltipId] = useState(() => `item-tooltip-${UNIQUE_ID++}`);
  if (!noItem) {
    noItem = {} as UniqueSetItem;
  }

  if (item == null) {
    const newItem = {} as Item;
    newItem.code = noItem.code;
    newItem.name = noItem.name;
    // It's either unique or set item at this point
    newItem.quality = noItem.setModifiers ? 5 : 7;

    if (noItem.modifiers != null) {
      newItem.modifiers = generateFixedMods(noItem.modifiers);
    }
    if (noItem.baseModifiers != null) {
      newItem.modifiers = generateFixedMods(noItem.baseModifiers);
    }
    if (newItem.modifiers != null) {
      consolidateMods(newItem.modifiers);
      // Generate descriptions only after consolidating
      if (newItem.modifiers) {
        describeMods(newItem, newItem.modifiers);
      }
    }
    if (noItem.setModifiers) {
      newItem.setItemModifiers?.forEach((mods, i) => {
        describeMods(newItem, mods, ` (${i + 2} items)`);
      });

      addSetMods(newItem);

      newItem.setGlobalModifiers?.forEach((mods, i) => {
        describeMods(newItem, mods, i >= 4 ? "" : ` (${i + 2} items)`);
      });
    }
    item = newItem;
  }
  let setName = "";
  if (item.unique != null && item.quality == 5) {
    setName = SET_ITEMS[item.unique].set;
  }
  const className = colorClass(item);

  if (item.simple) {
    return <span class={className}>{item.name}</span>;
  }
  const base = getBase(item);

  const magicMods =
    item.modifiers?.map(
      ({ description, range }) =>
        description && (
          <div class="magic">
            {description}
            <Range range={range} />
          </div>
        )
    ) ?? [];
  if (item.ethereal || item.sockets) {
    const toDisplay = [
      item.ethereal && "Ethereal",
      item.sockets && `Socketed (${item.sockets})`,
    ].filter((m) => !!m);
    magicMods?.push(
      <div class="magic">
        {toDisplay.join(", ")}
        <Range range={item.socketsRange} />
      </div>
    );
  }

  const setItemMods = item.setItemModifiers?.flatMap((mods) =>
    mods.map(
      ({ description, range }) =>
        description && (
          <div class="set">
            {description} <Range range={range} />
          </div>
        )
    )
  );

  const setGlobalMods = item.setGlobalModifiers?.flatMap((mods) =>
    mods.map(
      ({ description }) =>
        description && <div class="unique">{description}</div>
    )
  );
  setGlobalMods?.unshift(<br />);

  return (
    <span class="tooltip-container">
      <span
        class={`tooltip-trigger ${className}`}
        tabIndex={0}
        aria-describedby={tooltipId}
      >
        {item.name}
      </span>
      <div id={tooltipId} class="tooltip-content" role="tooltip">
        <div class={className}>{item.name}</div>
        <div class={className}>{base?.name}</div>
        <div>Item Level: {item.level}</div>
        {"def" in base && (
          <div>
            Defense:{" "}
            <span class={item.enhancedDefense ? "magic" : ""}>
              {item.defense}
              <Range range={item.defenseRange} />
            </span>
          </div>
        )}
        {item.durability && (
          <div>
            Durability: {item.durability?.[0]} of{" "}
            {item.durability[1] + (item.extraDurability ?? 0)}
          </div>
        )}
        {/* TODO: requirements */}
        {magicMods}
        {setItemMods}
        <p>
          <b>{setName}</b>
        </p>
        {setGlobalMods}
      </div>
    </span>
  );
}
