import { useEffect, useState } from "react";

export function useFashionData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}api/fashionData.json`);

        if (!response.ok) {
          throw new Error(`Fashion API failed with ${response.status}`);
        }

        const payload = await response.json();

        if (active) {
          setData(payload);
        }
      } catch (apiError) {
        if (active) {
          setError(apiError);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
