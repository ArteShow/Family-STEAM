(async function(){
	const root = document.getElementById('campsRoot');
	if(!root) return;

	const urlParams = new URLSearchParams(window.location.search);
	const eventIdFromUrl = urlParams.get('eventId');

	function isCampEvent(event) {
		const tag = (event.tag || '').toLowerCase();
		if (tag.includes('camp')) return true;

		const start = new Date(event.starts_at || event.start_date);
		const end = new Date(event.ends_at || event.end_date);
		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

		const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
		return durationDays >= 2;
	}

	try {
		// Fetch all events from backend
		const allEvents = await window.apiUtils.fetchAllEvents();
		
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		
		// Filter camps that start in future
		const futureEvents = allEvents.filter(event => {
			const eventDate = new Date(event.starts_at || event.start_date);
			eventDate.setHours(0, 0, 0, 0);
			return eventDate >= now && isCampEvent(event);
		});

		if(futureEvents.length === 0){
			root.innerHTML = '<p style="text-align:center;padding:2rem;color:#333">No camps available at the moment.</p>';
			return;
		}

		// Format and render all events as cards
		const camps = await Promise.all(futureEvents.map(e => window.apiUtils.formatEventFromBackend(e)));
		const validCamps = camps.filter(camp => !!camp);

		validCamps.forEach((camp, idx) => {
			const card = document.createElement('article');
			card.className = 'camp_card';
			card.style.animationDelay = `${idx * 120}ms`;
			card.id = 'camp-' + camp.id;

			const carousel = document.createElement('div');
			carousel.className = 'camp_carousel';

			const track = document.createElement('div');
			track.className = 'carousel_track';

			const campImages = (camp.images && camp.images.length > 0)
				? camp.images
				: ['../images/slider1.webp'];

			campImages.forEach(src => {
				const slide = document.createElement('div');
				slide.className = 'carousel_slide';
				const img = document.createElement('img');
				img.className = 'carousel_image';
				img.src = src;
				img.alt = camp.title;
				img.onerror = function() { this.src = '../images/slider1.webp'; };
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

			const info = document.createElement('div');
			info.className = 'camp_info';

			const title = document.createElement('h4');
			title.textContent = camp.title;

			const shortDesc = document.createElement('p');
			shortDesc.className = 'camp_short_desc';
			shortDesc.textContent = camp.shortDesc || camp.description || 'No description available';

			const icons = document.createElement('ul');
			icons.className = 'camp_icons';
			const dayCount = (() => {
				const start = new Date(camp.startDate);
				const end = new Date(camp.endDate);
				const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
				return diff > 0 ? diff : 1;
			})();

			icons.innerHTML = `
				<li><i class="fa-solid fa-location-dot"></i> <span>${camp.place}</span></li>
				<li><i class="fa-solid fa-euro-sign"></i> <span>${camp.price}</span></li>
				<li><i class="fa-regular fa-calendar"></i> <span>${dayCount} days</span></li>
				<li><i class="fa-solid fa-users"></i> <span>${camp.persons}</span></li>
			`;

			const actions = document.createElement('div');
			actions.className = 'camp_actions';

			const viewCalendarBtn = document.createElement('a');
			viewCalendarBtn.className = 'view_calendar_btn';
			viewCalendarBtn.href = `calender.html?date=${encodeURIComponent(camp.startDate)}`;
			viewCalendarBtn.textContent = 'View on Calendar';

			const registerBtn = document.createElement('a');
			registerBtn.className = 'register_btn';
			registerBtn.href = camp.registerUrl || '/forms/camp_register.html';
			registerBtn.textContent = camp.registerLabel || 'Register Now';

			actions.appendChild(registerBtn);
			actions.appendChild(viewCalendarBtn);

			info.appendChild(title);
			info.appendChild(shortDesc);
			info.appendChild(icons);
			info.appendChild(actions);

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

			card.appendChild(carousel);
			card.appendChild(info);
			card.appendChild(descContainer);
			root.appendChild(card);

			expandBtn.addEventListener('click', function() {
				const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';
				expandBtn.setAttribute('aria-expanded', !isExpanded);
				descContent.classList.toggle('expanded');
				expandBtn.classList.toggle('rotated');
			});

			let cur = 0;
			const slidesCount = campImages.length;
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

		if(eventIdFromUrl) {
			setTimeout(() => {
				const campElement = document.getElementById('camp-' + eventIdFromUrl);
				if(campElement) {
					campElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
					campElement.style.border = '2px solid #2980b9';
					campElement.style.boxShadow = '0 0 20px rgba(41, 128, 225, 0.5)';
				}
			}, 300);
		}
	} catch (error) {
		console.error('Error loading camps:', error);
		root.innerHTML = '<p style="text-align:center;padding:2rem;color:#ff6b6b;">Failed to load camps. Please refresh.</p>';
	}

})();