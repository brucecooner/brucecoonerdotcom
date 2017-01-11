var http = require('http')
var https = require('https');
var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000));

// -----------------------------------------------------------------------------
app.use(function(req, res, next)
{
  res.header("Access-Control-Allow-Origin", "https://brucecooner.github.io/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// -----------------------------------------------------------------------------
app.get('/', function (req, res)
{
   res.send('bruce cooner dot com (under construction)')
})

// -----------------------------------------------------------------------------
function getPhotos(params, callback)
{
   var requestServer = 'api.flickr.com'
   var requestPath = '/services/rest'

   var method = 'flickr.people.getPublicPhotos'
   var apiKey = process.env.FLICKR_API_KEY
   // var userId = '97403545@N00'
   var format = 'json'
   var resultsPerPage = 10

   var requestString = requestPath; // requestUrl
   requestString += '?' + 'method=' + method
   requestString += '&' + 'api_key=' + apiKey
   requestString += '&' + 'user_id=' + params['userId']
   requestString += '&' + 'format=' + format
   requestString += '&' + 'per_page=' + params['pageSize']
   requestString += '&' + 'page=' + params['pageNum']
   requestString += '&nojsoncallback=1'

   return https.get(
   {
      host: requestServer,
      path: requestString
   }, function(response)
      {
         // Continuously update stream with data
         var body = '';
         response.on('data', function(data)
         {
            body += data;
         });
         response.on('end', function()
         {
            // todo : errors in there?
            callback(body)
         });
      });
}

// -----------------------------------------------------------------------------
// function handlePhotosResponse(data, res)
// {
//    for (key in photos)
//    {
//       if (photos.hasOwnProperty(key))
//       {
//          console.log(`key = ${key}`)
//       }
//    }
// }

// -----------------------------------------------------------------------------
app.get('/photos/:userId/pageSize/:pageSize/page/:pageNum', function(req, res)
{
   getPhotos(req.params, function(data)
   {
      res.send(data)
   })
})

// -----------------------------------------------------------------------------
app.listen(app.get('port'), function ()
{
})
