$(function () {

	/*
	 * @param {object} opts
	 * @config {int} [duration] Timer duration (ms).
	 * @config {int} [interval] Timer update interval (ms).
	 * @config {function} [update] Update callback called per interval.
	 * @config {function} [done] Done callback called on timer completion.
	 */
	function timer(opts) {
		function noop() {}
		function currentTime() { return (new Date()).getTime(); }
		var startTime;
		var timeRemaining = opts.duration || 30000;
		var interval = opts.interval || 100;
		var update = opts.update || noop;
		var done = opts.done || noop;
		var runningTimer, elapsed;
		function onInterval() {
			elapsed = currentTime() - startTime;
			var finished = elapsed >= timeRemaining;
			if (finished) { clearInterval(runningTimer); done(); }
			else { return update(timeRemaining - elapsed); }
		}
		return {
			isRunning: false,
			pause: function () {
				clearInterval(runningTimer);
				timeRemaining = timeRemaining - elapsed;
				this.isRunning = false;
			},
			start: function () {
				startTime = currentTime();
				runningTimer = setInterval(onInterval, interval);
				this.isRunning = true;
			},
		};
	}

	var $counter = $('#counter').children().css('visibility', 'hidden');
	var $count = $('.count');
	var $timer = $('#timer');
	var $increment = $('.up-arrow');
	var $decrement = $('.down-arrow');
	var count = 0;
	var duration = (+window.location.hash.substring(1) * 1000) || 30000;
	var interval = 100;
	var clickEvent = 'touchstart';
	var countdown;

	$count.html(count);

	countdown = timer({
		duration: duration,
		interval: interval,
		update: function (timeRemaining) {
			timeRemaining = Math.round(timeRemaining / 100) / 10;
			$timer.html(timeRemaining + (timeRemaining % 1 === 0 ? '.0' : ''));
		},
		done: function () {
			timeRemaining = 0;
			$timer.add($increment).add($decrement).off(clickEvent);
			$increment.toggleClass('hide-content');
			$decrement.toggleClass('hide-content');
			$timer.html('Stop!');
			$timer.addClass('stop');
		}
	});

	$increment.on(clickEvent, function () {
		$count.html(++count);
	});
	$decrement.on(clickEvent, function () {
		if (count) { $count.html(--count); }
	});

	$timer.on(clickEvent, function () {
		if (!countdown.isRunning) {
			$timer.removeClass('start');
			$counter.css('visibility', 'visible');
			return countdown.start();
		}
		countdown.pause();
	});
});
