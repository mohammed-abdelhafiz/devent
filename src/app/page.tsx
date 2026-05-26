import { EventCard } from "@/components/EventCard";
import { ExploreBtn } from "@/components/ExploreBtn";
import { events } from "@/lib/constants";


export default function HomePage() {
  return (
    <div>
      <div className="flex flex-col items-center ">
        <h1 className="text-center">
          The hub for every dev <br />
          event you can&apos;t miss
        </h1>
        <p className="text-center mt-5">
          Hackathons, meetups, conferences, and more — all in one place.
        </p>
        <ExploreBtn />
      </div>
      <div className="mt-20 space-y-7">
        <h3 className="text-2xl font-semibold">Featured events</h3>
        <ul className="grid md:grid-cols-3 gap-10 sm:grid-cols-2 grid-cols-1">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}
