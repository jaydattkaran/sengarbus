"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

// Define TypeScript interfaces for API response
interface Booking {
  bookingId: number;
  userId: number;
  travelDate: string;
  paymentStatus: string;
  busDetails: {
    busId: number;
    name: string;
    type: string;
  };
  routeDetails: {
    routeId: number;
    startLocation: string;
    endLocation: string;
  };
  seatDetails: { seatNumber: string; seatType: string }[];
}

const Page = () => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isSignedIn) {
      const fetchBookingHistory = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const token = await getToken();
          const response = await fetch(`${API_URL}/api/booking-history`, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Now Clerk will recognize the user
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          // console.log("API Response:", data); // Debugging: Print the entire response

          setUsername(data.firstName);
          setBookingHistory(data.bookingHistory || []);
        } catch (error) {
          console.log("Unable to fetch bookings", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBookingHistory();
    }
  }, [isSignedIn]);

  return (
    <div>
      {loading ? (
        <div className="py-6 text-lg">Fetching your booking history...</div>
      ) : (
        <div>
          <div className="text-center py-4">
            <div className="text-xl md:text-3xl font-semibold">
              Hello {username}!
            </div>
            <div className="text-lg md:text-xl">
              Here is all your bookings...
            </div>
          </div>
          <ul className="space-y-4 w-[90vw]">
            {bookingHistory.map((booking) => (
              <li
                key={booking.bookingId}
                className="shadow-md rounded p-4 border"
              >
                <h2 className="text-lg font-semibold mb-2">
                  Booking ID: {booking.bookingId}
                </h2>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <p className="text-sm md:text-lg">
                    Status:{" "}
                    <span
                      className={
                        booking.paymentStatus === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {booking.paymentStatus === "success"
                        ? "Success"
                        : "Pending Payment"}
                    </span>
                  </p>
                  <p className="text-sm md:text-lg">
                    Travel Date: {booking.travelDate}
                  </p>
                  <p className="text-sm md:text-lg">
                    Route: {booking.routeDetails.startLocation} →{" "}
                    {booking.routeDetails.endLocation}
                  </p>
                  <p className="text-sm md:text-lg">
                    Bus: {booking.busDetails.name} ({booking.busDetails.type})
                  </p>
                  <p className="text-sm md:text-lg">
                    Seats:{" "}
                    {booking.seatDetails.map((seat, index) => (
                      <span key={index} className="mr-2">
                        {seat.seatNumber}{" "}
                        <span className="text-neutral-500 dark:text-neutral-400">
                          ({seat.seatType})
                        </span>
                        {index !== booking.seatDetails.length - 1 && ", "}{" "}
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Page;
