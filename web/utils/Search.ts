
/*
 * This is the function that actually highlights a text string by
 * adding HTML tags before and after all occurrences of the search
 * term. You can pass your own tags if you'd like, or if the
 * highlightStartTag or highlightEndTag parameters are omitted or
 * are empty strings then the default <font> tags will be used.
 */
export function doHighlight(bodyText, searchTerm, highlightStartTag, highlightEndTag)
{
    // the highlightStartTag and highlightEndTag parameters are optional
    if ((!highlightStartTag) || (!highlightEndTag)) {
        highlightStartTag = "<mark style='color:blue; background-color:yellow;'>";
        highlightEndTag = "</mark>";
    }

    // find all occurences of the search term in the given text,
    // and add some "highlight" tags to them (we're not using a
    // regular expression search, because we want to filter out
    // matches that occur within HTML tags and script blocks, so
    // we have to do a little extra validation)
    var newText = "";
    var i = -1;
    var lcSearchTerm = searchTerm.toLowerCase();
    var lcBodyText = bodyText.toLowerCase();

    while (bodyText.length > 0) {
        i = lcBodyText.indexOf(lcSearchTerm, i+1);
        if (i < 0) {
            newText += bodyText;
            bodyText = "";
        } else {
            // skip anything inside an HTML tag
            if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
                // skip anything inside a <script> block
                if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
                    newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substring(i, searchTerm.length) + highlightEndTag;
                    bodyText = bodyText.substring(i + searchTerm.length);
                    lcBodyText = bodyText.toLowerCase();
                    i = -1;
                }
            }
        }
    }

    return newText;
}


/*
 * This is sort of a wrapper function to the doHighlight function.
 * It takes the searchText that you pass, optionally splits it into
 * separate words, and transforms the text on the current web page.
 * Only the "searchText" parameter is required; all other parameters
 * are optional and can be omitted.
 */
function highlightSearchTerms(searchText, treatAsPhrase, warnOnFailure, highlightStartTag, highlightEndTag)
{
    // if the treatAsPhrase parameter is true, then we should search for
    // the entire phrase that was entered; otherwise, we will split the
    // search string so that each word is searched for and highlighted
    // individually
    if (treatAsPhrase) {
        searchArray = [searchText];
    } else {
        searchArray = searchText.split(" ");
    }

    if (!document.body || typeof(document.body.innerHTML) == "undefined") {
        if (warnOnFailure) {
            alert("Sorry, for some reason the text of this page is unavailable. Searching will not work.");
        }
        return false;
    }

    var bodyText = document.body.innerHTML;
    for (var i = 0; i < searchArray.length; i++) {
        bodyText = doHighlight(bodyText, searchArray[i], highlightStartTag, highlightEndTag);
    }

    document.body.innerHTML = bodyText;
    return true;
}


/*
 * This displays a dialog box that allows a user to enter their own
 * search terms to highlight on the page, and then passes the search
 * text or phrase to the highlightSearchTerms function. All parameters
 * are optional.
 */
function searchPrompt(defaultText, treatAsPhrase, textColor, bgColor)
{
    // This function prompts the user for any words that should
    // be highlighted on this web page
    if (!defaultText) {
        defaultText = "";
    }

    // we can optionally use our own highlight tag values
    if ((!textColor) || (!bgColor)) {
        highlightStartTag = "";
        highlightEndTag = "";
    } else {
        highlightStartTag = "<font style='color:" + textColor + "; background-color:" + bgColor + ";'>";
        highlightEndTag = "</font>";
    }

    if (treatAsPhrase) {
        promptText = "Please enter the phrase you'd like to search for:";
    } else {
        promptText = "Please enter the words you'd like to search for, separated by spaces:";
    }

    searchText = prompt(promptText, defaultText);

    if (!searchText)  {
        alert("No search terms were entered. Exiting function.");
        return false;
    }

    return highlightSearchTerms(searchText, treatAsPhrase, true, highlightStartTag, highlightEndTag);
}