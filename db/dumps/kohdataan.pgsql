--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Interests; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public."Interests" (
    id integer NOT NULL,
    name character varying(255),
    "createdAt" timestamp with time zone DEFAULT '2019-05-09 15:34:17.384+00'::timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT '2019-05-09 15:34:17.384+00'::timestamp with time zone NOT NULL
);


ALTER TABLE public."Interests" OWNER TO mmuser;

--
-- Name: Interests_id_seq; Type: SEQUENCE; Schema: public; Owner: mmuser
--

CREATE SEQUENCE public."Interests_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Interests_id_seq" OWNER TO mmuser;

--
-- Name: Interests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mmuser
--

ALTER SEQUENCE public."Interests_id_seq" OWNED BY public."Interests".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO mmuser;

--
-- Name: UserInterests; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public."UserInterests" (
    id integer NOT NULL,
    "userId" integer,
    "interestId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserInterests" OWNER TO mmuser;

--
-- Name: UserInterests_id_seq; Type: SEQUENCE; Schema: public; Owner: mmuser
--

CREATE SEQUENCE public."UserInterests_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserInterests_id_seq" OWNER TO mmuser;

--
-- Name: UserInterests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mmuser
--

ALTER SEQUENCE public."UserInterests_id_seq" OWNED BY public."UserInterests".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    nickname character varying(255),
    location character varying(255),
    description character varying(255),
    "profileReady" boolean NOT NULL,
    "tutorialWatched" boolean NOT NULL,
    "imageUploaded" boolean NOT NULL
);


ALTER TABLE public."Users" OWNER TO mmuser;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: mmuser
--

CREATE SEQUENCE public."Users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO mmuser;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mmuser
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: mmuser
--

ALTER TABLE ONLY public."Interests" ALTER COLUMN id SET DEFAULT nextval('public."Interests_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: mmuser
--

ALTER TABLE ONLY public."UserInterests" ALTER COLUMN id SET DEFAULT nextval('public."UserInterests_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: mmuser
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Interests; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public."Interests" (id, name, "createdAt", "updatedAt") FROM stdin;
1	Eläimet	2019-05-09 15:34:17.384+00	2019-05-09 15:34:17.384+00
2	Matkustus	2019-05-09 15:34:17.384+00	2019-05-09 15:34:17.384+00
\.


--
-- Name: Interests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mmuser
--

SELECT pg_catalog.setval('public."Interests_id_seq"', 2, true);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public."SequelizeMeta" (name) FROM stdin;
20190503075935-create-user.js
20190508142019-create-interest.js
20190508153103-create-user-interest.js
20190508153151-Users.js
\.


--
-- Data for Name: UserInterests; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public."UserInterests" (id, "userId", "interestId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: UserInterests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mmuser
--

SELECT pg_catalog.setval('public."UserInterests_id_seq"', 1, false);


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public."Users" (id, username, email, password, "createdAt", "updatedAt", nickname, location, description, "profileReady", "tutorialWatched", "imageUploaded") FROM stdin;
1	woland	janne.timonen@perfektio.com	$2b$12$9AWdWpQ4Fb.4OPl3cp00YOHoJlQnl8hMpJRPs.Qsq28JdSO.E0MmC	2019-05-09 15:54:59.609+00	2019-05-09 15:54:59.609+00	\N	\N	\N	f	f	f
\.


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mmuser
--

SELECT pg_catalog.setval('public."Users_id_seq"', 2, true);


--
-- Name: Interests_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public."Interests"
    ADD CONSTRAINT "Interests_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: UserInterests_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public."UserInterests"
    ADD CONSTRAINT "UserInterests_pkey" PRIMARY KEY (id);


--
-- Name: Users_email_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: mmuser
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM mmuser;
GRANT ALL ON SCHEMA public TO mmuser;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

