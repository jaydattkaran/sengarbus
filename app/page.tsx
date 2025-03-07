"use client";
// import * as React from "react"
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { routes } from "@/components/data/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePickerDemo from "@/components/ui/datepicker";
import Link from "next/link";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("general");
  // const [date, setDate] = React.useState<Date | undefined>(undefined)

  // const setToday = () => setDate(new Date());

  // const setTomorrow = () => {
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   setDate(tomorrow);
  //   console.log(tomorrow)
  // };
  // React.useEffect(() => {
  //   console.log("Updated Date:", date);
  // }, [date]);
  

  const categories = [
    { id: "general", label: "General" },
    { id: "ticket", label: "Ticket-related" },
    { id: "payment", label: "Payment" },
    { id: "cancellation", label: "Cancellation & Refund" },
  ];

  return (
    <main>
      <section className="md:px-6 py-2">
        <div className="text-2xl font-semibold pb-8 md:px-0">Book your bus now...</div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 text-lg">From</div>
              <Input  placeholder="Enter Boarding location" className="uppercase"/>
            </div>
            <div>
              <div className="mb-2 text-lg">To</div>
              <Input  placeholder="Enter destination" className="uppercase"/>
            </div>
            <div>
              <div className="mb-2 text-lg">Travel Date</div>
                <DatePickerDemo/>
              {/* <div className="border rounded-lg py-2 px-4">
              </div> */}
            </div>
            <Link href="/buses" className="flex justify-center">
              <Button className="md:w-[25vw] mt-2 w-[85vw] bg-[#FF6F00] hover:bg-[#FF6F00] hover:text-neutral-300 text-white font-semibold text-xl cursor-pointer">
                Search Bus
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-2 md:border-l py-2 px-4 md:mt-0 mt-4">
            <div className="h-[10rem] border rounded-xl"></div>
            <div className="px-2 pt-2 text-xl uppercase">Trending Offers</div>
            <div className="px-2 flex  gap-4">
              <div className="h-[7rem] w-[12rem] border rounded-lg"></div>
              <div className="h-[7rem] w-[12rem] border rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="md:px-6 py-10 ">
        <div>
          <h1 className="py-6 md:text-3xl text-2xl font-semibold md:px-0 px-2">Popular Bus Routes</h1>
          {/* <div key={route.id}>{route.title}</div> */}
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 md:px-0 px-2">
            {routes.map((route) => (
              <div
                key={route.id}
                className="border rounded-lg cursor-pointer glass-box px-2 py-2 flex flex-row gap-4 items-center"
              >
                <img src={route.image} alt="img" className="w-8 h-8" />
                <div>
                  <div className="md:text-lg font-semibold">{route.title}</div>
                  <div className="md:text-md text-sm">{route.to}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="md:px-6 py-10">
        <div className="md:text-2xl text-xl font-semibold py-2">
          SengarBus – Hassle-Free Online Booking for Sengar Travels
        </div>
        <div className="md:text-[1.1rem] text-md">
          SengarBus is the official online booking platform for Sengar Travels,
          designed to make bus ticket reservations effortless. Say goodbye to
          manual bookings and enjoy a seamless digital experience. Whether
          you're commuting daily or planning a long trip, SengarBus offers a
          quick and secure way to book your tickets. With just a few clicks, you
          can check seat availability, compare routes, select your preferred
          seat, and make payments using multiple secure options like UPI,
          debit/credit cards, and net banking. Our platform ensures a smooth and
          reliable booking process, so you can focus on your journey while we
          handle the rest. Book your next trip with SengarBus – fast, reliable,
          and built for your convenience!
        </div>
      </section>
      <section className="px-0 md:px-6">
        <div className="md:px-2 md:text-2xl text-xl font-semibold py-4">
          Frequently Asked Questions (FAQs)
        </div>

        {/* Category Selection */}
        <div className="py-2 flex flex-row md:gap-6 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`cursor-pointer text-sm font-semibold transition-all md:px-3 px-2 py-1 rounded-sm ${
                selectedCategory === category.id
                  ? "bg-neutral-800"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </div>
          ))}
        </div>

        {/* Accordions */}
        <div className="mt-4 md:px-4 px-2 lg:w-[50vw]">
          {selectedCategory === "general" && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>What is SengarBus?</AccordionTrigger>
                <AccordionContent>
                  SengarBus is the official online booking platform for Sengar
                  Travels, offering a seamless way to book bus tickets, choose
                  seats, and make secure payments online.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How do I book a bus ticket on SengarBus?
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5">
                    <li>Enter your source, destination, and travel date.</li>
                    <li>
                      Browse available buses and select your preferred one.
                    </li>
                    <li>
                      Choose your seat, boarding point, and drop-off location.
                    </li>
                    <li>
                      Complete the payment using UPI, debit/credit cards, or net
                      banking.
                    </li>
                    <li>Receive your e-ticket instantly via SMS or email.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Can I track my bus in real time?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! SengarBus offers live bus tracking, allowing you to
                  monitor the exact location of your bus.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Do I need to carry a printed ticket?
                </AccordionTrigger>
                <AccordionContent>
                  No, a digital ticket (SMS/email confirmation) is sufficient.
                  However, some bus operators may require a printed ticket, so
                  check your booking details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {selectedCategory === "ticket" && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do I check my booking status?
                </AccordionTrigger>
                <AccordionContent>
                  You can check your booking details under the My Bookings
                  section or via the confirmation email/SMS you received.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I modify my booking?</AccordionTrigger>
                <AccordionContent>
                  Currently, modification options are limited. You may need to
                  cancel and rebook if changes are required.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  What if I don’t receive my ticket confirmation?
                </AccordionTrigger>
                <AccordionContent>
                  If you haven’t received a confirmation email or SMS within 15
                  minutes of booking, check your spam folder or contact our
                  support team.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {selectedCategory === "payment" && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  What payment methods are available?
                </AccordionTrigger>
                <AccordionContent>
                  SengarBus supports:
                  <ol className="list-disc pl-5">
                    <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>Debit/Credit Cards (Visa, Mastercard, RuPay, etc.)</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is my payment secure?</AccordionTrigger>
                <AccordionContent>
                  Yes! SengarBus ensures 100% encrypted and secure transactions,
                  protecting your payment details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Will I receive a payment confirmation?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you will receive an SMS and email confirmation after a
                  successful payment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What if my payment fails but money is deducted?
                </AccordionTrigger>
                <AccordionContent>
                  In case of a failed transaction, the deducted amount is
                  usually refunded within 3-5 business days. If not, please
                  contact our support team.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {selectedCategory === "cancellation" && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I cancel my ticket?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your ticket based on Sengar Travels'
                  cancellation policy. Go to the Manage Booking section and
                  follow the instructions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Will I get a full refund if I cancel my ticket?
                </AccordionTrigger>
                <AccordionContent>
                  Refunds depend on cancellation timing and the travel
                  operator’s policy. Partial or full refunds may apply.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How long does it take to receive my refund?
                </AccordionTrigger>
                <AccordionContent>
                  Refunds are usually processed within 3-7 business days,
                  depending on your payment method.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What happens if my bus is canceled by the operator?
                </AccordionTrigger>
                <AccordionContent>
                  If your bus is canceled, you will receive a full refund or an
                  option to reschedule your journey.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </section>
    </main>
  );
}
