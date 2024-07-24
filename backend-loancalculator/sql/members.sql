CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS members (
    memberid serial,
    guid uuid default uuid_generate_v4(),
    firstname varchar(100),
    middlename varchar(100),
    lastname varchar(100),
    emailaddress varchar(250),
    datecreated timestamp without time zone default now()::timestamp without time zone,
    datemodified timestamp without time zone,
    datedeleted timestamp without time zone,
    CONSTRAINT members_memberid_pk PRIMARY KEY (memberid)
);

CREATE OR REPLACE FUNCTION member_trigger()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
AS 
$$
DECLARE
BEGIN
    UPDATE members SET datemodified = now() WHERE memberid = NEW.memberid;
    RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER after_insert_update_members
AFTER UPDATE ON members
FOR EACH ROW 
WHEN (pg_trigger_depth()<1)
EXECUTE FUNCTION member_trigger();

-- creating unique index
CREATE UNIQUE INDEX IF NOT EXISTS uqidx_members
ON members (emailaddress ASC NULLS LAST, COALESCE(datedeleted, '2019-04-24 06:31:19.771'::timestamp without time zone) ASC NULLS LAST)