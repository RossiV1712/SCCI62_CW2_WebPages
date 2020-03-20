var PossCountries = ['ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've', 'za']; // An array containing all possible countries for the API call
var PossLang = ['ar', 'de', 'en', 'es', 'fr', 'it', 'nl', 'no', 'pt', 'ru', 'se']; // An array containing all possible languages for the API call
var APIKEY = '0e2c625bcdbb4b23879ec13bf7fed0fd';
var Initmodal = document.getElementById("InitCountrySelectModal"); // Get the Initial modal element and store globally so it can always be used
var OutputArea = document.getElementById("ArticleOutput"); // Get the area ready for the articles to be displayed
var ReturnedData; // Declare this variable globally to store all of the returned articles from the API
var ScrollTop; // Store the current height of the scroll of the page before the article modal is opened, for use to scroll back to current position on article modal close
var Categories = ["Local", "Business", "Entertainment", "Health", "Science", "Sports", "Technology"]; // An array with the name of each category
/* A function to run when the DOM content is loaded to set up all intial settings and elements */
document.addEventListener('DOMContentLoaded',
    (function () {
        var Cat = parseInt(sessionStorage.getItem("Category"));
        if (isNaN(Cat) || ((Cat < 0 || Cat >= Categories.length))) { // Check that the sessionStorage category is an int and that it is in range
            sessionStorage.setItem("Category", 0); // If not then set session storage Category to 0
        }
        InitialiseCatSelection();
        if (isNaN(parseInt(localStorage.getItem("PageSize"))) || (localStorage.getItem("PageSize") > 50 || localStorage.getItem("PageSize") <= 0)) { // Check that the page size is an integer and that it is in range
            localStorage.setItem("PageSize", 20); // If not set local storage PageSize to 20
        }
        var Country = localStorage.getItem("Country"); // Retrieve the Country from the local storage
        if ((Country !== null) && PossCountries.includes(Country)) { // If the Country is not null (not set) and is in the array (not edited in any way)
            RefreshArticles(1); // Retrieve and load the articles 
        } else { // If the Country is null (not set) or not in the array (edited)
            OpenInitCountryModal(); // Open the initial modal
        };
        ColourStyle(); // Run the function to set the colour style sheet from the stored variable
        if (sessionStorage.getItem("Searching") == "true") { // If the session storage variable Searching is true
            ShowSearchAlert(); // Show the search alert box 
        }
    })
);
/* A function to format todays date so it can be compared to the input from the form */
function FilterFormatDate() {
    var d = new Date(), // Create a new date variable
        month = '' + (d.getMonth() + 1), // Store the month from the Date (Seen as an array so -1)
        day = '' + d.getDate(), // Store the day from the Date
        year = d.getFullYear(); // Store the year from the Date
    if (month.length < 2) // If the length of the month is less than 2
        month = '0' + month; // Add a '0' before it
    if (day.length < 2) // If the length of the day is less than 2
        day = '0' + day; // Add a '0' before it
    return ([year, month, day].join('-')); // Return the string joint by a '-'
}
/* Show the top bar to display that the search results are currently showing */
function ShowSearchAlert() {
    document.getElementById("SearchActive").removeAttribute("hidden"); // Remove the hidden attribute from the Search box
    CreateSearchCell(); // Run the function to create the Search cell in the navigation bar
    sessionStorage.setItem("Searching", true); // Set the session storage variable of Searching to true
    RefreshArticles(1); // Run the function to refresh the articles (with the search variables)
}
/* Hide the top bar to show that the search results are no longer showing */
function CloseSearchAlert() {
    sessionStorage.removeItem("Searching"); // Delete the Searching variable from session storage
    document.getElementById("SearchActive").setAttribute("hidden", true); // Add the hidden attribute to the Search box
    RemoveSearchCell(); // Run the funtion to remove the Search cell in the navigation bar
    RefreshArticles(1); // Run the function to refresh the articles (without the serach variables)
}
var VarName = ['--Style1-Colour1', '--Style1-Colour2', '--Style1-Colour3'];
var Style1 = ['000', 'EDF5E0', 'FFF'];
var Style2 = ['FFF', '8DE4AF', '000'];
var Style3 = ['38a832', '05396B', '16c4bc'];
/* Update the colour css file */
function ColourStyle() {
    var StoredColour = parseInt(localStorage.getItem("Colour")); // Store the local storage Colour variable as an int
    var Colour = ((isNaN(StoredColour)) || ((StoredColour > 6) || (StoredColour < 1))) ? "1" : StoredColour; // If the StoredColour is NotANumber or outside of the range of options then use 1, other wise use the integer
    var ChosenStyle;
    if (Colour == 1) {
        ChosenStyle = Style1;
    }
    else if (Colour == 2) {
        ChosenStyle = Style2;
    }
    else if (Colour == 3) {
        ChosenStyle = Style3;
    }
    else if (Colour == 4) {
        
    }
    else if (Colour == 5) {
        
    }
    else if (Colour == 6) {
        
    }
    var i = 0;
    VarName.forEach(function(value, index) {
       document.querySelector(":root").style.setProperty(value, "#" + ChosenStyle[index]);
       console.log(index);
    });
    var StyleSheet = document.getElementById("Colour"); // Store the stylesheet element
    StyleSheet.setAttribute("href", "CSS/Colours.css"); // Set the stylesheet href to the stored variable
}
/* Open the initial modal for first time use */
function OpenInitCountryModal() {
    Initmodal.style.display = "block"; // Show the initial modal
    var InitCloseSpan = document.getElementById("InitCloseSpan"); // Get the <span> element that closes the modal
    InitCloseSpan.onclick = function () { // When the user clicks on <span> (x), close the modal
        InitSelectLang(); // Function to get the selected country
    }
    window.onclick = function (event) { // When the user clicks anywhere run this function with the event details 
        if (event.target == Initmodal) { // If the window clicked is the modal class (whole screen except actual modal)
            InitSelectLang(); // Function to get the selected country
        }
    }
}
/* Store the chosen settings from the initial modal in local storage */
function InitSelectLang() {
    localStorage.setItem("Lang", document.getElementById("InitLanguageSelect").value); // Store the current value of the Language Select dropdown in the local storage
    localStorage.setItem("Country", document.getElementById("InitCountrySelect").value); // Store the current value of the Country Select dropdown in the local storage
    RefreshArticles(1); // Retrieve and display articles from page 1
    Initmodal.style.display = "none"; // Hide the initial select modal
}
/* A function to hide all of the article cards and the page navigation */
function HideCards() {
    document.getElementById("ArticleOutput").setAttribute("hidden", "true"); // Hide the div that contains the article cards
    document.getElementById("Pagination").setAttribute("hidden", "true"); // Hide the div containing the page select
}
/* A function to show all of the article cards and the page navigation */
function ShowCards() {
    document.getElementById("ArticleOutput").removeAttribute("hidden"); // Show the div that contains the article cards
    document.getElementById("Pagination").removeAttribute("hidden"); // Show the div containing the page select
}
/* A function to open the settings modal */
function OpenSettingsModal() {
    ArticleModalClose(); // Run the function to close the article modal (incase it is open)
    HideCards(); // Run the function to hide the article cards
    LoadStoredSettings(); // Run the function to load all stored settings and search terms
    var Settings = document.getElementById("SettingsModal"); // Store the element for the settings modal
    Settings.style.display = "block"; // Change the display attribute to show the modal
}
/* A function to close the settings modal */
function CloseSettingsModal() {
    var Settings = document.getElementById("SettingsModal"); // Store the element for the settings modal
    Settings.style.display = "none"; // Change the display attribute to none to hide the modal
    ShowCards(); // Run the function to show the article cards
}
/* A function to load all of the stored settings for use in the settings and search modal */
function LoadStoredSettings() {
    var StoredSearchQ = sessionStorage.getItem("Search") == null ? "" : sessionStorage.getItem("Search"); // Retrieve the variables from session storage
    var DateFrom = sessionStorage.getItem("FromDate") == null ? "" : sessionStorage.getItem("FromDate");
    var DateTo = sessionStorage.getItem("ToDate") == null ? "" : sessionStorage.getItem("ToDate");
    var SortBy = sessionStorage.getItem("SortBy") == null ? "" : sessionStorage.getItem("SortBy");
    if ((sessionStorage.getItem("Lang") == null) || (PossLang.includes(sessionStorage.getItem("Lang")) == false)) { // If session storage variable "Lang" is null or not in the possible array
        if ((localStorage.getItem("Lang") == null || PossLang.includes(localStorage.getItem("Lang")) == false)) { // If local storage variable "Lang" is null or not in the possible array
            var Lang = 'en'; // Set the language to en
        } else { // Otherwise, if local storage variable "Lang" is not null and in the possible array
            var Lang = localStorage.getItem("Lang"); // Set Lang to the retrieved value
        }
    } else { // Otherwise, if session storage variable "Lang" is not null and in the possible array
        var Lang = sessionStorage.getItem("Lang"); // Set Lang to the retrieved value
    }
    /* Use the prepared values to show in the search modal */
    document.getElementById("SearchBar").value = StoredSearchQ; // Get the elements and change the values to the retrieved values
    document.getElementById("SearchDateFrom").value = DateFrom;
    document.getElementById("SearchDateTo").value = DateTo;
    var SearchSortSelect = document.getElementById("SearchSort"); // Store the Sort By dropdown element
    var SearchSortOptions = SearchSortSelect.getElementsByTagName("option"); // Store each option inside the Sort By element as array
    for (i = 0; i < SearchSortOptions.length; i++) { // For each between 0 and the length of the array - 1 (<)
        if (SearchSortOptions[i].value == SortBy) { // If the value of the element is the same as the stored value
            SearchSortOptions[i].setAttribute("selected", "true"); // Select this element
        } 
    }
    /* Prepare variables from storage for use in the settings modal */
    var Country = (localStorage.getItem("Country") == null || PossCountries.includes(localStorage.getItem("Country")) == false) ? 'gb' : localStorage.getItem("Country"); // Variables to be stored for loading in the settigns modal, with error checking
    var Language = (localStorage.getItem("Lang") == null || PossLang.includes(localStorage.getItem("Lang")) == false) ? "en" : localStorage.getItem("Lang");
    /* Country Select */
    var StoredColour = (localStorage.getItem("Colour") == null || isNaN(parseInt(localStorage.getItem("Colour"))) || localStorage.getItem("Colour") <= 0 || localStorage.getItem("Colour") > 6) ? 1 : localStorage.getItem("Colour"); // Store the elements for the Colour select with error checking for null value or not a number and is in range
    var PageSize = (localStorage.getItem("PageSize") == null || isNaN(parseInt(localStorage.getItem("PageSize"))) || localStorage.getItem("PageSize") <= 0 || localStorage.getItem("PageSize") > 50) ? 20 : localStorage.getItem("PageSize"); // Set the initial slider value to the value retrieved from local storage with checking for null or not a number and is in range
    var SettCountrySelect = document.getElementById("SettingsCountrySelect"); // Store the element for the country select
    var SettCountryOptions = SettCountrySelect.getElementsByTagName("option"); // Store each option element inside the country select
    for (i = 0; i < SettCountrySelect.length; i++) { // For each option element
        if (SettCountryOptions[i].value == localStorage.getItem("Country")) { // If the value of the element is the same as the stored value
            SettCountryOptions[i].setAttribute("selected", "true"); // Select this element
        }
    }
    /* Language */
    var SettLangSelect = document.getElementById("SettingsLangSelect"); // Store the elements for the Settings Lanuage select
    var SettLangOptions = SettLangSelect.getElementsByTagName("option"); // Store the options inside the Settings Language select element
    var SearchLangSelect = document.getElementById("SearchLangSelect").getElementsByTagName("option"); // Store the options inside the Search Language element
    for (i = 0; i < SettLangSelect.length; i++) { // For each element
        if (SettLangOptions[i].value == Language) { // If the element value is the same as the stored value
            SettLangOptions[i].setAttribute("selected", "true"); // Select this element
        }
        if (SettLangOptions[i].value == Lang) { // if the element value is the same as the stored value
            SearchLangSelect[i].setAttribute("selected", "true"); // Select this element
        }
    }
    
    /* Colour */
    for (i = 1; i <= document.getElementsByName("ColourSelect").length; i++) { // For each element
        document.getElementById("SettingsColourRadio" + i).removeAttribute("checked"); // Remove the selected attribute
        if (document.getElementById("SettingsColourRadio" + i).value == StoredColour) { // If the element value is the same as the retrieved value
            document.getElementById("SettingsColourRadio" + i).setAttribute("checked", true); // Select this element
        }
    }
    /* Page Size */
    var slider = document.getElementById("SettingsPageSizeSlider"); // Store the elements for the Page Size select
    var output = document.getElementById("SettingsPageSizeDisplay"); 
    slider.value = PageSize;
    output.innerHTML = slider.value; // Display the current value in the output element
    slider.oninput = function () { // Each time the value of the slider changes
        output.innerHTML = this.value; // Display the current value in the output element
    }
}
/* A function to store all of the settings submitted in the search modal */
function FilterSubmit() {
    var q = document.getElementById("SearchBar").value; // Store the values from the inputs
    var FromDate = document.getElementById("SearchDateFrom").value;
    var ToDate = document.getElementById("SearchDateTo").value;
    var Error = 0; // Set the error value to 0
    if (q == "") { // If q is empty
        document.getElementById("SearchBar").classList.add("is-invalid"); // Add this class to the element to show an error and the error text
        Error = +1; // Add one to the error
    } else {
        document.getElementById("SearchBar").classList.remove("is-invalid"); // Otherwise remove the class as there is no longer an error (for multiple search attempts)
    }
    if (FromDate > ToDate) { // If the From date is after the To date
        document.getElementById("SearchDateFrom").classList.add("is-invalid"); // Add the class to the elements to show an error and the error text
        document.getElementById("SearchDateTo").classList.add("is-invalid");
        document.getElementById("DateFromError").innerHTML = "Input date is after the 'To' date"; // Set the error text to show what the issue is
        document.getElementById("DateToError").innerHTML = "Input date is before the 'From' date";
        return; // Stop running this function
    }
    if (FromDate > FilterFormatDate()) { // If the From date is after today
        document.getElementById("SearchDateFrom").classList.add("is-invalid"); // Add the class to the element to show an error and the error text
        document.getElementById("DateFromError").innerHTML = "Input date is out of range"; // Set the error text to show what the issue is
        Error = +1;
    } else {
        document.getElementById("SearchDateFrom").classList.remove("is-invalid"); // Otherwise remove the class as there is no longer an error (for multiple search attempts)
    }
    if (ToDate > FilterFormatDate()) {
        document.getElementById("SearchDateTo").classList.add("is-invalid"); // Add the class to the element to show an error and the error text
        document.getElementById("DateToError").innerHTML = "Input date is out of range"; // Set the error text to show what the issue is
        Error = +1;
    } else {
        document.getElementById("SearchDateTo").classList.remove("is-invalid"); // Otherwise remove the class as there is no longer an error (for multiple search attempts)
    }
    if (Error != 0) { // If there was an error
        return; // Stop running this function (Don't save)
    } else {
        document.getElementById("SearchDateFrom").classList.remove("is-invalid"); // Otherwise remove the class as there is no longer an error (for multiple search attempts)
        document.getElementById("SearchDateTo").classList.remove("is-invalid"); // Otherwise remove the class as there is no longer an error (for multiple search attempts)
    }
    CloseSettingsModal(); // Run the function to close the settings modal
    ShowSearchAlert(); // Run the function to show the search box
    sessionStorage.setItem("FromDate", FromDate); // Store the chosen terms
    sessionStorage.setItem("ToDate", ToDate);
    sessionStorage.setItem("Search", q);
    sessionStorage.setItem("Lang", document.getElementById("SearchLangSelect").value);
    sessionStorage.setItem("SortBy", document.getElementById("SearchSort").value);
}
/* A function to store all of the settings submitted in the settings modal */
function SettingsSubmit() {
    for (i = 1; i <= document.getElementsByName("ColourSelect").length; i++) { // For each element in the colour select
        if (document.getElementById("SettingsColourRadio" + i).checked) { // If the element is selected
            localStorage.setItem("Colour", i); // Store the value in local storage
        }
    }
    localStorage.setItem("Country", document.getElementById("SettingsCountrySelect").value); // Store the selected options in the local storage
    localStorage.setItem("Lang", document.getElementById("SettingsLangSelect").value);
    localStorage.setItem("PageSize", document.getElementById("SettingsPageSizeSlider").value);
    ColourStyle(); // Run the function to update the colour CSS based off of the local storage value
    CloseSettingsModal(); // Run the function to close the settings modal
}
/* Full screen news modal popup settings */
/* A function to show the article modal with the correct details for the selected article */
function ArticleModalOpen(i) {
    ScrollTop = window.pageYOffset; // Store the current scroll height
    var ArticleModal = document.getElementById("ArticleModal"); // Store the Article modal element
    CloseSettingsModal(); // Run the function to close the settings modal (incase it is open)
    HideCards(); // Run the function to hide the article cards
    var Title = (ReturnedData.articles[i].title == null || ReturnedData.articles[i].title == "") ? 'Unknown' : ReturnedData.articles[i].title; // For each piece of Returneddata check it is not null or empty ("") and if so output as 'Unknown' or the replacement image, if not then run the format function if needed and store the required data
    var Source = (ReturnedData.articles[i].source.name == null || ReturnedData.articles[i].source.name == "") ? 'Unknown' : ReturnedData.articles[i].source.name;
    var Desc = (ReturnedData.articles[i].description == null || ReturnedData.articles[i].decription == "") ? 'Unknown' : ReturnedData.articles[i].description;
    var Date = (ReturnedData.articles[i].publishedAt == null || ReturnedData.articles[i].publishedAt == "") ? 'Unknown' : FormatDate(ReturnedData.articles[i].publishedAt);
    var ImageURL = (ReturnedData.articles[i].urlToImage == null || ReturnedData.articles[i].urlToImage == "") ? 'Images/TempImage.png' : ReturnedData.articles[i].urlToImage;
    var URL = (ReturnedData.articles[i].url == null || ReturnedData.articles[i].url == "") ? 'Unknown' : ReturnedData.articles[i].url;
    document.getElementById("ArticleModalTitle").innerHTML = Title; // For each element output the variables retrieved from above
    document.getElementById("ArticleModalDesc").innerHTML = Desc;
    document.getElementById("ArticleModalImage").src = ImageURL;
    document.getElementById("ArticleModalMore").setAttribute("onclick", "window.open('" + URL + "')"); // Create an onclick event to open the article url in a new tab
    document.getElementById("ArticleModalDate").innerHTML = Date;
    document.getElementById("ArticleModalSource").innerHTML = Source;
    ArticleModal.style.display = "block"; // Show the article modal
    window.scroll(0, 0); // Scroll the window to the top
}
/* A function to close the article modal */
function ArticleModalClose() {
    ArticleModal.style.display = "none"; // Hide the Article modal
    ShowCards(); // Run the function to show the article cards
    window.scroll(0, ScrollTop); // Scroll to the stored height from before opening the Article modal
}
/* API Results Handling */
/* Check that the image can be retrieved and return the required url */
function CheckImage(BrokenImage) {
    BrokenImage.onerror = ""; // Set the onerror element to blank
    BrokenImage.src = "Images/TempImage.png"; // Replace the source of the image to the placeholder one
}
/* Format the date so it can be output in a readable format */
function FormatDate(Input) {
    var Date = Input.split("T"); // Returns String of yyyy-mm-dd
    var SepDate = Date[0].split("-"); // Split Date (yyyy-mm-dd) into array
    var SepTime = Date[1].split(":", 2); // Split Time (hh:mm:ssZ) into array
    return (SepDate[2] + "/" + SepDate[1] + "/" + SepDate[0] + " " + SepTime[0] + ":" + SepTime[1]); // Output as dd/mm/yyyy hh:mm
}
/* Display the response from the request in the limits of the page size and format correctly */
function OutputResults(Data) {
    var PageLimit = Data.articles.length < localStorage.getItem("PageSize") ? Data.articles.length : localStorage.getItem("PageSize"); // Store the lowest between the returned amount and page size
    for (i = 0; i < PageLimit; i++) { // For each number up to the Page Limit

        var Title = (Data.articles[i].title == null || Data.articles[i].title == "") ? 'Unknown' : Data.articles[i].title; // For each piece of data check it is not null or empty ("") and if so output as 'Unknown' or the replacement image, if not then run the format function if needed and store the required data
        var Source = (Data.articles[i].source.name == null || Data.articles[i].source.name == "") ? 'Unknown' : Data.articles[i].source.name;
        var Date = (Data.articles[i].publishedAt == null || Data.articles[i].publishedAt == "") ? 'Unknown' : FormatDate(Data.articles[i].publishedAt); // If not null, run the function to format the output of the date
        var ImageURL = (Data.articles[i].urlToImage == null || Data.articles[i].urlToImage == "") ?  'Images/TempImage.png' : Data.articles[i].urlToImage; // If not null run the function to check the image can load
        OutputArea.insertAdjacentHTML('beforeend', '<div class="card col-5 px-0 mx-auto my-1 ArticleCard" onclick="ArticleModalOpen(' + i + ')"><img class="card-img-top" src="' + ImageURL + '" alt="Article Image" onerror="CheckImage(this);"><div class="ArticleCardBody card-body p-2"><div class="ArticleTitle text-wrap font-weight-bold">' + Title + '</div></div><div class="ArticleCardFoot card-footer p-2"><div class="ArticleSource text-wrap text-muted">' + Source + '</div><div class="ArticleDate text-wrap text-muted">' + Date + '</div></div></div>'); // Add this html onto the end of what is already in the OutputArea div
    };
}
/* Get the category name from the given value ready for XMLHttpRequest */
function GetCategory(i) {
    if (i >= 1 && i <= (Categories.length - 1)) { // If the category is between 2 and one less than the length of the array (the number for the last element)
        return Categories[i]; // Return the corresponding category from the array
    } else { // If this does not apply
        return "general"; // Return general (for local news)
    }
}
/* News API GET request with required elements */
function RetrieveNews(Page, callback) {

    var Category = sessionStorage.getItem("Category") == null ? "" : GetCategory(sessionStorage.getItem("Category")); // Retrieve the category from the local storage
    SelectedCountry = localStorage.getItem("Country") == null ? "gb" : localStorage.getItem("Country"); // Retrieve the Country from the local storage
    PageSize = localStorage.getItem("PageSize"); // Retrieve the chosen Page Size from the local storage
    var NewsRequest = new XMLHttpRequest(); // Create a new XMLhttp request and store to variable
    NewsRequest.onreadystatechange = function () { // On a change in the ready state of the XMLhttp request
        if (this.readyState == 4 && this.status == 200) { // If the readyState of the request is complete and the status means that the request was successful
            ReturnedData = JSON.parse(this.response); // parse the JSON response and store it so it is available everywhere
            if (ReturnedData.totalResults > PageSize) { // If there are more results than are on 1 page
                var PagesNeeded = Math.ceil(ReturnedData.totalResults / PageSize); // Work out how many pages are needed rounded up
                DisplayNavBar(Page, PagesNeeded); // Configure and display nav bar based off of current page and total pages needed
            }
            callback(); // Run the callback of the function
        }
    };
    if (sessionStorage.getItem("Searching") == 'true') { // If Searching is true (Search is active)
        var q = sessionStorage.getItem("Search") == null ? "&q=" : "&q=" + sessionStorage.getItem("Search"); // Get all of the required elements
        var DateFrom = sessionStorage.getItem("FromDate") == null ? '&from=' : '&from=' + sessionStorage.getItem("FromDate");
        var DateTo = sessionStorage.getItem("ToDate") == null ? '&to=' : '&to=' + sessionStorage.getItem("ToDate");
        var Lang = sessionStorage.getItem("Lang") == null ? '&language=' : '&language=' + sessionStorage.getItem("Lang");
        var SortBy = sessionStorage.getItem("SortBy") == null ? '&sortBy=' : '&sortBy=' + sessionStorage.getItem("SortBy");
        var APIRequestURL = 'https://newsapi.org/v2/everything?pageSize=' + PageSize + '&page=' + Page + q + DateFrom + DateTo + SortBy + Lang + '&apiKey=' + APIKEY; // Create the API request
    } else { // If search is not active
        var APIRequestURL = 'https://newsapi.org/v2/top-headlines?pageSize=' + PageSize + '&page=' + Page + '&country=' + SelectedCountry + '&category=' + Category + '&sortBy=popularity&apiKey=' + APIKEY; // Create the API request
    }
    NewsRequest.open('GET', APIRequestURL, true); // Open the API request with the method GET and the prepared string
    NewsRequest.send(); // Send the API request
}
/* Retrieve and Output articles */
function RefreshArticles(Page) {
    var OutputArea = document.getElementById("ArticleOutput"); // Declare and store the element for articles to be in
    OutputArea.innerHTML = ""; // Clear the area for articles
    RetrieveNews(Page, // Retrieve the articles based on the SelectedCountry
        function () { // Wait for a callback from the retrieve
            OutputResults(ReturnedData) // Output the results (Waiting means the results are returned and stored before being output to avoid errors)
        });
}
/* Page Number */
/* A function to take to page number given and return a button with the needed details */
function PageNum(PageNum) {
    return "<li class='page-item'><a id='PageNum" + PageNum + "' class='page-link PageNumInactive' onclick='RefreshArticles(" + PageNum + ")'>" + PageNum + "</a></li>"; // Return the navigation button with required attributes based off of the given number
}
/* A function to configure and display the page navigation bar at bottom of the page based off of how many pages are available */
function DisplayNavBar(Page, TotalPages) {
    var NavBar = document.getElementById("PageNavBar"); // Get element to fill with pagination
    var PageOutput = ""; // Create an empty String for storage of output
    NavBar.innerHTML = ""; // Clear the navbar to allow full update / removal
    /* Set the common button values to variables to minimise code needed */
    var Prev = "<li class='page-item'><a id='PagePrev' class='page-link' onclick='RefreshArticles(" + (Page - 1) + ")' aria-label='Previous'><span aria-hidden='true'>&laquo;</span><span class='sr-only'>Previous</span></a></li>";
    var Page1 = "<li class='page-item'><a id='PageNum1' class='page-link' onclick='RefreshArticles(1)'>1</a></li>";
    var PageFiller = "<li class='page-item'><a class='page-link'>...</a></li>";
    var LastPage = "<li class='page-item'><a id='PageNum" + TotalPages + "' class='page-link' onclick='RefreshArticles(" + TotalPages + ")'>" + TotalPages + "</a></li>";
    var Next = "<li class='page-item'><a id='PageNext' class='page-link' onclick='RefreshArticles(" + (Page + 1) + ")' aria-label='Previous'><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Previous</span></a></li>";
    if (Page == 1) { // If it is the first page
        PageOutput += Page1 + PageNum(2); // Show the first and second page buttons
        if (TotalPages > 2 && TotalPages <= 5) { // Of there are more than 2 pages but less than 5
            for (i = 3; i <= TotalPages; i++) { // For each number starting at 3 and ending at the total number of pages
                PageOutput += PageNum(i); // Add the page button onto the Output
            }
        }
        if (TotalPages > 5) { // If there are more than 5 pages
            PageOutput += PageNum(3) + PageFiller + LastPage; // Add the 3rd page and then a filler followed by the last page
        }
        PageOutput += Next; // Add the next page button to the end of the output
    }
    if (Page == 2 && Page < TotalPages) { // If it is the Second, but not the last page
        PageOutput += Prev + Page1 + PageNum(2); // Add the previous button, 1st page and then 2nd page
        if (TotalPages <= 5) { // If there are less than or 5 total pages
            for (i = 3; i <= TotalPages; i++) { // For each starting at 3 and ending at the total pages
                PageOutput += PageNum(i); // Add the page button to the end of the output
            }
        } else { // If there are more than 5 pages
            PageOutput += PageNum(3) + PageFiller + LastPage; // Add the 3rd page, a filler and then the last page
        }
        PageOutput += Next; // Add the next page button to the end of the output
    }
    if (Page > 2 && Page < TotalPages) { // If it is after the second page, but not the last page
        PageOutput += Prev + Page1; // Add the first 2 elements
        if (TotalPages <= 5) { // If there are 5 or less pages
            for (i = 2; i <= TotalPages; i++) { // For each element number under the total number of pages
                PageOutput += PageNum(i); // Add the page button
            }
        }
        if (TotalPages > 5) { // If there are more than 5 pages
            if (Page > 3) { // If there are more than 3 pages
                PageOutput += PageFiller; // Add a filler to the end of the Output
            }
            if (Page <= TotalPages - 1) { // If the active page is atleast one before the last page
                PageOutput += PageNum(Page - 1) + PageNum(Page) + PageNum(Page + 1); // Add the page before, current and then next
                if (Page == TotalPages - 2) { // If the active page is 2 before the last page
                    PageOutput += LastPage; // Add the last page to the end of the output
                } else if (Page !== TotalPages - 1) { // Otherwise, if the current page is not one before the last
                    PageOutput += PageFiller + LastPage; // Add a filler and then the last page
                }
            }
        }
        PageOutput += Next; // Add the Next button to the end
    }
    if (Page == TotalPages) { // If it is the last page
        if (TotalPages > 5) { // If there are more than 5 pages
            PageOutput += Prev + Page1 + PageFiller + PageNum(Page - 2) + PageNum(Page - 1) + PageNum(Page); // Display prev button and page1 with a filler before the active page and 2 before
        }
        if (TotalPages <= 5) { // If there are only 5 pages or less
            PageOutput += Prev + Page1; // Add the initial 2 elements
            for (i = 2; i <= TotalPages; i++) { // For each between 2 and the total number of pages
                PageOutput += PageNum(i); // Add display for each that is within the total
            }
        }
    }
    NavBar.innerHTML = PageOutput; // Set the Navbar html to the Output created
    document.getElementById("PageNum" + Page).classList.add("PageNumActive"); // Add the active class to the current page
}
/* Create the navigation carousel at the top of the screen with the required settings  */
function InitialiseCatSelection() {
    $('#NavCategoryScroll').flickity({ // Initialise the flickity carousel
        // options
        draggable: true, // Make the carousel draggable
        cellAlign: 'center', // Align the cells to the center of the element
        wrapAround: true, // Wrap around to make it scroll infinitely
        pageDots: false, // Remove the pagination controls
        prevNextButtons: false, // Remove the controls
        initialIndex: sessionStorage.getItem("Category") // Set the initial index to the session storage variable
    });

    var $carousel = $('.carousel').flickity(); // Select the carousel
    var NavBarCarousel = $carousel.data('flickity'); // Store the data value into a variable

    NavBarCarousel.on('change', function (index) { // On the carousel value change 
        CloseSettingsModal();
        ArticleModalClose();
        sessionStorage.setItem("Category", index); // Set the session storage variable to the new cell
        if ((sessionStorage.getItem("Searching") == 'true') && (NavBarCarousel.selectedElement.id !== 'SearchCell')) { // If searching is true and the selected cell is not the Search cell
            CloseSearchAlert(); // Close the Search alert
        } else { // Otherwise
            RefreshArticles(1); //Refresh articles
        }
    });

}
/* Add the search cell to the navigation carousel at the top of the screen and scroll to it */
function CreateSearchCell() {
    var $carousel = $('.carousel').flickity(); // Select the carousel
    try { // Attempt to run
        var $cellElem = $('#SearchCell'); // Select the cell from the id
    }
    catch(e) { // If there is an error
        var SearchCell = false; // Set the variable to false
    }
    if (sessionStorage.getItem("Searching") && SearchCell){ // If the session storage is 
        return;
    }
    var $cellElem = $('<div id="SearchCell" class="carousel-cell"><b>Search</b></div>'); // Set the element html
    $carousel.flickity('insert', $cellElem, 0); // Insert the new cell into index 0
    $carousel.flickity('select', 0); // Select the new cell
}
/* Remove the search cell from the navigation carousel at the top of the screen and scroll away from it */
function RemoveSearchCell() {
    var $carousel = $('.carousel').flickity(); // Select the carousel
    var $cellElem = $('#SearchCell'); // Select the cell from the id
    $carousel.flickity('remove', $cellElem); // Remove the cell
}