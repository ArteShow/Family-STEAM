// ─── Family STEAM Global i18n Module ─────────────────────────────────────────
// Language is stored in localStorage('preferredLanguage'): 'en' | 'de' | 'ru'
// Usage in HTML:  data-i18n="key"              → sets textContent
//                 data-i18n-placeholder="key"  → sets placeholder attribute
// Usage in JS:    window.i18n.t('key')         → returns translated string
//                 window.i18n.apply()          → applies all data-i18n attrs
// ─────────────────────────────────────────────────────────────────────────────
(function () {
    var T = {
        en: {
            // ── Navigation ──────────────────────────────────────────────────
            nav_home: 'Home',
            nav_about: 'About Us',
            nav_calendar: 'Calendar',
            nav_events: 'Short Events',
            nav_camps: 'Camps',
            nav_archive: 'Archive',
            nav_tickets: 'Support Tickets',
            nav_signin: 'Sign In',

            // ── Footer ───────────────────────────────────────────────────────
            footer_about_title: 'About Us',
            footer_about_text: 'Family STEAM is dedicated to providing innovative, engaging, and educational programs for families of all ages. We believe in hands-on learning and creativity.',
            footer_links_title: 'Quick Links',
            footer_events_calendar: 'Events Calendar',
            footer_programs_title: 'Programs',
            footer_prog_science: 'Science Programs',
            footer_prog_tech: 'Tech Labs',
            footer_prog_arts: 'Art Workshops',
            footer_prog_math: 'Math Camp',
            footer_newsletter_title: 'Newsletter',
            footer_newsletter_text: 'Subscribe to get updates about our latest programs and events.',
            footer_email_ph: 'Your email',
            footer_subscribe: 'Subscribe',
            footer_copyright: '© 2026 Family STEAM | All Rights Reserved',

            // ── Home ─────────────────────────────────────────────────────────
            home_hero_title: 'Welcome to Family STEAM',
            home_hero_sub: 'Discover upcoming events and fun camps for everyone!',
            home_card1_title: 'Not sure yet?',
            home_card1_text: 'Take a look at our upcoming camps and events.',
            home_explore_calendar: 'Explore Calendar',
            home_card2_title: 'Ready to join?',
            home_card2_text: 'Register now and start your STEAM adventure.',
            home_register_now: 'Register Now',
            home_card3_title: 'Register for an event',
            home_card3_text: 'Quick registration for upcoming events.',
            home_event_reg: 'Event Registration',
            home_incoming: 'Incoming Events',
            home_why_we: 'Why We?',
            home_reason1: 'Fun & Educational Programs',
            home_reason2: 'Safe & Supportive Environment',
            home_reason3: 'Expert Mentors & Hands-On Experience',
            home_testimonials: 'What Our Clients Say About Us',
            review1_p1: 'A huge thank you from us for the camp \uD83E\uDEB6\uD83C\uDFFB\uD83E\uDEB6\uD83C\uDFFB\uD83E\uDEB6\uD83C\uDFFB, for the wonderful organisation of the learning process by Zlata and Anna Valeryevna, for the leisure time and evening mafia game, and for the great company. All the kids are simply wonderful and so sociable. My child felt comfortable and at ease with everyone.',
            review1_p2: 'Our daughter came home inspired and motivated to keep studying. She even sat down to finish her last assignments in one go — quite unlike usual! \uD83D\uDE35\u200D\uD83D\uDCAB\uD83D\uDE04',
            review1_p3: 'She is very much looking forward to the next camps. We really hope it all works out.',
            review1_p4: 'A special thank you for the day trip to Venice! The guide and the walk were absolutely top-class — memories for a lifetime.',
            review1_author: 'Parent of a participant',
            review2_p1: 'We thank everyone who was involved in the organisation for the wonderful time at the camp, the picturesque location, the programme, the excursions and the leisure activities!',
            review2_p2: 'And thank you to our friends for the recommendation!',
            review2_p3: 'Yesterday we looked at the photos with the kids and listened to their stories. The camp was a hit! Mitya especially loved the board games! Liza asked us to pass on that she would love to come back again!',
            review2_p4: 'Thank you! \uD83C\uDF37\uD83C\uDF37\uD83C\uDF37\uD83C\uDF37\uD83C\uDF37 Until we meet again \u2728',
            review2_author: 'Family of participants',
            home_faq: 'Frequently Asked Questions',
            home_see_more: 'See More Details',
            home_no_events: 'No upcoming events. Check back soon!',
            home_loading_error: 'Failed to load events',
            faq_q1: 'What age groups do your programs serve?',
            faq_a1: 'Our programs are designed for children and families of all ages, from 5 years old to adults. We offer age-specific programs to ensure each participant gets the most appropriate experience for their developmental level.',
            faq_q2: 'How do I register for a camp or event?',
            faq_a2: 'You can register directly through our website by clicking the "Register Now" button. Simply fill out the registration form with your details, select your preferred program, and complete the payment process. You\'ll receive a confirmation email with all the details.',
            faq_q3: 'What should I bring to the events?',
            faq_a3: 'Most programs provide all necessary materials. However, we recommend bringing comfortable clothing, a water bottle, and a notebook for taking notes. Specific item lists will be provided upon registration.',
            faq_q4: 'Do you offer refunds or cancellations?',
            faq_a4: 'We offer full refunds if you cancel at least 7 days before the event. Cancellations made within 7 days of the event may be subject to a 50% refund. Please contact us for more details about our cancellation policy.',
            faq_q5: 'Are there group discounts available?',
            faq_a5: 'Yes! We offer special discounts for groups of 5 or more participants. Please contact us directly for a custom group quote and to arrange your team\'s participation.',
            faq_q6: 'Can parents attend the programs?',
            faq_a6: 'We have family-friendly programs where parents can participate together with their children. For youth-only programs, parents are welcome to stay in our observation area or wait in our comfortable lounge.',

            // ── About Us ─────────────────────────────────────────────────────
            about_why_title: 'Why We Do It',
            about_why_text: 'Family STEAM was born from a simple belief: every child deserves access to creative, hands-on learning experiences that spark curiosity and ignite a lifelong love of discovery. Our programs blend Science, Theatre, Engineering, Arts and Mathematics into unforgettable adventures for families.',
            about_goals_title: 'Our Goals',
            about_goal1_title: 'Inspire Curiosity',
            about_goal1_text: 'We create experiences that make children ask questions, explore ideas and discover the joy of learning.',
            about_goal2_title: 'Build Community',
            about_goal2_text: 'Our camps and events bring families together, fostering lasting friendships and a sense of belonging.',
            about_goal3_title: 'Empower Creativity',
            about_goal3_text: 'Through arts, science and engineering, we help each child find their unique voice and express it with confidence.',

            // ── Calendar ─────────────────────────────────────────────────────
            cal_title: 'Calendar',
            cal_filter_label: 'Filter by Tag:',
            cal_all_events: 'All Events',
            cal_today: 'Today',
            cal_close: 'Close',
            cal_no_events: 'No events planned for this day.',
            cal_see_details: 'See Details',
            cal_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            cal_months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

            // ── Camps ────────────────────────────────────────────────────────
            camps_title: 'Summer & Winter Camps',
            camps_no_camps: 'No camps available at the moment.',
            camps_register: 'Register Now',
            camps_view_cal: 'View on Calendar',

            // ── Short Events ─────────────────────────────────────────────────
            events_title: 'Upcoming Short Events',
            events_no_events: 'No short events available at the moment.',
            events_register: 'Register',
            events_view_cal: 'View on Calendar',
            events_tags: 'Tags:',

            // ── Tickets ──────────────────────────────────────────────────────
            tickets_title: 'Support Tickets',
            tickets_tab_create: 'Create Ticket',
            tickets_tab_my: 'My Tickets',
            tickets_create_title: 'Submit a Support Ticket',
            tickets_must_signin: 'You need to be signed in to create a support ticket.',
            tickets_signin_btn: 'Sign In / Register',
            tickets_signed_as: 'Signed in as',
            tickets_help_text: 'Tell us how we can help.',
            tickets_subject_ph: 'Subject',
            tickets_message_ph: 'Describe your issue…',
            tickets_email_ph: 'Contact email (optional)',
            tickets_submit: 'Submit Ticket',
            tickets_success: 'Your ticket has been submitted! We will get back to you soon.',
            tickets_my_title: 'My Tickets',
            tickets_showing: 'Showing your last 5 tickets or tickets from the past month.',
            tickets_signin_view: 'Please sign in to view your support tickets.',
            tickets_no_tickets: 'You have no support tickets yet.',
            tickets_admin_response: 'Admin Response',
            tickets_close: 'Close Ticket',
            tickets_status_open: 'Open',
            tickets_status_closed: 'Closed',
            tickets_fail_submit: 'Failed to submit ticket. Please try again.',
            tickets_fail_load: 'Failed to load tickets. Please try again.',
            tickets_fail_close: 'Failed to close ticket.',

            // ── Contacts ─────────────────────────────────────────────────────
            contacts_title: 'Get In Touch With Us',
            contacts_form_title: 'Send Us a Message',
            contacts_form_sub: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
            contacts_name_ph: 'Your Name',
            contacts_email_ph: 'Your Email',
            contacts_subject_ph: 'Subject',
            contacts_msg_ph: 'Your Message',
            contacts_submit: 'Send Message',

            // ── Camp Register ────────────────────────────────────────────────
            camp_reg_title: 'Camp Registration',
            camp_reg_sub: 'Choose your camp and share the participant details. We will follow up with a confirmation email.',
            camp_reg_select_label: 'Select Camp',
            camp_reg_select_ph: 'Select a camp',
            camp_reg_firstname: 'First Name',
            camp_reg_firstname_ph: 'First name',
            camp_reg_lastname: 'Last Name',
            camp_reg_lastname_ph: 'Last name',
            camp_reg_dob: 'Date of Birth',
            camp_reg_phone: 'Phone',
            camp_reg_email: 'Email',
            camp_reg_submit: 'Submit Registration',
            camp_reg_note: 'We will contact you within 2 business days.',

            // ── Registration – auth & payment ────────────────────────────────
            reg_login_required: 'Sign in to register',
            reg_login_sub: 'You need an account to register for this activity.',
            reg_registering_as: 'Registering as',
            reg_payment_title: 'Payment Method',
            reg_pay_cash: 'Cash',
            reg_pay_cash_sub: 'Pay on arrival',
            reg_pay_card: 'Card',
            reg_pay_card_sub: 'Pay now online',

            // ── Payment page ─────────────────────────────────────────────────
            pay_title: 'Secure Payment',
            pay_sub: 'Complete your registration by entering your card details below.',
            pay_no_pending: 'No pending registration found.',
            pay_no_pending_sub: 'Please go back and fill in the registration form first.',
            pay_back_camps: 'Back to Camps',
            pay_order_summary: 'Order Summary',
            pay_type: 'Type',
            pay_registrant: 'Registrant',
            pay_email: 'Email',
            pay_total: 'Total',
            pay_card_details: 'Card Details',
            pay_card_number: 'Card Number',
            pay_card_number_ph: '0000 0000 0000 0000',
            pay_card_expiry: 'Expiry Date',
            pay_card_expiry_ph: 'MM/YY',
            pay_card_cvc: 'CVC',
            pay_card_cvc_ph: '123',
            pay_card_name: 'Name on Card',
            pay_card_name_ph: 'Full name',
            pay_mock_notice: 'This is a demo payment system. No real charges will be made.',
            pay_now_btn: 'Pay Now',
            pay_cancel_btn: 'Cancel',
            pay_success_title: 'Payment Successful!',
            pay_success_sub: 'Your registration is confirmed. We\'ll send you a confirmation email shortly.',
            pay_back_home: 'Back to Home',

            // ── Event Register ───────────────────────────────────────────────
            event_reg_title: 'Event Registration',
            event_reg_sub: 'Share your details and we will confirm your event registration by email.',
            event_reg_select_label: 'Select Event',
            event_reg_select_ph: 'Select an event',
            event_reg_age: 'Age',
            event_reg_submit: 'Submit Registration',

            // ── Settings ─────────────────────────────────────────────────────
            settings_title: 'Account Settings',
            settings_subtitle: 'Manage your profile and preferences',
            settings_profile: 'Profile',
            settings_registered: 'Registered user',
            settings_signout: 'Sign Out',
            settings_language: 'Language',
            settings_lang_desc: 'Choose the language for the website interface.',
            settings_wa: 'WhatsApp Support Button',
            settings_wa_desc: 'Show or hide the floating WhatsApp support button across the site.',
            settings_wa_enabled: 'Enabled',
            settings_footer_about: 'Family STEAM is dedicated to providing innovative, engaging, and educational programs for families of all ages.',

            // ── Auth ─────────────────────────────────────────────────────────
            auth_login_tab: 'Log In',
            auth_register_tab: 'Register',
            auth_login_title: 'Welcome Back',
            auth_login_sub: 'Sign in to your account',
            auth_username_ph: 'Username',
            auth_password_ph: 'Password',
            auth_login_btn: 'Log In',
            auth_register_title: 'Create Account',
            auth_register_sub: 'Join Family STEAM today',
            auth_confirm_ph: 'Confirm Password',
            auth_register_btn: 'Create Account',

            // ── Archive ──────────────────────────────────────────────────────
            archive_title: 'Past Events & Camps',
            archive_subtitle: 'A look back at everything we\'ve done together.',
            archive_filter_all: 'All',
            archive_filter_events: 'Short Events',
            archive_filter_camps: 'Camps',
            archive_loading: 'Loading archive…',
            archive_empty: 'No past events or camps yet.',
            archive_load_error: 'Failed to load archive. Please refresh.',
            archive_no_filter: 'No archived items found for this filter.',
            archive_badge_event: 'Event',
            archive_badge_camp: 'Camp',
            archive_date_label: 'Date',
            files_label: 'Files',

            // ── Reviews ──────────────────────────────────────────────────────
            review_btn: 'Reviews',
            review_close: 'Close',
            review_write_title: 'Write a Review',
            review_placeholder: 'Share your experience…',
            review_rating_label: 'Your Rating',
            review_submit: 'Submit Review',
            review_empty: 'No reviews yet. Be the first!',
            review_load_error: 'Could not load reviews.',
            review_submitted: 'Review submitted!',
            review_already: 'You have already reviewed this event.',
            review_not_eligible: 'Only participants can leave a review.',
            review_login_required: 'Please sign in to leave a review.',
            review_checking: 'Checking eligibility…',
            review_submitting: 'Submitting…',
            review_load_more: 'Load more',

            // ── Language Selection ──────────────────────────────────────────
            lang_select_title: 'Select Your Language',
            lang_select_subtitle: 'Please choose your preferred language to continue.',
            lang_select_english: 'English',
            lang_select_german: 'Deutsch',
            lang_select_russian: 'Русский',
            lang_select_confirm: 'Continue',
        },

        de: {
            nav_home: 'Startseite',
            nav_about: 'Über uns',
            nav_calendar: 'Kalender',
            nav_events: 'Kurze Events',
            nav_camps: 'Lager',
            nav_archive: 'Archiv',
            nav_tickets: 'Support-Tickets',
            nav_signin: 'Anmelden',

            footer_about_title: 'Über uns',
            footer_about_text: 'Family STEAM widmet sich der Bereitstellung innovativer, anregender und lehrreicher Programme für Familien aller Altersgruppen. Wir glauben an praxisnahes Lernen und Kreativität.',
            footer_links_title: 'Schnelllinks',
            footer_events_calendar: 'Veranstaltungskalender',
            footer_programs_title: 'Programme',
            footer_prog_science: 'Wissenschaftsprogramme',
            footer_prog_tech: 'Tech-Labs',
            footer_prog_arts: 'Kunst-Workshops',
            footer_prog_math: 'Mathe-Lager',
            footer_newsletter_title: 'Newsletter',
            footer_newsletter_text: 'Abonnieren Sie, um Updates zu unseren neuesten Programmen und Veranstaltungen zu erhalten.',
            footer_email_ph: 'Ihre E-Mail',
            footer_subscribe: 'Abonnieren',
            footer_copyright: '© 2026 Family STEAM | Alle Rechte vorbehalten',

            home_hero_title: 'Willkommen bei Family STEAM',
            home_hero_sub: 'Entdecken Sie bevorstehende Events und tolle Lager für alle!',
            home_card1_title: 'Noch nicht sicher?',
            home_card1_text: 'Schauen Sie sich unsere bevorstehenden Lager und Events an.',
            home_explore_calendar: 'Kalender erkunden',
            home_card2_title: 'Bereit dabei zu sein?',
            home_card2_text: 'Registrieren Sie sich jetzt und starten Sie Ihr STEAM-Abenteuer.',
            home_register_now: 'Jetzt registrieren',
            home_card3_title: 'Für ein Event registrieren',
            home_card3_text: 'Schnelle Registrierung für bevorstehende Events.',
            home_event_reg: 'Event-Registrierung',
            home_incoming: 'Bevorstehende Events',
            home_why_we: 'Warum wir?',
            home_reason1: 'Lehrreiche & spaßige Programme',
            home_reason2: 'Sichere & unterstützende Umgebung',
            home_reason3: 'Experten & praktische Erfahrung',
            home_testimonials: 'Was unsere Kunden über uns sagen',
            review1_p1: 'Von uns ebenfalls ein ganz herzliches Dankeschön für das Lager \uD83E\uDEB6\uD83C\uDFFB\uD83E\uDEB6\uD83C\uDFFB\uD83E\uDEB6\uD83C\uDFFB, für die wunderbare Organisation des Lernprozesses durch Zlata und Anna Walerjewna, für die Freizeitgestaltung und das Abend-Mafia-Spiel sowie für die tolle Gemeinschaft. Alle Kinder sind einfach wunderbar und gesellig. Mein Kind hat sich bei allen wohl und geborgen gefühlt.',
            review1_p2: 'Unsere Tochter kam beflügelt und motiviert nach Hause, um ihr Studium fortzusetzen. Sie hat sogar ihre letzten Hausaufgaben in einem Zug erledigt – ganz untypisch für sie! \uD83D\uDE35\u200D\uD83D\uDCAB\uD83D\uDE04',
            review1_p3: 'Sie freut sich sehr auf die nächsten Lager. Wir hoffen wirklich, dass alles klappt.',
            review1_p4: 'Ein besonderer Dank gilt dem Ausflugstag in Venedig! Der Reiseführer und der Spaziergang waren erstklassig – Erinnerungen fürs Leben.',
            review1_author: 'Elternteil eines Teilnehmers',
            review2_p1: 'Wir danken jedem, der an der Organisation beteiligt war, für die wunderbare Zeit im Lager, die malerische Lage, das Programm, die Ausflüge und die Freizeitgestaltung!',
            review2_p2: 'Und danke an unsere Freunde für die Empfehlung!',
            review2_p3: 'Gestern haben wir mit den Kindern Fotos angeschaut und ihre Geschichten gehört. Das Lager war ein voller Erfolg! Mitja erinnerte sich besonders gern an die Brettspiele! Liza ließ ausrichten, dass sie sehr gerne wiederkommen würde!',
            review2_p4: 'Danke! \uD83C\uDF37\uD83C\uDF37\uD83C\uDF37\uD83C\uDF37\uD83C\uDF37 Bis zum nächsten Mal \u2728',
            review2_author: 'Familie von Teilnehmern',
            home_faq: 'Häufig gestellte Fragen',
            home_see_more: 'Mehr Details',
            home_no_events: 'Keine bevorstehenden Events. Schauen Sie bald wieder vorbei!',
            home_loading_error: 'Events konnten nicht geladen werden',
            faq_q1: 'Für welche Altersgruppen sind Ihre Programme geeignet?',
            faq_a1: 'Unsere Programme sind für Kinder und Familien aller Altersgruppen konzipiert, von 5 Jahren bis zu Erwachsenen. Wir bieten altersgerechte Programme an, damit jeder Teilnehmer die optimale Erfahrung erhält.',
            faq_q2: 'Wie registriere ich mich für ein Lager oder Event?',
            faq_a2: 'Sie können sich direkt über unsere Website registrieren, indem Sie auf „Jetzt registrieren" klicken. Füllen Sie das Registrierungsformular aus und schließen Sie den Zahlungsvorgang ab.',
            faq_q3: 'Was soll ich zu den Events mitbringen?',
            faq_a3: 'Die meisten Programme stellen alle notwendigen Materialien zur Verfügung. Wir empfehlen bequeme Kleidung, eine Wasserflasche und ein Notizbuch. Spezifische Listen werden nach der Anmeldung bereitgestellt.',
            faq_q4: 'Bieten Sie Rückerstattungen oder Stornierungen an?',
            faq_a4: 'Wir bieten vollständige Rückerstattungen an, wenn Sie mindestens 7 Tage vor der Veranstaltung stornieren. Bei Stornierungen innerhalb von 7 Tagen kann eine 50%ige Rückerstattung anfallen.',
            faq_q5: 'Gibt es Gruppenrabatte?',
            faq_a5: 'Ja! Wir bieten Sonderrabatte für Gruppen ab 5 Personen an. Kontaktieren Sie uns direkt für ein individuelles Gruppenangebot.',
            faq_q6: 'Können Eltern an den Programmen teilnehmen?',
            faq_a6: 'Wir haben familienfreundliche Programme, bei denen Eltern gemeinsam mit ihren Kindern teilnehmen können. Bei Programmen nur für Jugendliche sind Eltern herzlich willkommen, in unserem Beobachtungsbereich zu warten.',

            about_why_title: 'Warum wir das machen',
            about_why_text: 'Family STEAM entstand aus einer einfachen Überzeugung: Jedes Kind verdient Zugang zu kreativen, praxisnahen Lernerfahrungen, die Neugier wecken und eine lebenslange Freude am Entdecken entfachen. Unsere Programme verbinden Wissenschaft, Theater, Technik, Kunst und Mathematik zu unvergesslichen Abenteuern für Familien.',
            about_goals_title: 'Unsere Ziele',
            about_goal1_title: 'Neugier wecken',
            about_goal1_text: 'Wir gestalten Erlebnisse, die Kinder zum Fragen anregen, Ideen erkunden und die Freude am Lernen entdecken lassen.',
            about_goal2_title: 'Gemeinschaft aufbauen',
            about_goal2_text: 'Unsere Lager und Events bringen Familien zusammen und fördern dauerhafte Freundschaften und ein Gemeinschaftsgefühl.',
            about_goal3_title: 'Kreativität stärken',
            about_goal3_text: 'Durch Kunst, Wissenschaft und Technik helfen wir jedem Kind, seine eigene Stimme zu finden und sie selbstbewusst einzusetzen.',

            cal_title: 'Kalender',
            cal_filter_label: 'Nach Tag filtern:',
            cal_all_events: 'Alle Events',
            cal_today: 'Heute',
            cal_close: 'Schließen',
            cal_no_events: 'Für diesen Tag sind keine Events geplant.',
            cal_see_details: 'Details ansehen',
            cal_days: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
            cal_months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],

            camps_title: 'Sommer- & Winterlager',
            camps_no_camps: 'Derzeit keine Lager verfügbar.',
            camps_register: 'Jetzt registrieren',
            camps_view_cal: 'Im Kalender anzeigen',

            events_title: 'Bevorstehende kurze Events',
            events_no_events: 'Derzeit keine kurzen Events verfügbar.',
            events_register: 'Registrieren',
            events_view_cal: 'Im Kalender anzeigen',
            events_tags: 'Tags:',

            tickets_title: 'Support-Tickets',
            tickets_tab_create: 'Ticket erstellen',
            tickets_tab_my: 'Meine Tickets',
            tickets_create_title: 'Support-Ticket einreichen',
            tickets_must_signin: 'Sie müssen angemeldet sein, um ein Support-Ticket zu erstellen.',
            tickets_signin_btn: 'Anmelden / Registrieren',
            tickets_signed_as: 'Angemeldet als',
            tickets_help_text: 'Beschreiben Sie uns Ihr Anliegen.',
            tickets_subject_ph: 'Betreff',
            tickets_message_ph: 'Beschreiben Sie Ihr Anliegen…',
            tickets_email_ph: 'Kontakt-E-Mail (optional)',
            tickets_submit: 'Ticket einreichen',
            tickets_success: 'Ihr Ticket wurde eingereicht! Wir werden uns bald bei Ihnen melden.',
            tickets_my_title: 'Meine Tickets',
            tickets_showing: 'Zeigt Ihre letzten 5 Tickets oder Tickets des letzten Monats.',
            tickets_signin_view: 'Bitte melden Sie sich an, um Ihre Support-Tickets anzuzeigen.',
            tickets_no_tickets: 'Sie haben noch keine Support-Tickets.',
            tickets_admin_response: 'Admin-Antwort',
            tickets_close: 'Ticket schließen',
            tickets_status_open: 'Offen',
            tickets_status_closed: 'Geschlossen',
            tickets_fail_submit: 'Ticket konnte nicht eingereicht werden. Bitte versuchen Sie es erneut.',
            tickets_fail_load: 'Tickets konnten nicht geladen werden. Bitte versuchen Sie es erneut.',
            tickets_fail_close: 'Ticket konnte nicht geschlossen werden.',

            contacts_title: 'Nehmen Sie Kontakt auf',
            contacts_form_title: 'Senden Sie uns eine Nachricht',
            contacts_form_sub: 'Wir freuen uns, von Ihnen zu hören. Senden Sie uns eine Nachricht und wir antworten so schnell wie möglich.',
            contacts_name_ph: 'Ihr Name',
            contacts_email_ph: 'Ihre E-Mail',
            contacts_subject_ph: 'Betreff',
            contacts_msg_ph: 'Ihre Nachricht',
            contacts_submit: 'Nachricht senden',

            camp_reg_title: 'Lager-Registrierung',
            camp_reg_sub: 'Wählen Sie Ihr Lager und teilen Sie die Teilnehmerdetails mit. Wir senden Ihnen eine Bestätigungs-E-Mail.',
            camp_reg_select_label: 'Lager auswählen',
            camp_reg_select_ph: 'Lager auswählen',
            camp_reg_firstname: 'Vorname',
            camp_reg_firstname_ph: 'Vorname',
            camp_reg_lastname: 'Nachname',
            camp_reg_lastname_ph: 'Nachname',
            camp_reg_dob: 'Geburtsdatum',
            camp_reg_phone: 'Telefon',
            camp_reg_email: 'E-Mail',
            camp_reg_submit: 'Registrierung einreichen',
            camp_reg_note: 'Wir werden uns innerhalb von 2 Werktagen bei Ihnen melden.',

            // ── Registration – auth & payment ────────────────────────────────
            reg_login_required: 'Anmelden um zu registrieren',
            reg_login_sub: 'Sie benötigen ein Konto, um sich für diese Aktivität anzumelden.',
            reg_registering_as: 'Registrierung als',
            reg_payment_title: 'Zahlungsmethode',
            reg_pay_cash: 'Bargeld',
            reg_pay_cash_sub: 'Zahlung bei Ankunft',
            reg_pay_card: 'Karte',
            reg_pay_card_sub: 'Jetzt online bezahlen',

            // ── Payment page ─────────────────────────────────────────────────
            pay_title: 'Sichere Zahlung',
            pay_sub: 'Schließen Sie Ihre Registrierung ab, indem Sie Ihre Kartendetails eingeben.',
            pay_no_pending: 'Keine ausstehende Registrierung gefunden.',
            pay_no_pending_sub: 'Bitte gehen Sie zurück und füllen Sie zuerst das Registrierungsformular aus.',
            pay_back_camps: 'Zurück zu den Lagern',
            pay_order_summary: 'Bestellübersicht',
            pay_type: 'Typ',
            pay_registrant: 'Teilnehmer',
            pay_email: 'E-Mail',
            pay_total: 'Gesamt',
            pay_card_details: 'Kartendetails',
            pay_card_number: 'Kartennummer',
            pay_card_number_ph: '0000 0000 0000 0000',
            pay_card_expiry: 'Ablaufdatum',
            pay_card_expiry_ph: 'MM/JJ',
            pay_card_cvc: 'CVC',
            pay_card_cvc_ph: '123',
            pay_card_name: 'Name auf der Karte',
            pay_card_name_ph: 'Vollständiger Name',
            pay_mock_notice: 'Dies ist ein Demo-Zahlungssystem. Es werden keine echten Abbuchungen vorgenommen.',
            pay_now_btn: 'Jetzt bezahlen',
            pay_cancel_btn: 'Abbrechen',
            pay_success_title: 'Zahlung erfolgreich!',
            pay_success_sub: 'Ihre Registrierung ist bestätigt. Wir senden Ihnen in Kürze eine Bestätigungs-E-Mail.',
            pay_back_home: 'Zurück zur Startseite',

            event_reg_title: 'Event-Registrierung',
            event_reg_sub: 'Teilen Sie Ihre Daten mit und wir bestätigen Ihre Event-Registrierung per E-Mail.',
            event_reg_select_label: 'Event auswählen',
            event_reg_select_ph: 'Event auswählen',
            event_reg_age: 'Alter',
            event_reg_submit: 'Registrierung einreichen',

            settings_title: 'Kontoeinstellungen',
            settings_subtitle: 'Verwalten Sie Ihr Profil und Ihre Einstellungen',
            settings_profile: 'Profil',
            settings_registered: 'Registrierter Benutzer',
            settings_signout: 'Abmelden',
            settings_language: 'Sprache',
            settings_lang_desc: 'Wählen Sie die Sprache für die Website-Benutzeroberfläche.',
            settings_wa: 'WhatsApp-Support-Schaltfläche',
            settings_wa_desc: 'Zeigen oder verbergen Sie die schwebende WhatsApp-Support-Schaltfläche.',
            settings_wa_enabled: 'Aktiviert',
            settings_footer_about: 'Family STEAM widmet sich innovativen, anregenden und lehrreichen Programmen für Familien aller Altersgruppen.',

            auth_login_tab: 'Anmelden',
            auth_register_tab: 'Registrieren',
            auth_login_title: 'Willkommen zurück',
            auth_login_sub: 'Melden Sie sich bei Ihrem Konto an',
            auth_username_ph: 'Benutzername',
            auth_password_ph: 'Passwort',
            auth_login_btn: 'Anmelden',
            auth_register_title: 'Konto erstellen',
            auth_register_sub: 'Werden Sie Teil von Family STEAM',
            auth_confirm_ph: 'Passwort bestätigen',
            auth_register_btn: 'Konto erstellen',

            // ── Archive ──────────────────────────────────────────────────────
            archive_title: 'Vergangene Events & Lager',
            archive_subtitle: 'Ein Rückblick auf alles, was wir zusammen erlebt haben.',
            archive_filter_all: 'Alle',
            archive_filter_events: 'Kurze Events',
            archive_filter_camps: 'Lager',
            archive_loading: 'Archiv wird geladen…',
            archive_empty: 'Noch keine vergangenen Events oder Lager.',
            archive_load_error: 'Archiv konnte nicht geladen werden. Bitte aktualisieren.',
            archive_no_filter: 'Keine archivierten Einträge für diesen Filter.',
            archive_badge_event: 'Event',
            archive_badge_camp: 'Lager',
            archive_date_label: 'Datum',
            files_label: 'Dateien',

            // ── Reviews ──────────────────────────────────────────────────────
            review_btn: 'Bewertungen',
            review_close: 'Schließen',
            review_write_title: 'Bewertung schreiben',
            review_placeholder: 'Teilen Sie Ihre Erfahrung…',
            review_rating_label: 'Ihre Bewertung',
            review_submit: 'Bewertung absenden',
            review_empty: 'Noch keine Bewertungen. Seien Sie der Erste!',
            review_load_error: 'Bewertungen konnten nicht geladen werden.',
            review_submitted: 'Bewertung eingereicht!',
            review_already: 'Sie haben diese Veranstaltung bereits bewertet.',
            review_not_eligible: 'Nur Teilnehmer können eine Bewertung abgeben.',
            review_login_required: 'Bitte melden Sie sich an, um eine Bewertung zu hinterlassen.',
            review_checking: 'Berechtigung wird geprüft…',
            review_submitting: 'Wird gesendet…',
            review_load_more: 'Mehr laden',
            // ── Language Selection ──────────────────────────────────────────
            lang_select_title: 'Sprache wählen',
            lang_select_subtitle: 'Bitte wählen Sie Ihre bevorzugte Sprache.',
            lang_select_english: 'English',
            lang_select_german: 'Deutsch',
            lang_select_russian: 'Русский',
            lang_select_confirm: 'Fortfahren',        },

        ru: {
            nav_home: 'Главная',
            nav_about: 'О нас',
            nav_calendar: 'Календарь',
            nav_events: 'Короткие события',
            nav_camps: 'Лагеря',
            nav_archive: 'Архив',
            nav_tickets: 'Тикеты поддержки',
            nav_signin: 'Войти',

            footer_about_title: 'О нас',
            footer_about_text: 'Family STEAM посвящена предоставлению инновационных, увлекательных и образовательных программ для семей всех возрастов. Мы верим в практическое обучение и творчество.',
            footer_links_title: 'Быстрые ссылки',
            footer_events_calendar: 'Календарь событий',
            footer_programs_title: 'Программы',
            footer_prog_science: 'Программы по науке',
            footer_prog_tech: 'Технические лабы',
            footer_prog_arts: 'Арт-мастерские',
            footer_prog_math: 'Математический лагерь',
            footer_newsletter_title: 'Рассылка',
            footer_newsletter_text: 'Подпишитесь, чтобы получать обновления о наших последних программах и событиях.',
            footer_email_ph: 'Ваш email',
            footer_subscribe: 'Подписаться',
            footer_copyright: '© 2026 Family STEAM | Все права защищены',

            home_hero_title: 'Добро пожаловать в Family STEAM',
            home_hero_sub: 'Откройте для себя предстоящие события и увлекательные лагеря для всей семьи!',
            home_card1_title: 'Ещё не уверены?',
            home_card1_text: 'Посмотрите наши предстоящие лагеря и события.',
            home_explore_calendar: 'Открыть календарь',
            home_card2_title: 'Готовы присоединиться?',
            home_card2_text: 'Зарегистрируйтесь сейчас и начните своё STEAM-приключение.',
            home_register_now: 'Зарегистрироваться',
            home_card3_title: 'Регистрация на событие',
            home_card3_text: 'Быстрая регистрация на предстоящие события.',
            home_event_reg: 'Регистрация на событие',
            home_incoming: 'Предстоящие события',
            home_why_we: 'Почему мы?',
            home_reason1: 'Весёлые и образовательные программы',
            home_reason2: 'Безопасная и поддерживающая среда',
            home_reason3: 'Эксперты и практический опыт',
            home_testimonials: 'Что наши клиенты говорят о нас',
            review1_p1: 'От нас тоже большая пребольшая благодарность за лагерь \uD83E\uDEB6\uD83C\uDFFB\uD83E\uDEB6\uD83C\uDFFB\uD83E\uDEB6\uD83C\uDFFB, за прекрасную организацию учебного процесса Злате и Анне Валерьевне, за досуг и вечернюю мафию, за веселую компанию. Все детки просто чудесные, компанейские. Моему ребенку было со всеми комфортно и интересно.',
            review1_p2: 'Дочка приехала домой окрыленная и замотивированая на дальнейшую учебу. Даже последние домашки по допам села выполнить на одном дыхании, а не как обычно \uD83D\uDE35\u200D\uD83D\uDCAB\uD83D\uDE04',
            review1_p3: 'Очень ждёт следующих лагерей. Очень надеемся, что всё получится.',
            review1_p4: 'Отдельное спасибо за выходной в Венеции! Гид и прогулка были высший класс, воспоминания на всю жизнь.',
            review1_author: 'Родитель участника',
            review2_p1: 'Благодарим каждого, кто принимал участие в организации, за прекрасное время в лагере, живописное расположение, программу, экскурсии и досуг!',
            review2_p2: 'И спасибо друзьям за рекомендацию!',
            review2_p3: 'Вчера вместе с детьми смотрели фотографии и слушали их истории. Лагерь понравился! Мите особенно запомнились настольные игры! Лиза просила передать, что будет рада приехать снова!',
            review2_p4: 'Спасибо! \uD83C\uDF37\uD83C\uDF37\uD83C\uDF37\uD83C\uDF37\uD83C\uDF37 До новых встреч \u2728',
            review2_author: 'Семья участников',
            home_faq: 'Часто задаваемые вопросы',
            home_see_more: 'Подробнее',
            home_no_events: 'Нет предстоящих событий. Загляните позже!',
            home_loading_error: 'Не удалось загрузить события',
            faq_q1: 'Для каких возрастных групп предназначены ваши программы?',
            faq_a1: 'Наши программы разработаны для детей и семей всех возрастов, от 5 лет до взрослых. Мы предлагаем возрастные программы, чтобы каждый участник получил наиболее подходящий опыт.',
            faq_q2: 'Как зарегистрироваться на лагерь или событие?',
            faq_a2: 'Вы можете зарегистрироваться прямо на нашем сайте, нажав кнопку «Зарегистрироваться». Заполните форму регистрации и завершите процесс оплаты. Вы получите подтверждение по электронной почте.',
            faq_q3: 'Что взять с собой на события?',
            faq_a3: 'Большинство программ предоставляют все необходимые материалы. Рекомендуем взять удобную одежду, бутылку воды и блокнот. Подробные списки будут предоставлены после регистрации.',
            faq_q4: 'Предусмотрены ли возврат средств или отмена?',
            faq_a4: 'Мы предлагаем полный возврат средств при отмене не позднее чем за 7 дней до события. При отмене в течение 7 дней возможен возврат 50%. Свяжитесь с нами для уточнения деталей.',
            faq_q5: 'Есть ли групповые скидки?',
            faq_a5: 'Да! Мы предлагаем специальные скидки для групп от 5 человек. Свяжитесь с нами напрямую для получения индивидуального предложения.',
            faq_q6: 'Могут ли родители присутствовать на программах?',
            faq_a6: 'У нас есть семейные программы, где родители могут участвовать вместе с детьми. В программах только для молодёжи родители могут оставаться в зоне наблюдения или ждать в удобном зале.',

            about_why_title: 'Почему мы это делаем',
            about_why_text: 'Family STEAM возникла из простой идеи: каждый ребёнок заслуживает доступа к творческому практическому обучению, которое пробуждает любопытство и зажигает любовь к открытиям. Наши программы объединяют науку, театр, инженерию, искусство и математику в незабываемые приключения для семей.',
            about_goals_title: 'Наши цели',
            about_goal1_title: 'Вдохновлять на любопытство',
            about_goal1_text: 'Мы создаём опыт, который заставляет детей задавать вопросы, исследовать идеи и открывать радость обучения.',
            about_goal2_title: 'Строить сообщество',
            about_goal2_text: 'Наши лагеря и события объединяют семьи, формируя прочные дружеские связи и чувство принадлежности.',
            about_goal3_title: 'Развивать творчество',
            about_goal3_text: 'Через искусство, науку и технологии мы помогаем каждому ребёнку найти свой голос и выражать себя с уверенностью.',

            cal_title: 'Календарь',
            cal_filter_label: 'Фильтр по тегу:',
            cal_all_events: 'Все события',
            cal_today: 'Сегодня',
            cal_close: 'Закрыть',
            cal_no_events: 'На этот день событий нет.',
            cal_see_details: 'Смотреть детали',
            cal_days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            cal_months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],

            camps_title: 'Летние и зимние лагеря',
            camps_no_camps: 'Лагерей пока нет.',
            camps_register: 'Зарегистрироваться',
            camps_view_cal: 'Посмотреть в календаре',

            events_title: 'Предстоящие короткие события',
            events_no_events: 'Коротких событий пока нет.',
            events_register: 'Зарегистрироваться',
            events_view_cal: 'Посмотреть в календаре',
            events_tags: 'Теги:',

            tickets_title: 'Тикеты поддержки',
            tickets_tab_create: 'Создать тикет',
            tickets_tab_my: 'Мои тикеты',
            tickets_create_title: 'Подать тикет в поддержку',
            tickets_must_signin: 'Вам нужно войти в систему, чтобы создать тикет поддержки.',
            tickets_signin_btn: 'Войти / Зарегистрироваться',
            tickets_signed_as: 'Вошли как',
            tickets_help_text: 'Расскажите нам, чем мы можем помочь.',
            tickets_subject_ph: 'Тема',
            tickets_message_ph: 'Опишите вашу проблему…',
            tickets_email_ph: 'Контактный email (необязательно)',
            tickets_submit: 'Отправить тикет',
            tickets_success: 'Ваш тикет отправлен! Мы свяжемся с вами в ближайшее время.',
            tickets_my_title: 'Мои тикеты',
            tickets_showing: 'Показывает ваши последние 5 тикетов или тикеты за прошлый месяц.',
            tickets_signin_view: 'Войдите в систему, чтобы просмотреть свои тикеты поддержки.',
            tickets_no_tickets: 'У вас пока нет тикетов поддержки.',
            tickets_admin_response: 'Ответ администратора',
            tickets_close: 'Закрыть тикет',
            tickets_status_open: 'Открыт',
            tickets_status_closed: 'Закрыт',
            tickets_fail_submit: 'Не удалось отправить тикет. Попробуйте ещё раз.',
            tickets_fail_load: 'Не удалось загрузить тикеты. Попробуйте ещё раз.',
            tickets_fail_close: 'Не удалось закрыть тикет.',

            contacts_title: 'Свяжитесь с нами',
            contacts_form_title: 'Отправьте нам сообщение',
            contacts_form_sub: 'Мы будем рады услышать вас. Напишите нам, и мы ответим как можно скорее.',
            contacts_name_ph: 'Ваше имя',
            contacts_email_ph: 'Ваш email',
            contacts_subject_ph: 'Тема',
            contacts_msg_ph: 'Ваше сообщение',
            contacts_submit: 'Отправить сообщение',

            camp_reg_title: 'Регистрация в лагерь',
            camp_reg_sub: 'Выберите лагерь и укажите данные участника. Мы пришлём вам подтверждение по email.',
            camp_reg_select_label: 'Выберите лагерь',
            camp_reg_select_ph: 'Выберите лагерь',
            camp_reg_firstname: 'Имя',
            camp_reg_firstname_ph: 'Имя',
            camp_reg_lastname: 'Фамилия',
            camp_reg_lastname_ph: 'Фамилия',
            camp_reg_dob: 'Дата рождения',
            camp_reg_phone: 'Телефон',
            camp_reg_email: 'Email',
            camp_reg_submit: 'Отправить регистрацию',
            camp_reg_note: 'Мы свяжемся с вами в течение 2 рабочих дней.',

            // ── Registration – auth & payment ────────────────────────────────
            reg_login_required: 'Войдите для регистрации',
            reg_login_sub: 'Для регистрации на это мероприятие необходим аккаунт.',
            reg_registering_as: 'Регистрация как',
            reg_payment_title: 'Способ оплаты',
            reg_pay_cash: 'Наличные',
            reg_pay_cash_sub: 'Оплата при прибытии',
            reg_pay_card: 'Карта',
            reg_pay_card_sub: 'Оплатить онлайн',

            // ── Payment page ─────────────────────────────────────────────────
            pay_title: 'Безопасная оплата',
            pay_sub: 'Завершите регистрацию, введя данные карты ниже.',
            pay_no_pending: 'Ожидающая регистрация не найдена.',
            pay_no_pending_sub: 'Пожалуйста, вернитесь и сначала заполните форму регистрации.',
            pay_back_camps: 'Вернуться к лагерям',
            pay_order_summary: 'Сводка заказа',
            pay_type: 'Тип',
            pay_registrant: 'Участник',
            pay_email: 'Email',
            pay_total: 'Итого',
            pay_card_details: 'Данные карты',
            pay_card_number: 'Номер карты',
            pay_card_number_ph: '0000 0000 0000 0000',
            pay_card_expiry: 'Срок действия',
            pay_card_expiry_ph: 'ММ/ГГ',
            pay_card_cvc: 'CVC',
            pay_card_cvc_ph: '123',
            pay_card_name: 'Имя на карте',
            pay_card_name_ph: 'Полное имя',
            pay_mock_notice: 'Это демонстрационная платёжная система. Реальные списания не производятся.',
            pay_now_btn: 'Оплатить',
            pay_cancel_btn: 'Отмена',
            pay_success_title: 'Оплата прошла успешно!',
            pay_success_sub: 'Ваша регистрация подтверждена. Мы скоро пришлём вам письмо с подтверждением.',
            pay_back_home: 'На главную',

            event_reg_title: 'Регистрация на событие',
            event_reg_sub: 'Укажите ваши данные, и мы подтвердим регистрацию по email.',
            event_reg_select_label: 'Выберите событие',
            event_reg_select_ph: 'Выберите событие',
            event_reg_age: 'Возраст',
            event_reg_submit: 'Отправить регистрацию',

            settings_title: 'Настройки аккаунта',
            settings_subtitle: 'Управление профилем и настройками',
            settings_profile: 'Профиль',
            settings_registered: 'Зарегистрированный пользователь',
            settings_signout: 'Выйти',
            settings_language: 'Язык',
            settings_lang_desc: 'Выберите язык интерфейса сайта.',
            settings_wa: 'Кнопка поддержки WhatsApp',
            settings_wa_desc: 'Показать или скрыть плавающую кнопку поддержки WhatsApp.',
            settings_wa_enabled: 'Включено',
            settings_footer_about: 'Family STEAM посвящена предоставлению инновационных, увлекательных и образовательных программ для семей всех возрастов.',

            auth_login_tab: 'Войти',
            auth_register_tab: 'Регистрация',
            auth_login_title: 'С возвращением',
            auth_login_sub: 'Войдите в свой аккаунт',
            auth_username_ph: 'Имя пользователя',
            auth_password_ph: 'Пароль',
            auth_login_btn: 'Войти',
            auth_register_title: 'Создать аккаунт',
            auth_register_sub: 'Присоединяйтесь к Family STEAM',
            auth_confirm_ph: 'Подтвердите пароль',
            auth_register_btn: 'Создать аккаунт',

            // ── Archive ──────────────────────────────────────────────────────
            archive_title: 'Прошедшие события и лагеря',
            archive_subtitle: 'Всё, что мы пережили вместе.',
            archive_filter_all: 'Все',
            archive_filter_events: 'Короткие события',
            archive_filter_camps: 'Лагеря',
            archive_loading: 'Загрузка архива…',
            archive_empty: 'Прошедших событий и лагерей пока нет.',
            archive_load_error: 'Не удалось загрузить архив. Обновите страницу.',
            archive_no_filter: 'Нет архивных записей для этого фильтра.',
            archive_badge_event: 'Событие',
            archive_badge_camp: 'Лагерь',
            archive_date_label: 'Дата',
            files_label: 'Файлы',

            // ── Reviews ────────────────────────────────────────────────────────────────
            review_btn: 'Отзывы',
            review_close: 'Закрыть',
            review_write_title: 'Написать отзыв',
            review_placeholder: 'Поделитесь своим опытом…',
            review_rating_label: 'Ваша оценка',
            review_submit: 'Отправить отзыв',
            review_empty: 'Пока нет отзывов. Будьте первым!',
            review_load_error: 'Не удалось загрузить отзывы.',
            review_submitted: 'Отзыв отправлен!',
            review_already: 'Вы уже оценили это мероприятие.',
            review_not_eligible: 'Оставить отзыв могут только участники.',
            review_login_required: 'Войдите в систему, чтобы оставить отзыв.',
            review_checking: 'Проверка правжоительности…',
            review_submitting: 'Отправка…',
            review_load_more: 'Загрузить ещё',

            // ── Language Selection ──────────────────────────────────────────
            lang_select_title: 'Выберите язык',
            lang_select_subtitle: 'Пожалуйста, выберите предпочитаемый язык.',
            lang_select_english: 'English',
            lang_select_german: 'Deutsch',
            lang_select_russian: 'Русский',
            lang_select_confirm: 'Продолжить',
        }
    };

    // Production-ready language detection and persistence
    function getLang() {
        // Check cookie first (highest priority)
        if (typeof CookieManager !== 'undefined') {
            var cookieLang = CookieManager.get('family-steam-lang');
            if (cookieLang && ['en', 'de', 'ru'].includes(cookieLang.toLowerCase())) {
                if (window.__DEV__) console.log('[i18n] Using language from cookie:', cookieLang);
                return cookieLang.toLowerCase();
            }
        }
        
        // Check localStorage (fallback for compatibility)
        var storageLang = localStorage.getItem('preferredLanguage');
        if (storageLang && ['en', 'de', 'ru'].includes(storageLang.toLowerCase())) {
            if (window.__DEV__) console.log('[i18n] Using language from localStorage:', storageLang);
            return storageLang.toLowerCase();
        }
        
        // Final fallback to 'en'
        if (window.__DEV__) console.log('[i18n] Using default language: en');
        return 'en';
    }

    function t(key, lang) {
        var l = lang || getLang();
        var parts = key.split('.');
        var dict = T[l] || T.en;
        var baseKey = parts[0];
        var val = (dict[baseKey] !== undefined) ? dict[baseKey] : ((T.en[baseKey] !== undefined) ? T.en[baseKey] : key);
        if (parts.length > 1 && Array.isArray(val)) {
            var idx = parseInt(parts[1], 10);
            return (val[idx] !== undefined) ? val[idx] : key;
        }
        return (typeof val === 'string' || Array.isArray(val)) ? val : key;
    }

    // Supported languages and metadata
    var SUPPORTED_LANGUAGES = {
        en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
        de: { name: 'Deutsch', flag: '🇦🇹', nativeName: 'Deutsch' },
        ru: { name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' }
    };

    var onLanguageChangeCallbacks = [];

    // Change language and persist to both cookie and localStorage
    function changeLanguage(lang) {
        var validLang = ['en', 'de', 'ru'].includes(lang) ? lang.toLowerCase() : 'en';
        
        if (window.__DEV__) {
            console.log('[i18n] Changing language to:', validLang);
        }

        // Save to cookie (30-365 days, 90 is good middle ground for most cases)
        if (typeof CookieManager !== 'undefined') {
            CookieManager.set('family-steam-lang', validLang, 365, '/');
        }

        // Also save to localStorage for fallback + legacy support
        localStorage.setItem('preferredLanguage', validLang);

        // Apply translations immediately
        apply(validLang);

        // Trigger callbacks
        if (onLanguageChangeCallbacks.length > 0) {
            onLanguageChangeCallbacks.forEach(function (callback) {
                try {
                    callback(validLang);
                } catch (e) {
                    console.error('[i18n] Error in language change callback:', e);
                }
            });
        }

        if (window.__DEV__) {
            console.log('[i18n] Language changed successfully to:', validLang);
        }

        return validLang;
    }

    // Get list of supported languages
    function getSupportedLanguages() {
        return Object.keys(SUPPORTED_LANGUAGES).map(function (code) {
            return {
                code: code,
                name: SUPPORTED_LANGUAGES[code].name,
                flag: SUPPORTED_LANGUAGES[code].flag,
                nativeName: SUPPORTED_LANGUAGES[code].nativeName
            };
        });
    }

    // Register callback for language changes
    function onLanguageChange(callback) {
        if (typeof callback === 'function') {
            onLanguageChangeCallbacks.push(callback);
        }
    }

    window.i18n = {
        t: t,
        getLang: getLang,
        apply: apply,
        changeLanguage: changeLanguage,
        getSupportedLanguages: getSupportedLanguages,
        onLanguageChange: onLanguageChange,
        SUPPORTED_LANGUAGES: SUPPORTED_LANGUAGES
    };
})();
