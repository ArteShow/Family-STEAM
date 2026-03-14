(function () {
    const STORAGE_KEY = 'familySteamLang';
    const SUPPORTED_LANGS = ['en', 'de', 'ru'];

    const KEY_TRANSLATIONS = {
        en: {
            'nav.home': 'Home',
            'nav.about': 'About Us',
            'nav.calendar': 'Calender',
            'nav.shortEvents': 'Short events',
            'nav.camps': 'Camps',
            'nav.contacts': 'Contacts',
            'about.title': 'Why We Do It',
            'about.intro': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            'about.team.member1.name': 'Lorem Ipsum',
            'about.team.member1.bio': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
            'about.team.member2.name': 'Dolor Sit Amet',
            'about.team.member2.bio': 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure. Sed ut perspiciatis unde omnis.',
            'about.goals.title': 'Our Goals',
            'about.goals.goal1.title': 'Consectetur Adipiscing',
            'about.goals.goal1.text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.',
            'about.goals.goal2.title': 'Sed Do Eiusmod',
            'about.goals.goal2.text': 'Dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut.',
            'about.goals.goal3.title': 'Tempor Incididunt',
            'about.goals.goal3.text': 'Aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse.',
            'home.hero.title': 'Welcome to Family STEAM',
            'home.hero.subtitle': 'Discover upcoming events and fun camps for everyone!',
            'home.cards.browse.title': 'Not sure yet?',
            'home.cards.browse.text': 'Take a look at our upcoming camps and events.',
            'home.cards.browse.cta': 'Explore Calendar',
            'home.cards.join.title': 'Ready to join?',
            'home.cards.join.text': 'Register now and start your STEAM adventure.',
            'home.cards.join.cta': 'Register Now',
            'home.cards.event.title': 'Register for an event',
            'home.cards.event.text': 'Quick registration for upcoming events.',
            'home.cards.event.cta': 'Event Registration',
            'home.incoming.title': 'Incoming events',
            'home.why.title': 'Why We?',
            'home.why.reason1': 'Fun & Educational Programs',
            'home.why.reason2': 'Safe & Supportive Environment',
            'home.why.reason3': 'Expert Mentors & Hands-On Experience',
            'home.reviews.title': 'What Our Clients Say About Us',
            'home.faq.title': 'Frequently Asked Questions',
            'home.faq.q1': 'What age groups do your programs serve?',
            'home.faq.a1': 'Our programs are designed for children and families of all ages, from 5 years old to adults. We offer age-specific programs to ensure each participant gets the most appropriate experience for their developmental level.',
            'home.faq.q2': 'How do I register for a camp or event?',
            'home.faq.a2': 'You can register directly through our website by clicking the "Register Now" button. Simply fill out the registration form with your details, select your preferred program, and complete the payment process. You\'ll receive a confirmation email with all the details.',
            'home.faq.q3': 'What should I bring to the events?',
            'home.faq.a3': 'Most programs provide all necessary materials. However, we recommend bringing comfortable clothing, a water bottle, and a notebook for taking notes. Specific item lists will be provided upon registration.',
            'home.faq.q4': 'Do you offer refunds or cancellations?',
            'home.faq.a4': 'We offer full refunds if you cancel at least 7 days before the event. Cancellations made within 7 days of the event may be subject to a 50% refund. Please contact us for more details about our cancellation policy.',
            'home.faq.q5': 'Are there group discounts available?',
            'home.faq.a5': 'Yes! We offer special discounts for groups of 5 or more participants. Please contact us directly for a custom group quote and to arrange your team\'s participation.',
            'home.faq.q6': 'Can parents attend the programs?',
            'home.faq.a6': 'We have family-friendly programs where parents can participate together with their children. For youth-only programs, parents are welcome to stay in our observation area or wait in our comfortable lounge.',
            'footer.about.title': 'About Us',
            'footer.about.text': 'Family STEAM is dedicated to providing innovative, engaging, and educational programs for families of all ages. We believe in hands-on learning and creativity.',
            'footer.quick.title': 'Quick Links',
            'footer.quick.home': 'Home',
            'footer.quick.events': 'Events Calendar',
            'footer.quick.camps': 'Camps',
            'footer.quick.contact': 'Contact Us',
            'footer.programs.title': 'Programs',
            'footer.programs.math': 'Math Camps',
            'footer.programs.art': 'Art Tours',
            'footer.programs.science': 'Science Programs',
            'footer.programs.sport': 'Sport Activities',
            'footer.newsletter.title': 'Newsletter',
            'footer.newsletter.text': 'Subscribe to get updates about our latest programs and events.',
            'footer.newsletter.placeholder': 'Your email',
            'footer.newsletter.button': 'Subscribe',
            'footer.legal': '© 2026 Family STEAM | All Rights Reserved',
            'dynamic.noUpcomingEvents': 'No upcoming events. Check back soon!',
            'dynamic.failedLoadEvents': 'Failed to load events',
            'dynamic.seeMoreDetails': 'See More Details',
            'dynamic.seeAllEvents': 'See All Events →',
            'dynamic.noCamps': 'No camps available at the moment.',
            'dynamic.noShortEvents': 'No short events in the next 30 days.',
            'dynamic.noDescription': 'No description available',
            'dynamic.register': 'Register',
            'dynamic.registerNow': 'Register Now',
            'dynamic.viewOnCalendar': 'View on Calendar',
            'dynamic.failedLoadCampsRefresh': 'Failed to load camps. Please refresh.',
            'dynamic.failedLoadEventsRefresh': 'Failed to load events. Please refresh.',
            'dynamic.filterByTag': 'Filter by Tag:',
            'dynamic.allEvents': 'All Events',
            'dynamic.today': 'Today',
            'dynamic.close': 'Close',
            'dynamic.noEventsForDay': 'No events planned for this day.',
            'dynamic.seeDetails': 'See Details',
            'dynamic.days': 'days',
            'dynamic.failedLoadEventsPage': 'Failed to load events. Please refresh the page.',
            'dynamic.noEventsAvailable': 'No events available',
            'dynamic.noCampsAvailable': 'No camps available',
            'dynamic.failedLoadEventsOption': 'Failed to load events',
            'dynamic.failedLoadCampsOption': 'Failed to load camps',
            'dynamic.selectEvent': 'Select an event',
            'dynamic.selectCamp': 'Select a camp',
            'dynamic.selectEventAlert': 'Please select an event.',
            'dynamic.selectCampAlert': 'Please select a camp.',
            'dynamic.registrationSuccess': 'Registration submitted successfully.',
            'dynamic.registrationFailed': 'Failed to submit registration. Please try again.',
            'dynamic.contactFillRequired': 'Please fill in all required fields',
            'dynamic.contactThanks': 'Thank you for your message! We will get back to you soon.',
            'dynamic.contactSent': 'Message Sent!',
            'dynamic.loginFailed': 'Login failed',
            'dynamic.registrationFailedShort': 'Registration failed',
            'dynamic.registrationOkLogin': 'Registration successful. Please login.',
            'dynamic.jwtRequired': 'JWT token is required for registration',
            'dynamic.missingToken': 'Missing token in login response'
        },
        de: {
            'nav.home': 'Startseite',
            'nav.about': 'Uber uns',
            'nav.calendar': 'Kalender',
            'nav.shortEvents': 'Kurzveranstaltungen',
            'nav.camps': 'Camps',
            'nav.contacts': 'Kontakte',
            'home.hero.title': 'Willkommen bei Family STEAM',
            'home.hero.subtitle': 'Entdecke kommende Events und spannende Camps fur alle!',
            'home.cards.browse.title': 'Noch unsicher?',
            'home.cards.browse.text': 'Schau dir unsere kommenden Camps und Veranstaltungen an.',
            'home.cards.browse.cta': 'Kalender ansehen',
            'home.cards.join.title': 'Bereit mitzumachen?',
            'home.cards.join.text': 'Jetzt registrieren und dein STEAM-Abenteuer starten.',
            'home.cards.join.cta': 'Jetzt registrieren',
            'home.cards.event.title': 'Fur ein Event registrieren',
            'home.cards.event.text': 'Schnelle Anmeldung fur bevorstehende Events.',
            'home.cards.event.cta': 'Event-Anmeldung',
            'home.incoming.title': 'Kommende Veranstaltungen',
            'home.why.title': 'Warum wir?',
            'home.why.reason1': 'Spannende und lehrreiche Programme',
            'home.why.reason2': 'Sichere und unterstutzende Umgebung',
            'home.why.reason3': 'Erfahrene Mentoren und praktische Erfahrungen',
            'home.reviews.title': 'Was unsere Kunden uber uns sagen',
            'home.faq.title': 'Haufig gestellte Fragen',
            'home.faq.q1': 'Welche Altersgruppen bedienen Ihre Programme?',
            'home.faq.a1': 'Unsere Programme sind fur Kinder und Familien aller Altersgruppen gedacht, von 5 Jahren bis zu Erwachsenen. Wir bieten altersspezifische Programme fur eine passende Erfahrung.',
            'home.faq.q2': 'Wie registriere ich mich fur ein Camp oder Event?',
            'home.faq.a2': 'Sie konnen sich direkt uber unsere Website anmelden, indem Sie auf "Jetzt registrieren" klicken. Fullen Sie das Formular aus und Sie erhalten eine Bestatigungs-E-Mail.',
            'home.faq.q3': 'Was soll ich zu den Veranstaltungen mitbringen?',
            'home.faq.a3': 'Die meisten Programme stellen Materialien bereit. Wir empfehlen bequeme Kleidung, eine Wasserflasche und ein Notizbuch.',
            'home.faq.q4': 'Bieten Sie Ruckerstattungen oder Stornierungen an?',
            'home.faq.a4': 'Volle Ruckerstattung bei Stornierung mindestens 7 Tage vorher. Innerhalb von 7 Tagen kann eine 50%-Ruckerstattung gelten.',
            'home.faq.q5': 'Gibt es Gruppenrabatte?',
            'home.faq.a5': 'Ja! Wir bieten Sonderrabatte fur Gruppen ab 5 Teilnehmern.',
            'home.faq.q6': 'Konnen Eltern an den Programmen teilnehmen?',
            'home.faq.a6': 'Wir haben familienfreundliche Programme, in denen Eltern mitmachen konnen. Bei Jugendprogrammen gibt es einen Wartebereich.',
            'footer.about.title': 'Uber uns',
            'footer.about.text': 'Family STEAM bietet innovative und spannende Bildungsprogramme fur Familien aller Altersgruppen.',
            'footer.quick.title': 'Schnellzugriffe',
            'footer.quick.home': 'Startseite',
            'footer.quick.events': 'Event-Kalender',
            'footer.quick.camps': 'Camps',
            'footer.quick.contact': 'Kontakt',
            'footer.programs.title': 'Programme',
            'footer.programs.math': 'Mathe-Camps',
            'footer.programs.art': 'Kunsttouren',
            'footer.programs.science': 'Wissenschaftsprogramme',
            'footer.programs.sport': 'Sportaktivitaten',
            'footer.newsletter.title': 'Newsletter',
            'footer.newsletter.text': 'Abonniere Updates zu unseren neuesten Programmen und Events.',
            'footer.newsletter.placeholder': 'Deine E-Mail',
            'footer.newsletter.button': 'Abonnieren',
            'footer.legal': '© 2026 Family STEAM | Alle Rechte vorbehalten',
            'dynamic.noUpcomingEvents': 'Keine bevorstehenden Events. Schau bald wieder vorbei!',
            'dynamic.failedLoadEvents': 'Events konnten nicht geladen werden',
            'dynamic.seeMoreDetails': 'Mehr Details',
            'dynamic.seeAllEvents': 'Alle Events ansehen →',
            'dynamic.noCamps': 'Derzeit sind keine Camps verfugbar.',
            'dynamic.noShortEvents': 'Keine Kurzveranstaltungen in den nachsten 30 Tagen.',
            'dynamic.noDescription': 'Keine Beschreibung verfugbar',
            'dynamic.register': 'Registrieren',
            'dynamic.registerNow': 'Jetzt registrieren',
            'dynamic.viewOnCalendar': 'Im Kalender anzeigen',
            'dynamic.failedLoadCampsRefresh': 'Camps konnten nicht geladen werden. Bitte aktualisieren.',
            'dynamic.failedLoadEventsRefresh': 'Events konnten nicht geladen werden. Bitte aktualisieren.',
            'dynamic.filterByTag': 'Nach Tag filtern:',
            'dynamic.allEvents': 'Alle Events',
            'dynamic.today': 'Heute',
            'dynamic.close': 'Schliessen',
            'dynamic.noEventsForDay': 'Fur diesen Tag sind keine Events geplant.',
            'dynamic.seeDetails': 'Details ansehen',
            'dynamic.days': 'Tage',
            'dynamic.failedLoadEventsPage': 'Events konnten nicht geladen werden. Bitte Seite aktualisieren.',
            'dynamic.noEventsAvailable': 'Keine Events verfugbar',
            'dynamic.noCampsAvailable': 'Keine Camps verfugbar',
            'dynamic.failedLoadEventsOption': 'Events konnten nicht geladen werden',
            'dynamic.failedLoadCampsOption': 'Camps konnten nicht geladen werden',
            'dynamic.selectEvent': 'Event auswahlen',
            'dynamic.selectCamp': 'Camp auswahlen',
            'dynamic.selectEventAlert': 'Bitte ein Event auswahlen.',
            'dynamic.selectCampAlert': 'Bitte ein Camp auswahlen.',
            'dynamic.registrationSuccess': 'Anmeldung erfolgreich gesendet.',
            'dynamic.registrationFailed': 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.',
            'dynamic.contactFillRequired': 'Bitte alle Pflichtfelder ausfullen',
            'dynamic.contactThanks': 'Danke fur deine Nachricht! Wir melden uns bald.',
            'dynamic.contactSent': 'Nachricht gesendet!',
            'dynamic.loginFailed': 'Anmeldung fehlgeschlagen',
            'dynamic.registrationFailedShort': 'Registrierung fehlgeschlagen',
            'dynamic.registrationOkLogin': 'Registrierung erfolgreich. Bitte anmelden.',
            'dynamic.jwtRequired': 'JWT-Token ist fur die Registrierung erforderlich',
            'dynamic.missingToken': 'Token in der Login-Antwort fehlt'
        },
        ru: {
            'nav.home': 'Главная',
            'nav.about': 'О нас',
            'nav.calendar': 'Календарь',
            'nav.shortEvents': 'Короткие события',
            'nav.camps': 'Лагеря',
            'nav.contacts': 'Контакты',
            'home.hero.title': 'Добро пожаловать в Family STEAM',
            'home.hero.subtitle': 'Откройте ближайшие события и интересные лагеря для всех!',
            'home.cards.browse.title': 'Еще не решили?',
            'home.cards.browse.text': 'Посмотрите наши ближайшие лагеря и мероприятия.',
            'home.cards.browse.cta': 'Открыть календарь',
            'home.cards.join.title': 'Готовы присоединиться?',
            'home.cards.join.text': 'Зарегистрируйтесь и начните свое STEAM-приключение.',
            'home.cards.join.cta': 'Зарегистрироваться',
            'home.cards.event.title': 'Регистрация на событие',
            'home.cards.event.text': 'Быстрая регистрация на ближайшие события.',
            'home.cards.event.cta': 'Регистрация на событие',
            'home.incoming.title': 'Ближайшие события',
            'home.why.title': 'Почему мы?',
            'home.why.reason1': 'Веселые и образовательные программы',
            'home.why.reason2': 'Безопасная и поддерживающая среда',
            'home.why.reason3': 'Опытные наставники и практика',
            'home.reviews.title': 'Что о нас говорят клиенты',
            'home.faq.title': 'Часто задаваемые вопросы',
            'home.faq.q1': 'Для каких возрастов ваши программы?',
            'home.faq.a1': 'Наши программы подходят для детей и семей всех возрастов, от 5 лет до взрослых. Есть программы по возрастным группам.',
            'home.faq.q2': 'Как зарегистрироваться на лагерь или событие?',
            'home.faq.a2': 'Вы можете зарегистрироваться на сайте, нажав "Зарегистрироваться". Заполните форму и получите письмо-подтверждение.',
            'home.faq.q3': 'Что брать с собой на мероприятия?',
            'home.faq.a3': 'Обычно материалы предоставляются. Рекомендуем удобную одежду, воду и блокнот.',
            'home.faq.q4': 'Есть ли возвраты и отмены?',
            'home.faq.a4': 'Полный возврат при отмене не позднее чем за 7 дней. При отмене позже возможен возврат 50%.',
            'home.faq.q5': 'Есть ли скидки для групп?',
            'home.faq.a5': 'Да, есть специальные скидки для групп от 5 участников.',
            'home.faq.q6': 'Могут ли родители участвовать?',
            'home.faq.a6': 'Есть семейные программы, где родители участвуют вместе с детьми. Для детских программ есть зона ожидания.',
            'footer.about.title': 'О нас',
            'footer.about.text': 'Family STEAM проводит современные и увлекательные образовательные программы для семей всех возрастов.',
            'footer.quick.title': 'Быстрые ссылки',
            'footer.quick.home': 'Главная',
            'footer.quick.events': 'Календарь событий',
            'footer.quick.camps': 'Лагеря',
            'footer.quick.contact': 'Контакты',
            'footer.programs.title': 'Программы',
            'footer.programs.math': 'Математические лагеря',
            'footer.programs.art': 'Арт-туры',
            'footer.programs.science': 'Научные программы',
            'footer.programs.sport': 'Спортивные активности',
            'footer.newsletter.title': 'Рассылка',
            'footer.newsletter.text': 'Подпишитесь, чтобы получать новости о наших программах и событиях.',
            'footer.newsletter.placeholder': 'Ваш email',
            'footer.newsletter.button': 'Подписаться',
            'footer.legal': '© 2026 Family STEAM | Все права защищены',
            'dynamic.noUpcomingEvents': 'Пока нет ближайших событий. Загляните позже!',
            'dynamic.failedLoadEvents': 'Не удалось загрузить события',
            'dynamic.seeMoreDetails': 'Подробнее',
            'dynamic.seeAllEvents': 'Все события →',
            'dynamic.noCamps': 'Сейчас нет доступных лагерей.',
            'dynamic.noShortEvents': 'В ближайшие 30 дней нет коротких событий.',
            'dynamic.noDescription': 'Описание отсутствует',
            'dynamic.register': 'Регистрация',
            'dynamic.registerNow': 'Зарегистрироваться',
            'dynamic.viewOnCalendar': 'Смотреть в календаре',
            'dynamic.failedLoadCampsRefresh': 'Не удалось загрузить лагеря. Обновите страницу.',
            'dynamic.failedLoadEventsRefresh': 'Не удалось загрузить события. Обновите страницу.',
            'dynamic.filterByTag': 'Фильтр по тегу:',
            'dynamic.allEvents': 'Все события',
            'dynamic.today': 'Сегодня',
            'dynamic.close': 'Закрыть',
            'dynamic.noEventsForDay': 'На этот день событий нет.',
            'dynamic.seeDetails': 'Смотреть детали',
            'dynamic.days': 'дней',
            'dynamic.failedLoadEventsPage': 'Не удалось загрузить события. Обновите страницу.',
            'dynamic.noEventsAvailable': 'События отсутствуют',
            'dynamic.noCampsAvailable': 'Лагеря отсутствуют',
            'dynamic.failedLoadEventsOption': 'Не удалось загрузить события',
            'dynamic.failedLoadCampsOption': 'Не удалось загрузить лагеря',
            'dynamic.selectEvent': 'Выберите событие',
            'dynamic.selectCamp': 'Выберите лагерь',
            'dynamic.selectEventAlert': 'Пожалуйста, выберите событие.',
            'dynamic.selectCampAlert': 'Пожалуйста, выберите лагерь.',
            'dynamic.registrationSuccess': 'Регистрация успешно отправлена.',
            'dynamic.registrationFailed': 'Не удалось отправить регистрацию. Попробуйте снова.',
            'dynamic.contactFillRequired': 'Пожалуйста, заполните все обязательные поля',
            'dynamic.contactThanks': 'Спасибо за сообщение! Мы скоро ответим.',
            'dynamic.contactSent': 'Сообщение отправлено!',
            'dynamic.loginFailed': 'Ошибка входа',
            'dynamic.registrationFailedShort': 'Ошибка регистрации',
            'dynamic.registrationOkLogin': 'Регистрация успешна. Пожалуйста, войдите.',
            'dynamic.jwtRequired': 'JWT токен обязателен для регистрации',
            'dynamic.missingToken': 'В ответе входа отсутствует токен'
        }
    };

    const PHRASE_TRANSLATIONS = {
        de: {
            'Family STEAM | ArteShow': 'Family STEAM | ArteShow',
            'Family STEAM | Camps': 'Family STEAM | Camps',
            'Family STEAM | Contacts': 'Family STEAM | Kontakte',
            'Family STEAM | Camp Registration': 'Family STEAM | Camp-Anmeldung',
            'Family STEAM | Event Registration': 'Family STEAM | Event-Anmeldung',
            'Family STEAM | Admin Dashboard': 'Family STEAM | Admin-Dashboard',
            'Home': 'Startseite',
            'About Us': 'Uber uns',
            'Calender': 'Kalender',
            'Short events': 'Kurzveranstaltungen',
            'Camps': 'Camps',
            'Contacts': 'Kontakte',
            'Why We Do It': 'Warum wir es tun',
            'Our Goals': 'Unsere Ziele',
            'Get In Touch With Us': 'Kontaktieren Sie uns',
            'Send Us a Message': 'Senden Sie uns eine Nachricht',
            "We'd love to hear from you. Send us a message and we'll respond as soon as possible.": 'Wir freuen uns von Ihnen zu horen. Senden Sie uns eine Nachricht und wir antworten so schnell wie moglich.',
            'Send Message': 'Nachricht senden',
            'Your Name': 'Ihr Name',
            'Your Email': 'Ihre E-Mail',
            'Subject': 'Betreff',
            'Your Message': 'Ihre Nachricht',
            'Calender': 'Kalender',
            'Filter by Tag:': 'Nach Tag filtern:',
            'All Events': 'Alle Events',
            'Today': 'Heute',
            'Close': 'Schliessen',
            'Mon': 'Mo',
            'Tue': 'Di',
            'Wed': 'Mi',
            'Thu': 'Do',
            'Fri': 'Fr',
            'Sat': 'Sa',
            'Sun': 'So',
            'Summer & Winter Camps': 'Sommer- und Wintercamps',
            'Short Events in the next month': 'Kurzveranstaltungen im nachsten Monat',
            'Enable JavaScript to view camps.': 'Aktivieren Sie JavaScript, um Camps anzuzeigen.',
            'Enable JavaScript to view upcoming short events.': 'Aktivieren Sie JavaScript, um kommende Kurzveranstaltungen anzuzeigen.',
            'Camp Registration': 'Camp-Anmeldung',
            'Event Registration': 'Event-Anmeldung',
            'Choose your camp and share the participant details. We will follow up with a confirmation email.': 'Wahlen Sie Ihr Camp und geben Sie die Teilnehmerdaten an. Wir senden eine Bestatigung per E-Mail.',
            'Share your details and we will confirm your event registration by email.': 'Teilen Sie uns Ihre Daten mit, wir bestatigen Ihre Event-Anmeldung per E-Mail.',
            'Select Camp': 'Camp auswahlen',
            'Select Event': 'Event auswahlen',
            'Select a camp': 'Camp auswahlen',
            'Select an event': 'Event auswahlen',
            'First Name': 'Vorname',
            'Last Name': 'Nachname',
            'Date of Birth': 'Geburtsdatum',
            'Phone': 'Telefon',
            'Email': 'E-Mail',
            'Age': 'Alter',
            'Submit Registration': 'Anmeldung absenden',
            'We will contact you within 2 business days.': 'Wir kontaktieren Sie innerhalb von 2 Werktagen.',
            'First name': 'Vorname',
            'Last name': 'Nachname',
            'Your email': 'Ihre E-Mail',
            'About Us': 'Uber uns',
            'Quick Links': 'Schnellzugriffe',
            'Events Calendar': 'Event-Kalender',
            'Contact Us': 'Kontakt',
            'Programs': 'Programme',
            'Science Programs': 'Wissenschaftsprogramme',
            'Tech Labs': 'Tech-Labore',
            'Art Workshops': 'Kunst-Workshops',
            'Math Camp': 'Mathe-Camp',
            'Newsletter': 'Newsletter',
            'Subscribe to get updates about our latest programs and events.': 'Abonnieren Sie Updates zu unseren neuesten Programmen und Events.',
            'Subscribe': 'Abonnieren',
            '© 2026 Family STEAM | All Rights Reserved': '© 2026 Family STEAM | Alle Rechte vorbehalten',
            'Login': 'Anmelden',
            'Register': 'Registrieren',
            'Welcome Back': 'Willkommen zuruck',
            'Sign in to access your account': 'Melden Sie sich an, um auf Ihr Konto zuzugreifen',
            'Username': 'Benutzername',
            'Password': 'Passwort',
            'Enter your username': 'Benutzernamen eingeben',
            'Enter your password': 'Passwort eingeben',
            "Don't have an account?": 'Noch kein Konto?',
            'Register here': 'Hier registrieren',
            'Create Account': 'Konto erstellen',
            'Sign up to get started': 'Registrieren Sie sich, um zu starten',
            'Choose your username': 'Benutzernamen wahlen',
            'Create a password': 'Passwort erstellen',
            'JWT Token': 'JWT-Token',
            'Enter your JWT token': 'JWT-Token eingeben',
            'Already have an account?': 'Bereits ein Konto?',
            'Login here': 'Hier anmelden'
        },
        ru: {
            'Family STEAM | ArteShow': 'Family STEAM | ArteShow',
            'Family STEAM | Camps': 'Family STEAM | Лагеря',
            'Family STEAM | Contacts': 'Family STEAM | Контакты',
            'Family STEAM | Camp Registration': 'Family STEAM | Регистрация в лагерь',
            'Family STEAM | Event Registration': 'Family STEAM | Регистрация на событие',
            'Family STEAM | Admin Dashboard': 'Family STEAM | Админ-панель',
            'Home': 'Главная',
            'About Us': 'О нас',
            'Calender': 'Календарь',
            'Short events': 'Короткие события',
            'Camps': 'Лагеря',
            'Contacts': 'Контакты',
            'Why We Do It': 'Почему мы это делаем',
            'Our Goals': 'Наши цели',
            'Get In Touch With Us': 'Свяжитесь с нами',
            'Send Us a Message': 'Отправьте нам сообщение',
            "We'd love to hear from you. Send us a message and we'll respond as soon as possible.": 'Мы будем рады вашему сообщению и ответим как можно скорее.',
            'Send Message': 'Отправить сообщение',
            'Your Name': 'Ваше имя',
            'Your Email': 'Ваш email',
            'Subject': 'Тема',
            'Your Message': 'Ваше сообщение',
            'Filter by Tag:': 'Фильтр по тегу:',
            'All Events': 'Все события',
            'Today': 'Сегодня',
            'Close': 'Закрыть',
            'Mon': 'Пн',
            'Tue': 'Вт',
            'Wed': 'Ср',
            'Thu': 'Чт',
            'Fri': 'Пт',
            'Sat': 'Сб',
            'Sun': 'Вс',
            'Summer & Winter Camps': 'Летние и зимние лагеря',
            'Short Events in the next month': 'Короткие события в следующем месяце',
            'Enable JavaScript to view camps.': 'Включите JavaScript, чтобы увидеть лагеря.',
            'Enable JavaScript to view upcoming short events.': 'Включите JavaScript, чтобы увидеть ближайшие короткие события.',
            'Camp Registration': 'Регистрация в лагерь',
            'Event Registration': 'Регистрация на событие',
            'Choose your camp and share the participant details. We will follow up with a confirmation email.': 'Выберите лагерь и укажите данные участника. Мы отправим подтверждение на email.',
            'Share your details and we will confirm your event registration by email.': 'Укажите ваши данные, и мы подтвердим регистрацию по email.',
            'Select Camp': 'Выберите лагерь',
            'Select Event': 'Выберите событие',
            'Select a camp': 'Выберите лагерь',
            'Select an event': 'Выберите событие',
            'First Name': 'Имя',
            'Last Name': 'Фамилия',
            'Date of Birth': 'Дата рождения',
            'Phone': 'Телефон',
            'Email': 'Email',
            'Age': 'Возраст',
            'Submit Registration': 'Отправить регистрацию',
            'We will contact you within 2 business days.': 'Мы свяжемся с вами в течение 2 рабочих дней.',
            'First name': 'Имя',
            'Last name': 'Фамилия',
            'Your email': 'Ваш email',
            'Quick Links': 'Быстрые ссылки',
            'Events Calendar': 'Календарь событий',
            'Contact Us': 'Связаться с нами',
            'Programs': 'Программы',
            'Science Programs': 'Научные программы',
            'Tech Labs': 'Тех-лаборатории',
            'Art Workshops': 'Арт-мастерские',
            'Math Camp': 'Математический лагерь',
            'Newsletter': 'Рассылка',
            'Subscribe to get updates about our latest programs and events.': 'Подпишитесь, чтобы получать обновления о наших программах и событиях.',
            'Subscribe': 'Подписаться',
            '© 2026 Family STEAM | All Rights Reserved': '© 2026 Family STEAM | Все права защищены',
            'Login': 'Вход',
            'Register': 'Регистрация',
            'Welcome Back': 'С возвращением',
            'Sign in to access your account': 'Войдите, чтобы получить доступ к аккаунту',
            'Username': 'Имя пользователя',
            'Password': 'Пароль',
            'Enter your username': 'Введите имя пользователя',
            'Enter your password': 'Введите пароль',
            "Don't have an account?": 'Нет аккаунта?',
            'Register here': 'Зарегистрироваться',
            'Create Account': 'Создать аккаунт',
            'Sign up to get started': 'Зарегистрируйтесь, чтобы начать',
            'Choose your username': 'Придумайте имя пользователя',
            'Create a password': 'Создайте пароль',
            'JWT Token': 'JWT токен',
            'Enter your JWT token': 'Введите JWT токен',
            'Already have an account?': 'Уже есть аккаунт?',
            'Login here': 'Войти здесь'
        }
    };

    function getSavedLanguage() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && SUPPORTED_LANGS.includes(saved)) {
            return saved;
        }
        return 'en';
    }

    function setSavedLanguage(lang) {
        localStorage.setItem(STORAGE_KEY, lang);
    }

    function t(key, fallback = '') {
        const lang = getSavedLanguage();
        return (KEY_TRANSLATIONS[lang] && KEY_TRANSLATIONS[lang][key])
            || (KEY_TRANSLATIONS.en && KEY_TRANSLATIONS.en[key])
            || fallback;
    }

    function getLocale() {
        const lang = getSavedLanguage();
        if (lang === 'de') return 'de-DE';
        if (lang === 'ru') return 'ru-RU';
        return 'en-US';
    }

    function translateByKey() {
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            if (!key) return;
            element.textContent = t(key, element.textContent);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (!key) return;
            element.setAttribute('placeholder', t(key, element.getAttribute('placeholder') || ''));
        });
    }

    function mapPhrase(lang, text) {
        if (!text) return text;
        if (lang === 'en') return text;
        const map = PHRASE_TRANSLATIONS[lang] || {};
        return map[text] || text;
    }

    function replaceTextNode(node, lang) {
        const raw = node.nodeValue;
        if (!raw || !raw.trim()) return;
        const trimmed = raw.trim();
        const translated = mapPhrase(lang, trimmed);
        if (translated === trimmed) return;

        const start = raw.indexOf(trimmed);
        const end = start + trimmed.length;
        node.nodeValue = raw.slice(0, start) + translated + raw.slice(end);
    }

    function translateByPhrase() {
        const lang = getSavedLanguage();
        if (lang === 'en') return;

        document.title = mapPhrase(lang, document.title);

        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((element) => {
            const placeholder = element.getAttribute('placeholder') || '';
            element.setAttribute('placeholder', mapPhrase(lang, placeholder));
        });

        const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (treeWalker.nextNode()) {
            textNodes.push(treeWalker.currentNode);
        }

        textNodes.forEach((node) => {
            if (!node.parentElement) return;
            if (node.parentElement.closest('script, style')) return;
            replaceTextNode(node, lang);
        });
    }

    function injectSwitcherStyles() {
        if (document.getElementById('langSwitcherStyles')) return;
        const style = document.createElement('style');
        style.id = 'langSwitcherStyles';
        style.textContent = `
            .language-switcher {
                display: flex;
                gap: 0.35rem;
                align-items: center;
                margin-left: 1rem;
                flex-wrap: nowrap;
            }
            .lang-btn {
                border: 1px solid rgba(255, 255, 255, 0.35);
                background: rgba(0, 0, 0, 0.15);
                color: #fff;
                border-radius: 999px;
                padding: 0.35rem 0.55rem;
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                line-height: 1;
                white-space: nowrap;
            }
            .lang-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }
            .lang-btn.active {
                background: rgb(255, 239, 170);
                color: rgb(24, 37, 110);
                border-color: rgb(255, 239, 170);
            }
            @media (max-width: 768px) {
                .language-switcher {
                    margin-left: 0;
                    margin-top: 0.4rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function buildSwitcher() {
        const existing = document.querySelector('.language-switcher');
        if (existing) return existing;

        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.setAttribute('aria-label', 'Language switcher');

        switcher.innerHTML = [
            '<button type="button" class="lang-btn" data-lang="en" aria-label="Switch to English">🇬🇧 EN</button>',
            '<button type="button" class="lang-btn" data-lang="de" aria-label="Auf Deutsch wechseln">🇩🇪 DE</button>',
            '<button type="button" class="lang-btn" data-lang="ru" aria-label="Переключить на русский">🇷🇺 RU</button>'
        ].join('');

        const adminContainer = document.querySelector('.admin-header .header-container');
        const standardHeader = document.querySelector('header');

        if (adminContainer) {
            const logout = adminContainer.querySelector('.logout');
            if (logout) {
                adminContainer.insertBefore(switcher, logout);
            } else {
                adminContainer.appendChild(switcher);
            }
        } else if (standardHeader) {
            if (standardHeader.querySelector('.header-actions')) {
                standardHeader.querySelector('.header-actions').appendChild(switcher);
            } else {
                standardHeader.appendChild(switcher);
            }
        }

        return switcher;
    }

    function updateActiveButton() {
        const current = getSavedLanguage();
        document.querySelectorAll('.lang-btn').forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-lang') === current);
        });
    }

    function applyLanguage() {
        const lang = getSavedLanguage();
        document.documentElement.lang = lang;
        translateByKey();
        translateByPhrase();
        updateActiveButton();
    }

    function setLanguage(lang, reloadPage) {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        setSavedLanguage(lang);
        applyLanguage();
        if (reloadPage) {
            window.location.reload();
        }
    }

    function init() {
        injectSwitcherStyles();
        buildSwitcher();
        applyLanguage();

        document.querySelectorAll('.lang-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const lang = button.getAttribute('data-lang');
                if (lang && lang !== getSavedLanguage()) {
                    setLanguage(lang, true);
                }
            });
        });
    }

    window.i18n = {
        t,
        getLang: getSavedLanguage,
        setLang: (lang) => setLanguage(lang, false),
        getLocale,
        applyLanguage
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
