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
		url: 'http://localhost:8080/oauth/token',
		contextType:'application/x-www-form-urlencoded',
		datatype: 'json',
		type: 'post',
		headers: {'Authorization': 'Basic YXBpZ2F0ZXdheTphcGlnYXRld2F5MTI='},
		async: false,
		data: {
			scope: 'write read',
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
			url: 'http://localhost:8080/users/current',
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

/**
 * 개인 정보 불러오기
 * 
 */

function getProfile(){
	
	var token = getOauthTokenFromStorage();
	var account = null;
	var myUrl = 'http://localhost:8080/users/'+localStorage.getItem('username');
	if (token) {
		$.ajax({
			url: myUrl,
			datatype: 'json',
			type: 'get',
			headers: {'Authorization': 'Bearer ' + token},
			async: false,
			success: function (data) {
				if(localStorage.getItem('name')){
					localStorage.removeItem('name');
					localStorage.setItem('name', data.name);
				}else{
					localStorage.setItem('name', data.name);
				}
				
				if(localStorage.getItem('email')){
					localStorage.removeItem('email');
					localStorage.setItem('email', data.email);
				}else{
					localStorage.setItem('email', data.email);
				}
				
			},
			error: function () {
				removeOauthTokenFromStorage();
			}
		});
	}
	
}

function getAlarm(){
	console.log("알림 호출됨");

	var token = getOauthTokenFromStorage();
	var account = null;
	var myUrl = 'http://localhost:8763/notice/'+localStorage.getItem('username');
	if (token) {
		$.ajax({
			url: myUrl,
			datatype: 'json',
			type: 'get',
			headers: {'Authorization': 'Bearer ' + token},
			async: false,
			success: function (data) {
				console.log("알림 가져오기 성공");
				for(var notice in data){
					//console.log(data[notice]);
					add_notice(data[notice]);
				}
			},
			error: function () {
				console.log("알림 가져오기 실패");
				removeOauthTokenFromStorage();
			}
		});
	}
	
}
function getStory(){
	var token = getOauthTokenFromStorage();
	var account = null;
	var myUrl = 'http://localhost:8768/story/';
	if (token) {
		$.ajax({
			url: myUrl,
			datatype: 'json',
			type: 'get',
			headers: {'Authorization': 'Bearer ' + token},
			async: false,
			success: function (data) {
				console.log("스토리 가져오기 성공");
				for(var story in data){
					//console.log(data[notice]);
					add_story(data[story]);
				}
			},
			error: function () {
				console.log("알림 가져오기 실패");
				removeOauthTokenFromStorage();
			}
		});
	}
}

function getMyStory(){
	var token = getOauthTokenFromStorage();
	var account = null;
	var myUrl = 'http://localhost:8768/story/'+localStorage.getItem('username');
	if (token) {
		$.ajax({
			url: myUrl,
			datatype: 'json',
			type: 'get',
			headers: {'Authorization': 'Bearer ' + token},
			async: false,
			success: function (data) {
				console.log("내 스토리 가져오기 성공");
				for(var story in data){
					console.log("여기 처리해줘야한다~~~~");
				}
				
			},
			error: function () {
				console.log("내 스토리 가져오기 실패");
				removeOauthTokenFromStorage();
			}
		});
	}
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