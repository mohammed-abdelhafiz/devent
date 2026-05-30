import { model, models, Schema, type HydratedDocument, type Types } from "mongoose"
import { Event } from "./event.model"

export interface IBooking {
  eventId: Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

type BookingDocument = HydratedDocument<IBooking>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => EMAIL_REGEX.test(value),
        message: "A valid email address is required.",
      },
    },
  },
  { timestamps: true }
)

bookingSchema.pre("save", async function () {
  const booking = this as BookingDocument

  // Validate normalized email format before checking references.
  const normalizedEmail = booking.email.trim().toLowerCase()
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new Error("A valid email address is required.")
  }
  booking.email = normalizedEmail

  // Guard referential integrity by requiring a real target Event.
  const eventExists = await Event.exists({ _id: booking.eventId })
  if (!eventExists) {
    throw new Error("Cannot create booking: referenced event does not exist.")
  }
})

bookingSchema.index({ eventId: 1 })

// Add a unique index for each event to ensure only one booking per email per event.
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true })

export const Booking = models.Booking || model<IBooking>("Booking", bookingSchema)