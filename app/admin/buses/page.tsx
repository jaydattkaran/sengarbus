"use client";

import { useEffect, useState } from "react";
import { fetchBuses, deleteBus } from "@/utils/api";
import { useRouter } from "next/navigation";
import BusTable from "@/components/BusTable";
import { Button } from "@/components/ui/button";

export default function BusList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const data = await fetchBuses();
      setBuses(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this bus?")) {
      await deleteBus(id);
      loadBuses();
    }
  };

  return (
    <div className="md:w-full w-[100vw] md:p-6 p-4">
      <h1 className="text-2xl pb-2 font-bold">Bus Management</h1>
      <Button onClick={() => router.push("/admin/buses/new")}>
        Add New Bus
      </Button>

      {loading ? (
        <p>Loading buses...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <BusTable buses={buses} onDelete={handleDelete} />
      )}
    </div>
  );
}
