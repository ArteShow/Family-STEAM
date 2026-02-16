(function(){



	const events = shortEvents;

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

		const track = document.createElement('div');
		track.className = 'carousel_track';

		if (!ev.images || ev.images.length === 0) ev.images = ['https://via.placeholder.com/800x500?text=No+Image'];
		ev.images.forEach(src => {
			const slide = document.createElement('div');
			slide.className = 'carousel_slide';
			const sImg = document.createElement('img');
			sImg.className = 'carousel_image';
			sImg.src = src;
			sImg.alt = ev.title;
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

		const resp = document.createElement('p');
		resp.className = 'event_responsibility';
		resp.innerHTML = `<strong>Responsibility:</strong> ${ev.responsibility || 'Professional team'}`;

		const descContainer = document.createElement('div');
		descContainer.className = 'event_desc_container';

		const expandBtn = document.createElement('button');
		expandBtn.className = 'expand_btn';
		expandBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
		expandBtn.setAttribute('aria-expanded', 'false');

		const descContent = document.createElement('div');
		descContent.className = 'event_desc_content';
		descContent.innerHTML = `<p>${ev.description || 'No description available'}</p>`;

		descContainer.appendChild(expandBtn);
		descContainer.appendChild(descContent);

		const actions = document.createElement('div');
		actions.className = 'event_actions';

		const viewOnCalendar = document.createElement('a');
		viewOnCalendar.className = 'see_more_btn';
		viewOnCalendar.href = 'calender.html';
		viewOnCalendar.textContent = 'View on Calendar';

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
		const slidesCount = ev.images.length;
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

})();

