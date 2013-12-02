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

  var urlPrefix = '/graph'
  var searchUrl = urlPrefix + '/{query}?fields=name,picture'
  var feedUrl = urlPrefix + '/{query}?fields=posts.fields(message,created_time,from,picture)'
  var photoUrl = urlPrefix + '/{query}?fields=photos'

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
        '   </section>'+
        ' </li>'
  var usersList = $('#users')

  function renderUser(user) {
    usersList.html('')
    var html = userHtml
      .replace('{name}', user.name)
      .replace('{avatar}', user.picture.data.url)
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
    var feeds = feeds.posts.data
    $.each(feeds, function(i, feed) {
      if (feeds[i].picture && feeds[i].message) {
        html = feedHtml
          .replace('{name}', feed.from.name)
          .replace('{text}', feed.message)
          .replace('#', feed.picture)
          .replace('{time}', feed.created_time)
      } else if (feeds[i].message) {
        html = feedHtml
          .replace('{name}', feed.from.name)
          .replace('{text}', feed.message)
          .replace('{time}', feed.created_time.slice(0, 10))
      } else {
        html = ""
      }
      $('img[src="#"]').remove()
      feedList.append(html)
    })  
  }
  
  function getPic(name) {
    feedList.html('')
    name = encodeURIComponent(name)
    var url = photoUrl.replace('{query}', name)
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
    var pics = pics.photos.data
    $.each(pics, function(i, pic) {
      if (pics[i].picture) {
        html = picHtml
          .replace('#', pic.source)
      } else {
        html = picHtml
      }
      $('img[src="#"]').remove()
      picList.append(html)
    })
  }
}())
