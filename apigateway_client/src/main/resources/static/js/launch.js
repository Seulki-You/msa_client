var global = {
    mobileClient: false,
    savePermit: true,
    usd: 0,
    eur: 0
};

/**
 * Oauth2
 */

function requestOauthToken(username, password) {

	var success = false;

	$.ajax({
		url: 'http://192.168.10.178:8080/oauth/token',
		contextType:'application/x-www-form-urlencoded',
		datatype: 'json',
		type: 'post',
		headers: {'Authorization': 'Basic YXBpZ2F0ZXdheTphcGlnYXRld2F5MTI='},
		async: false,
		data: {
			scope: 'read write',
			username: username,
			password: password,
			grant_type: 'password'
		},
		success: function (data){
			localStorage.setItem('token',data.access_token);
			success = true;
		},
		error: function () {
			removeOauthTokenFromStorage();
		}
	});

	return success;
}

function getOauthTokenFromStorage() {
	return localStorage.getItem('token');
}

function removeOauthTokenFromStorage() {
    return localStorage.removeItem('token');
}

/**
 * Current account
 */

function getCurrentAccount() {

	var token = getOauthTokenFromStorage();
	var account = null;

	if (token) {
		$.ajax({
			url: 'http://192.168.10.178:8080/users/current',
			datatype: 'json',
			type: 'get',
			headers: {'Authorization': 'Bearer ' + token},
			async: false,
			success: function (data) {
				account = data;
			},
			error: function () {
				removeOauthTokenFromStorage();
			}
		});
	}

	return account;
}

function getProfile(){
	var token = getOauthTokenFromStorage();
	var profile = null;
	var myUrl = 'http://192.168.10.178:8080/users/' + localStorage.getItem('username');
	
	if (token) {
		$.ajax({
			url: myUrl,
			datatype: 'json',
			type: 'get',
			headers: {'Authorization': 'Bearer ' + token},
			async: false,
			success: function (data) {
				alert("성공");
				profile = data;
			},
			error: function () {
				removeOauthTokenFromStorage();
			}
		});
	}

	return profile;
}

function getAlarm(){
	var token = getOauthTokenFromStorage();
	var notice = null;
	var myUrl = 'http://192.168.10.176:8763/notice/' + localStorage.getItem('username');
	
	if (token) {
		$.ajax({
			url: myUrl,
			datatype: 'json',
			type: 'get',
			headers: {'Authorization': 'Bearer ' + token},
			async: false,
			success: function (data) {
				alert("성공");
				notice = data;
			},
			error: function () {
				removeOauthTokenFromStorage();
			}
		});
	}
	
	return notice;
}
$(window).load(function(){

	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		FastClick.attach(document.body);
        global.mobileClient = true;
	}

    $.getJSON("http://api.fixer.io/latest?base=RUB", function( data ) {
        global.eur = 1 / data.rates.EUR;
        global.usd = 1 / data.rates.USD;
    });

	var account = getCurrentAccount();

	if (account) {
		showGreetingPage(account);
	} else {
		showLoginForm();
	}
});

function showGreetingPage(account) {
    initAccount(account);
	var userAvatar = $("<img />").attr("src","images/userpic.jpg");
	$(userAvatar).load(function() {
		$("#user_profile_text").html(localStorage.getItem('username'));
		setTimeout(initGreetingPage, 500);
	});
}

function showLoginForm() {
	$("#loginpage").show();
	$("#frontloginform").focus();
	setTimeout(initialShaking, 700);
}