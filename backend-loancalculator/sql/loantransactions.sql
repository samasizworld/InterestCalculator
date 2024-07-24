CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE paidtype AS ENUM('principal', 'interest');

CREATE TABLE IF NOT EXISTS loantransactions (
    loantransactionid serial,
    guid uuid default uuid_generate_v4(),
    paidamount numeric,
    isamountpaid boolean default false,
    paidtype paidtype,
    paiddate timestamp without time zone,
    loanid integer NOT NULL,
    datecreated timestamp without time zone default now()::timestamp without time zone,
    datemodified timestamp without time zone,
    datedeleted timestamp without time zone,
    CONSTRAINT loantransactions_loantransactionid_pk PRIMARY KEY (loantransactionid),
    CONSTRAINT loantransactions_loanid_pk FOREIGN KEY (loanid)
    REFERENCES loans(loanid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE OR REPLACE FUNCTION loantransactions_trigger()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
AS 
$$
DECLARE
BEGIN
    UPDATE loantransactions SET datemodified = now() WHERE loantransactionid = NEW.loantransactionid;
    RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER after_insert_update_loantransactions
AFTER UPDATE ON loantransactions
FOR EACH ROW 
WHEN (pg_trigger_depth()<1)
EXECUTE FUNCTION loantransactions_trigger();