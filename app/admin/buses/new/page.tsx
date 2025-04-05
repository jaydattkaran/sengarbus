"use client";

import { useState } from "react";
import { addBus } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewBusPage() {
  const [busData, setBusData] = useState({ bus_number: "", bus_name: "", total_seats: 40 });
  const router = useRouter();

  const handleChange = (e: any) => {
    setBusData({ ...busData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await addBus(busData);
    router.push("/admin/buses");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-2xl font-bold">Add New Bus</h1>
      <input name="bus_number" onChange={handleChange} required placeholder="Bus Number" />
      <input name="bus_name" onChange={handleChange} required placeholder="Bus Name" />
      <Button type="submit">Add Bus</Button>
    </form>
  );
}
