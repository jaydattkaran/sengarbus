import { fetchBusById } from "@/utils/api";

export default async function BusDetails(bus_id: string ) {
  try {
    const bus = await fetchBusById(bus_id);
    

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Bus Details</h1>
        <p>Bus Number: {bus.bus_number}</p>
        <p>Bus Name: {bus.bus_name}</p>
        <p>Bus Type: {bus.bus_type}</p>
        <p>Total Seats: {bus.total_seats}</p>
        <p>Operator: {bus.operator_name}</p>
        <p>Status: {bus.bus_status}</p>
      </div>
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return <p className="text-red-500">Bus not found.</p>;
  }
}
