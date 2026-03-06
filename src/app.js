(function(){
  const form = document.getElementById('registerForm');
  const msg = document.getElementById('formMessages');
  const detectBtn = document.getElementById('detectLocation');
  const locationStatus = document.getElementById('locationStatus');

  /**
	 * showMessage(text, isError)
	 * Display a short message to the user in the form message area.
	 * - Updates the message text and applies a color based on error state.
	 * @param {string} text - Message to display.
	 * @param {boolean} isError - If true, show as error (red); otherwise show success (green).
	 */
	function showMessage(text, isError){
		msg.textContent = text;
		msg.style.color = isError ? '#b31' : '#0a6';
	}

	/**
	 * validateEmail(email)
	 * Perform a conservative validation of an email address using a regex.
	 * Returns true for strings that look like a basic email (local@domain.tld).
	 * @param {string} email
	 * @returns {boolean}
	 */
	function validateEmail(email){
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	/**
	 * validatePhone(phone)
	 * Validate a phone number field. The phone is optional; empty value is considered valid.
	 * Uses a permissive regex to allow digits, plus, parentheses, dots, dashes and spaces.
	 * @param {string} phone
	 * @returns {boolean}
	 */
	function validatePhone(phone){
		if(!phone) return true; // optional field
		return /^[\d+().\-\s]{6,20}$/.test(phone);
	}

	/**
	 * passwordStrength(pwd)
	 * Compute a simple strength score (0-4) for the given password:
	 * - +1 if length >= 8
	 * - +1 if contains an uppercase letter
	 * - +1 if contains a digit
	 * - +1 if contains a non-alphanumeric character
	 * This is a lightweight heuristic to gate weak passwords in the demo.
	 * @param {string} pwd
	 * @returns {number} score (0..4)
	 */
	function passwordStrength(pwd){
		let score = 0;
		if(pwd.length >= 8) score++;
		if(/[A-Z]/.test(pwd)) score++;
		if(/[0-9]/.test(pwd)) score++;
		if(/[^A-Za-z0-9]/.test(pwd)) score++;
		return score; // 0-4
	}

  /**
	 * Form submit handler
	 * - Prevents default submit, validates input fields (email, phone, password match & strength, terms).
	 * - Builds a small non-sensitive summary object for demo logging (passwords not included).
	 * - In a real app, this is where you'd POST form data to the server.
	 * @param {Event} e
	 */
	form.addEventListener('submit', function(e){
		e.preventDefault();
		msg.textContent = '';

		const data = new FormData(form);
		const email = data.get('email')||'';
		const password = data.get('password')||'';
		const confirm = data.get('confirmPassword')||'';
		const phone = data.get('phone')||'';

		if(!validateEmail(email)){
			showMessage('Please enter a valid email address.', true);
			return;
		}
		if(!validatePhone(phone)){
			showMessage('Please enter a valid phone number.', true);
			return;
		}
		if(password !== confirm){
			showMessage('Passwords do not match.', true);
			return;
		}
		const strength = passwordStrength(password);
		if(strength < 3){
			showMessage('Password is too weak. Use upper/lower/digits/symbols.', true);
			return;
		}
		if(!data.get('terms')){
			showMessage('You must accept the terms and conditions.', true);
			return;
		}

		// Build a small summary (do not include raw passwords)
		const summary = {
			username: data.get('username'),
			name: (data.get('firstName')||'') + ' ' + (data.get('lastName')||''),
			email: data.get('email'),
			phone: data.get('phone'),
			city: data.get('city'),
			country: data.get('country')
		};

		showMessage('Registration looks good — form ready to be submitted.');
		console.log('Form submission payload (example):', summary);

		// In a real app you would POST the FormData to the server here.
	});

  /**
	 * detectBtn click handler
	 * - Triggers the browser geolocation API to attempt to read the user's coordinates.
	 * - Updates the UI with status, coordinates or an error message.
	 * - Uses a 10 second timeout for the geolocation call.
	 */
	detectBtn.addEventListener('click', function(){
		locationStatus.textContent = 'Detecting location...';
		if(!navigator.geolocation){
			locationStatus.textContent = 'Geolocation is not supported by your browser.';
			return;
		}
		navigator.geolocation.getCurrentPosition(function(position){
			const lat = position.coords.latitude.toFixed(6);
			const lon = position.coords.longitude.toFixed(6);
			locationStatus.textContent = `Lat: ${lat}, Lon: ${lon}`;
		}, function(err){
			locationStatus.textContent = 'Unable to detect location: ' + (err.message||err.code);
		}, {timeout:10000});
	});

})();
