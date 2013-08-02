(function(){
  var demo_scan = [' ', 'new Date()', '"2013/7/21" ,"YYYY/M/D"', '"Sep. 5, 2013 13:30", "MMM. D, YYYY HH:mm"', 'new Date(1995,11,17)', 'new Date(2013,3,18,7,45,30)', '"01/01/01", "MM/DD/YY"'],
      demo_format= ['YYYY-MM-DD', 'MMMM D, YYYY', 'D MM YYYY', 'DDD of MMMM, YYYY', 'MMM. D, YYYY', 'MM.DD.YY', 'M/D', 'HH:mm', 'hh:mm:ss', 'YYYY MM DD HH:mm:ss'],
      $scan = $('.scan'),
      $format = $('.format'),
      $console = $('.console'),
      done = 0;
      tid = null;

  function random(n) {
    return Math.floor(Math.random() * n);
  }

  function typeScan() {
    $scan.typeTo(demo_scan[random(demo_scan.length)]);
  }

  function typeFormat() {
    $format.typeTo(demo_format[random(demo_format.length)]);
  }

  function evaluate() {
    $console.text(eval('d8s('+ $scan.text() +').print("'+ $format.text() +'")')).addClass('light-up');
    setTimeout(function(){ $console.removeClass('light-up') }, 500);
  }

  $scan.on('typer:done', typeFormat);
  $format.on('typer:done', function(){
    evaluate();
    tid = setTimeout(function(){ typeScan(); }, 3000);
  });
  $('.scan,.format').on('click', function(){
    clearTimeout(tid);
  }).on('keydown', function(evt){
    if (evt.which === 13) {
      evt.preventDefault();
      evaluate();
    }
  }).on('keyup', function(evt){
    if ($(evt.target).text() === '') {
      typeScan();
    }
  }).on('blur', evaluate);

  typeScan();

})();
