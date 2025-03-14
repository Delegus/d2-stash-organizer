export function selectMaxItems() {
  const table = document.getElementById("collection");
  const tbody = table?.querySelector("tbody");
  const rows = tbody?.querySelectorAll(".item");

  if (!rows) {
    return;
  }

  const maxValues: Record<string, number> = {};

  const getRowCharacteristics = (
    row: Element
  ): { itemName: string; characteristicValue: number } | null => {
    const td4Content = row.querySelector("td:nth-child(4)")?.textContent;
    if (td4Content && td4Content.indexOf("Worn by") >= 0) {
      return null;
    }

    const th = row.querySelector("th");
    const td3 = row.querySelector("td:nth-child(3)");

    if (!th || !td3) {
      return null;
    }

    let itemName = th.getAttribute("aria-label")?.trim();
    if (!itemName) {
      return null;
    }

    if (td3.textContent && td3.textContent.indexOf("Ethereal") >= 0) {
      itemName += "Ethereal";
    }

    const characteristicValue =
      parseFloat(
        td3.textContent
          ?.replace(", Ethereal", "")
          .replace("% perfect", "")
          .replace("Perfect", "100")
          .trim() || "0"
      ) || 0;

    return { itemName, characteristicValue };
  };

  const processRow = (row: Element, maxValues: Record<string, number>) => {
    const { itemName, characteristicValue } = getRowCharacteristics(row) ?? {};

    if (!itemName) {
      return;
    }

    if (!maxValues[itemName]) {
      maxValues[itemName] = characteristicValue!;
    } else if (
      characteristicValue &&
      characteristicValue > maxValues[itemName]
    ) {
      maxValues[itemName] = characteristicValue!;
    }
  };

  const markCheckbox = (row: Element, maxValues: Record<string, number>) => {
    const { itemName, characteristicValue } = getRowCharacteristics(row) ?? {};

    if (!itemName) {
      return;
    }

    const checkbox = row.querySelector(
      "input[type='checkbox']"
    ) as HTMLInputElement;

    if (characteristicValue != maxValues[itemName]) {
      checkbox.checked = true;
      const event = new Event("change", { bubbles: true });
      checkbox.dispatchEvent(event);
    } else {
      delete maxValues[itemName];
    }
  };

  rows.forEach((row) => processRow(row, maxValues));
  rows.forEach((row) => markCheckbox(row, maxValues));
}
