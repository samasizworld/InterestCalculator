CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE notification_status AS ENUM ('ready','error','sent');

CREATE TABLE IF NOT EXISTS messages (
    messageid serial,
    guid uuid default uuid_generate_v4(),
    notificationstatus notification_status default 'ready',
    subject text,
    body text,
    recipientemailaddress text NOT NULL,
    attachments json,
    datecreated timestamp without time zone default now()::timestamp without time zone,
    datemodified timestamp without time zone,
    datedeleted timestamp without time zone,
    CONSTRAINT messages_messageid_pk PRIMARY KEY (messageid)
);


CREATE OR REPLACE FUNCTION messages_trigger()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
AS 
$$
DECLARE
BEGIN
    UPDATE messages SET datemodified = now() WHERE messageid = NEW.messageid;
    RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER after_insert_update_messages
AFTER UPDATE ON messages
FOR EACH ROW 
WHEN (pg_trigger_depth()<1)
EXECUTE FUNCTION messages_trigger();