$(window).load(function(){
	
	var avatarImg = $(".content-avatar-image .lazy-img").attr("data-src");
	if(typeof(avatarImg) != 'undefined'){
		$(".content-avatar-image .lazy-img").attr("src",avatarImg).removeAttr("data-src").addClass("active");
	}
	
	var mapImg = $("#min-map").attr("data-map-img");
	if(typeof(mapImg) != 'undefined'){
		$("#min-map").css("background-image","url('"+mapImg+"')").removeAttr("data-map-img");
	}
			
	$(window).scroll(function(){
		
		window_y = $(window).scrollTop();
		var mapLat = $("#content-map #map").attr("data-lat");
		var mapLng = $("#content-map #map").attr("data-lng");
		
		if (window_y >= 300) { 
			$(".similar-properties .lazy-img").each(function() {
				var imagen = $(this).attr("data-src");
				if(typeof(imagen) != 'undefined'){
					$(this).attr("src",imagen).removeAttr("data-src").addClass("active");
				}	
			});
			if((typeof(mapLat) != 'undefined') && (typeof(mapLng) != 'undefined')){
				showFullMap();
			}
		} else {}
		
	});
});

$(document).ready(function() {
	
	temporalHeight();
	
	var owl_carousel;
	owl_carousel = $("#slider-properties").owlCarousel({
		items: 3,
		lazyLoad:true,
		loop:true,
		responsive: {
			0: {
				items: 1,
			},
			768: {
				items: 2,
			},
			1000: {
				items: 3,
			}
		}
	});
	
	/**********************************************************/
	$("#email-friend").click(function() {
		active_modal($('#modal_email_to_friend'));
	});
	$("#schedule-now").click(function() {
		active_modal($('#modal_schedule'));
	});
	$("#calculator-mortgage").click(function() {
		active_modal($('#modal_calculator'));
	});
	$( window ).resize(function() {
		temporalHeight();
	});
	$("#btn-flight").on("touchstart click", function(){
		toggleFullScreen('full-slider');
	});
	$(".option-switch").click(function() {
		if ($(this).hasClass("active")) {
			return;
		}
		$(".option-switch").removeClass("active");
		$(this).addClass("active");
		var view = $(this).data('view');
		switch (view) {
			case 'gallery':
				$("#map-view").removeClass('active');
				$("#full-slider").removeClass('active');
				break;
			case 'map':
				showMap();
				break;
		}
	});
	$("#min-map").click(function() {
		showMap();
	});
	
	/** modal close **/
	$(".close-div").click(function() {
		$(".modal-welcome-login").fadeOut();
	});

	/** btn print **/
	$("#print-btn").click(function (e){
		e.preventDefault();
		
		var imgPrint = $("#slider-properties .owl-item.active li").eq(1).html();
		$("#imagen-print").html(imgPrint);
		
		$("#printMessageBox").fadeIn();
		$("#full-main").printArea({
			onClose: function () {
				$('#printMessageBox').fadeOut();
			}
		});
		
	});
	
	/** btn login modal **/
	$(".header-tab a").click(function() {
		var loginHeight = 0;
		
		$(".header-tab a").removeClass('active');
		$(this).addClass('active');
		var tabId = $(this).attr('data-tab');

		switch(tabId){
			case 'tabLogin': $('#modal_login h2').text('Welcome Back'); $(".text-slogan").text('Sign in below'); break;
			case 'tabRegister': $('#modal_login h2').text('Register'); $(".text-slogan").text('Join to save listings and receive updates'); break;
			case 'tabReset': $('#modal_login h2').text('Welcome Back'); $(".text-slogan").text('Sign in below'); break;
		}
		$(".item_tab").removeClass('active');
		$("#"+tabId).addClass('active');
		
		loginHeight = $("#content-info-modal").height();
		$(".img_modal").css({'height':loginHeight+'px'});
		
	});
	
	$("#login-btn").click(function() {
		active_modal($('#modal_login'));
		var modalImg = $("#modal_login .lazy-img").attr("data-src");
		if(typeof(modalImg) != 'undefined'){
			$("#modal_login .lazy-img").attr("src",modalImg).removeAttr("data-src");
		}
	});
	
	$(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e) {
		var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
		var event = state ? 'FullscreenOn' : 'FullscreenOff';

		$('#slider-properties').owlCarousel('destroy');
        $('#slider-properties').find('.owl-stage-outer').children().unwrap();
        $('#slider-properties').removeData();

        if (event == 'FullscreenOff') {
		
			$("#full-slider").removeClass("show-fullscreen");

			owl_carousel = $("#slider-properties").owlCarousel({
				items: 3,
				lazyLoad:true,
				loop:true,
				responsive: {
					0: {
						items: 1,
					},
					768: {
						items: 2,
					},
					1000: {
						items: 3,
					}
				}
			});
			
        } else { 

			$("#full-slider").addClass("show-fullscreen");

			owl_carousel = $("#slider-properties").owlCarousel({
				items: 1,
				lazyLoad:true,
				loop:true
			});
			
			var dotcount = 1;
		 
			$('.owl-dot').each(function() {
				$( this ).addClass( 'dotnumber' + dotcount);
				$( this ).attr('data-info', dotcount);
				dotcount=dotcount+1;
			});
				
			var slidecount = 1;
		 
			$('.owl-item').not('.cloned').each(function() {
				$( this ).addClass( 'slidenumber' + slidecount);
				slidecount=slidecount+1;
			});

			$('.owl-dot').each(function() {
				var grab = $(this).data('info');
				var slidegrab = $('.slidenumber'+ grab +' img').attr('src');
				if(typeof(slidegrab) == 'undefined'){
					slidegrab = $('.slidenumber'+ grab +' img').attr('data-src');
				}				  	
				$(this).css("background-image", "url("+slidegrab+")");  
			});
				
			var amount = $('.owl-dot').length;
			var gotowidth = 100/amount;
			
			$('.owl-dot').css("width", gotowidth+"%");
			var newwidth = jQuery('.owl-dot').width();
			$('.owl-dot').css("height", newwidth+"px");

        }
    });
	
	/****************** FULL SCREEN *****************/
	
	function toggleFullScreen(element) {
		var element = element;
        var divObj = document.getElementById(element);	
		
		if (divObj.requestFullscreen)   
			if (document.fullScreenElement) {
				document.cancelFullScreen();       
			} else {
				divObj.requestFullscreen();
			}
		else if (divObj.msRequestFullscreen)
			if (document.msFullscreenElement) {
				document.msExitFullscreen();
			} else {
				divObj.msRequestFullscreen();
			}
		else if (divObj.mozRequestFullScreen)
			if (document.mozFullScreenElement) {
				document.mozCancelFullScreen();
			} else {
				divObj.mozRequestFullScreen();
			}
		else if (divObj.webkitRequestFullscreen)
			if (document.webkitFullscreenElement) {
				document.webkitCancelFullScreen();
			} else {
			divObj.webkitRequestFullscreen();
		}
		
	}

});

function showMap(){
	$("#map-view").addClass('active');
	$(".option-switch").removeClass("active");
	if (!$("#show-map").hasClass("active")) {
		$("#show-map").addClass("active");
		$("#full-slider").addClass('active');
	}
	
	//mini map
	var flex_map_mini_view = $("#map-result");
	var myLatLng2 = {
		lat: parseFloat(flex_map_mini_view.data('lat')),
		lng: parseFloat(flex_map_mini_view.data('lng'))
	};
	var miniMap = new google.maps.Map(document.getElementById('map-result'), {
		zoom: 16,
		center: myLatLng2
	});
	var marker = new google.maps.Marker({
		position: myLatLng2,
		map: miniMap
	});
}

function showFullMap(){

	var flex_map_mini_view = $("#map");
	var myLatLng2 = {
		lat: parseFloat(flex_map_mini_view.data('lat')),
		lng: parseFloat(flex_map_mini_view.data('lng'))
	};
	var miniMap = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: myLatLng2
	});
	var marker = new google.maps.Marker({
		position: myLatLng2,
		map: miniMap
	});
	
	$("#map").removeAttr("data-lat");
	$("#map").removeAttr("data-lng");
}

function temporalHeight(){
	
	var finalTop = ($(".property-information").height()) + ($(".panel-options").height()) + 30;
	var heightContent = $("#property-description").height();
	
	var finalHeight = heightContent + 60;
	$(".temporal-content").height(finalHeight).css({'top': finalTop+'px'});
}