export function selectMaxItems() {
  const table = document.getElementById("collection");
  const tbody = table?.querySelector("tbody");
  const rows = tbody?.querySelectorAll(".item");
  const maxValues: Record<string, number> = {};

  rows?.forEach((row) => {
    if (
      row.querySelector("td:nth-child(4)")?.textContent?.indexOf("Worn by") ||
      -1 >= 0
    ) {
      return;
    }
    let itemName = row.querySelector("th")?.getAttribute("aria-label")?.trim();
    if (
      row.querySelector("td:nth-child(3)")?.textContent?.indexOf("Ethereal") ||
      -1 >= 0
    ) {
      itemName += "Ethereal";
    }
    const characteristicValue = parseFloat(
      row
        .querySelector("td:nth-child(3)")
        ?.textContent?.replace(", Ethereal", "")
        .replace("% perfect", "")
        .replace("Perfect", "100")
        .trim() || ""
    );
    if (!maxValues[itemName!]) {
      maxValues[itemName!] = characteristicValue;
    } else if (characteristicValue > maxValues[itemName!]) {
      maxValues[itemName!] = characteristicValue;
    }
  });

  rows?.forEach((row) => {
    if (
      row.querySelector("td:nth-child(4)")?.textContent?.indexOf("Worn by") ||
      -1 >= 0
    ) {
      return;
    }
    const checkbox = row.querySelector(
      "input[type='checkbox']"
    ) as HTMLInputElement;
    let itemName = row.querySelector("th")?.getAttribute("aria-label")?.trim();
    if (
      row.querySelector("td:nth-child(3)")?.textContent?.indexOf("Ethereal") ||
      -1 >= 0
    ) {
      itemName += "Ethereal";
    }
    const characteristicValue = parseFloat(
      row
        .querySelector("td:nth-child(3)")
        ?.textContent?.replace("% perfect", "")
        .replace("Perfect", "100")
        .trim() || ""
    );
    console.info(
      "characteristicValue-",
      characteristicValue,
      maxValues,
      itemName!
    );
    if (characteristicValue != maxValues[itemName!]) {
      checkbox.checked = true;
      const event = new Event("change", { bubbles: true });
      checkbox.dispatchEvent(event);
    }
    if (characteristicValue === maxValues[itemName!]) {
      delete maxValues[itemName!];
    }
  });
}
