import { EventItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Props {
  event: EventItem;
}

export const EventCard = ({
  event: { slug, title, image, location, date, time },
}: Props) => {
  return (
    <Link href={`events/${slug}`} className="group block">
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={title}
            width={410}
            height={300}
            className="h-[240px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-1.5 px-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin size={13} className="shrink-0" />
            <p className="text-xs font-light truncate">{location}</p>
          </div>
          <p className="text-[17px] font-semibold leading-snug line-clamp-2">
            {title}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="shrink-0" />
              <p className="text-xs font-light">{date}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="shrink-0" />
              <p className="text-xs font-light">{time}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
