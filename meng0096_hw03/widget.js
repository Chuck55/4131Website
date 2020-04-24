		function checkPassword(password) {
		console.log(password);
		var strength = 0
		if (password.length < 6) {
			document.getElementById("password_checking").innerHTML = "Too Short";
		}
		if (password.length > 7) strength += 1
		// If password contains both lower and uppercase characters, increase strength value.
		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
		// If it has numbers and characters, increase strength value.
		if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
		// If it has one special character, increase strength value.
		if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
		// If it has two special characters, increase strength value.
		if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
		// Calculated strength value, we can return messages
		// If value is less than 2
		if (strength < 2) {
			document.getElementById("password_checking").innerHTML = "Weak";
			document.getElementById("password_checking").style.color="red";
			document.getElementById("password_color").style.width="25%";

		} else if (strength == 2) {
			document.getElementById("password_checking").innerHTML = "Good";
			document.getElementById("password_checking").style.color="blue";
			document.getElementById("password_color").style.width="50%";
		} else {
			document.getElementById("password_checking").innerHTML = "Strong";
			document.getElementById("password_checking").style.color="green";
			document.getElementById("password_color").style.width="75%";
		}
	};
