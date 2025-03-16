"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Users } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface Bus {
  isFullyBooked: string;
  available_seats: number[];
  schedule_id: number;
  bus_id: number;
  route_id: number;
  bus_name: string;
  bus_type: string;
  capacity: number;
  departure_time: string;
  arrival_time: string;
  price: number;
  source: string;
  destination: string;
  distance_km: number;
  totalAvailableSeats?: number;
  lowestPrice?: number;
  boarding_points: BoardingPoint[]; // ✅ Add this
  dropping_points: DroppingPoint[];
}
interface BoardingPoint {
  stop_type: string;
  location_name: string;
  time: string;
}
interface DroppingPoint {
  stop_type: string;
  location_name: string;
  time: string;
}
interface Seat {
  seat_no: number;
  seat_type: string;
  status: "Booked" | "Available";
  price: number;
}

const Page = () => {
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();
  // console.log("Query params:", searchParams.toString());
  const router = useRouter();

  const [source] = useState(searchParams.get("source") || "");
  const [destination] = useState(searchParams.get("destination") || "");
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  // const initialDateString = searchParams.get("date");
  // console.log("Initial date string:", initialDateString);
  const initialDate = searchParams.get("date")
    ? new Date(searchParams.get("date") as string)
    : null;

  // console.log("Parsed date:", initialDate);
  const [travelDate] = useState<Date | null>(initialDate);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }); // "Mar 4"
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // "21:00"
  };

  const formattedBuses = buses.map((bus) => ({
    ...bus,
    formattedDeparture: formatDate(bus.departure_time),
    formattedArrival: formatDate(bus.arrival_time),
  }));

  useEffect(() => {
    if (!source || !destination || !travelDate) return;

    // const formattedDate = format(travelDate, "yyyy-MM-dd");
    // const query = new URLSearchParams({
    //   source,
    //   destination,
    //   date: formattedDate,
    // }).toString();

    const fetchBuses = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_URL}/api/search-buses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            source,
            destination,
            travelDate: travelDate
              ? travelDate.toISOString().split("T")[0]
              : null,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch buses");

        const data = await response.json(); //function example<T>(data: T) { }
        console.log("Available buses:", data);

        const busesWithSeatCount =
          data.buses?.map((bus: Bus) => {
            // Ensure available_seats is an array of objects, not just numbers
            const seats = (bus.available_seats as unknown as Seat[]) || [];

            return {
              ...bus,
              totalAvailableSeats: seats.filter(
                (seat) => seat.status === "Available"
              ).length,
              lowestPrice:
                seats.length > 0
                  ? Math.min(...seats.map((seat) => +seat.price))
                  : null,
            };
          }) || [];

        setBuses(busesWithSeatCount);
      } catch (error) {
        console.log("Error fetching buses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [source, destination, travelDate]);

  if (loading) return <p>Loading buses...</p>;

  const handleSelectBus = async (bus: Bus) => {
    if (bus.isFullyBooked) {
      alert("This bus is fully booked.");
      return; // Stop execution, don't proceed
    }

    try {
      if (!isSignedIn) {
        alert("Please sign in to continue booking.");
        return;
      }
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/api/buses/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bus }),
      });

      const data = await response.json();
      console.log("API Response:", response.status, data);

      if (!response.ok) {
        alert(
          `Bus not selected. Server response: ${
            data.message || "Unknown error"
          }`
        );
      } else {
        console.log("bus details for booking", data);
        router.push(`/ticket?busId=${bus.bus_id}&routeId=${bus.route_id}`);
      }
    } catch (error) {
      console.log("Error selecting bus:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // const handleUpdateSearch = async () => {
  //   if (!source || !destination || !travelDate) return;

  //   const formattedDate = format(travelDate, "yyyy-MM-dd");
  //   const newQuery = new URLSearchParams({
  //     source,
  //     destination,
  //     date: formattedDate,
  //   }).toString();
  //   router.push(`/buses?${newQuery}`);

  //   try {
  //     const response = await fetch(`/api/search-buses?${newQuery}`);
  //     if(!response.ok) throw new Error("Failed to fetch buses");

  //     const data = await response.json();
  //     setBuses(data);
  //   } catch(error) {
  //     console.log("Error fetching buses:", error);
  //   }
  // };

  // useEffect(() => {
  //   console.log("Loaded values:", { source, destination, travelDate });
  // }, [source, destination, travelDate]);

  return (
    <main>
      <section className="py-4">
        <div className="p-2">
          <section className="py-4 md:mx-4">
            <div>
              <h1 className="text-xl px-2">
                Buses from {source} to {destination} on{" "}
                {formattedBuses[0]?.formattedDeparture}
              </h1>
              {/* for mobile */}
              <ul className="py-2 mt-4 px-1 flex flex-col gap-4 md:hidden block">
                {Array.isArray(buses) && buses.length > 0 ? (
                  buses.map((bus) => (
                    <li
                      key={bus.schedule_id}
                      onClick={() => handleSelectBus(bus)}
                      className="cursor-pointer"
                    >
                      <div className="w-[95vw] rounded glass-box border grid md:grid-cols-3 md:gap-1 gap-2 p-1 py-2">
                        <div className="px-2 flex md:flex-col flex-row justify-between items-center md:gap-4 gap-20">
                          <div>
                            <div className="text-xl font-semibold">
                              {bus.bus_name}
                            </div>
                            <div className="text-neutral-400 text-sm">
                              {bus.bus_type}
                            </div>
                          </div>
                          <div>4.0/5</div>
                        </div>
                        <div className="flex justify-between pb-2">
                          <div>
                            <div className="flex justify-between gap-2 px-2">
                              <div>
                                <div className="text-xl font-semibold">
                                  {formatTime(bus.departure_time)}
                                </div>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                <div className="text-neutral-300">
                                  - {bus.distance_km} km -
                                </div>
                              </div>
                              <div>
                                <div className="text-xl font-semibold">
                                  {formatTime(bus.arrival_time)}
                                </div>
                              </div>
                            </div>
                            <div className="px-2 text-sm text-gray-400 flex gap-1">
                              <Users className="w-4 h-4" />{" "}
                              <div className="items-center">
                                {bus.totalAvailableSeats} Seats
                              </div>
                            </div>
                          </div>
                          <div className="flex md:flex-col justify-between items-end gap-2 pr-2 md:px-0 px-2">
                            <div>
                              <div className="text-xl font-semibold">
                                {bus.lowestPrice !== null && (
                                  <div className="text-xl font-semibold">
                                    ₹ {bus.lowestPrice}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No buses available</p>
                )}
              </ul>
            </div>
            {/* for desktop */}
            <div>
              <ul className="py-2 mt-4 px-1 flex flex-col gap-4 hidden md:block">
                {Array.isArray(buses) && buses.length > 0 ? (
                  buses.map((bus) => (
                    <li key={bus.schedule_id}>
                      <div className="w-full mt-4 rounded glass-box border flex justify-between gap-2 px-2 py-4">
                        <div className="flex flex-col justify-between gap-4">
                          <div>
                            <div className="text-xl font-semibold">
                              {bus.bus_name}
                            </div>
                            <div className="text-neutral-400 text-sm">
                              {bus.bus_type}
                            </div>
                          </div>
                          <div>4.0/5</div>
                        </div>
                        <div className="flex justify-between gap-2 min-w-[18vw]">
                          <div>
                            <div className="text-sm">
                              {formatDate(bus.departure_time)}
                            </div>
                            <div className="text-xl font-semibold">
                              {formatTime(bus.departure_time)}
                            </div>
                            <div className="text-sm w-[7rem]">
                              {bus.boarding_points?.length > 0 ? (
                                <p>{bus.boarding_points[0].location_name}</p>
                              ) : (
                                <p>Not available</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-center pr-4">
                            <div className="text-neutral-300">
                              {bus.distance_km} km
                            </div>
                            <div className="relative flex items-center">
                              <div className="w-[5rem] h-1 bg-neutral-400 relative">
                                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                                <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm">
                              {formatDate(bus.arrival_time)}
                            </div>
                            <div className="text-xl font-semibold">
                              {formatTime(bus.arrival_time)}
                            </div>
                            <div className="text-sm w-[7rem]">
                              {bus.dropping_points?.length > 0 ? (
                                <p>{bus.dropping_points[0].location_name}</p>
                              ) : (
                                <p>Not available</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex md:flex-col  justify-between items-end gap-2">
                          <div>
                            {bus.lowestPrice !== null && (
                              <div className="text-xl font-semibold">
                                ₹ {bus.lowestPrice}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-neutral-400 text-sm">
                              {bus.totalAvailableSeats} Seats
                            </div>

                            <Button
                              onClick={() => handleSelectBus(bus)}
                              className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]"
                            >
                              Select Seat
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No buses available</p>
                )}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Page;
