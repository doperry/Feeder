// Feeder Application
// Uses JQuery to manipulate the DOM
// Uses vanilla javascript to handle API calls

// API keys
const apiKeyNYTimes = "itVeMhL58Vipd65ozsTcAanv2M7ofRWJ"
const apiKeyMediaStack = "58544fb278d071b8189a63cb4300af90"

// Setup newsAPI class
class NewsAPI
{
     // Constructor holds the name and the url of the API
     constructor(name, url)
     {
          this.name = name
          this.url = url
     }

}

// Creates a class for each type of API
class SpaceFlight extends NewsAPI
{
     constructor(name, url)
     {
          super(name, url)
    
     }

     // Function to get Story Title
     getTitle(elemenNum, dataSource)
     {
          this.dataSource=dataSource
          this.elemenNum=elemenNum
          return(`${this.dataSource[this.elemenNum].title}`)
     }

     // Function to get Story Image
     getImg(elemenNum, dataSource)
     {
          this.elemenNum=elemenNum
          this.dataSource=dataSource
          return(`${this.dataSource[this.elemenNum].imageUrl}`)
     }

     // Function to get link to full story
     getLink(elemenNum, dataSource)
     {
          this.elemenNum=elemenNum
          this.dataSource=dataSource
          return(`${this.dataSource[this.elemenNum].url}`)
     }

     // Function to get the article description
     getDesc(elemenNum, dataSource)
     {
          this.elemenNum=elemenNum
          this.dataSource=dataSource
          return(`${this.dataSource[this.elemenNum].summary}`)
     }

}

class NYTimes extends NewsAPI
{
     constructor(name, url)
     {
          super(name, url)
     }

     // Function to get Story Title
     getTitle(elemenNum, dataSource)
     {
          this.dataSource=dataSource
          this.elemenNum=elemenNum
          return(`${this.dataSource[this.elemenNum].title}`)
     }

     // Function to get Story Image
     getImg(dataSource)
     {
          this.dataSource=dataSource
          return(`${this.dataSource.url}`)
     }

     // Function to get Story Link
     getLink(elemenNum, dataSource)
     {
          this.elemenNum=elemenNum
          this.dataSource=dataSource
          return(`${this.dataSource[this.elemenNum].url}`)
     }

     // Function to get story description
     getDesc(elemenNum, dataSource)
     {
          this.elemenNum=elemenNum
          this.dataSource=dataSource
          return(`${this.dataSource[this.elemenNum].abstract}`)
     }
}

class MediaStack extends NewsAPI
{
     constructor(name, url)
     {
          super(name, url)
     }

     // Function to get Story Title
     getTitle(elemenNum, dataSource)
     {
          this.dataSource=dataSource
          this.elemenNum=elemenNum
          return(`${this.dataSource.title}`)
     }

     // Function to get Story Image
     getImg(elemenNum, dataSource)
     {
          this.elemenNum=elemenNum
          this.dataSource=dataSource

          // Not all of the media stack articles have photos
          //  When they don't the API returns null.  This will set a "default" image to use instead
          if (this.dataSource.image === null)
          {
               return("https://www.guwahatiplus.com/public/web/images/default-news.png")
          }
          else
          {
               return(`${this.dataSource.image}`)
     
          }
     }

     // Function to get a link to the full article
     getLink(elemenNum, dataSource)
     {
          this.elemenNum=elemenNum
          this.dataSource=dataSource
          return(`${this.dataSource.url}`)
     }

     // Function to get article description
     getDesc(elemenNum, dataSource)
     {
          this.elemenNum=elemenNum
          this.dataSource=dataSource
          return(`${this.dataSource.description}`)
     }

}

// Setup initial API sources
const sourceOne = new SpaceFlight("Space Flight","https://test.spaceflightnewsapi.net/api/v2/articles")
const sourceTwo = new NYTimes("NYTimes", `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKeyNYTimes}`)
const sourceThree = new MediaStack("Media Stack - CNN", `http://api.mediastack.com/v1/news?access_key=${apiKeyMediaStack}&sources=cnn`)
const sourceFour = new MediaStack("Media Stack - BBC", `http://api.mediastack.com/v1/news?access_key=${apiKeyMediaStack}&sources=bbc`)

// Array of the sources.  Using an array helps limit the lines of code needed
const apiSourceArray = [sourceOne, sourceTwo, sourceThree, sourceFour]

// Function to clear and "reset" when feedr icon is clicked
$('#feedr').click(function()
{
     updateSpan("Please Select")
})


// Runs through the array and creates a drop down for each one assiging it an id based on it's position in the list 
for (let i = 0; i < apiSourceArray.length; i++)
{
     $('#news_list').append(`<li id="${i}">${apiSourceArray[i].name}</li>`)
}



// Loop that will watch for when one of the list elements is clicked on.
for (let i = 0; i < $('#news_list').children().length; i++ )
{

     $(`#${i}`).click(function()
     {
          // Runs the newsClicked function and passes it which list element was clicked
          newsClicked(i)
     }) //end of click event
}


// Function to handle when a drop down item is clicked.  Uses standard javascript instead of jQuery
function newsClicked(elementNum)
{

     // Fetches the API URL
     fetch(apiSourceArray[elementNum].url)
          // Takes the API response and converts to JSON     
          .then(resp => {
               
               // fetch only fails if there's a newtork issue, this 
               //  checks to see if there's any other errors and then
               //  creates a new error messgae if it there is 
               if(resp.ok)
               {
                    return(resp.json())
               }
               else
               {
                    // Creates an error object so the fetch will default to catch
                    throw new Error(resp.statusText)
               }
          })
          // Takes the data returned from the JSON and decides how to process it
          .then(function(data)
               {
                    // Pick which API layout to use
                    switch(elementNum)
                    {
                         case 0:
                              updateSpan("Space Flight")
                              spaceNewsClick(data)
                              break;
                         case 1:
                              updateSpan("New York Times")
                              nyTimesClick(data)
                              break;
                         case 2:
                              updateSpan("CNN")
                              cnnClick(data)
                              break;
                         case 3:
                                   // Clears out any articles that might be present
                              updateSpan("BBC")
                              bbcClick(data)
                              
                              break;
                    }


               } )//End function
          // Run when there's an error
          .catch((error) => {
               
               console.log(error)
               // Updates the screen
               updateSpan("Please Select")
               $('#main').append(`
               
               <h1>Could not load source</h1>
               <h2>Error message: ${error}</h2>
               
               `)
          })

}

// Function will update the news Span with the news source and 
//  clear out any stories already present
function updateSpan(text)
{
     $('#main').empty()
     $('#source_span').text(text)
}


function spaceNewsClick(data)
{


     // Runs for all the stories returned by the API
     for (let i = 0; i < data.length; i++)
     {

          $('#main').append(`
          <article id=\"news\" class=\"article\">       
            <section class=\"featuredImage\">
              <img src=\"${sourceOne.getImg(i,data)}\" alt=\"\" />
            </section>
            <section class=\"articleContent\">
              <a href="#"><h3 id="story${i}">${sourceOne.getTitle(i,data)}</h3></a>
            </section>
            <div class=\"clearfix\"></div>
          </article>`)
     
          // Adds a click event for each story as they're added to the DOM
          $(`#story${i}`).click(function()
          {
               createPopUp(
                    `${sourceOne.getLink(i,data)}`,
                    `${sourceOne.getTitle(i,data)}`,
                    `${sourceOne.getDesc(i,data)}`
               )

          })// end click event

     
     }

}

function nyTimesClick(data)
{

     // Runs for all the stories returned
     for (let i = 0; i < data.results.length; i++)
     {
          $('#main').append(`
          <article class=\"article\">       
            <section class=\"featuredImage\">
              <img src=\"${sourceTwo.getImg(data.results[i].multimedia[1])}\" alt=\"\" />
            </section>
            <section class=\"articleContent\">
              <a href=\"#\"><h3 id="story${i}">${sourceTwo.getTitle(i,data.results)}</h3></a>
            </section>
            <div class=\"clearfix\"></div>
          </article>`)
     
     
          // Creates a watcher for when the story is clicked
          $(`#story${i}`).click(function()
          {
               createPopUp(
                    `${sourceTwo.getLink(i,data.results)}`,
                    `${sourceTwo.getTitle(i,data.results)}`,
                    `${sourceTwo.getDesc(i, data.results)}`
               )

          })// end click event
     }

}

function cnnClick(data)
{
 
     // Runs for all the stories returned by the API
     for (let i = 0; i < data.data.length; i++)
     {
          // Updates the article class with all the values for each story
          $('#main').append(`       
          <article class="article">
            <section class=\"featuredImage\">
              <img src=\"${sourceThree.getImg(i,data.data[i])}\" alt=\"\" />
            </section>
            <section class=\"articleContent\">
              <a href=\"#\"><h3 id="story${i}">${sourceThree.getTitle(i,data.data[i])}</h3></a>
            </section>
            <div class=\"clearfix\"></div>
          </article>`)
          
          // creates a watcher for the story click
          $(`#story${i}`).click(function()
          {
               createPopUp(
                    `${sourceThree.getLink(i,data.data[i])}`,
                    `${sourceThree.getTitle(i,data.data[i])}`,
                    `${sourceThree.getDesc(i,data.data[i])}`
               )

          }) // end click event
     
     }
}

function bbcClick(data)
{


     // Runs for all the stories returned by the API
     for (let i = 0; i < data.data.length; i++)
     {
          // Adds an article class with all the values for each story
          $('#main').append(`
          <article class="article">       
            <section class=\"featuredImage\">
              <img src=\"${sourceFour.getImg(i,data.data[i])}\" alt=\"\" />
            </section>
            <section class=\"articleContent\">
              <a href=\"#\"><h3 id="story${i}">${sourceFour.getTitle(i,data.data[i])}</h3></a>
            </section>
          <div class=\"clearfix\"></div>
          </article>`)
          
          // Creates a watcher for when the story is clicked
          $(`#story${i}`).click(function()
          {
               createPopUp(
                    `${sourceFour.getLink(i,data.data[i])}`,
                    `${sourceFour.getTitle(i,data.data[i])}`,
                    `${sourceFour.getDesc(i,data.data[i])}`
               )

          }) // end click event
     
     }
}


// Creates a "popup" to display more details about the story
function createPopUp(url,title,description)
{
     // Appends the html elements to create the popup to the body section
     $('body').append(`
     <div id="popUp">
     <a href="#" id="x" class="closePopUp">X</a>
     <div class="container">
       <h1>${title}</h1>
       <p>
         ${description}
       </p>
       <a href="${url}" class="popUpAction" target="_blank">Read more from source</a>
     </div>
   </div>
   `)
   
   // Creates a watcher for when the user presses the X
   $('#x').click(function()
     {
          // Removes the popup element from the DOM
          $('#popUp').remove()
     }) // end click event


}