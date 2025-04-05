"use client";
import React from "react";
import { useUser, SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BusFront } from "lucide-react";

interface Seat {
  seat_no: number;
  seat_type: string;
  status: "Booked" | "Available";
  price: number;
}

interface Bus {
  source: string;
  destination: string;
  departure_time: string | number | Date;
  bus_name: string;
  bus_type: string;
  arrival_time: string | number | Date;
  schedule_id: string;
  name: string;
  available_seats: Seat[];
  boarding_points: Stop[];
  dropping_points: Stop[];
}
interface Stop {
  type: "boarding" | "dropping";
  location_name: string;
  time: string;
}

const Page = () => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [busDetails, setBusDetails] = useState<Bus | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<Stop | null>(null);
  const [selectedDropping, setSelectedDropping] = useState<Stop | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });
  const serviceCharge: number = 20;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      const fetchBusDetails = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const token = await getToken();
          const response = await fetch(`${API_URL}/api/ticket`, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Now Clerk will recognize the user
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          //  console.log("bus data from backend:", data);

          if (data.userData) {
            setFormData({
              name: `${data.userData.firstname} ${data.userData.lastname}`,
              email: data.userData.email || "",
              phone: data.userData.phone.replace(/^\+91\s*/, ""), // Remove "+91 ",
              age: data.userData.age || "",
              gender: data.userData.gender || "",
            });
            setSelectedGender(data.userData.gender || "");
          }

          if (response.ok) {
            setBusDetails(data.bus);
          } else {
            console.log("Failed to fetch bus details.");
          }
        } catch (error) {
          console.error("Error fetching bus details:", error);
        }
      };

      fetchBusDetails();
    }
  }, [isSignedIn]);

  const toggleSeatSelection = (seat: Seat) => {
    if (seat.status === "Booked") return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.seat_no === seat.seat_no);
      if (isSelected) {
        return prev.filter((s) => s.seat_no !== seat.seat_no);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handlePaymentAndBooking = async (
    e: React.FormEvent,
    scheduleId: string
  ) => {
    e.preventDefault();
    // console.log("🚀 Schedule ID received in function:", scheduleId);

    if (
      !selectedGender ||
      !formData.age.trim() ||
      !formData.email.trim() ||
      !formData.name.trim() ||
      !formData.phone.trim()
    ) {
      alert("Please fill all fields before submitting.");
      return;
    }

    if (!busDetails) {
      alert("Check the details correctly");
      return;
    }
    setIsProcessing(true);
    try {
      const totalAmount =
        selectedSeats.reduce((sum, seat) => sum + seat.price, 0) +
        serviceCharge;

      const formattedPhone = formData.phone.startsWith("+")
        ? formData.phone
        : "+91 " + formData.phone;

      const [firstName, ...lastNameParts] = formData.name.trim().split(" ");
      const lastName = lastNameParts.join(" ") || "";

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/api/bookticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          schedule_id: scheduleId,
          seat_id: selectedSeats,
          firstname: firstName,
          lastname: lastName,
          email: formData.email,
          phone: formattedPhone,
          age: formData.age,
          gender: formData.gender,
          amount: totalAmount,
        }),
      });

      const bookingData = await response.json();
      // console.log("booking data:", bookingData);

      if (!response.ok || !bookingData?.booking_id) {
        throw new Error(
          bookingData?.message || "Booking failed. Please try again."
        );
      }

      // 🔹 Redirect to booking confirmation
      router.push(`/booking-confirmation?booking_id=${bookingData.booking_id}`);
    } catch (error) {
      console.log("Error initiating payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main>
      {!isSignedIn ? (
        <SignInButton mode="modal" />
      ) : (
        <div>
          {busDetails ? (
            <section className=" md:px-6 py-4 gap-2 border-b">
              <div className="border rounded flex flex-col gap-6 py-2 px-4 ">
                <div className="flex flex-col md:flex-row gap-6">
                  <div>
                    <h2>{busDetails.name}</h2>
                    {/* Boarding Points */}
                    <h3>Boarding Points</h3>
                    {busDetails.boarding_points.length > 0 ? (
                      <ul>
                        {busDetails.boarding_points.map(
                          (point: Stop, index: number) => (
                            <li
                              className="flex gap-1 mt-1 items-center"
                              key={index}
                              onClick={() => setSelectedBoarding(point)}
                              style={{
                                cursor: "pointer",
                                fontWeight:
                                  selectedBoarding?.location_name ===
                                  point.location_name
                                    ? "bold"
                                    : "normal",
                                color:
                                  selectedBoarding?.location_name ===
                                  point.location_name
                                    ? "#f5f5f5"
                                    : "#a3a3a3",
                              }}
                            >
                              <BusFront className="w-4 h-4" />
                              <div>
                                {point.location_name} - {point.time.slice(0, 5)}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>You will be notified for boarding.</p>
                    )}
                  </div>
                  <div>
                    {/* Dropping Points */}
                    {/* Dropping Points Selection */}
                    <h3>Dropping Points</h3>
                    {busDetails.dropping_points.length > 0 ? (
                      <ul>
                        {busDetails.dropping_points.map(
                          (point: Stop, index: number) => (
                            <li
                              className="flex gap-1 mt-1 items-center"
                              key={index}
                              onClick={() => setSelectedDropping(point)}
                              style={{
                                cursor: "pointer",
                                fontWeight:
                                  selectedDropping?.location_name ===
                                  point.location_name
                                    ? "bold"
                                    : "normal",
                                color:
                                  selectedDropping?.location_name ===
                                  point.location_name
                                    ? "#f5f5f5"
                                    : "#a3a3a3",
                              }}
                            >
                              <BusFront className="w-4 h-4" />{" "}
                              <div>
                                {point.location_name} - {point.time.slice(0, 5)}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>You will be notified for dropping.</p>
                    )}
                  </div>
                </div>
                <div className="px-4 py-4 rounded border shadow-lg  mx-auto">
                  {/* Seat Legend */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <div>Booked</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 bg-[#28A745] rounded"></div>
                      <div>Available</div>
                    </div>
                  </div>

                  {/* Seat Layout */}
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-4 p-2">
                    {busDetails?.available_seats &&
                    busDetails.available_seats.length > 0 ? ( // ✅ Ensure seats exist
                      busDetails.available_seats.map((seat: Seat) => (
                        <button
                          key={seat.seat_no}
                          className={`w-[4rem] h-[3.5rem] flex flex-col items-center justify-center text-sm font-semibold border-2 rounded-lg 
          ${
            seat.status === "Booked"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : selectedSeats.some((s) => s.seat_no === seat.seat_no)
              ? "bg-blue-500 text-white"
              : "bg-[#28A745] text-white hover:bg-green-600"
          }`}
                          disabled={seat.status === "Booked"} // ✅ Prevents clicking on booked seats
                          onClick={() =>
                            seat.status !== "Booked" &&
                            toggleSeatSelection(seat)
                          }
                        >
                          <span className="font-bold">{seat.seat_no}</span>
                          <span className="text-xs">{seat.seat_type}</span>
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center w-full">
                        Fetching seats...
                      </p> // ✅ Temporary message instead of 'No seats available'
                    )}
                  </div>

                  {/* Display Selected Seat & Price */}
                  <div className="flex justify-between mt-6 p-2 border-t">
                    <div>
                      Seats Selected:{" "}
                      <span className="text-xl font-semibold">
                        {selectedSeats.length > 0
                          ? selectedSeats.map((seat) => seat.seat_no).join(", ")
                          : "None"}
                      </span>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">
                        ₹{" "}
                        {selectedSeats.reduce(
                          (sum, seat) => sum + seat.price,
                          0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <p>Loading route details....</p>
          )}
          {busDetails ? (
            <section className="flex flex-col items-center justify-center py-4">
              <div className="flex flex-col gap-2 w-full">
                <div className="text-2xl font-semibold">
                  Review your booking
                </div>
                <div className="text-xl font-medium">
                  {" "}
                  <span className="font-semibold mr-1">
                    {busDetails.source} - {busDetails.destination}{" "}
                  </span>{" "}
                  |{" "}
                  {new Date(busDetails.departure_time).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="md:w-[60%]">
                    <div className="border rounded px-4 pt-2 pb-6">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xl font-semibold">
                            {busDetails.bus_name}
                          </div>
                          <div className="text-sm">{busDetails.bus_type}</div>
                          <div className="my-2">
                            Seat selected{" "}
                            <span className="text-xl font-semibold">
                              {selectedSeats.length > 0
                                ? selectedSeats
                                    .map((seat) => seat.seat_no)
                                    .join(", ")
                                : "None"}
                            </span>
                          </div>
                        </div>
                        <div className="text-[#0077B6]">
                          Cancellation Policy
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                        <div className="border px-2 py-2 rounded flex flex-col gap-1">
                          <div className="text-xl">Boarding Point</div>
                          <div className="bg-[#0077B6] text-white px-2 rounded  text-sm">
                            {selectedBoarding
                              ? `${selectedBoarding.time.slice(0, 5)} `
                              : "None"}{" "}
                            {new Date(
                              busDetails.departure_time
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-lg mt-2">
                            {selectedBoarding
                              ? `${selectedBoarding.location_name}`
                              : "None"}
                          </div>
                        </div>
                        <div className="border px-2 py-2 rounded flex flex-col gap-1">
                          <div className="text-xl">Dropping Point</div>
                          <div className="bg-[#0077B6] text-white px-2 rounded text-sm">
                            {selectedDropping
                              ? `${selectedDropping.time.slice(0, 5)} `
                              : "None"}{" "}
                            {new Date(
                              busDetails.arrival_time
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-lg mt-2">
                            {selectedDropping
                              ? `${selectedDropping.location_name} `
                              : "None"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded md:w-[40%] flex flex-col gap-2 px-4 py-2">
                    <div className="text-2xl font-semibold">Price Details</div>
                    <div className="border-b py-1">
                      <div>
                        Base Fare :{" "}
                        <span className="text-xl mx-2 font-semibold">
                          ₹{" "}
                          {selectedSeats.reduce(
                            (sum, seat) => sum + seat.price,
                            0
                          )}
                        </span>
                      </div>
                      <div>
                        GST & Exlcusive tax :{" "}
                        <span className="text-xl mx-2 font-semibold">₹ 20</span>
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      Total :{" "}
                      <span className="text-xl mx-2 font-semibold">
                        ₹{" "}
                        {selectedSeats.reduce(
                          (sum, seat) => sum + seat.price,
                          0
                        ) + serviceCharge}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border rounded p-4 mt-4">
                  <div className="text-2xl">Passenger Details</div>
                  <div className="flex flex-col md:flex-row md:gap-10 gap-4 mt-4">
                    <div>
                      <div className="mx-1">Full Name</div>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="h-10 mt-2 "
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <div className="mx-1">Age</div>
                      <Input
                        className="h-10 mt-2"
                        placeholder="Age"
                        type="text"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                      />
                    </div>
                    <div className="mx-1">
                      <div>Gender</div>
                      <div className="flex gap-2 mt-2">
                        {["Male", "Female"].map((gender) => (
                          <Button
                            key={gender}
                            variant={
                              selectedGender === gender
                                ? "destructive"
                                : "secondary"
                            }
                            onClick={() => {
                              setSelectedGender(gender);
                              setFormData((prev) => ({ ...prev, gender }));
                            }}
                            className={`px-4 py-2 rounded-md transition-all ${
                              selectedGender === gender ? "" : "border"
                            }`}
                          >
                            {gender}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border rounded p-4 mt-4">
                  <div className="text-2xl">Contact Details</div>
                  <div className="flex flex-col md:flex-row md:gap-10 gap-4 mt-4">
                    <div>
                      <div className="mx-1">Email</div>
                      <Input
                        className="h-10 mt-2 "
                        placeholder="Enter your email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <div className="mx-1">Mobile Number</div>
                      <Input
                        className="h-10 mt-2 "
                        placeholder="Enter your number"
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={(e) =>
                    handlePaymentAndBooking(e, busDetails.schedule_id)
                  }
                  disabled={isProcessing}
                  className="w-full text-xl bg-[#FF6F00] hover:bg-[#FF6F00] text-white cursor-pointer font-semibold h-12 mt-4"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment ₹{" "}
                      {selectedSeats.reduce(
                        (sum, seat) => sum + seat.price,
                        0
                      ) + serviceCharge}
                    </>
                  )}
                </Button>
              </div>
            </section>
          ) : (
            <p>Loading ticket details....</p>
          )}
        </div>
      )}
    </main>
  );
};

export default Page;
