# React-Autosuggestions
An accessible React component to take the pain out of creating auto-suggestion components

## Usage:

```
import React from 'react';
import { AutoSuggest } from 'react-autosuggestions';

const ExampleServer = () => {
    const [make, setMake] = React.useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`The make selected was ${make}`)
    }
    return (
        <form onSubmit={handleSubmit}>
            <AutoSuggest 
                name="Make"
                url="https://ntsb-server.herokuapp.com/api/accidents/makeList"
                handleChange={setMake}
                value={make}
            />
            <button>Submit</button>
        </form>
    )
}

const ExampleClient = () => {
    const [make, setMake] = React.useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`The make selected was ${make}`)
    }
    return (
        <form onSubmit={handleSubmit}>
            <AutoSuggest
                name="Make"
                options={[
                "Acura",
                "BMW",
                "Audi",
                "Bentley",
                "Buick",
                "Cadillac",
                "Chevrolet",
                ]}
                handleChange={setMake}
                value={make}
            />
            <button>Submit</button>
        </form>
    )

}

```

## AutoSuggest props:
| propName | Description |
| --- | --- |
| **id** | value used to generate ids of nested elements |
| **type** | passing "server" will tell the component to render an AutoSuggestServer component.  If a type is not passed and a url argument is passed, the component infers the type to be server.  If no type is passed (or a type other than "server" is passed), AutoSuggestClient component is rendered. |
| **name** | name used for the autosuggest input label.  If `id` prop is not provided, the `name` prop is used for generating the ids of nested elements |
| **url** | endpoint to query to generate the suggestions list.  Component expects the url to accept input text as a parameter, not query.<br><br>Example:<br>With "https://ntsb-server.herokuapp.com/api/accidents/makeList" as the url,<br>if a user typed 'Bo' into the input field, a request would be sent to<br>https://ntsb-server.herokuapp.com/api/accidents/makeList/Bo) |
| **debounceTime** | the amount of milliseconds to wait before sending requests to url based on input |
| **styles** |  an object to customize the appearance of the AutoSuggest component |
| **options** | The array of options if the autosuggest is created using a list of items already in the application |
| **handleChange** | array for updating the text in the autosuggest field |
| **value** | the value of the autosuggest field |
| **caseInsensitive** | setting for Client version of AutoSuggest, whether to perform case-insensitive matches against the options array |


## AutoSuggest Default Props
| propName | type | defaultValue |
| --- | --- | --- |
| **id** | string | "" |
| **type** | string | "" |
| **name** | string | "Search" |
| **url** | string | "" |
| **debounceTime** | number | 200 |
| **styles** | object | <pre> {<br>    announcement: {<br>      position: "absolute",<br>      clip: "rect(0 0 0 0)",<br>      clipPath: "inset(50%)",<br>      height: "1px",<br>      width: "1px",<br>      overflow: "hidden",<br>    },<br>    combobox: {<br>      display: "inline-block",<br>    },<br>    hoveredSuggestionOption: {<br>      background: "#110D3B",<br>      color: "#FFF"<br>    },<br>    loadingStyles: {<br>      backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif)",<br>      position: "right center",<br>      repeat: "no-repeat",<br>    },<br>    searchField: {<br>      padding: ".5rem",<br>      border: "2px solid #c8c8c8",<br>      backgroundColor: "#fff",<br>      borderRadius: "6px",<br>      color: "#000",<br>      fontWeight: "normal",<br>      fontSize: "1.35rem",<br>      margin: "0 auto",<br>      width: "19rem",<br>      focus: {<br>        color: "#000",<br>        border: "2px solid #005499",<br>        outline: "none",<br>      },<br>    },<br>    searchLabel: {<br>      display: "block",<br>      fontSize: "1.35rem",<br>    },<br>    selectedSuggestionOption: {<br>      background: "#110D3B",<br>      color: "#FFF"<br>    },<br>    suggestionOption: {<br>      margin: "0",<br>      padding: ".5rem",<br>      fontSize: "1.35rem",<br>      whiteSpace: "nowrap",<br>      overflow: "hidden",<br>      cursor: "default",<br>    },<br>    suggestionOptions: {<br>      margin: "0",<br>      padding: "0",<br>      listStyle: "none",<br>    },<br>    suggestionsContainer: {<br>      display: "block",<br>      position: "absolute",<br>      border: "1px solid #999",<br>      background: "#fff",<br>      width: "20rem",<br>    },<br>  } </pre> |
| **options** | array | [] |
| **handleChange** | function | No default.  Required prop |
| **value** | string | No default.  Required prop |
| **caseInsensitive** | boolean | true |

<hr>

## Options argument

### Valid input:
- An array of strings
    
    If an array of strings is passed as the options argument, the `<li/>` options are given a textvalue attribute set to the value of the string and text content set to the value of the string
    
- An array of objects with the shape of { **name**, **value** }

    If an array of objects with {name, value} is passed as the options argument, the `<li/>` options will be given a name attribute set to the value of **name**, a textvalue attribute set to the value of **value**, and text content set to the value of **value**.
    
- An array of objects with the shape of { **abbr**, **name**, **value** }

    If an array of objects with {abbr, name, value} is passed as the options argument, the `<li/>` options will be given an abbr attribute set to the value of **abbr**, a name attribute set to the value of **name**, a textvalue attribute set to the value of **value**, and text content set to the value of **value**.


## What is actually generated by AutoSuggest
Using our earlier example

```jsx
    <form onSubmit={handleSubmit}>
        <AutoSuggest id="desktop-make" name="Make" url="https://ntsb-server.herokuapp.com/api/accidents/makeList" handleChange={setMake} value={make}/>
        <button>Submit</button>
    </form>
```

If the user entered "brau" into the input field, the resulting html would look like this:

```html
<form>
    <div id="desktop-make-announcement" class="visually-hidden" aria-live="polite" style="position: absolute; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; width: 1px; overflow: hidden;">4 suggestions displayed.  To navigate, use up and down arrow keys.
    </div>
    <div>
        <div id="desktop-make-searchField" role="combobox" aria-expanded="true" aria-owns="desktop-make-input" aria-haspopup="listbox" aria-controls="desktop-make-autosuggest-options" style="display: inline-block;">
            <label for="desktop-make-input" style="display: block; font-size: 1.35rem;">Make
            </label>
            <input id="desktop-make-input" type="text" class="searchfield" autocomplete="off" aria-autocomplete="both" value="brau" style="padding: 0.5rem; border: 2px solid rgb(200, 200, 200); background-color: rgb(255, 255, 255); border-radius: 6px; color: rgb(0, 0, 0); font-weight: normal; font-size: 1.35rem; margin: 0px auto; width: 19rem; outline: none;">
        </div>
        <div class="autocompleteSuggestions" id="desktop-make-autocomplete" style="display: block; position: absolute; border: 1px solid rgb(153, 153, 153); background: rgb(255, 255, 255); width: 20rem;">
            <ul id="desktop-make-autosuggest-options" role="listbox" style="margin: 0px; padding: 0px; list-style: none;">
                <li role="option" id="desktop-make-suggestion-0" aria-selected="false" class="auto-suggestions" style="margin: 0px; padding: 0.5rem; font-size: 1.35rem; white-space: nowrap; overflow: hidden; cursor: default;">BRAUCH
                </li>
                <li role="option" id="desktop-make-suggestion-1" aria-selected="false" class="auto-suggestions" style="margin: 0px; padding: 0.5rem; font-size: 1.35rem; white-space: nowrap; overflow: hidden; cursor: default;">BRAULT GLASAIR
                </li>
                <li role="option" id="desktop-make-suggestion-2" aria-selected="false" class="auto-suggestions" style="margin: 0px; padding: 0.5rem; font-size: 1.35rem; white-space: nowrap; overflow: hidden; cursor: default;">Brault
                </li>
                <li role="option" id="desktop-make-suggestion-3" aria-selected="false" class="auto-suggestions" style="margin: 0px; padding: 0.5rem; font-size: 1.35rem; white-space: nowrap; overflow: hidden; cursor: default;">Braunschmidt
                </li>
            </ul>
        </div>
    </div>
    <button>Submit</button>
</form>
```

### Features
- If no results match the text entered (whether that means the fetch request resulted in an empty list or if the options list does not include anything that starts with the text value), a paragraph tag is displayed saying "No results found"
- With an AutoSuggestServer component, if the fetch fails, a paragraph tag is displayed saying "Results could not be fetched"
- With an AutoSuggestServer component, a loading spinner is shown on the input field while the fetch request is being sent (and while the search text doesn't equal the same value as the debounced search text)

### Credit

Logic greatly inspired by the work of Dennis Lembree (@dennisl) at https://github.com/weboverhauls/demos
