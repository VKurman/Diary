$(function(){
	// $( "#tabs" ).tabs();
	$( "#datepicker" ).datepicker({ dateFormat: 'dd/mm/yy'}).attr({placeholder:"Дата события"});

//конструктор событичя
  function Event(time1, data1, name1, eventText1, mood1, formatText1, img1, video1, place1){
    this.data = data1;
    this.name = name1;
    this.eventText = eventText1;
    this.time = time1;
    this.mood = mood1;
    this.formatText = formatText1;
    this.img = img1;
    this.video = video1;
    this.place = place1;  
  };
//функция которая возращает масив с ключами к ЛС 
  function keysArr(Arr){
    var lslength = localStorage.length;
        if(lslength > 0){
          for(var i = 0; i < lslength; i++){
            var key = localStorage.key(i);
            if(key.indexOf(key.match(/\d{8}/g)) == 0){
              Arr.push(key)
            };
          };
        }; 
    return;
  }
//функция которая по заданым кординатам строит маркер
  function cordinats(key){
    var myLatlng = new google.maps.LatLng(JSON.parse(localStorage.getItem(key)).place[0], JSON.parse(localStorage.getItem(key)).place[1]);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      cursor: JSON.parse(localStorage.getItem(key)).time,
      title: JSON.parse(localStorage.getItem(key)).name
    });
    map.setCenter(myLatlng);
    return ;
  }
// функция отвечает за скрытие и отображение контента меню
  function changeMenu(content){
    $('#eventAdd').addClass("moveaway")
    $('#event').addClass("moveaway")
    $('#eventList').addClass("moveaway")
    $('#places').addClass("moveaway");
    $(content).toggleClass('moveaway');
    return ;
  }
// функция которая отлавливает изминение хеша
  function changeHash(){
    var hash = location.hash;
    changeMenu(hash);
    return;
  }
  window.addEventListener('hashchange', changeHash);

// функция поиск адреса и рисует маркер по этому адресу
  function findAddress() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          title: $('#name').val().trim() || "без названия" 
        });
        var cordinats = results[0].geometry.location;
        $('#lat').empty().append(cordinats.k);
        $('#lng').empty().append(cordinats.D);
        google.maps.event.addListener(marker,"dragend", function(event) {
          lat = marker.getPosition().lat();
          lng = marker.getPosition().lng();
          $('#lat').empty().append(lat);
          $('#lng').empty().append(lng) 
        });  
      } else {
        alert('Такой адресс не найден');
      }
    });
    return;
  }
// функция отрисовывает карту в заданом диве
  function showMap(id){
    var startplace= new google.maps.LatLng(49.986, 36.237);        
    var mapOptions = {
      zoom: 13,
      center: startplace,
    };
    map = new google.maps.Map(document.getElementById(id), mapOptions);         
    return;
  };
// функция добавляет елемент в список событий
  function makerList(key){         
    $('<li>').attr({class: 'date','data-item': key}).prependTo('#listHolder');
    $('<form>').prependTo('#listHolder li:first');
    $('<input>')
      .attr({class: 'list', 'type': "button", 'value':"Удалить событие", 'data-delete': 'delete'})
      .prependTo('.date form:first');
    $('<a>')
      .attr({href:'#event', class: 'list', 'data-menu':"#event", 'data-lookevent': JSON.parse(localStorage.getItem(key)).time} )
      .text(JSON.parse(localStorage.getItem(key)).name)
      .prependTo('.date form:first');
    $('<p>',{class: 'list'})
      .text('Дата создания события:' + '  ' + JSON.parse(localStorage.getItem(key)).data)
      .prependTo('.date form:first');
    $('<div>',{class: 'format mood'})
      .addClass(JSON.parse(localStorage.getItem(key)).mood)
      .prependTo('.date form:first');
    return;
  }
// функция показывает событие при просмотре события 
  function showEvetn(key){
    $('#eventHolder').empty();
    if(!JSON.parse(localStorage.getItem(key)).place[0] == ""){  
      $('<div>')
        .attr({'class':'map', id:'showmap'})
        .prependTo('#eventHolder');      
    };  
    if(!JSON.parse(localStorage.getItem(key)).img == ''){
      $('<img>',{id:"img", src:JSON.parse(localStorage.getItem(key)).img})
        .prependTo('#eventHolder');
    };
    if(!JSON.parse(localStorage.getItem(key)).video == ''){
      $('<iframe></iframe>')
        .attr({frameborder:"0", id:"video", src:JSON.parse(localStorage.getItem(key)).video})
        .prependTo('#eventHolder');
    };        
    $('<p>')
      .attr('class', JSON.parse(localStorage.getItem(key)).formatText)
      .text(JSON.parse(localStorage.getItem(key)).eventText)
      .prependTo('#eventHolder');       
    $('<p>')
      .text('Название события:' + '  ' + JSON.parse(localStorage.getItem(key)).name)
      .prependTo('#eventHolder');
    $('<p>')
      .text('Дата создания события:' + '  ' + JSON.parse(localStorage.getItem(key)).data)
      .prependTo('#eventHolder');
    return;
  };
//создания списка событий из локолторедж
  function getEvents(){
    var Arr = [];
    keysArr(Arr);
    for(var i = 0; i < Arr.length; i++){
      var key =  Arr[i];          
      makerList(key);
    };
  return;
  };
// функция удаляет исходные данные из создания списка
  function clearEventAdd(){
    $('#name').val("").attr({placeholder:"Название события"});
    $('#datepicker').val("").attr({placeholder:"Дата события"});
    $('#eventText').val("").attr({placeholder:"Текст события", 'data-moodnew':'1no mood'}).removeClass();
    $('.mood').removeClass("borderRadius");
    $('.img').val("").removeClass('moveaway');
    $('.video').val("").removeClass('moveaway');
    $('.imgbutton').removeClass('moveaway');
    $('.videobutton').removeClass('moveaway');
    $('#ImgVideo').empty();
    $('#lat').empty();
    $('#lng').empty(); 
    $('#map').addClass('moveaway');
    $('[data-i="iaddress"]').toggleClass('moveaway');
    $('#address').toggleClass('moveaway');
  };
// проветка на налицие событий в ЛС
    getEvents();
//клик повесил на весь документ который сробатывает на индетификотор(индетификатором является атрибут data-*)
  $(document).on('click', function(e){
    var target = $(e.target);
// клик на выдиление текста меню 
    var content = target.attr('data-menu');
      if(content){
        changeMenu(content);
        $('.menu a').removeClass('bold');
         target.addClass('bold');
      };
// клик на фоматирование текста (жирный, курсив, подчер.)
    var changeFormat = target.attr('data-format');
      if(changeFormat){
        $($('#eventText')).toggleClass(changeFormat);
      };
// клик на фоматирование цвета текста 
    var changeColor = target.attr('data-color');
      if(changeColor){
        $('#eventText')
          .removeClass("greenText")
          .removeClass("redText")
          .removeClass("blueText")
          .addClass(changeColor);
      };
// клик на фоматирование настроение
     var changeMood = target.attr('data-mood');
      if(changeMood){
        $('#eventText').attr('data-moodnew', changeMood);
        $('.mood').removeClass("borderRadius");
        target.addClass("borderRadius");
      };
// клик надобавление картикки
    var imgAdd = target.attr('data-img');
      if(imgAdd){
        $('<img>')
          .attr({id:"img", src:$('.img').val().trim()})
          .prependTo('#ImgVideo');
        $('.img').addClass('moveaway');
        $('.imgbutton').addClass('moveaway');
      };
// клик на добавление видео
    var videoAdd = target.attr('data-video');
      if(videoAdd){
        var video = $('.video').val().trim();
        var pattern = /<iframe.+<\/iframe>/g;
        var patternWatch = /.+watch.+/;
        if(pattern.test(video)){
          $(video).prependTo('#ImgVideo');
          $('.video').addClass('moveaway');
        }else if(patternWatch.test(video)){
          var video2 = video.replace(/.+watch\?v=/, '');
        $('<iframe></iframe>')
          .attr({id:"video", src:"https://www.youtube.com/embed/"+video2})
          .prependTo('#ImgVideo');
          $('.video').addClass('moveaway');
          $('.videobutton').addClass('moveaway')  
        };
      };
// клик на добавление карты
    var mapAdd = target.attr('data-map');
      if(mapAdd){
        $('#map').toggleClass('moveaway');
        $('[data-i="iaddress"]').toggleClass('moveaway');
        $('#address').toggleClass('moveaway');
        showMap(mapAdd);
        google.maps.event.addListener(map, 'click', function (event) {
          addMarker(event.latLng);
        });//добавляем событие нажание мышки 
        function addMarker(location) {
          var marker = new google.maps.Marker({
            position: location,
            draggable: true,
            animation: google.maps.Animation.DROP, 
            map: map,
            title: $('#name').val().trim() || "без названия"
          }); 
          lat = marker.getPosition().lat();
          lng = marker.getPosition().lng();
          $('#lat').empty().append(lat);
          $('#lng').empty().append(lng) 
          google.maps.event.addListener(marker,"dragend", function(event) {
            lat = marker.getPosition().lat();
            lng = marker.getPosition().lng();
            $('#lat').empty().append(lat);
            $('#lng').empty().append(lng) 
          });     
        };
      };
// клик на поиск по адресуe
    var addAddress = target.attr('data-i');
      if(addAddress){
        findAddress();
      };
//клик создание события
    var newEvent = target.attr('name');  
      if(newEvent){
          //создание елементов конструктора
        var time = $('#datepicker').val().replace(/\//g, ',').split(",").reverse().join("")
        var data = $('#datepicker').val();
        var name = $('#name').val().trim();
        var eventText = $('#eventText').val().trim();
        var mood = $('#eventText').attr('data-moodnew');
        var formatText = $('#eventText').attr('class');
        var img = $('#img').attr('src') || '';
        var video = $('#video').attr('src') || '';
        var place = [$('#lat').val(), $('#lng').val()] || "didn't addPlace";
    //создание объекта события и проверки на заполняемость полей
        if(name !== ''){
          if(eventText !== ''){
            if(data !== ''){
              var createEvent = new Event(time, data, name, eventText, mood, formatText, img, video, place);
              //добавление события в локол сторедж
              $('#listHolder').empty()
              localStorage.setItem(time, JSON.stringify(createEvent))
              getEvents();
              clearEventAdd();
            }else{$('#datepicker').attr({placeholder:"Введите дату"})};
          }else{$('#eventText').attr({placeholder:"Введите текст события (Поле обезательно для ввода)"})};
        }else{$('#name').attr({placeholder:"Введите название события (Поле обезательно для ввода)"})};
      };
//сортировка события по дате события
    var sortData = target.attr('data-sortData');
      if(sortData){
        var Arr = [];
        keysArr(Arr);
        $('#listHolder').empty();
        var keySort = Arr.sort();
        for(var i = 0; i < keySort.length; i++){
          var key = keySort[i];
          makerList(key);
        }; 
      };     
//сортировка по настроению события
    var sortData = target.attr('data-sortMood');
      if(sortData){
        var Arr = [];
        keysArr(Arr);
        $('#listHolder').empty();
        var sortMoodArr = Arr.sort(function(event1, event2) {
            if (JSON.parse(localStorage.getItem(event1)).mood < JSON.parse(localStorage.getItem(event2)).mood) return -1;
            if (JSON.parse(localStorage.getItem(event1)).mood > JSON.parse(localStorage.getItem(event2)).mood) return 1;
            return 0;
          });
        for(var j = 0; j < sortMoodArr.length; j++){
         var key = sortMoodArr[j];
          makerList(key);
        };
      };
//поиск по названию
    var searchName = target.attr('data-searchName');
      if(searchName){
        var Arr = [];
        keysArr(Arr);
        var key = '';
        for(var i = 0; i < Arr.length; i++){
          if(JSON.parse(localStorage.getItem(Arr[i])).name === $('#searchName').val().trim()){
            key = Arr[i];
            break;            
          };
        };
        if(!key == ''){
          $('#listHolder').empty();
          makerList(key);
        }else{alert("Событие не найдено")};
      };
//удаление события
    var deleteEvent = target.attr('data-delete');
      if(deleteEvent){
        if(confirm("Удалить событие?")){
        var perent = $(target).parent().parent();
        perent.remove();
        localStorage.removeItem(perent.attr('data-item'));
        };
      };
// клик напросмотр события
    var lookEvent = target.attr('data-lookevent');
      if(lookEvent){
        $('#eventHolder').empty()
        showEvetn(lookEvent);
        if(!JSON.parse(localStorage.getItem(lookEvent)).place[0] == ""){  
          showMap('showmap');      
          cordinats(lookEvent);              
        }; 
      };
// клик на добавление карты всех мест
    var places = target.attr('data-places');
      if(places){
        var lslength = localStorage.length;
        if(lslength > 0){
          var placesArr=[];          
          for(var i = 0; i < lslength; i++){
            var key = localStorage.key(i);
            if(!JSON.parse(localStorage.getItem(key)).place[0] == "" && key.indexOf(key.match(/\d{8}/g)) == 0 ){
              placesArr.push(JSON.parse(localStorage.getItem(key)));           
            };
          };
          showMap('allplaces');
          for(var i = 0; i < placesArr.length; i++){
            var myLatlng = new google.maps.LatLng(placesArr[i].place[0],placesArr[i].place[1]);
            var marker = new google.maps.Marker({
              position: myLatlng,
              map: map,
              cursor: placesArr[i].time,
              title: placesArr[i].name
            });
            map.setCenter(myLatlng);
            google.maps.event.addListener(marker, 'click', function(e) {
              location.href = '#event'
              showEvetn(this.cursor);
              if(!JSON.parse(localStorage.getItem(this.cursor)).place[0] == ""){  
                showMap('showmap');      
                cordinats(this.cursor);              
              };
            });
          };
        }; 
      };
// клик на инструкцию офф
    var instruction = target.attr("data-instruction")
      if(instruction){
        $("#instruction").addClass('moveaway');
      }
  }); //закрытие клика  
});
       
