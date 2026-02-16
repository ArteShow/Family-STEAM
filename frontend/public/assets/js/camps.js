(function(){
	// Array of camps data - ready to be replaced with backend data
	const camps = [
		{
			id: 1,
			title: 'Lorem Ipsum Dolor',
			startDate: getOffsetDate(10),
			endDate: getOffsetDate(17),
			place: 'Consectetur Adipiscing Location',
			price: '€250',
			capacity: '8-15 years',
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

	function getOffsetDate(days) {
		const d = new Date();
		d.setDate(d.getDate() + days);
		return d.toISOString();
	}

	function formatDateRange(startISO, endISO) {
		const start = new Date(startISO);
		const end = new Date(endISO);
		const startStr = start.toLocaleDateString();
		const endStr = end.toLocaleDateString();
		return `${startStr} - ${endStr}`;
	}

	function getDayCount(startISO, endISO) {
		const start = new Date(startISO);
		const end = new Date(endISO);
		const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
		return diff;
	}

	const root = document.getElementById('campsRoot');
	if(!root) return;

	if(camps.length === 0) {
		root.innerHTML = '<p style="text-align:center;padding:2rem;color:#333">No camps available at the moment.</p>';
		return;
	}

	camps.forEach((camp, idx) => {
		const card = document.createElement('article');
		card.className = 'camp_card';
		card.style.animationDelay = `${idx * 120}ms`;

		// Carousel section
		const carousel = document.createElement('div');
		carousel.className = 'camp_carousel';

		const track = document.createElement('div');
		track.className = 'carousel_track';

		if (!camp.images || camp.images.length === 0) {
			camp.images = ['https://via.placeholder.com/800x500?text=Camp+Image'];
		}

		camp.images.forEach(src => {
			const slide = document.createElement('div');
			slide.className = 'carousel_slide';
			const img = document.createElement('img');
			img.className = 'carousel_image';
			img.src = src;
			img.alt = camp.title;
			slide.appendChild(img);
			track.appendChild(slide);
		});

		const leftBtn = document.createElement('button');
		leftBtn.className = 'carousel_btn left';
		leftBtn.innerHTML = '&#10094;';

		const rightBtn = document.createElement('button');
		rightBtn.className = 'carousel_btn right';
		rightBtn.innerHTML = '&#10095;';

		carousel.appendChild(leftBtn);
		carousel.appendChild(track);
		carousel.appendChild(rightBtn);

		// Info section
		const info = document.createElement('div');
		info.className = 'camp_info';

		const title = document.createElement('h4');
		title.textContent = camp.title;

		const shortDesc = document.createElement('p');
		shortDesc.className = 'camp_short_desc';
		shortDesc.textContent = camp.shortDesc;

		const icons = document.createElement('ul');
		icons.className = 'camp_icons';
		const dayCount = getDayCount(camp.startDate, camp.endDate);
		icons.innerHTML = `
			<li><i class="fa-solid fa-location-dot"></i> <span>${camp.place}</span></li>
			<li><i class="fa-solid fa-euro-sign"></i> <span>${camp.price}</span></li>
			<li><i class="fa-regular fa-calendar"></i> <span>${dayCount} days</span></li>
			<li><i class="fa-solid fa-users"></i> <span>${camp.capacity}</span></li>
		`;

		// Duration button to navigate to calendar
		const durationBtn = document.createElement('button');
		durationBtn.className = 'duration_btn';
		durationBtn.textContent = `📅 View on Calendar (${formatDateRange(camp.startDate, camp.endDate)})`;
		durationBtn.addEventListener('click', () => {
			// Navigate to calendar with camp ID for highlighting
			window.location.href = `calender.html?campId=${camp.id}&startDate=${encodeURIComponent(camp.startDate)}&endDate=${encodeURIComponent(camp.endDate)}`;
		});

		const registerBtn = document.createElement('a');
		registerBtn.className = 'register_btn';
		registerBtn.href = camp.registerUrl || '#';
		registerBtn.textContent = camp.registerLabel || 'Register Now';

		info.appendChild(title);
		info.appendChild(shortDesc);
		info.appendChild(icons);
		info.appendChild(durationBtn);
		info.appendChild(registerBtn);

		// Description container (expandable)
		const descContainer = document.createElement('div');
		descContainer.className = 'camp_desc_container';

		const expandBtn = document.createElement('button');
		expandBtn.className = 'expand_btn';
		expandBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
		expandBtn.setAttribute('aria-expanded', 'false');

		const descContent = document.createElement('div');
		descContent.className = 'camp_desc_content';
		descContent.innerHTML = `<p>${camp.description || 'No description available'}</p>`;

		descContainer.appendChild(expandBtn);
		descContainer.appendChild(descContent);

		// Assemble card
		card.appendChild(carousel);
		card.appendChild(info);
		card.appendChild(descContainer);
		root.appendChild(card);

		// Expand/collapse functionality
		expandBtn.addEventListener('click', function() {
			const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';
			expandBtn.setAttribute('aria-expanded', !isExpanded);
			descContent.classList.toggle('expanded');
			expandBtn.classList.toggle('rotated');
		});

		// Carousel logic
		let cur = 0;
		const slidesCount = camp.images.length;
		const trackEl = track;

		function updateTrack() {
			trackEl.style.transform = `translateX(-${cur * 100}%)`;
		}

		function show(index) {
			cur = (index + slidesCount) % slidesCount;
			updateTrack();
		}

		leftBtn.addEventListener('click', () => show(cur - 1));
		rightBtn.addEventListener('click', () => show(cur + 1));

		// Touch/swipe support
		let startX = 0, deltaX = 0, isDragging = false;
		carousel.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			deltaX = 0;
			isDragging = true;
			trackEl.style.transition = 'none';
		}, {passive: true});

		carousel.addEventListener('touchmove', (e) => {
			if(!isDragging) return;
			deltaX = e.touches[0].clientX - startX;
			trackEl.style.transform = `translateX(calc(-${cur * 100}% + ${deltaX}px))`;
		}, {passive: true});

		carousel.addEventListener('touchend', () => {
			isDragging = false;
			trackEl.style.transition = 'transform 420ms cubic-bezier(.22,.9,.3,1)';
			if(Math.abs(deltaX) > 50) {
				if(deltaX < 0) show(cur + 1);
				else show(cur - 1);
			} else {
				updateTrack();
			}
		});
	});

})();