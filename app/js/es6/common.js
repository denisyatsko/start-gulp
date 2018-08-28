$(document).ready(function() {

	// preloader
	// $(window).on("load", function() {
	// 	var $preloader = $("#preloader");
	// 	$preloader.delay(250).fadeOut('slow');
	// });

	// toTop
	$(window).scroll(function() {
		var windowHeight = $(window).height();
		if ($(this).scrollTop() > windowHeight) {
			$("#toTop").fadeIn();
		} else {
			$("#toTop").fadeOut();
		}
	});
	$("#toTop").on("click", function(e) {
		e.preventDefault();
		$("html, body").animate({ scrollTop: 0 }, 800);
	});

	// Validate and submite form
	$("form").each(function() {
	    $(this).validate({
			rules: {
				name: {
					required: true,
					minlength: 3
				},
				phone: {
					required: true,
				},
				message: {
					required: true
				}
			},
			messages: {
				name: {
					required: "Это поле обязательно для заполнения",
					minlength: "Длина должна быть не менее 3-х символов"
				},
				phone: {
					required: "Это поле обязательно для заполнения"
				},
				message: {
					required: "Это поле обязательно для заполнения"
				}
			},
			submitHandler: function(){
				alert('Спасибо за заявку, с вами свяжутся в ближайшее время!');
				var th = $(this); // ВНИМАТЕЛЬНО ПРОВЕРИТЬ ЭТОТ МОМЕНТ, РАБОТАЕТ ЛИ this
					$.ajax({
						type: "POST",
						url: "mail.php",
						data: th.serialize()
					}).done(function() {
						setTimeout(function() {
							th.trigger("reset");
						}, 1000);
					});
				return false;
			}
		});
	});

	// phone input mask
	// $("input[name='phone']").mask("(999) 999-99-99");

	// Scroll on click to #id
	$(".main-menu li a[href^='#'], .footer-menu li a[href^='#']").on('click', function(event){
	    var target = $(this.getAttribute('href'));
	    if (target.length){
	        event.preventDefault();
	        $('html, body').stop().animate({
	            scrollTop: target.offset().top
	        }, 1000); 
	        // close toggle menu  
		    if ($(".toggle-menu").hasClass("on")) {
				$(".main-menu").slideToggle(400);
				$("body").removeClass("overflow-body");
				$(".toggle-menu").removeClass("on");
			}
	    }
	});

	// show toggle-menu 
	$(".toggle-menu").click(function(){
		$(this).toggleClass("on");
		$("body").toggleClass("overflow-body");
		$(".main-menu").slideToggle().css({'display':'flex'});
	});
	
	// var mainSlider = tns({
	//     container: '.paralellogram-slider',
	//     items: 3,
	//     navAsThumbnails: true,
	//     lazyload: true,
	//     mouseDrag: true,
	//     speed: 700,
	//     controlsContainer: ".arrow-wrap",
	//     autoplay: false,
	//     autoplayTimeout: 2500,
	//     autoplayButtonOutput: false,
	//     responsive: {
	// 	    768: {
	// 	      items: 3
	// 	    },
	// 	    480: {
	// 	      items: 2
	// 	    },
	// 	    320: {
	// 	      items: 1
	// 	    }
	// 	  },
	//   });

	// bootstrap-4 accardion events SHOW and HIDE
	$(".collapse").on('show.bs.collapse', function () {
		$(this).prev(".faq-card-header").addClass("active");
	});
	$(".collapse").on('hide.bs.collapse', function () {
		$(this).prev(".faq-card-header").removeClass("active");
	});

	// show popup
	$(".btn-popup").click(function(){
		var popupWindow = $("#"+ $(this).attr('rel'));
		popupWindow.show();
		$(".overflow").show();
		$("body").addClass("overflow-body");
	});

});
