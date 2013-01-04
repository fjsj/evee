Template.datepicker.rendered = function () {
  var $datepicker = $('#datepicker');
  var $datepickerInput = $('#datepicker input');
  
  $datepicker.datepicker({
    format: 'dd/mm/yyyy',
    autoclose: true,
    todayBtn: "linked",
    todayHighlight: true
  }).on('show', function (ev) {
    scrollToIfHidden(".datepicker-dropdown", true, this);
  });

  $datepickerInput.click(function (ev) {
    $datepicker.datepicker("show");
  });

  selectedDate.setAsMoment(moment());
  $datepickerInput.val(selectedDate.getFormatted());
  $datepicker.on('changeDate', function (ev) {
    selectedDate.setAsMoment(moment.utc(ev.date.valueOf()));
  });
}
