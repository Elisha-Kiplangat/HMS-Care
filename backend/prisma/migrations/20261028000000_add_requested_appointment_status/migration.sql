-- Allow patients to request appointments before clinician approval.
ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'REQUESTED';