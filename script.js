$(function () {

	var $counter = $('#counter');
	var $count = $('#count');
	var $timer = $('#timer');
	var count = 0;
	var time = window.location.hash.substring(1) || 30;
	var interval = 0.1;
	var timer;
	var clickEvent = 'touchstart';

	$count.html(count);

	$('#increment').on(clickEvent, function () {
		$count.html(++count);
	});

	$('#decrement').on(clickEvent, function () {
		if (count) { $count.html(--count); }
	});

	$timer.on(clickEvent, function () {
		$timer.removeClass('start');
		$timer.html(time);
		$counter.removeClass('hidden');
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}
		else {
			timer = setInterval(function () {
				time = roundToOneDP(time - interval);
				if (time >= 0) {
					$timer.html(time);
				}
				else {
					$timer.html('Stop!');
					$timer.off(clickEvent);
					$timer.addClass('stop');
					clearTimeout(timer);
				}
			}, interval * 1000);
		}
	});

	function roundToOneDP(num) {
		return Math.round(num * 10) / 10;
	}

});
