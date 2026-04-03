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
				: [];

			eventImages.forEach(src => {
				const slide = document.createElement('div');
				slide.className = 'carousel_slide';
				const sImg = document.createElement('img');
				sImg.className = 'carousel_image';
				sImg.src = src;
				sImg.alt = ev.title;
				sImg.onerror = function() { 
					this.style.display = 'none';
					const noImg = document.createElement('div');
					noImg.className = 'carousel_no_image';
					noImg.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#999;font-size:1rem;';
					noImg.textContent = 'No image';
					this.parentNode.replaceChild(noImg, this);
				};
				slide.appendChild(sImg);
				track.appendChild(slide);
			});

			if (eventImages.length === 0) {
				const slide = document.createElement('div');
				slide.className = 'carousel_slide';
				const noImg = document.createElement('div');
				noImg.className = 'carousel_no_image';
				noImg.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#999;font-size:1rem;';
				noImg.textContent = 'No image';
				slide.appendChild(noImg);
				track.appendChild(slide);
			}

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
			info.className = 'event_info';

			const title = document.createElement('h4');
			title.textContent = ev.title + ' — ' + (new Date(ev.date)).toLocaleDateString();

			const icons = document.createElement('ul');
			icons.className = 'event_icons';
			icons.innerHTML = `
				<li><i class="fa-solid fa-location-dot"></i> <span>${ev.place}</span></li>
				<li><span style="color: #ff6b6b; font-weight: 600;">€ ${ev.price}</span></li>
				<li><i class="fa-regular fa-clock"></i> <span>${ev.duration}</span></li>
				<li><i class="fa-solid fa-users"></i> <span>${ev.persons}</span></li>
			`;

			const resp = document.createElement('p');
			resp.className = 'event_responsibility';
			resp.innerHTML = `<strong>Tags:</strong> ${ev.tags.join(', ') || t('dynamic.allEvents', 'Event')}`;

			const actions = document.createElement('div');
			actions.className = 'event_actions';

			const register = document.createElement('a');
			register.className = 'register_btn';
			register.href = ev.registerUrl || '/forms/event_register.html';
			register.textContent = t('dynamic.register', 'Register');
			
			const seeDescription = document.createElement('a');
			seeDescription.className = 'see_description_btn';
			seeDescription.href = '#';
			seeDescription.innerHTML = '<i class="fa-solid fa-arrow-down"></i> See description';
			
			const descModal = document.createElement('div');
			descModal.className = 'description_modal';
			descModal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;';
			
			const modalContent = document.createElement('div');
			modalContent.style.cssText = 'background:white;padding:2rem;border-radius:1rem;max-width:600px;max-height:80vh;overflow-y:auto;';
			modalContent.innerHTML = `<h3>${ev.title}</h3><p>${ev.description}</p><button onclick="this.parentNode.parentNode.classList.remove('active')" style="margin-top:1rem;padding:0.5rem 1rem;background:rgb(41,128,225);color:white;border:none;border-radius:0.5rem;cursor:pointer;">Close</button>`;
			descModal.appendChild(modalContent);
			document.body.appendChild(descModal);
			
			seeDescription.addEventListener('click', (e) => {
				e.preventDefault();
				descModal.classList.add('active');
			});
			
			const style = document.createElement('style');
			style.textContent = `.description_modal.active { display: flex !important; }`;
			if (!document.head.querySelector('style[data-modal-style-short]')) {
				style.setAttribute('data-modal-style-short', 'true');
				document.head.appendChild(style);
			}
			
			actions.appendChild(register);
			actions.appendChild(seeDescription);

			info.appendChild(title);
			info.appendChild(icons);
			info.appendChild(resp);
			info.appendChild(actions);

			// Create links container (formatted as inline links, not table)
			const linksContainer = document.createElement('div');
			linksContainer.className = 'event_links_container';
			linksContainer.style.cssText = 'margin-top:1.5rem;';
			
			if (ev.links && ev.links.length > 0) {
				const linksTitle = document.createElement('h5');
				linksTitle.textContent = t('dynamic.resources', 'Resources & Links');
				linksTitle.style.cssText = 'margin-bottom:1rem;color:rgb(24,37,110);';
				linksContainer.appendChild(linksTitle);
				
				const linksList = document.createElement('div');
				linksList.className = 'event_links_list';
				linksList.style.cssText = 'display:flex;flex-wrap:wrap;gap:1rem;';
				
				ev.links.forEach(link => {
					const linkItem = document.createElement('a');
					linkItem.href = link.url;
					linkItem.target = '_blank';
					linkItem.className = 'event_link_item';
					linkItem.innerHTML = `<i class="fa-solid fa-external-link-alt"></i> ${link.title_en || link.title || 'Link'}`;
					linksList.appendChild(linkItem);
				});
				
				linksContainer.appendChild(linksList);
			}

			row.appendChild(carousel);
			row.appendChild(info);
			row.appendChild(linksContainer);
			root.appendChild(row);

			let cur = 0;
			const slidesCount = eventImages.length > 0 ? eventImages.length : 1;
			const trackEl = track;

			function updateTrack(){
				trackEl.style.transform = `translateX(-${cur * 100}%)`;
			}

			function show(index){
				cur = (index + slidesCount) % slidesCount;
				updateTrack();
			}

			leftBtn.addEventListener('click', ()=> show(cur - 1));
			rightBtn.addEventListener('click', ()=> show(cur + 1));

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
