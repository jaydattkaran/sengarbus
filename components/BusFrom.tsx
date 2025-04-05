import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Bus {
  bus_number: string;
  bus_name: string;
  bus_type: string;
  total_seats: number;
  operator_name: string;
}

interface Props {
  initialData?: Bus;
  onSubmit: (busData: Bus) => void;
}

export default function BusForm({ initialData, onSubmit }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<Bus>({
    bus_number: "",
    bus_name: "",
    bus_type: "",
    total_seats: 0,
    operator_name: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <input name="bus_number" placeholder="Bus Number" value={formData.bus_number} onChange={handleChange} required />
      <input name="bus_name" placeholder="Bus Name" value={formData.bus_name} onChange={handleChange} required />
      <input name="bus_type" placeholder="Bus Type" value={formData.bus_type} onChange={handleChange} required />
      <input name="total_seats" type="number" placeholder="Total Seats" value={formData.total_seats} onChange={handleChange} required />
      <input name="operator_name" placeholder="Operator Name" value={formData.operator_name} onChange={handleChange} required />
      <button type="submit" className="bg-blue-500 text-white p-2">Save Bus</button>
    </form>
  );
}
