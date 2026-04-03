(async function(){
	const root = document.getElementById('campsRoot');
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
		
		const futureEvents = allEvents.filter(event => {
			const eventDate = new Date(event.starts_at || event.start_date);
			eventDate.setHours(0, 0, 0, 0);
			return eventDate >= now && isCampEvent(event);
		});

		if(futureEvents.length === 0){
			root.innerHTML = `<p style="text-align:center;padding:2rem;color:#333">${t('dynamic.noCamps', 'No camps available at the moment.')}</p>`;
			return;
		}

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
				: [];

			campImages.forEach(src => {
				const slide = document.createElement('div');
				slide.className = 'carousel_slide';
				const img = document.createElement('img');
				img.className = 'carousel_image';
				img.src = src;
				img.alt = camp.title;
				img.onerror = function() { 
					this.style.display = 'none';
					const noImg = document.createElement('div');
					noImg.className = 'carousel_no_image';
					noImg.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#999;font-size:1rem;';
					noImg.textContent = 'No image';
					this.parentNode.replaceChild(noImg, this);
				};
				slide.appendChild(img);
				track.appendChild(slide);
			});

			if (campImages.length === 0) {
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
			info.className = 'camp_info';

			const title = document.createElement('h4');
			title.textContent = camp.title;

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
				<li><span style="color: #ff6b6b; font-weight: 600;">€ ${camp.price}</span></li>
				<li><i class="fa-regular fa-calendar"></i> <span>${dayCount} ${t('dynamic.days', 'days')}</span></li>
				<li><i class="fa-solid fa-users"></i> <span>${camp.persons}</span></li>
			`;

			const actions = document.createElement('div');
			actions.className = 'camp_actions';

			const registerBtn = document.createElement('a');
			registerBtn.className = 'register_btn';
			registerBtn.href = camp.registerUrl || '/forms/camp_register.html';
			registerBtn.textContent = camp.registerLabel || t('dynamic.registerNow', 'Register Now');

			const viewCalendarBtn = document.createElement('a');
			viewCalendarBtn.className = 'view_calendar_btn';
			viewCalendarBtn.href = 'calender.html';
			viewCalendarBtn.innerHTML = '<i class="fa-regular fa-calendar"></i> View on Calendar';

			const seeDescription = document.createElement('a');
			seeDescription.className = 'see_description_btn';
			seeDescription.href = '#';
			seeDescription.innerHTML = '<i class="fa-solid fa-arrow-down"></i> See description';
			
			const descModal = document.createElement('div');
			descModal.className = 'description_modal';
			descModal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;';
			
			const modalContent = document.createElement('div');
			modalContent.style.cssText = 'background:white;padding:2rem;border-radius:1rem;max-width:600px;max-height:80vh;overflow-y:auto;';
			modalContent.innerHTML = `<h3>${camp.title}</h3><p>${camp.description}</p><button onclick="this.parentNode.parentNode.classList.remove('active')" style="margin-top:1rem;padding:0.5rem 1rem;background:rgb(41,128,225);color:white;border:none;border-radius:0.5rem;cursor:pointer;">Close</button>`;
			descModal.appendChild(modalContent);
			
			seeDescription.addEventListener('click', (e) => {
				e.preventDefault();
				descModal.classList.add('active');
			});
			
			const style = document.createElement('style');
			style.textContent = `.description_modal.active { display: flex !important; }`;
			if (!document.head.querySelector('style[data-modal-style]')) {
				style.setAttribute('data-modal-style', 'true');
				document.head.appendChild(style);
			}
			document.body.appendChild(descModal);

			actions.appendChild(registerBtn);
			actions.appendChild(viewCalendarBtn);
			actions.appendChild(seeDescription);

			info.appendChild(title);
			info.appendChild(icons);
			info.appendChild(actions);

			// Create links container (formatted as inline links, not table)
			const linksContainer = document.createElement('div');
			linksContainer.className = 'camp_links_container';
			linksContainer.style.cssText = 'margin-top:1.5rem;';
			
			if (camp.links && camp.links.length > 0) {
				const linksTitle = document.createElement('h5');
				linksTitle.textContent = t('dynamic.resources', 'Resources & Links');
				linksTitle.style.cssText = 'margin-bottom:1rem;color:rgb(24,37,110);';
				linksContainer.appendChild(linksTitle);
				
				const linksList = document.createElement('div');
				linksList.className = 'camp_links_list';
				linksList.style.cssText = 'display:flex;flex-wrap:wrap;gap:1rem;';
				
				camp.links.forEach(link => {
					const linkItem = document.createElement('a');
					linkItem.href = link.url;
					linkItem.target = '_blank';
					linkItem.className = 'camp_link_item';
					linkItem.innerHTML = `<i class="fa-solid fa-external-link-alt"></i> ${link.title_en || link.title || 'Link'}`;
					linksList.appendChild(linkItem);
				});
				
				linksContainer.appendChild(linksList);
			}

			card.appendChild(carousel);
			card.appendChild(info);
			card.appendChild(linksContainer);
			root.appendChild(card);

			let cur = 0;
			const slidesCount = campImages.length > 0 ? campImages.length : 1;
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
		root.innerHTML = `<p style="text-align:center;padding:2rem;color:#ff6b6b;">${t('dynamic.failedLoadCampsRefresh', 'Failed to load camps. Please refresh.')}</p>`;
	}

})();
