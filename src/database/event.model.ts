import { model, models, Schema, type HydratedDocument } from "mongoose"

export interface IEvent {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

type EventDocument = HydratedDocument<IEvent>

const REQUIRED_STRING_FIELDS: (keyof Pick<
  IEvent,
  | "title"
  | "description"
  | "overview"
  | "image"
  | "venue"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "audience"
  | "organizer"
>)[] = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
]

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty item.",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => item.trim().length > 0),
        message: "Tags must contain at least one non-empty item.",
      },
    },
  },
  { timestamps: true }
)

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function normalizeDateToIso(value: string): string {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid event date format.")
  }

  return parsed.toISOString()
}

function normalizeTime(value: string): string {
  const time24HourMatch = value.match(/^([01]?\d|2[0-3]):([0-5]\d)$/)

  if (time24HourMatch) {
    const hour = time24HourMatch[1].padStart(2, "0")
    const minute = time24HourMatch[2]
    return `${hour}:${minute}`
  }

  const time12HourMatch = value.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*([aApP][mM])$/)

  if (!time12HourMatch) {
    throw new Error("Invalid event time format. Use HH:mm or h:mm AM/PM.")
  }

  const rawHour = Number.parseInt(time12HourMatch[1], 10)
  const minute = time12HourMatch[2]
  const period = time12HourMatch[3].toUpperCase()

  let normalizedHour = rawHour % 12
  if (period === "PM") {
    normalizedHour += 12
  }

  return `${String(normalizedHour).padStart(2, "0")}:${minute}`
}

eventSchema.pre("save", function () {
  const event = this as EventDocument

  // Enforce non-empty required string values before persistence.
  for (const field of REQUIRED_STRING_FIELDS) {
    const value = event[field]
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${field} is required and cannot be empty.`)
    }
  }

  // Normalize list fields and ensure no blank entries are stored.
  event.agenda = event.agenda.map((item) => item.trim())
  event.tags = event.tags.map((item) => item.trim())

  if (event.agenda.length === 0 || event.agenda.some((item) => item.length === 0)) {
    throw new Error("Agenda must contain at least one non-empty item.")
  }

  if (event.tags.length === 0 || event.tags.some((item) => item.length === 0)) {
    throw new Error("Tags must contain at least one non-empty item.")
  }

  // Regenerate the slug only when title is new/changed.
  if (event.isModified("title")) {
    event.slug = createSlug(event.title)
  }

  try {
    // Store date as ISO and time as HH:mm for consistent querying/display.
    event.date = normalizeDateToIso(event.date.trim())
    event.time = normalizeTime(event.time.trim())
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to normalize event date/time values.")
  }
})

eventSchema.index({ slug: 1 }, { unique: true })

export const Event = models.Event || model<IEvent>("Event", eventSchema)