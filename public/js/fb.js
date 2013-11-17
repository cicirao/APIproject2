;(function() {

  $('#fb').on('submit', function(e) {
    e.preventDefault()
    var searchQuery = $(this).find('input:text').val()
    $('button').click(function() {
      if ($(this).val() === 'fbf') {
        getUser(searchQuery)
        getFeed(searchQuery) 
      } else if ($(this).val() === 'fbp') {
        getUser(searchQuery)
        getPic(searchQuery)
      }
      console.log($(this).val())
    })
  })

  var urlPrefix = '/api'
  var searchUrl = urlPrefix + '/{query}?fields=name'
  var feedUrl = urlPrefix
        + '/{query}?fields=feed'

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
        '   <section>'+
        '     <h3 name="name">{name}'+
        '     </h3>'+
        '   </section>'+
        ' </li>'
  var usersList = $('#users')

  function renderUser(user) {
    usersList.html('')
    var html = userHtml
      .replace('{name}', user.name)
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
    var feeds = feeds.feed.data
    $.each(feeds, function(i, feed) {
      if (feeds[i].picture) {
        html = feedHtml
          .replace('{name}', feed.from.name)
          .replace('{text}', feed.message)
          .replace('#', feed.picture)
          .replace('{time}', feed.created_time.slice(4, 16))
      } else {
        html = feedHtml
          .replace('{name}', feed.from.name)
          .replace('{text}', feed.message)
          .replace('{time}', feed.created_time.slice(4, 16))
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
    var pics = pics.feed.data
    $.each(pics, function(i, pic) {
      if (pics[i].picture) {
        html = picHtml
          .replace('#', pic.picture)
      } else {
        html = picHtml
      }
      $('img[src="#"]').remove()
      picList.append(html)
    })
  }
}())
