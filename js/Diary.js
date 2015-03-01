$(function(){
	// $( "#tabs" ).tabs();
	$( "#datepicker" ).datepicker({ dateFormat: 'dd/mm/yy' });
  
      // ev.preventDefault();
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
  

//создания списка событий из локолторедж
    function getEvents(){
      var lslength = localStorage.length;
      if(lslength > 0){
        for(var i = 0; i < lslength; i++){
          var key = localStorage.key(i);
          if(key.indexOf(key.match(/\d{8}/g)) == 0){
            $('<li>').attr({class: 'date','data-item': key}).prependTo('#listHolder');
            $('<form>').prependTo('#listHolder li:first');
            $('<input>')
              .attr({class: 'list', 'type': "button", 'value':"Удалить событие", 'data-delete': 'delete'})
              .prependTo('.date form:first');
            $('<a>')
              .attr({href:'#event', class: 'list', 'data-menu':"#event1", 'data-lookevent': JSON.parse(localStorage.getItem(key)).time} )
              .text(JSON.parse(localStorage.getItem(key)).name)
              .prependTo('.date form:first');
            $('<p>',{class: 'list'})
              .text('Дата создания события:' + '  ' + JSON.parse(localStorage.getItem(key)).data)
              .prependTo('.date form:first');
            $('<div>',{class: 'format mood'})
              .addClass(JSON.parse(localStorage.getItem(key)).mood)
              .prependTo('.date form:first');
          };
        };
      }; 
    };

    getEvents();
  //клик
  $(document).on('click', function(e){
    var target = $(e.target);
    // клик на скрытие текста 
    var content = target.attr('data-menu');
    // debugger;
      if(content){
        $('#eventAdd1').addClass("moveaway")
        $('#event1').addClass("moveaway")
        $('#eventList1').addClass("moveaway")
        $('#places1').addClass("moveaway");
        $($(content)).toggleClass('moveaway');
        $('.menu a').removeClass('bold');
        target.addClass('bold');
      };
// клик на фоматирование  текста 
    var changeFormat = target.attr('data-format');
    // debugger
      if(changeFormat){
        $($('#eventText')).toggleClass(changeFormat);
      };
// клик на фоматирование цвета текста 
    var changeColor = target.attr('data-color');
      if(changeColor){
        $($('#eventText'))
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
        var img = $('#img').attr('src');
        var video = $('#video').attr('src');
        // var place = $('.place').attr('data-format');
        
        //создание объекта события
		  if(name !== ''){
			  if(eventText !== ''){
          if(data !== ''){
    				var createEvent = new Event(time, data, name, eventText, mood, formatText, img, video);
    				//создание елемента списка события
    				$('<li>').attr({class: 'date','data-item': time}).prependTo('#listHolder');
    				$('<form>').prependTo('#listHolder li:first');
    				$('<input>')
    				  .attr({class: 'list','type': "button", 'value':"Удалить событие", 'data-delete': 'delete'})
    				  .prependTo('.date form:first');
    				$('<a>')
    				  .attr({href:'#event',class: 'list', 'data-menu':"#event1", 'data-lookevent': time})
    				  .text(name).prependTo('.date form:first');
    				$('<p>',{class: 'list'}).text('Дата создания события:' + '  ' + data)
    				  .prependTo('.date form:first');
    				$('<div>',{class: 'format mood'})
    				  .addClass(mood).prependTo('.date form:first');
    				// обнуление строк
    				$('#name').val("");
    				$('#datepicker').val("");
    				$('#eventText').val("");
    				$('#name').attr({placeholder:"Название события"});
            $('.video')
              .attr({placeholder:"Добавить видео"})
              .removeClass('moveaway');
            $('.img')
              .attr({placeholder:"Добавить картинку"})
              .removeClass('moveaway');
            $('#ImgVideo').children().remove();
    				//добавление события в локол сторедж
    				localStorage.setItem(time, JSON.stringify(createEvent))
    				console.log(createEvent)
          }else{$('#datepicker').attr({placeholder:"Введите дату"})};
			  }else{$('#eventText').attr({placeholder:"Введите текст события (Поле обезательно для ввода)"})};
		  }else{$('#name').attr({placeholder:"Введите название события (Поле обезательно для ввода)"})};
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
      //сортировка по дате события
    var sortData = target.attr('data-sortData');
      if(sortData){
        var lslength = localStorage.length;
        if(lslength > 0){
          $('#listHolder li').remove();
          var keyArr = [];
          for(var i = 0; i < lslength; i++){
            var keyK = localStorage.key(i);
            if(keyK.indexOf(keyK.match(/\d{8}/g)) == 0){
              keyArr.push(keyK);           
            };
          };
          var keySort = keyArr.sort();
          for(var j = 0; j < keySort.length; j++){
           var key = keySort[j];
            $('<li>',{class: 'date'}).attr('data-item', key).prependTo('#listHolder');
            $('<form>').prependTo('#listHolder li:first');
            $('<input>')
              .attr({class: 'list', 'type': "button", 'value':"Удалить событие", 'data-delete': 'delete'})
              .prependTo('.date form:first');
            $('<a>')
              .attr({href:'#event', class: 'list', 'data-menu':"#event1", 'data-lookevent': JSON.parse(localStorage.getItem(key)).time})
              .text(JSON.parse(localStorage.getItem(key)).name)
              .prependTo('.date form:first');
            $('<p>',{class: 'list'})
              .text('Дата создания события:' + '  ' + JSON.parse(localStorage.getItem(key)).data)
              .prependTo('.date form:first');
            $('<div>',{class: 'format mood'})
              .addClass(JSON.parse(localStorage.getItem(key)).mood).prependTo('.date form:first');
          };
        }; 
      };//закрытие сортировка по дате события
       
     //сортировка по настроению события
    var sortData = target.attr('data-sortMood');
    if(sortData){
      var lslength = localStorage.length;
      if(lslength > 0){
        var moodArr = [];
  		$('#listHolder li').remove();
        for(var i = 0; i < lslength; i++){
          var keyK = localStorage.key(i);
          if(keyK.indexOf(keyK.match(/\d{8}/g)) == 0){
            moodArr.push(JSON.parse(localStorage.getItem(keyK)));           
          };
        };
           var sortMoodArr = moodArr.sort(function(event1, event2) {
        		// debugger;
          	  if (event1.mood < event2.mood) return -1;
              if (event1.mood > event2.mood) return 1;
              return 0;
            });
          for(var j = 0; j < sortMoodArr.length; j++){
           var key = sortMoodArr[j].time;
            $('<li>').attr({class: 'date', 'data-item': key}).prependTo('#listHolder');
            $('<form>').prependTo('#listHolder li:first');
            $('<input>')
              .attr({class: 'list','type': "button", 'value':"Удалить событие", 'data-delete': 'delete'})
              .prependTo('.date form:first');
            $('<a>')
            .attr({href:'#event', class: 'list', 'data-menu':"#event1", 'data-lookevent': JSON.parse(localStorage.getItem(key)).time})
              .text(JSON.parse(localStorage.getItem(key)).name)
              .prependTo('.date form:first');
            $('<p>',{class: 'list'})
              .text('Дата создания события:' + '  ' + JSON.parse(localStorage.getItem(key)).data)
              .prependTo('.date form:first');
            $('<div>',{class: 'format mood'})
              .addClass(JSON.parse(localStorage.getItem(key)).mood).prependTo('.date form:first');
          };
        }; 
      };
       //закрытие сортировка по настроению события
     //поиск по названию
    var searchName = target.attr('data-searchName');
    if(searchName){
      var lslength = localStorage.length;
      if(lslength > 0){
        var searchArr = [];
        for(var i = 0; i < lslength; i++){
          var keyK = localStorage.key(i);
          if(keyK.indexOf(keyK.match(/\d{8}/g)) == 0){
            searchArr.push(JSON.parse(localStorage.getItem(keyK)));           
          };
        };
        for(var j = 0; j < searchArr.length; j++){
          if(searchArr[j].name === $('#searchName').val().trim()){
            $('#listHolder li').remove();
            var key = searchArr[j].time;
            $('<li>').attr({class: 'date','data-item': key}).prependTo('#listHolder');
            $('<form>').prependTo('#listHolder li:first');
            $('<input>')
              .attr({class: 'list', 'type': "button", 'value':"Удалить событие", 'data-delete': 'delete'})
              .prependTo('.date form:first');
            $('<a>')
            .attr({href:'#event', class: 'list', 'data-menu':"#event1", 'data-lookevent': JSON.parse(localStorage.getItem(key)).time})
              .text(JSON.parse(localStorage.getItem(key)).name)
              .prependTo('.date form:first');
            $('<p>',{class: 'list'})
              .text('Дата создания события:' + '  ' + JSON.parse(localStorage.getItem(key)).data)
              .prependTo('.date form:first');
            $('<div>',{class: 'format mood'})
              .addClass(JSON.parse(localStorage.getItem(key)).mood).prependTo('.date form:first');
              break;
          }else{alert("Событие не найдено")};
        };     
      }; 
    };//закрытие поиск по названию

     // клик напросмотр события
    var lookEvent = target.attr('data-lookevent');
      if(lookEvent){
        debugger;
      $('#eventHolder').children().remove()
        if(!JSON.parse(localStorage.getItem(lookEvent)).img == 'undefined'){
          $('<img>',{id:"img", src:JSON.parse(localStorage.getItem(lookEvent)).img})
            .prependTo('#eventHolder');
        };      
        $('<iframe></iframe>')
          .attr({frameborder:"0", id:"video", src:JSON.parse(localStorage.getItem(lookEvent)).video})
          .prependTo('#eventHolder');
        $('<p>')
        .attr('class', JSON.parse(localStorage.getItem(lookEvent)).formatText)
        .text(JSON.parse(localStorage.getItem(lookEvent)).eventText)
        .prependTo('#eventHolder');       
        $('<p>')
          .text('Название события:' + '  ' + JSON.parse(localStorage.getItem(lookEvent)).name)
          .prependTo('#eventHolder');
        $('<p>')
        .text('Дата создания события:' + '  ' + JSON.parse(localStorage.getItem(lookEvent)).data)
        .prependTo('#eventHolder');
    };// off клик напросмотр события
  // клик надобавление картикки
    var imgAdd = target.attr('data-img');
      if(imgAdd){
      $('<img>')
        .attr({id:"img", src:$('.img').val().trim()})
        .prependTo('#ImgVideo');
      $('.img').addClass('moveaway')
    };// off клик надобавление события
    // клик на добавление видео
    var videoAdd = target.attr('data-video');
      if(videoAdd){
        var video = $('.video').val().trim();
        var pattern = /<iframe.+<\/iframe>/g;
        var pattern2 = /.+watch.+/;
        if(pattern.test(video)){
          $(video).prependTo('#ImgVideo');
          $('.video').addClass('moveaway');
        }else if(pattern2.test(video)){
          var video2 = video.replace(/.+watch\?v=/, '');
        $('<iframe></iframe>')
          .attr({id:"video", src:"https://www.youtube.com/embed/"+video2})
          .prependTo('#ImgVideo');
          $('.video').addClass('moveaway')  
        };
    };// off клик на добавление видео




  }); //закрытие клика  
});
       
