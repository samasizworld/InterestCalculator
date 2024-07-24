CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS loans (
    loanid serial,
    guid uuid default uuid_generate_v4(),
    amount numeric,
    isamountpaid boolean default false,
    loantakendate timestamp without time zone,
    memberid integer NOT NULL,
    datecreated timestamp without time zone default now()::timestamp without time zone,
    datemodified timestamp without time zone,
    datedeleted timestamp without time zone,
    CONSTRAINT loans_loanid_pk PRIMARY KEY (loanid),
    CONSTRAINT loans_memberid_fk FOREIGN KEY (memberid)
    REFERENCES members(memberid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE OR REPLACE FUNCTION loans_trigger()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
AS 
$$
DECLARE
BEGIN
    UPDATE loans SET datemodified = now() WHERE loanid = NEW.loanid;
    RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER after_insert_update_loans
AFTER UPDATE ON loans
FOR EACH ROW 
WHEN (pg_trigger_depth()<1)
EXECUTE FUNCTION loans_trigger();

-- creating unique index
CREATE UNIQUE INDEX IF NOT EXISTS uqidx_loans
ON loans (memberid, isamountpaid, COALESCE(datedeleted, '2019-04-24 06:31:19.771'::timestamp without time zone) ASC NULLS LAST)