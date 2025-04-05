import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Bus {
  bus_id: string;
  bus_number: string;
  bus_name: string;
  bus_type: string;
  total_seats: number;
  operator_name: string;
  bus_status: string;
}

interface Props {
  buses: Bus[];
  onDelete: (id: string) => void;
}

export default function BusTable({ buses, onDelete }: Props) {
  const router = useRouter();

  if (!buses || buses.length === 0) {
    return <p>No buses available.</p>;
  }

  return (
    <table className="w-full mt-4 border">
      <thead>
        <tr className="bg-gray-500 text-sm md:text-lg">
          <th className="p-2 border-r">Bus Number</th>
          <th className="p-2 border-r">Bus Name</th>
          <th className="p-2 border-r">Bus Type</th>
          <th className="p-2 border-r">Total Seats</th>
          <th className="p-2 border-r">Operator</th>
          <th className="p-2 border-r">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {buses.map((bus) => (
          <tr key={bus.bus_id} className="border-t">
            <td className="p-2 border-r">{bus.bus_number}</td>
            <td className="p-2 border-r">{bus.bus_name}</td>
            <td className="p-2 border-r">{bus.bus_type}</td>
            <td className="p-2 border-r">{bus.total_seats}</td>
            <td className="p-2 border-r">{bus.operator_name}</td>
            <td className="p-2 border-r">{bus.bus_status}</td>
            <td className="p-2 flex">
              <Button onClick={() => router.push(`/admin/buses/${bus.bus_id}`)}>Edit</Button>
              <Button onClick={() => onDelete(bus.bus_id)} className="ml-2 bg-red-500">
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
