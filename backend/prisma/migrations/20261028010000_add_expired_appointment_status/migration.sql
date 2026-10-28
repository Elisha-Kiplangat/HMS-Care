-- Mark appointments whose scheduled end time has passed as expired.
ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';