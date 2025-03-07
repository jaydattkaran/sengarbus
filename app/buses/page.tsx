import { Button } from "@/components/ui/button";
import DatePickerDemo from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const page = () => {
  return (
    <main>
      <section className="md:px-6 py-2">
        <div className="flex md:flex-row flex-col gap-4">
          <div>
            <div className="mb-2 text-lg">From</div>
            <Input
              placeholder="Enter Boarding location"
              className="uppercase md:w-[15vw]"
            />
          </div>
          <div>
            <div className="mb-2 text-lg">To</div>
            <Input
              placeholder="Enter destination"
              className="uppercase md:w-[15vw]"
            />
          </div>
          <div>
            <div className="mb-2 text-lg">Travel Date</div>
            <DatePickerDemo />
          </div>
          <div className="md:mt-10 mt-2">
            <Link href="/buses">
              <Button className="bg-[#0077B6] h-12 uppercase hover:bg-[#0077B6] hover:text-neutral-400 text-white font-semibold text-xl cursor-pointer">
                Update Search
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 md:px-6 py-4">
        <div className="border max-w-[20vw] hidden md:block rounded px-4 py-4 flex flex-col gap-4">
          <div className="text-xl font-semibold">Filters</div>
          <div>
            <div className="text-lg uppercase mb-2 font-semibold">Bus type</div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant={"outline"} className="rounded">
                AC
              </Button>
              <Button variant={"outline"} className="rounded">
                AC
              </Button>
              <Button variant={"outline"} className="rounded">
                AC
              </Button>
              <Button variant={"outline"} className="rounded">
                AC
              </Button>
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold mb-4">Boarding Point</div>
            <Select>
              <SelectTrigger className="w-[18vw]">
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
          <div>
            <div className="text-lg font-semibold mb-4">Dropping Point</div>
            <Select>
              <SelectTrigger className="w-[18vw]">
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
        <div className="md:min-w-[45vw] min-w-[98vw] -translate-x-4 md:-translate-x-[9vw] p-2">
          <div>
            <div className="w-[10rem] h-[5rem] border rounded"></div>
          </div>

          {/* for mobile */}
          <div className="py-2 mt-4 px-1 flex flex-col gap-4 block md:hidden">
            <div className="w-full rounded glass-box border grid md:grid-cols-3 md:gap-1 gap-2 p-1 py-4">
              <div className="px-2 flex md:flex-col items-center md:gap-4 gap-20">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400 text-sm">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5</div>
              </div>
              <div className="flex justify-between gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                </div>
              </div>
              <div className="flex md:flex-col justify-between items-end gap-2 pr-2 md:px-0 px-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div className="line-through text-sm">₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400 text-sm">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full rounded glass-box border grid md:grid-cols-3 md:gap-1 gap-2 p-1 py-4">
              <div className="px-2 flex md:flex-col items-center md:gap-4 gap-20">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5</div>
              </div>
              <div className="flex justify-between gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                </div>
              </div>
              <div className="flex md:flex-col justify-between items-end gap-2 pr-2 md:px-0 px-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div className="line-through">₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full rounded glass-box border grid md:grid-cols-3 md:gap-1 gap-2 p-1 py-4">
              <div className="px-2 flex md:flex-col items-center md:gap-4 gap-20">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5</div>
              </div>
              <div className="flex justify-between gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                </div>
              </div>
              <div className="flex md:flex-col justify-between items-end gap-2 pr-2 md:px-0 px-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div className="line-through">₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full rounded glass-box border grid md:grid-cols-3 md:gap-1 gap-2 p-1 py-4">
              <div className="px-2 flex md:flex-col items-center md:gap-4 gap-20">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5</div>
              </div>
              <div className="flex justify-between gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                </div>
              </div>
              <div className="flex md:flex-col justify-between items-end gap-2 pr-2 md:px-0 px-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div className="line-through">₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full rounded glass-box border grid md:grid-cols-3 md:gap-1 gap-2 p-1 py-4">
              <div className="px-2 flex md:flex-col items-center md:gap-4 gap-20">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5</div>
              </div>
              <div className="flex justify-between gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                </div>
              </div>
              <div className="flex md:flex-col justify-between items-end gap-2 pr-2 md:px-0 px-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div className="line-through">₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* for desktop */}
          <div className="py-2 mt-4 flex flex-col gap-4 hidden md:block">
            <div className="w-full rounded glass-box border grid md:grid-cols-3 gap-1 p-1 py-4">
              <div className="px-2 flex flex-col gap-4">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5 | 100+ Ratings</div>
              </div>
              <div className="flex gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                  <div className="text-sm w-[7rem]">
                    Chandrawani Naka Bus Stop
                  </div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                  <div className="text-sm w-[7rem]">Nadra Bus Stand</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 pr-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div className="line-through">₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full rounded glass-box border grid grid-cols-3 gap-1 p-1 py-4">
              <div className="px-2 flex flex-col gap-4">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5 | 100+ Ratings</div>
              </div>
              <div className="flex gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                  <div className="text-sm w-[7rem]">
                    Chandrawani Naka Bus Stop
                  </div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                  <div className="text-sm w-[7rem]">Nadra Bus Stand</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 pr-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div>₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full rounded glass-box border grid grid-cols-3 gap-1 p-1 py-4">
              <div className="px-2 flex flex-col gap-4">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5 | 100+ Ratings</div>
              </div>
              <div className="flex gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                  <div className="text-sm w-[7rem]">
                    Chandrawani Naka Bus Stop
                  </div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                  <div className="text-sm w-[7rem]">Nadra Bus Stand</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 pr-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div>₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full rounded glass-box border grid grid-cols-3 gap-1 p-1 py-4">
              <div className="px-2 flex flex-col gap-4">
                <div>
                  <div className="text-xl font-semibold">
                    Sengar Travels Gwalior
                  </div>
                  <div className="text-neutral-400">
                    NON AC Seater/Sleeper 2+1
                  </div>
                </div>
                <div>4.0/5 | 100+ Ratings</div>
              </div>
              <div className="flex gap-2 px-2 min-w-[18vw]">
                <div>
                  <div className="text-sm">Mar 4</div>
                  <div className="text-xl font-semibold">21:00</div>
                  <div className="text-sm w-[7rem]">
                    Chandrawani Naka Bus Stop
                  </div>
                </div>
                <div className="pr-2">
                  <div className="text-neutral-300">09h 30min</div>
                  <div className="relative flex items-center">
                    <div className="w-[5rem] h-1 bg-neutral-400 relative">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm">Mar 5</div>
                  <div className="text-xl font-semibold">07:00</div>
                  <div className="text-sm w-[7rem]">Nadra Bus Stand</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 pr-2">
                <div>
                  <div className="text-xl font-semibold">₹ 315</div>
                  <div>₹ 350</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-neutral-400">Only 20 seats left</div>
                  <Link href="/ticket">
                    <Button className="uppercase cursor-pointer text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
                      Select Seat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
