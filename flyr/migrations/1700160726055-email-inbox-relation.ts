import { sql } from 'slonik'

export const up = sql.unsafe`
  -- Add inbox_uuid to EmailMessage Table
  ALTER TABLE EmailMessage
  ADD COLUMN inbox_uuid VARCHAR(36);

  -- Add Foreign Key Constraint
  ALTER TABLE EmailMessage
  ADD CONSTRAINT fk_emailmessage_inbox
  FOREIGN KEY (inbox_uuid)
  REFERENCES EmailInbox(uuid);
`

export const down = sql.unsafe`
  -- Remove Foreign Key Constraint
  ALTER TABLE EmailMessage
  DROP CONSTRAINT fk_emailmessage_inbox;

  -- Remove inbox_uuid Column
  ALTER TABLE EmailMessage
  DROP COLUMN inbox_uuid;
`

export const fill = sql.unsafe`
  /* Replace with SQL to run when filling the database. */
`
