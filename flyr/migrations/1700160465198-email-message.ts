import { sql } from 'slonik'

export const up = sql.unsafe`
  -- Email Account Table
  CREATE TABLE EmailAccount (
      uuid VARCHAR(36) PRIMARY KEY,
      address VARCHAR(255) NOT NULL
  );

  -- Email Inbox Table
  CREATE TABLE EmailInbox (
      uuid VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      parent_inbox VARCHAR(36),
      email_account VARCHAR(36),
      FOREIGN KEY (parent_inbox) REFERENCES EmailInbox(uuid),
      FOREIGN KEY (email_account) REFERENCES EmailAccount(uuid)
  );

  -- Email Envelope Table
  CREATE TABLE EmailEnvelope (
      uuid VARCHAR(36) PRIMARY KEY,
      date TIMESTAMP NOT NULL,
      subject VARCHAR(255) NOT NULL
  );

  -- Email Message Table
  CREATE TABLE EmailMessage (
      uuid VARCHAR(36) PRIMARY KEY,
      envelope VARCHAR(36),
      FOREIGN KEY (envelope) REFERENCES EmailEnvelope(uuid)
  );

  -- Email Address Table
  CREATE TABLE EmailAddress (
      uuid VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255),
      address VARCHAR(255) NOT NULL
  );

  -- Many-to-Many Relationship Table: EnvelopeInReplyTo
  CREATE TABLE EnvelopeInReplyTo (
      envelope_uuid VARCHAR(36),
      address_uuid VARCHAR(36),
      PRIMARY KEY (envelope_uuid, address_uuid),
      FOREIGN KEY (envelope_uuid) REFERENCES EmailEnvelope(uuid),
      FOREIGN KEY (address_uuid) REFERENCES EmailAddress(uuid)
  );

  -- Many-to-Many Relationship Table: EnvelopeFrom
  CREATE TABLE EnvelopeFrom (
      envelope_uuid VARCHAR(36),
      address_uuid VARCHAR(36),
      PRIMARY KEY (envelope_uuid, address_uuid),
      FOREIGN KEY (envelope_uuid) REFERENCES EmailEnvelope(uuid),
      FOREIGN KEY (address_uuid) REFERENCES EmailAddress(uuid)
  );

  -- Many-to-Many Relationship Table: EnvelopeSender
  CREATE TABLE EnvelopeSender (
      envelope_uuid VARCHAR(36),
      address_uuid VARCHAR(36),
      PRIMARY KEY (envelope_uuid, address_uuid),
      FOREIGN KEY (envelope_uuid) REFERENCES EmailEnvelope(uuid),
      FOREIGN KEY (address_uuid) REFERENCES EmailAddress(uuid)
  );

  -- Many-to-Many Relationship Table: EnvelopeReplyTo
  CREATE TABLE EnvelopeReplyTo (
      envelope_uuid VARCHAR(36),
      address_uuid VARCHAR(36),
      PRIMARY KEY (envelope_uuid, address_uuid),
      FOREIGN KEY (envelope_uuid) REFERENCES EmailEnvelope(uuid),
      FOREIGN KEY (address_uuid) REFERENCES EmailAddress(uuid)
  );

  -- Many-to-Many Relationship Table: EnvelopeTo
  CREATE TABLE EnvelopeTo (
      envelope_uuid VARCHAR(36),
      address_uuid VARCHAR(36),
      PRIMARY KEY (envelope_uuid, address_uuid),
      FOREIGN KEY (envelope_uuid) REFERENCES EmailEnvelope(uuid),
      FOREIGN KEY (address_uuid) REFERENCES EmailAddress(uuid)
  );

  -- Many-to-Many Relationship Table: EnvelopeCc
  CREATE TABLE EnvelopeCc (
      envelope_uuid VARCHAR(36),
      address_uuid VARCHAR(36),
      PRIMARY KEY (envelope_uuid, address_uuid),
      FOREIGN KEY (envelope_uuid) REFERENCES EmailEnvelope(uuid),
      FOREIGN KEY (address_uuid) REFERENCES EmailAddress(uuid)
  );

  -- Many-to-Many Relationship Table: EnvelopeBcc
  CREATE TABLE EnvelopeBcc (
      envelope_uuid VARCHAR(36),
      address_uuid VARCHAR(36),
      PRIMARY KEY (envelope_uuid, address_uuid),
      FOREIGN KEY (envelope_uuid) REFERENCES EmailEnvelope(uuid),
      FOREIGN KEY (address_uuid) REFERENCES EmailAddress(uuid)
  );
`

export const down = sql.unsafe`
  -- Drop Many-to-Many Relationship Tables
  -- These need to be dropped first due to their dependencies on the EmailEnvelope and EmailAddress tables

  DROP TABLE IF EXISTS EnvelopeBcc;
  DROP TABLE IF EXISTS EnvelopeCc;
  DROP TABLE IF EXISTS EnvelopeTo;
  DROP TABLE IF EXISTS EnvelopeReplyTo;
  DROP TABLE IF EXISTS EnvelopeSender;
  DROP TABLE IF EXISTS EnvelopeFrom;
  DROP TABLE IF EXISTS EnvelopeInReplyTo;

  -- Drop Email Message Table
  DROP TABLE IF EXISTS EmailMessage;

  -- Drop Email Envelope Table
  DROP TABLE IF EXISTS EmailEnvelope;

  -- Drop Email Address Table
  DROP TABLE IF EXISTS EmailAddress;

  -- Drop Email Inbox Table
  -- Note: This needs to be dropped after EmailMessage due to the foreign key constraint
  DROP TABLE IF EXISTS EmailInbox;

  -- Drop Email Account Table
  DROP TABLE IF EXISTS EmailAccount;
`

export const fill = sql.unsafe`
  /* Replace with SQL to run when filling the database. */
`
