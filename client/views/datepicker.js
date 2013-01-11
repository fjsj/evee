Template.datepicker.rendered = function () {
  var $datepicker = $('#datepicker');
  var $datepickerInput = $('#datepicker input');
  var $datepickerDropdown = $('.datepicker-dropdown');

  if ($datepickerDropdown.length !== 0) {
    $datepicker.datepicker("remove");
    $datepickerDropdown.remove();
  }
  $datepicker.datepicker({
    format: I18N.getDatepickerFormat(),
    language: I18N.getLanguage(),
    autoclose: true,
    todayBtn: "linked",
    todayHighlight: true
  }).on('show', function (ev) {
    $helpers.scrollToIfHidden(".datepicker-dropdown", true, this);
  });

  $datepickerInput.click(function (ev) {
    $datepicker.datepicker("show");
  });

  $datepickerInput.val(SelectedDate.getFormatted());
  $datepicker.on('changeDate', function (ev) {
    SelectedDate.setAsMoment(moment.utc(ev.date.valueOf()));
  });
};
