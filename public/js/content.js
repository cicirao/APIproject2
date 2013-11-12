;(function() {

  $('#search').on('submit', function(e) {
    e.preventDefault()
    var searchQuery = $(this).find('input:text').val()
    getUser(searchQuery)
    getFeed(searchQuery)
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
      '     </section>'+
      ' </li>'
  var feedList = $('#feeds')

  function renderFeed(feeds) {
    feedList.html('')
    $.each(feeds, function(i, feed) {
      html = feedHtml
        .replace('{name}', feed.created_at)
        .replace('{text}', feed.text)
      feedList.append(html)
    })
  }

}())
