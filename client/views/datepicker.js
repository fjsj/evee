function isScrolledIntoView (selector, fully) {
  // http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(selector).offset().top;
  var elemBottom = elemTop + $(selector).height();

  var isVisible = (elemBottom <= docViewBottom) && (elemTop >= docViewTop);
  if (fully) {
    return isVisible = isVisible && (elemBottom >= docViewTop) && (elemTop <= docViewBottom);
  }
  return isVisible;
}

function scrollTo (selector) {
  $('html, body').animate({
    scrollTop: $(selector).offset().top
  }, 500);
}

function scrollToIfHidden (selector, partially, destinationSelector) {
  if (!isScrolledIntoView(selector, partially)) {
    scrollTo(destinationSelector);
  }
}

Template.datepicker.rendered = function () {
  var $datepicker = $('#datepicker');
  var $datepickerInput = $('#datepicker input');
  var $datepickerDropdown = $('.datepicker-dropdown');

  if ($datepickerDropdown.length != 0) {
    $datepicker.datepicker("remove");
    $datepickerDropdown.remove();
  }
  $datepicker.datepicker({
    format: i18n.getDatepickerFormat(),
    language: i18n.getLanguage(),
    autoclose: true,
    todayBtn: "linked",
    todayHighlight: true
  }).on('show', function (ev) {
    scrollToIfHidden(".datepicker-dropdown", true, this);
  });

  $datepickerInput.click(function (ev) {
    $datepicker.datepicker("show");
  });

  $datepickerInput.val(selectedDate.getFormatted());
  $datepicker.on('changeDate', function (ev) {
    selectedDate.setAsMoment(moment.utc(ev.date.valueOf()));
  });
};
