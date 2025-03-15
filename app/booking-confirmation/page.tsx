"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

interface Seat {
  seat_id: number;
  schedule_id: number;
  seat_no: number;
  seat_type: string;
  price: number;
  status: string;
}

interface Schedule {
  schedule_id: number;
  bus_id: number;
  route: Route;
  departure_time: string;
  arrival_time: string;
  created_at: string;
}

interface Route {
  source: string;
  destination: string;
}

interface Booking {
  booking_id: number;
  user: User;
  seats: Seat[];
  schedule: Schedule;
  amount: number;
  payment_status: string;
  booked_at: string;
}

const TicketPage = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const booking_id = searchParams.get("booking_id");
  const ticketRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (booking_id) {
      fetchBookingDetails(booking_id as string);
    }
  }, [booking_id]);

  useEffect(() => {
    if (booking && booking?.payment_status === "success") {
      let timeLeft = 120;
      setCountdown(timeLeft);

      const timerInterval = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          router.push("/");
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [booking, router]);

  const fetchBookingDetails = async (booking_id: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${API_URL}/api/bookedticket/?booking_id=${booking_id}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("booked tickets:", data);

      if (!data.booked_at) {
        console.error("⚠️ booked_at is missing from API response!");
      }
      setBooking(data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  // Create a separate ticket for PDF download with plain HTML and inline styles
  const createPdfTicket = () => {
    if (!booking) return null;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    // Create a container div with a unique ID for the PDF
    const container = document.createElement("div");
    container.id = "pdf-ticket-container";
    container.style.width = "600px";
    container.style.padding = "0";
    container.style.margin = "0";
    container.style.backgroundColor = "#ffffff";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "#333333";
    container.style.border = "1px solid #dddddd";
    container.style.borderRadius = "8px";
    container.style.overflow = "hidden";
    container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

    // Header
    const header = document.createElement("div");
    header.style.backgroundColor = "#2563eb"; // Solid color instead of gradient
    header.style.color = "#ffffff";
    header.style.padding = "20px";

    const headerContent = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0; font-size: 24px; font-weight: bold;">SengarBus</h2>
          <p style="margin: 4px 0 0; font-size: 14px; color: #e6f0ff;">E-Ticket Confirmation</p>
        </div>
        <div style="background-color: #ffffff; color: #2563eb; border-radius: 50%; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
    `;

    header.innerHTML = headerContent;
    container.appendChild(header);

    // Booking Info
    const bookingInfo = document.createElement("div");
    bookingInfo.style.padding = "16px 20px";
    bookingInfo.style.borderBottom = "1px solid #dddddd";
    bookingInfo.style.backgroundColor = "#f9fafb";

    const bookingInfoContent = `
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;">
        <div style="margin-bottom: 8px; min-width: 120px;">
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Booking Reference</div>
          <div style="font-size: 18px; font-weight: bold; color: #1f2937;">#${
            booking.booking_id
          }</div>
        </div>
        <div style="margin-bottom: 8px; min-width: 120px;">
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Status</div>
          <div style="display: inline-block; padding: 4px 0; font-size: 14px; font-weight: 600; border-radius: 9999px;  color: #166534;">
            ${booking.payment_status}
          </div>
        </div>
        <div style="min-width: 120px;">
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Booked On</div>
          <div style="font-size: 14px; color: #1f2937;">${new Date(
            booking.booked_at
          ).toLocaleDateString()}</div>
        </div>
      </div>
    `;

    bookingInfo.innerHTML = bookingInfoContent;
    container.appendChild(bookingInfo);

    // Passenger Details
    const passengerDetails = document.createElement("div");
    passengerDetails.style.padding = "20px";
    passengerDetails.style.borderBottom = "1px solid #dddddd";

    const passengerDetailsContent = `
      <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-top: 0; margin-bottom: 16px;">Passenger Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Name</div>
          <div style="color: #1f2937;">${booking.user.firstname} ${booking.user.lastname}</div>
        </div>
        <div>
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Contact</div>
          <div style="color: #1f2937;">${booking.user.phone}</div>
        </div>
        <div style="grid-column: span 2;">
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Email</div>
          <div style="color: #1f2937;">${booking.user.email}</div>
        </div>
      </div>
    `;

    passengerDetails.innerHTML = passengerDetailsContent;
    container.appendChild(passengerDetails);

    // Journey Details
    const journeyDetails = document.createElement("div");
    journeyDetails.style.padding = "20px";
    journeyDetails.style.borderBottom = "1px solid #dddddd";

    const journeyDetailsContent = `
      <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-top: 0; margin-bottom: 16px;">Journey Details</h3>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Departure</div>
          <div style="color: #1f2937; font-weight: 500;">${
            booking.schedule.route.source
          }</div>
          <div style="color: #1f2937; font-weight: 500;">${formatDate(
            booking.schedule.departure_time
          )}</div>
        </div>
        <div style="text-align: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        <div>
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Arrival</div>
          <div style="color: #1f2937; font-weight: 500;">${
            booking.schedule.route.destination
          }</div>
          <div style="color: #1f2937; font-weight: 500;">${formatDate(
            booking.schedule.arrival_time
          )}</div>
        </div>
      </div>
    `;

    journeyDetails.innerHTML = journeyDetailsContent;
    container.appendChild(journeyDetails);

    // Seat Details
    const seatDetails = document.createElement("div");
    seatDetails.style.padding = "20px";
    seatDetails.style.borderBottom = "1px solid #dddddd";

    let seatGrid = `
      <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-top: 0; margin-bottom: 16px;">Seat Details</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    `;

    booking.seats.forEach((seat) => {
      seatGrid += `
        <div style="background-color: #eff6ff; border-radius: 8px; padding: 12px; border: 1px solid #dbeafe;">
          <div style="font-size: 12px; text-transform: uppercase; color: #2563eb; font-weight: 600;">Seat ${seat.seat_no}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span style="color: #1f2937;">${seat.seat_type}</span>
            <span style="font-weight: bold; color: #111827;">₹${seat.price}</span>
          </div>
        </div>
      `;
    });

    seatGrid += "</div>";
    seatDetails.innerHTML = seatGrid;
    container.appendChild(seatDetails);

    // Payment Details
    const paymentDetails = document.createElement("div");
    paymentDetails.style.padding = "20px";
    paymentDetails.style.backgroundColor = "#f9fafb";

    const paymentDetailsContent = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Total Amount</div>
          <div style="font-size: 24px; font-weight: bold; color: #1f2937;">₹${booking.amount}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Payment Status</div>
          <div style="color: #059669; font-weight: 500;">${booking.payment_status}</div>
        </div>
      </div>
    `;

    paymentDetails.innerHTML = paymentDetailsContent;
    container.appendChild(paymentDetails);

    // Footer
    const footer = document.createElement("div");
    footer.style.backgroundColor = "#f3f4f6";
    footer.style.padding = "16px 20px";
    footer.style.textAlign = "center";

    const footerContent = `
      <p style="color: #4b5563; font-size: 14px; margin: 0 0 4px 0;">Thank you for choosing SengarBus! We wish you a safe and comfortable journey.</p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">Have questions? Contact our support at support@sengarbus.com</p>
    `;

    footer.innerHTML = footerContent;
    container.appendChild(footer);

    return container;
  };

  const downloadPDF = async () => {
    setIsDownloading(true);

    try {
      // Create our PDF-ready ticket with plain HTML/CSS
      const pdfTicket = createPdfTicket();
      if (!pdfTicket) return;

      // Temporarily add to document
      document.body.appendChild(pdfTicket);

      const canvas = await html2canvas(pdfTicket, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Remove the temporary element
      document.body.removeChild(pdfTicket);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit nicely on the page with margins
      const margin = 15; // mm
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      // Center the image on the page
      const xPosition = margin;
      const yPosition = (pageHeight - imageHeight) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        xPosition,
        yPosition,
        imageWidth,
        imageHeight
      );

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text(
        "Generated on " + new Date().toLocaleString(),
        margin,
        pageHeight - 10
      );

      pdf.save(`SengarBus-Ticket-${booking?.booking_id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    console.log("Received dateString:", dateString); // ✅ Debugging log
  
    if (!dateString) return "N/A"; // Handle missing values
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }
  
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // ✅ Convert to IST
    }).format(date);
  };
  
  if (!booking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div>
        {booking.payment_status === "success" && countdown !== null && (
          <p className="text-lg mb-4 text-neutral-300">
            Redirecting to homepage in {countdown} seconds...
          </p>
        )}
      </div>
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div
          ref={ticketRef}
          className="ticket-container bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200"
        >
          {/* Ticket Header - Using basic background-color instead of gradient for PDF compatibility */}
          <div className="bg-blue-600 text-white py-6 px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">SengarBus</h2>
                <p className="text-blue-100 mt-1">E-Ticket Confirmation</p>
              </div>
              <div className="bg-white text-blue-800 rounded-full p-3 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap justify-between items-center">
              <div className="mb-2 md:mb-0">
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Booking Reference
                </div>
                <div className="text-xl font-bold text-gray-800">
                  #{booking.booking_id}
                </div>
              </div>
              <div className="mb-2 md:mb-0">
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Status
                </div>
                <div className="inline-block py-1 text-sm font-semibold rounded-ful text-green-800">
                  {booking.payment_status}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Booked On
                </div>
                <div className="text-sm text-gray-800">
                  {new Date(booking.booked_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Passenger Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Name
                </div>
                <div className="text-gray-800">
                  {booking.user.firstname} {booking.user.lastname}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Contact
                </div>
                <div className="text-gray-800">{booking.user.phone}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Email
                </div>
                <div className="text-gray-800">{booking.user.email}</div>
              </div>
            </div>
          </div>

          {/* Journey Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Journey Details
            </h3>
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div className="mb-4 md:mb-0">
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Departure
                </div>
                <div className="text-gray-800 font-medium">
                  {booking.schedule.route.source}
                </div>
                <div className="text-gray-800 font-medium">
                  {formatDateTime(booking.schedule.departure_time)}
                </div>
              </div>
              <div className="hidden md:block self-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Arrival
                </div>
                <div className="text-gray-800 font-medium">
                  {booking.schedule.route.destination}
                </div>
                <div className="text-gray-800 font-medium">
                  {formatDateTime(booking.schedule.arrival_time)}
                </div>
              </div>
            </div>
          </div>

          {/* Seat Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Seat Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {booking.seats.map((seat) => (
                <div
                  key={seat.seat_id}
                  className="bg-blue-50 rounded-lg p-3 border border-blue-100"
                >
                  <div className="text-xs uppercase text-blue-700 font-semibold">
                    Seat {seat.seat_no}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-800">{seat.seat_type}</span>
                    <span className="font-bold text-gray-900">
                      ₹{seat.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Total Amount
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  ₹{booking.amount}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase text-gray-500 font-semibold">
                  Payment Status
                </div>
                <div className="text-green-600 font-medium">
                  {booking.payment_status}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-6 py-4 text-center">
            <p className="text-gray-600 text-sm">
              Thank you for choosing SengarBus! We wish you a safe and
              comfortable journey.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Have questions? Contact our support at support@sengarbus.com
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={downloadPDF}
        disabled={isDownloading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm flex items-center"
      >
        {isDownloading ? (
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Download Ticket as PDF
          </>
        )}
      </Button>
    </div>
  );
};

export default TicketPage;
