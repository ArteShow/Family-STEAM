(function(){
	const events = [
		{
			id: 1,
			title: 'Mini Robotics Workshop',
			date: getOffsetDate(3),
			place: 'Community Center',
			price: '€12',
			duration: '2h',
			persons: '6-12',
			images: [
				'../images/math-camp.jpg',
				'../images/math-camp.jpg'
			]
		},
		{
			id: 2,
			title: 'Family Painting Hour',
			date: getOffsetDate(10),
			place: 'Art Studio',
			price: 'Free',
			duration: '1.5h',
			persons: 'All ages',
			images: [
                '../images/slider1.webp',
                '../images/slider2.jpg',
                '../images/slider3.jpg'
			]
		},
		{
			id: 3,
			title: 'Star Gazing Night',
			date: getOffsetDate(33),
			place: 'Hill Park',
			price: '€5',
			duration: '3h',
			persons: 'All ages',
			images: [
				'https://via.placeholder.com/800x500?text=Stars+1'
			]
		}
	];

	function getOffsetDate(days){
		const d = new Date(); d.setDate(d.getDate() + days);
		return d.toISOString();
	}

	function isWithinNextDays(isoDate, days){
		const now = new Date();
		const target = new Date(isoDate);
		const diff = (target - now) / (1000*60*60*24);
		return diff >= 0 && diff <= days;
	}

	const root = document.getElementById('eventsRoot');
	if(!root) return;

	const upcoming = events.filter(e=> isWithinNextDays(e.date,30));

	if(upcoming.length === 0){
		root.innerHTML = '<p style="text-align:center;padding:2rem;color:#333">No short events in the next 30 days.</p>';
		return;
	}

	upcoming.forEach((ev, idx) => {
		const row = document.createElement('section');
		row.className = 'event_row' + (idx % 2 === 1 ? ' reverse' : '');
		row.style.animationDelay = `${idx * 120}ms`;

		const carousel = document.createElement('div');
		carousel.className = 'event_carousel';

		const img = document.createElement('img');
		img.className = 'carousel_image';
		img.src = ev.images[0] || 'https://via.placeholder.com/800x500?text=No+Image';
		img.alt = ev.title;

		const left = document.createElement('button');
		left.className = 'carousel_btn left';
		left.innerHTML = '&#10094;';

		const right = document.createElement('button');
		right.className = 'carousel_btn right';
		right.innerHTML = '&#10095;';

		carousel.appendChild(left);
		carousel.appendChild(img);
		carousel.appendChild(right);

		const info = document.createElement('div');
		info.className = 'event_info';

		const register = document.createElement('a');
		register.className = 'register_btn';
		register.href = ev.registerUrl || '#';
		register.textContent = ev.registerLabel || 'Register';
		const title = document.createElement('h4');
		title.textContent = ev.title + ' — ' + (new Date(ev.date)).toLocaleDateString();

		const icons = document.createElement('ul');
		icons.className = 'event_icons';
		icons.innerHTML = `
			<li><i class="fa-solid fa-location-dot"></i> <span>${ev.place}</span></li>
			<li><i class="fa-solid fa-euro-sign"></i> <span>${ev.price}</span></li>
			<li><i class="fa-regular fa-clock"></i> <span>${ev.duration}</span></li>
			<li><i class="fa-solid fa-users"></i> <span>${ev.persons}</span></li>
		`;

		info.appendChild(title);
		info.appendChild(icons);
		info.appendChild(register);

		row.appendChild(carousel);
		row.appendChild(info);
		root.appendChild(row);

		let cur = 0;
		function show(index){
			if(!ev.images || ev.images.length === 0) return;
			cur = (index + ev.images.length) % ev.images.length;
			img.src = ev.images[cur];
		}

		left.addEventListener('click', ()=> show(cur - 1));
		right.addEventListener('click', ()=> show(cur + 1));
	});

})();

