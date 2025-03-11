import "./Settings.css";
import { useContext } from "preact/hooks";
import { SettingsContext } from "./SettingsContext";

export function Settings() {
  const {
    accessibleFont,
    toggleAccessibleFont,
    excludeAccessories,
    toggleExcludeAccessories,
    pageSize,
    togglePageSize,
  } = useContext(SettingsContext);

  return (
    <>
      <p>
        <label>
          <input
            type="checkbox"
            name="font"
            checked={!accessibleFont}
            onChange={toggleAccessibleFont}
          />{" "}
          Use Diablo font
        </label>
      </p>
      <p>
        <label>
          <input
            type="checkbox"
            name="exclude"
            checked={!excludeAccessories}
            onChange={toggleExcludeAccessories}
          />{" "}
          Exclude accessories from duplicates
        </label>
      </p>
      <p>
        <label for="page-size-select">Items per page:</label>
      </p>
      <p>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={({ currentTarget }) =>
            togglePageSize(Number(currentTarget.value))
          }
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={500}>500</option>
        </select>
      </p>
      <p class="sidenote">More settings to come...</p>
    </>
  );
}
