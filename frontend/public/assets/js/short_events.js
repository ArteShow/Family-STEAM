(async function(){
	const root = document.getElementById('eventsRoot');
	if(!root) return;
	const t = (key, fallback) => (window.i18n && typeof window.i18n.t === 'function')
		? window.i18n.t(key, fallback)
		: fallback;

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
		const allEvents = await window.apiUtils.fetchAllEvents();
		
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
		
		const upcoming = allEvents.filter(event => {
			const eventDate = new Date(event.starts_at || event.start_date);
			eventDate.setHours(0, 0, 0, 0);
			return eventDate >= now && eventDate <= thirtyDaysLater && !isCampEvent(event);
		});

		if (eventIdFromUrl) {
			const selected = allEvents.find(event => String(event.id) === String(eventIdFromUrl));
			if (selected && !isCampEvent(selected) && !upcoming.some(event => String(event.id) === String(selected.id))) {
				upcoming.push(selected);
			}
		}

		if(upcoming.length === 0){
			root.innerHTML = `<p style="text-align:center;padding:2rem;color:#333">${t('dynamic.noShortEvents', 'No short events in the next 30 days.')}</p>`;
			return;
		}

		const events = await Promise.all(upcoming.map(e => window.apiUtils.formatEventFromBackend(e)));
		const validEvents = events.filter(ev => !!ev);

		validEvents.forEach((ev, idx) => {
			const row = document.createElement('section');
			row.className = 'event_row' + (idx % 2 === 1 ? ' reverse' : '');
			row.style.animationDelay = `${idx * 120}ms`;
			row.id = 'event-' + ev.id;

			const carousel = document.createElement('div');
			carousel.className = 'event_carousel';

			const track = document.createElement('div');
			track.className = 'carousel_track';

			const eventImages = (ev.images && ev.images.length > 0)
				? ev.images
				: ['../images/slider1.webp'];

			eventImages.forEach(src => {
				const slide = document.createElement('div');
				slide.className = 'carousel_slide';
				const sImg = document.createElement('img');
				sImg.className = 'carousel_image';
				sImg.src = src;
				sImg.alt = ev.title;
				sImg.onerror = function() { this.src = '../images/slider1.webp'; };
				slide.appendChild(sImg);
				track.appendChild(slide);
			});

			const left = document.createElement('button');
			left.className = 'carousel_btn left';
			left.innerHTML = '&#10094;';

			const right = document.createElement('button');
			right.className = 'carousel_btn right';
			right.innerHTML = '&#10095;';

			carousel.appendChild(left);
			carousel.appendChild(track);
			carousel.appendChild(right);

			const info = document.createElement('div');
			info.className = 'event_info';

			const register = document.createElement('a');
			register.className = 'register_btn';
			register.href = ev.registerUrl || '/forms/event_register.html';
			register.textContent = t('dynamic.register', 'Register');
			
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

			const resp = document.createElement('p');
			resp.className = 'event_responsibility';
			resp.innerHTML = `<strong>Tags:</strong> ${ev.tags.join(', ') || t('dynamic.allEvents', 'Event')}`;

			const descContainer = document.createElement('div');
			descContainer.className = 'event_desc_container';

			const expandBtn = document.createElement('button');
			expandBtn.className = 'expand_btn';
			expandBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
			expandBtn.setAttribute('aria-expanded', 'false');

			const descContent = document.createElement('div');
			descContent.className = 'event_desc_content';
			descContent.innerHTML = `<p>${ev.description || t('dynamic.noDescription', 'No description available')}</p>`;

			descContainer.appendChild(expandBtn);
			descContainer.appendChild(descContent);

			const actions = document.createElement('div');
			actions.className = 'event_actions';

			const viewOnCalendar = document.createElement('a');
			viewOnCalendar.className = 'see_more_btn';
			viewOnCalendar.href = `calender.html?date=${encodeURIComponent(ev.date)}`;
			viewOnCalendar.textContent = t('dynamic.viewOnCalendar', 'View on Calendar');

			actions.appendChild(register);
			actions.appendChild(viewOnCalendar);

			info.appendChild(title);
			info.appendChild(icons);
			info.appendChild(resp);
			info.appendChild(actions);

			row.appendChild(carousel);
			row.appendChild(info);
			row.appendChild(descContainer);
			root.appendChild(row);

			expandBtn.addEventListener('click', function() {
				const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';
				expandBtn.setAttribute('aria-expanded', !isExpanded);
				descContent.classList.toggle('expanded');
				expandBtn.classList.toggle('rotated');
			});

			let cur = 0;
			const slidesCount = eventImages.length;
			const trackEl = track;
			trackEl.style.transition = 'transform 420ms cubic-bezier(.22,.9,.3,1)';

			function updateTrack(){
				trackEl.style.transform = `translateX(-${cur * 100}%)`;
			}

			function show(index){
				cur = (index + slidesCount) % slidesCount;
				updateTrack();
			}

			left.addEventListener('click', ()=> show(cur - 1));
			right.addEventListener('click', ()=> show(cur + 1));

			let startX = 0, deltaX = 0, isDragging = false;
			carousel.addEventListener('touchstart', (e) => {
				startX = e.touches[0].clientX;
				deltaX = 0;
				isDragging = true;
				trackEl.style.transition = 'none';
			}, {passive:true});
			carousel.addEventListener('touchmove', (e) => {
				if(!isDragging) return;
				deltaX = e.touches[0].clientX - startX;
				trackEl.style.transform = `translateX(calc(-${cur * 100}% + ${deltaX}px))`;
			}, {passive:true});
			carousel.addEventListener('touchend', () => {
				isDragging = false;
				trackEl.style.transition = 'transform 420ms cubic-bezier(.22,.9,.3,1)';
				if(Math.abs(deltaX) > 50){
					if(deltaX < 0) show(cur + 1); else show(cur - 1);
				} else {
					updateTrack();
				}
			});
		});

		if(eventIdFromUrl) {
			setTimeout(() => {
				const eventElement = document.getElementById('event-' + eventIdFromUrl);
				if(eventElement) {
					eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
					eventElement.style.border = '2px solid #2980b9';
					eventElement.style.boxShadow = '0 0 20px rgba(41, 128, 225, 0.5)';
				}
			}, 300);
		}
	} catch (error) {
		console.error('Error loading events:', error);
		root.innerHTML = `<p style="text-align:center;padding:2rem;color:#ff6b6b;">${t('dynamic.failedLoadEventsRefresh', 'Failed to load events. Please refresh.')}</p>`;
	}

})();
