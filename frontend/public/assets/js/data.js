


function getOffsetDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
}

const shortEvents = [
    {
        id: 1,
        title: 'Lorem Dolor Sit',
        date: getOffsetDate(3),
        place: 'Consectetur Location',
        price: '€12',
        duration: '2h',
        persons: '6-12',
        tag: 'Workshop',
        responsibility: 'Led by professional facilitators',
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.`,
        images: [
            '../images/slider1.webp',
            '../images/slider2.jpg'
        ]
    },
    {
        id: 2,
        title: 'Adipiscing Elit Hour',
        date: getOffsetDate(10),
        place: 'Sed Do Studio',
        price: 'Free',
        duration: '1.5h',
        persons: 'All ages',
        tag: 'Activity',
        responsibility: 'Conducted by expert coordinators',
        description: `Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam.`,
        images: [
            '../images/slider1.webp',
            '../images/slider2.jpg',
            '../images/slider3.jpg'
        ]
    },
    {
        id: 3,
        title: 'Incididunt Ut Night',
        date: getOffsetDate(33),
        place: 'Labore Park',
        price: '€5',
        duration: '3h',
        persons: 'All ages',
        tag: 'Experience',
        responsibility: 'Guided by professional coordinators',
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.`,
        images: [
            '../images/slider3.jpg'
        ]
    }
];

const camps = [
    {
        id: 1,
        title: 'Lorem Ipsum Dolor',
        startDate: getOffsetDate(10),
        endDate: getOffsetDate(17),
        place: 'Consectetur Adipiscing Location',
        price: '€250',
        capacity: '8-15 years',
        tag: 'Camp',
        shortDesc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua universitas enim ad minim.',
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`,
        images: [
            '../images/slider1.webp',
            '../images/slider2.jpg',
            '../images/slider3.jpg'
        ]
    },
    {
        id: 2,
        title: 'Consectetur Adipiscing Elit',
        startDate: getOffsetDate(45),
        endDate: getOffsetDate(52),
        place: 'Sed Eiusmod Studio Lab',
        price: '€200',
        capacity: '6-18 years',
        tag: 'Camp',
        shortDesc: 'Incididunt ut labore et dolore magna aliqua sed do eiusmod tempor universitas.',
        description: `Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.`,
        images: [
            '../images/slider2.jpg',
            '../images/slider1.webp'
        ]
    },
    {
        id: 3,
        title: 'Tempor Incididunt Challenge',
        startDate: getOffsetDate(20),
        endDate: getOffsetDate(27),
        place: 'Ut Labore Et Dolore Hub',
        price: '€300',
        capacity: '10-16 years',
        tag: 'Camp',
        shortDesc: 'Magna aliqua ut enim ad minim veniam quis nostrud exercitation universitas.',
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit sed do eiusmod.`,
        images: [
            '../images/slider3.jpg',
            '../images/slider1.webp',
            '../images/slider2.jpg'
        ]
    }
];

function getIncomingEvents() {
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const incoming = [];

    shortEvents.forEach(event => {
        const eventDate = new Date(event.date);
        if (eventDate >= now && eventDate <= thirtyDaysLater) {
            incoming.push({
                ...event,
                type: 'event',
                pageLink: 'short_events.html'
            });
        }
    });

    camps.forEach(camp => {
        const startDate = new Date(camp.startDate);
        if (startDate >= now && startDate <= thirtyDaysLater) {
            incoming.push({
                id: `camp-${camp.id}`,
                title: camp.title,
                date: camp.startDate,
                endDate: camp.endDate,
                place: camp.place,
                price: camp.price,
                tag: camp.tag,
                shortDesc: camp.shortDesc,
                type: 'camp',
                pageLink: 'camps.html'
            });
        }
    });

    incoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return incoming;
}
