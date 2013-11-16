;(function() {

  $('#search').on('submit', function(e) {
    e.preventDefault()
    var searchQuery = $(this).find('input:text').val()
    $('button').click(function() {
      if ($(this).val() === 'twt') {
        getUser(searchQuery)
        getFeed(searchQuery) 
      } else if ($(this).val() === 'twp') {
        getUser(searchQuery)
        getPic(searchQuery)
      }
      console.log($(this).val())
    })
  })

  var urlPrefix = '/api'
  var searchUrl = urlPrefix + '/users/show.json?screen_name={query}'
  var feedUrl = urlPrefix
        + '/statuses/user_timeline.json?screen_name={query}'

  function getUser(name) {
    name = encodeURIComponent(name)
    var url = searchUrl.replace('{query}', name)
    $.get(url).done(function(res) {
      console.log(res)
      renderUser(res)
    })
  }

  var userHtml =
        ' <li>'+
        '   <img src="{avatar}">'+
        '   <section>'+
        '     <h3 name="name">{name}'+
        '     </h3>'+
        '     <p class="story">{text}</p>'+
        '   </section>'+
        ' </li>'
  var usersList = $('#users')

  function renderUser(user) {
    usersList.html('')
    var html = userHtml
      .replace('{avatar}', user.profile_image_url)
      .replace('{name}', user.name)
      .replace('{text}', user.description)
    usersList.append(html)
  }


  function getFeed(name) {
    picList.html('')
    name = encodeURIComponent(name)
    var url = feedUrl.replace('{query}', name)
    $.get(url).done(function(res) {
      console.log(res)
      renderFeed(res)
    })
  }

  var feedHtml =
      ' <li>'+
      '     <section>'+
      '       <h3 name="name">{name}'+
      '       </h3>'+
      '       <p class="story">{text}</p>'+
      '       <img src="#" />'+
      '       <small class="time">{time}</small>'+
      '     </section>'+
      ' </li>'
  var feedList = $('#feeds')

  function renderFeed(feeds) {
    feedList.html('')
    $.each(feeds, function(i, feed) {
  	  if (feeds[i].entities.media) {
        html = feedHtml
          .replace('{name}', feed.user.name)
		      .replace('{text}', feed.text)
          .replace('#', feed.entities.media[0].media_url)
          .replace('{time}', feed.created_at.slice(4, 16))
  	  } else {
	      html = feedHtml
          .replace('{name}', feed.user.name)
          .replace('{text}', feed.text)
          .replace('{time}', feed.created_at.slice(4, 16))
  	  }
      $('img[src="#"]').remove()
      feedList.append(html)
    })	
  }
  
  function getPic(name) {
    feedList.html('')
    name = encodeURIComponent(name)
    var url = feedUrl.replace('{query}', name)
    $.get(url).done(function(res) {
      console.log(res)
      renderPic(res)
    })
  }

  var picHtml =
      ' <li>'+
      '       <img src="#" />'+
      ' </li>'
  var picList = $('#pics')

  function renderPic(pics) {
    picList.html('')
    $.each(pics, function(i, pic) {
      if (pics[i].entities.media) {
        html = picHtml
          .replace('#', pic.entities.media[0].media_url)
      } else {
        html = picHtml
      }
    $('img[src="#"]').remove()
    picList.append(html)
    })
  }
}())
