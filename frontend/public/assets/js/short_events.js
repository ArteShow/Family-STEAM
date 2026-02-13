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
			responsibility: 'Led by certified STEM instructors',
			description: `🤖 Join us for an exciting Mini Robotics Workshop designed to introduce young learners to the fundamentals of robotics and engineering!

This hands-on workshop will guide participants through the basics of robot assembly, programming, and problem-solving. Participants will work with educational robotics kits, learning how to build simple mechanisms, understand sensors, and write basic code to control their robots.

⚙️ Throughout the workshop, children will engage in team-based challenges that encourage creativity and critical thinking. Our experienced instructors create a supportive learning environment where mistakes become learning opportunities.

✨ This workshop is perfect for beginners with no prior robotics experience. Participants will take home a certificate of completion and an exclusive workshop guide. We provide all necessary equipment and materials.

🏆 By the end of this workshop, participants will have gained foundational knowledge in robotics, improved their problem-solving skills, and made new friends who share their interest in technology. The workshop emphasizes hands-on learning through building, experimenting, and collaborating with peers. Each participant receives individual attention and support from our instructors to ensure they get the most out of the experience.`,
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
			responsibility: 'Conducted by professional art facilitators',
			description: `🎨 Experience the joy of creative expression in our Family Painting Hour, where art becomes a bonding experience for all ages!

This inclusive workshop welcomes families with members ranging from young children to grandparents. Our professional art facilitators guide the creative journey while encouraging individual expression and unique artistic vision.

🖌️ The session features a relaxed, judgment-free environment where the process matters more than the final product. Participants can choose from various mediums including acrylics, watercolors, and mixed media. Whether you are an experienced artist or picking up a brush for the first time, there is something for everyone.

🎭 The workshop includes instruction on color theory, brush techniques, composition, and storytelling through art. Each family creates their own masterpiece to take home, or collaborate on a shared canvas if preferred.

❤️ Throughout the session, participants share creative ideas and appreciate each other's work in a supportive community setting. We provide all art supplies, aprons, and materials. The workshop concludes with a brief gallery walk where participants display and discuss their creations. This is a perfect opportunity to strengthen family bonds while exploring artistic talents!`,
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
			responsibility: 'Guided by amateur astronomy enthusiasts',
			description: `⭐ Discover the wonders of the night sky during our enchanting Star Gazing Night at scenic Hill Park!

This astronomy experience invites participants of all ages to explore the cosmos and marvel at celestial objects. Our knowledgeable guides use powerful telescopes to help you observe planets, star clusters, nebulae, and other deep-sky objects.

🔭 The evening begins with an introduction to the constellations visible in the current season, followed by telescope observations and interactive discussions about our universe. Learn about the life cycles of stars, galaxy formations, and the latest space missions.

✨ Even without telescopes, the naked eye reveals countless stars and constellations. We teach participants how to locate major constellations and navigate the night sky using simple techniques. The experience includes fascinating stories about mythology connected to the constellations.

🌙 Dress warmly as the evening can be cool, and bring blankets or camping chairs for comfortable viewing. We provide hot beverages and snacks. Clear skies are essential for this activity, but we reschedule if weather conditions are unfavorable. This unforgettable experience fosters appreciation for astronomy and ignites curiosity about our place in the universe!`,
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

		// Responsibility section
		const resp = document.createElement('p');
		resp.className = 'event_responsibility';
		resp.innerHTML = `<strong>Responsibility:</strong> ${ev.responsibility || 'Professional team'}`;

		// Expandable description section
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

		info.appendChild(title);
		info.appendChild(icons);
		info.appendChild(resp);
		info.appendChild(register);

		row.appendChild(carousel);
		row.appendChild(info);
		row.appendChild(descContainer);
		root.appendChild(row);

		// Expand/collapse functionality
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

		// touch / swipe support for mobile
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

