import { useEffect, useState } from "react";

export function useCatalogData() {
  const [catalogData, setCatalogData] = useState(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadCatalogData() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}api/catalogData.json`);

        if (!response.ok) {
          throw new Error(`Catalog API failed with ${response.status}`);
        }

        const payload = await response.json();

        if (active) {
          setCatalogData(payload);
        }
      } catch (error) {
        if (active) {
          setCatalogError(error);
        }
      } finally {
        if (active) {
          setCatalogLoading(false);
        }
      }
    }

    loadCatalogData();

    return () => {
      active = false;
    };
  }, []);

  return { catalogData, catalogLoading, catalogError };
}
