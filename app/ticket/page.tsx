import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const page = () => {
  return (
    <main>
      <section className="grid md:grid-cols-2 grid-cols-1 md:px-6 py-4 gap-2 border-b">
        <div className="border rounded flex flex-col gap-6 py-2 px-4 md:w-[23vw]">
          <div className="text-2xl font-semibold">
            Select Boarding and Dropping Points
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg">Boarding Point</div>
            <Select>
              <SelectTrigger className="md:w-[18vw] w-[80vw]">
                <SelectValue placeholder="Select your boarding" />
              </SelectTrigger>
              <SelectContent className="py-2">
                <SelectItem value="light">Chandrawani Naka Bus Stop</SelectItem>
                <SelectItem value="dark">
                  Chandrawani Naka Bus Stop 2
                </SelectItem>
                <SelectItem value="system">
                  Chandrawani Naka Bus Stop 3
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <div className="text-lg">Dropping Point</div>
            <Select>
              <SelectTrigger className="md:w-[18vw] w-[80vw]">
                <SelectValue placeholder="Select your dropping point" />
              </SelectTrigger>
              <SelectContent className="py-2">
                <SelectItem value="light">Nadra Bus Stand</SelectItem>
                <SelectItem value="dark">Nadra Bus Stand 2</SelectItem>
                <SelectItem value="system">Nadra Bus Stand 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border rounded flex flex-col gap-6 py-2 px-4 md:min-w-[35vw] md:-translate-x-[5vw]">
          <div className="text-2xl font-semibold">Select your seat</div>
          <div className="px-4 py-2 rounded">
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-neutral-500 rounded-xs"></div>
                <div>Booked</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-neutral-100 rounded-xs"></div>
                <div>Availabe</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="hidden md:block">
                <div className="flex px-4 py-4 relative md:rotate-0 rotate-90 border my-4 rounded-lg">
                  <div className="-rotate-90 absolute -left-3 top-20 text-lg font-semibold">
                    Sleeper
                  </div>
                  <div>
                    <div className="flex flex-col gap-4 mx-8">
                      <div className="flex gap-4">
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex px-4 py-4 relative border md:rotate-0 rotate-90 my-4 rounded-lg">
                  <div className="-rotate-90 absolute -left-3 top-20 text-lg font-semibold">
                    Seater
                  </div>
                  <div>
                    <div className="flex flex-col gap-4 mx-8">
                      <div className="flex gap-4">
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                        <div className="w-[5rem] h-[2rem] border-2 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div>
                    Seat Selected :{" "}
                    <span className="text-xl font-semibold">30</span>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">₹ 315</div>
                    <div className="-translate-x-8 text-[#0077B6] cursor-pointer">
                      Fare details
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center py-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="text-2xl font-semibold">Review your booking</div>
          <div className="text-xl font-medium">
            {" "}
            <span className="font-semibold mr-1">Gwalior - Bhopal </span> | 06
            March 2025
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div>
              <div className="border rounded md:min-w-[35vw] px-4 pt-2 pb-6">
                <div className="flex justify-between">
                  <div>
                    <div className="text-xl font-semibold">Sengar Travels</div>
                    <div className="text-sm">AC Sleeper (2+1)</div>
                    <div className="my-2">Seat selected 30</div>
                  </div>
                  <div className="text-[#0077B6]">Cancellation Policy</div>
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                  <div className="border px-2 py-2 rounded flex flex-col gap-1">
                    <div className="text-xl">Boarding Point</div>
                    <div className="bg-[#0077B6] text-white px-2 rounded md:w-[10vw] w-[40vw] text-sm">
                      08:00 PM, March 06
                    </div>
                    <div className="text-lg mt-2">
                      Chandrawani Naka Bus Stop
                    </div>
                  </div>
                  <div className="border px-2 py-2 rounded flex flex-col gap-1">
                    <div className="text-xl">Dropping Point</div>
                    <div className="bg-[#0077B6] text-white px-2 rounded md:w-[10vw] w-[40vw] text-sm">
                      08:00 PM, March 06
                    </div>
                    <div className="text-lg mt-2">Nadra Bus Stand</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border rounded md:w-[20vw] flex flex-col gap-2 px-4 py-2">
              <div className="text-2xl font-semibold">Price Details</div>
              <div className="border-b py-1">
                <div>
                  Base Fare :{" "}
                  <span className="text-xl mx-2 font-semibold">₹ 315</span>
                </div>
                <div>
                  GST & Exlcusive tax :{" "}
                  <span className="text-xl mx-2 font-semibold">₹ 315</span>
                </div>
              </div>
              <div className="text-lg font-semibold">
                Total :{" "}
                <span className="text-xl mx-2 font-semibold">₹ 315</span>
              </div>
            </div>
          </div>
          <div className="border rounded p-4 mt-4">
            <div className="text-2xl">Passenger Details</div>
            <div className="flex flex-col md:flex-row md:gap-10 gap-4 mt-4">
              <div>
                <div className="mx-1">Full Name</div>
                <Input
                  className="h-10 mt-2 md:w-[15vw]"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <div className="mx-1">Age</div>
                <Input className="h-10 mt-2 md:w-[5vw]" placeholder="Age" />
              </div>
              <div className="mx-1">
                <div>Gender</div>
                <div className="flex gap-2 mt-2">
                  <div>Male</div>
                  <div>Female</div>
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
                  className="h-10 mt-2 md:w-[20vw]"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div>
                <div className="mx-1">Mobile Number</div>
                <Input
                  className="h-10 mt-2 md:w-[15vw]"
                  placeholder="Enter your number"
                />
              </div>
            </div>
          </div>
          <Button className="border text-xl bg-[#FF6F00] hover:bg-[#FF6F00] text-white cursor-pointer font-semibold h-12 mt-4">
            Continue to Payment ₹ 315
          </Button>
        </div>
      </section>
    </main>
  );
};

export default page;
