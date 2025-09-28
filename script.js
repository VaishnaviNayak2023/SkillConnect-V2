document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE NAVIGATION TOGGLE ---
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerIcon && mobileMenu) {
    hamburgerIcon.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  // --- MESSAGE BOX FUNCTION ---
  const messageContainer = document.getElementById('message-container');
  function showMessage(message, type) {
    if (!messageContainer) return;

    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('px-4', 'py-3', 'rounded-lg', 'shadow-md', 'mb-2', 'transition-all', 'duration-300');

    if (type === 'success') {
      messageElement.classList.add('bg-green-100', 'text-green-800');
    } else {
      messageElement.classList.add('bg-red-100', 'text-red-800');
    }

    messageContainer.appendChild(messageElement);
    setTimeout(() => {
      messageElement.style.opacity = '0';
      setTimeout(() => messageElement.remove(), 300);
    }, 4000);
  }

  // --- CONTACT FORM LOGIC ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const emailAddress = document.getElementById('emailAddress').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!fullName || !emailAddress || !subject || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      console.log('Form Submitted:', { fullName, emailAddress, subject, message });
      showMessage('Thank you for your message! We will get back to you soon.', 'success');
      contactForm.reset();
    });
  }

  // --- HANDLE URL PARAMETERS FOR FORM MESSAGES ---
  function handleFormMessages() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');

    if (status && message) {
      showMessage(decodeURIComponent(message), status);
    }
  }
  handleFormMessages();

  // --- JOBS FILTER LOGIC ---
  const jobSearchInput = document.querySelector('.jobs-search-bar .search-input');
  const jobCategoryFilter = document.getElementById('job-category-filter');
  const jobLocationFilter = document.getElementById('job-location-filter');
  const jobTypeFilter = document.getElementById('job-type-filter');
  const jobClearFiltersButton = document.querySelector('.jobs-search-filter-container .clear-filters-button');
  const jobsFoundTextElement = document.querySelector('.jobs-found-text');
  const jobCards = document.querySelectorAll('.job-card');

  const filterJobs = () => {
    if (!jobsFoundTextElement || jobCards.length === 0 || !jobSearchInput || !jobCategoryFilter || !jobLocationFilter || !jobTypeFilter) return;

    const searchTerm = jobSearchInput.value.toLowerCase();
    const selectedCategory = jobCategoryFilter.value;
    const selectedLocation = jobLocationFilter.value;
    const selectedType = jobTypeFilter.value;
    let visibleJobsCount = 0;

    jobCards.forEach(card => {
      const title = card.querySelector('.job-title')?.textContent.toLowerCase() || '';
      const company = card.querySelector('.job-company')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.job-description')?.textContent.toLowerCase() || '';
      const skills = Array.from(card.querySelectorAll('.job-skill-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
      const cardTags = Array.from(card.querySelectorAll('.job-tag')).map(tag => tag.textContent.toLowerCase());
      const cardLocationText = card.querySelector('.job-location')?.textContent.toLowerCase() || '';
      const isRemoteJob = cardTags.includes('remote');

      const matchesSearch = searchTerm === '' || title.includes(searchTerm) || company.includes(searchTerm) || description.includes(searchTerm) || skills.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || cardTags.includes(selectedCategory);
      const matchesLocation = selectedLocation === 'all' || cardLocationText.includes(selectedLocation.toLowerCase()) || (selectedLocation === 'remote' && isRemoteJob);
      const matchesType = selectedType === 'all' || cardTags.includes(selectedType);

      if (matchesSearch && matchesCategory && matchesLocation && matchesType) {
        card.style.display = 'flex';
        visibleJobsCount++;
      } else {
        card.style.display = 'none';
      }
    });

    jobsFoundTextElement.textContent = `${visibleJobsCount} jobs found`;
  };

  if (jobSearchInput) jobSearchInput.addEventListener('input', filterJobs);
  if (jobCategoryFilter) jobCategoryFilter.addEventListener('change', filterJobs);
  if (jobLocationFilter) jobLocationFilter.addEventListener('change', filterJobs);
  if (jobTypeFilter) jobTypeFilter.addEventListener('change', filterJobs);
  if (jobClearFiltersButton) jobClearFiltersButton.addEventListener('click', () => {
    if (jobSearchInput) jobSearchInput.value = '';
    if (jobCategoryFilter) jobCategoryFilter.value = 'all';
    if (jobLocationFilter) jobLocationFilter.value = 'all';
    if (jobTypeFilter) jobTypeFilter.value = 'all';
    filterJobs();
  });

  // --- MENTORS FILTER LOGIC ---
  const mentorSearchInput = document.querySelector('.mentors-search-bar .search-input');
  const industryFilter = document.getElementById('industry-filter');
  const mentorLocationFilter = document.getElementById('mentor-location-filter');
  const mentorClearFiltersButton = document.querySelector('.mentors-search-filter-container .clear-filters-button');
  const mentorsFoundTextElement = document.querySelector('.mentors-found-text');
  const mentorCards = document.querySelectorAll('.mentor-card');

  const filterMentors = () => {
    if (!mentorsFoundTextElement || mentorCards.length === 0 || !mentorSearchInput || !industryFilter || !mentorLocationFilter) return;

    const searchTerm = mentorSearchInput.value.toLowerCase();
    const selectedIndustry = industryFilter.value;
    const selectedLocation = mentorLocationFilter.value;
    let visibleMentorsCount = 0;

    mentorCards.forEach(card => {
      const name = card.querySelector('.mentor-name')?.textContent.toLowerCase() || '';
      const role = card.querySelector('.mentor-role')?.textContent.toLowerCase() || '';
      const bio = card.querySelector('.mentor-bio')?.textContent.toLowerCase() || '';
      const skills = Array.from(card.querySelectorAll('.mentor-skill-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
      const locationText = card.querySelector('.mentor-location')?.textContent.toLowerCase() || '';
      const matchesIndustry = selectedIndustry === 'all' || skills.includes(selectedIndustry);
      const matchesSearch = searchTerm === '' || name.includes(searchTerm) || role.includes(searchTerm) || bio.includes(searchTerm) || skills.includes(searchTerm);
      const matchesLocation = selectedLocation === 'all' || locationText.includes(selectedLocation.toLowerCase());

      if (matchesSearch && matchesIndustry && matchesLocation) {
        card.style.display = 'flex';
        visibleMentorsCount++;
      } else {
        card.style.display = 'none';
      }
    });

    mentorsFoundTextElement.textContent = `${visibleMentorsCount} mentors found`;
  };

  if (mentorSearchInput) mentorSearchInput.addEventListener('input', filterMentors);
  if (industryFilter) industryFilter.addEventListener('change', filterMentors);
  if (mentorLocationFilter) mentorLocationFilter.addEventListener('change', filterMentors);
  if (mentorClearFiltersButton) mentorClearFiltersButton.addEventListener('click', () => {
    if (mentorSearchInput) mentorSearchInput.value = '';
    if (industryFilter) industryFilter.value = 'all';
    if (mentorLocationFilter) mentorLocationFilter.value = 'all';
    filterMentors();
  });

  // --- COURSES FILTER LOGIC ---
  const courseSearchInput = document.querySelector('.discover-course-section .search-input');
  const categoryFilter = document.getElementById('category-filter');
  const locationFilter = document.getElementById('location-filter');
  const durationFilter = document.getElementById('duration-filter');
  const difficultyFilter = document.getElementById('difficulty-filter');
  const sortByFilter = document.getElementById('sort-by-filter');
  const certifiedCheckbox = document.getElementById('certified-checkbox');
  const showingCoursesTextElement = document.querySelector('.showing-courses-text');
  const courseCards = document.querySelectorAll('.course-list-card');

  const filterCourses = () => {
    if (!showingCoursesTextElement || courseCards.length === 0 || !courseSearchInput) return;

    const searchTerm = courseSearchInput.value.toLowerCase();
    const selectedCategory = categoryFilter?.value || 'all';
    const selectedLocation = locationFilter?.value || 'all';
    const selectedDuration = durationFilter?.value || 'all';
    const selectedDifficulty = difficultyFilter?.value || 'all';
    const selectedSortBy = sortByFilter?.value || 'rating';
    const showCertifiedOnly = certifiedCheckbox?.checked || false;

    let visibleCourses = [];

    courseCards.forEach(card => {
      const title = card.querySelector('.course-list-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.course-list-description')?.textContent.toLowerCase() || '';
      const provider = card.querySelector('.provider-text')?.textContent.toLowerCase() || '';
      const skills = Array.from(card.querySelectorAll('.key-skill-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
      const isCertified = !!card.querySelector('.cert-tag.certified');
      const locationText = card.querySelector('[data-key^="list"][data-key$="Location"]')?.textContent.toLowerCase() || '';
      const courseLevel = card.querySelector('.level-tag')?.textContent.toLowerCase() || '';
      const courseDurationText = card.querySelector('[data-key^="list"][data-key$="Duration"]')?.textContent.toLowerCase() || '';
      const durationMatch = courseDurationText.match(/(\d+)\s*weeks/);
      const courseDurationWeeks = durationMatch ? parseInt(durationMatch[1]) : 0;

      const matchesSearch = searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm) || provider.includes(searchTerm) || skills.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || (card.dataset.category === selectedCategory);
      const matchesLocation = selectedLocation === 'all' || (selectedLocation === 'online' ? locationText.includes('online') : locationText.includes(selectedLocation.toLowerCase()));
      const matchesDuration = selectedDuration === 'all' || 
        (selectedDuration === 'short' && courseDurationWeeks < 8) || 
        (selectedDuration === 'medium' && courseDurationWeeks >= 8 && courseDurationWeeks <= 12) ||
        (selectedDuration === 'long' && courseDurationWeeks > 12);
      const matchesDifficulty = selectedDifficulty === 'all' || courseLevel.includes(selectedDifficulty);
      const matchesCertified = !showCertifiedOnly || isCertified;

      if (matchesSearch && matchesCategory && matchesLocation && matchesDuration && matchesDifficulty && matchesCertified) {
        visibleCourses.push(card);
      }
    });

    // Sorting
    if (selectedSortBy === 'rating') {
      visibleCourses.sort((a, b) => (parseFloat(b.dataset.rating) || 0) - (parseFloat(a.dataset.rating) || 0));
    } else if (selectedSortBy === 'popularity') {
      visibleCourses.sort((a, b) => (parseInt(b.dataset.students) || 0) - (parseInt(a.dataset.students) || 0));
    }

    courseCards.forEach(card => card.style.display = 'none');
    visibleCourses.forEach(card => card.style.display = 'block');
    showingCoursesTextElement.textContent = `Showing ${visibleCourses.length} of ${courseCards.length} courses`;
  };

  if (courseSearchInput) courseSearchInput.addEventListener('input', filterCourses);
  if (categoryFilter) categoryFilter.addEventListener('change', filterCourses);
  if (locationFilter) locationFilter.addEventListener('change', filterCourses);
  if (durationFilter) durationFilter.addEventListener('change', filterCourses);
  if (difficultyFilter) difficultyFilter.addEventListener('change', filterCourses);
  if (sortByFilter) sortByFilter.addEventListener('change', filterCourses);
  if (certifiedCheckbox) certifiedCheckbox.addEventListener('change', filterCourses);

  // --- AUTH LOGIN/SIGNUP LOGIC WITH AJAX ---
  const formInner = document.getElementById('form-inner');
  const showLoginLink = document.getElementById('show-login');
  const showSignupLink = document.getElementById('show-signup');
  const passwordToggles = document.querySelectorAll('.password-toggle');

  if (showLoginLink && formInner) showLoginLink.addEventListener('click', e => { e.preventDefault(); formInner.classList.remove('flipped'); });
  if (showSignupLink && formInner) showSignupLink.addEventListener('click', e => { e.preventDefault(); formInner.classList.add('flipped'); });

  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      toggle.innerHTML = input.type === 'password' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  });

  // AJAX Login
  const loginForm = document.querySelector('.card-front .form');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      if (!email || !password) { showMessage('Please enter email & password.', 'error'); return; }

      const formData = new FormData();
      formData.append('action', 'login');
      formData.append('login-email', email);
      formData.append('login-password', password);

      try {
        const res = await fetch('auth.php', { method: 'POST', body: formData });
        const data = await res.json();
        showMessage(data.message, data.status);
        if (data.status === 'success' && data.redirect) window.location.href = data.redirect;
      } catch (err) { showMessage('Server error. Try again.', 'error'); }
    });
  }

  // AJAX Signup
  const signupForm = document.querySelector('.card-back .form');
  if (signupForm) {
    signupForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      if (!name || !email || !password) { showMessage('Please fill all fields.', 'error'); return; }

      const isValidPassword = password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
      if (!isValidPassword) { showMessage('Password must be 8+ chars with letters, numbers & symbols.', 'error'); return; }

      const formData = new FormData();
      formData.append('action', 'signup');
      formData.append('signup-name', name);
      formData.append('signup-email', email);
      formData.append('signup-password', password);

      try {
        const res = await fetch('auth.php', { method: 'POST', body: formData });
        const data = await res.json();
        showMessage(data.message, data.status);
        if (data.status === 'success' && data.redirect) window.location.href = data.redirect;
      } catch (err) { showMessage('Server error. Try again.', 'error'); }
    });
  }

  // Google Login Button
  const googleButton = document.querySelector('.social-button.google');
  if (googleButton) {
    googleButton.addEventListener('click', () => {
      window.location.href = 'auth.php?google=login';
    });
  }

  // --- INITIAL FILTER CALLS ---
  filterJobs(); 
  filterMentors();
  filterCourses();

});

/*google translate in navbar*/
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,kok,mr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}
(function() {
    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(gtScript);
})();