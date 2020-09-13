// fetch national park api
var campgroundStateSearch = function(event) {
    event.preventDefault();

    const state = document.querySelector('#stateDropDown').value.trim();
    var url = "https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&api_key=MhULk8Ddiq8LChoxjMFP1euW2OvKmzF3lrN2Cu0c";

    fetch(url)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            const cg = data.data;

            generateSearch(cg);

            //saveCampground();                
        });
};

function generateSearch(campgrounds) {
    $('#search-results-wrapper').empty() //clearing out the previous search
    //check if user is logged in 
    var loggedIn = localStorage.getItem("loggedIn").toLowerCase === true;
    const campgroundsArray = campgrounds;

    // if there are no search results -- alerts user
    if (campgroundsArray.length == 0) {
        alert("Sorry! No national park campgrounds available to show right now!");
    };

    for (var i = 0; i < campgroundsArray.length; i++) {

        const searchResultsList = document.querySelector('#search-results-wrapper');
        const name = campgroundsArray[i].name;
        const address = campgroundsArray[i].addresses[0];
        const email = campgroundsArray[i].contacts.emailAddresses[0];
        const number = campgroundsArray[i].contacts.phoneNumbers[0];
        const picture = campgroundsArray[i].images[0];
        var id = campgroundsArray[i].id;
        var nameId = '#name-'+id;

        //create li element
        let campgroundListEl = document.createElement('li');
        campgroundListEl.setAttribute('id', id);
        $(campgroundListEl).addClass('col_12 alt');

        // append camp name
        var campNameEl = document.createElement("h5");
        campNameEl.setAttribute('id', 'name-'+id)
        campNameEl.setAttribute('value', name)
        campNameEl.innerHTML = name;
        campgroundListEl.appendChild(campNameEl);

        // append image
        if (picture == null || picture.url == "") {
            console.log('No picture!');
        } else {
           var campImageEl = document.createElement("p");
           campImageEl.innerHTML = '<img src="' + picture.url +'" credit="'
            + picture.credit + '" alt="'
            + picture.altText + '">';
            
            campgroundListEl.appendChild(campImageEl)
        }

        // append address
        if (address == null || address.line1 == "") {
            var noAddressEl = document.createElement("p");
            noAddressEl.innerHTML = "No address available";
            noAddressEl.setAttribute('id', 'address-'+id)
            noAddressEl.setAttribute('value', 'No address found')
            campgroundListEl.appendChild(noAddressEl);
            var addressId = '#address-'+id;
    
        } else {
            var validAddressEl = document.createElement("p");
            validAddressEl.innerHTML = address.line1 +
            ', ' + address.city + ', ' + address.stateCode + ', '
            + address.postalCode + '.';
            validAddressEl.setAttribute('id', 'address-'+id)
            campgroundListEl.appendChild(validAddressEl);
            validAddressEl.setAttribute('value', address.line1 + ' ' + address.city)
            var addressId = '#address-'+id;

        }

        // append number
        if (number == null || number.phoneNumber == "") {
            var noNumberEl = document.createElement("p");
            noNumberEl.innerHTML = "<b>Number: N/A</b>";
            campgroundListEl.appendChild(noNumberEl);
        } else {
            var validNumberEl = document.createElement("p");

            validNumberEl.innerHTML = '<b>Number:</b> ' + number.phoneNumber;
            campgroundListEl.appendChild(validNumberEl);
        }

        // append email
        if (email == null || email.emailAddress == "") {
            var noEmailEl = document.createElement("p");
            noEmailEl.innerHTML = "<b>Email: N/A</b>";
            campgroundListEl.appendChild(noEmailEl);
        } else {
            var validEmailEl = document.createElement("p");

            validEmailEl.innerHTML = '<b>Email:</b> ' + email.emailAddress + '</br></br>';
            campgroundListEl.appendChild(validEmailEl);
        }

        if(loggedIn){
            //append button 
            var saveButtonEl = document.createElement('button');
            saveButtonEl.innerHTML = "Save";
            saveButtonEl.addEventListener('click', function () {
                saveCampground(nameId, addressId);
            })
            $(saveButtonEl).addClass('med col_12 green');
            campgroundListEl.appendChild(saveButtonEl);
        }
        searchResultsList.appendChild(campgroundListEl)
    }
};

async function saveCampground(nameId, addressId) {
    event.preventDefault();
    console.log(nameId, addressId)

    const campground_name = document.querySelector(nameId).innerHTML.toString().trim();
    const location = document.querySelector(addressId).innerHTML.toString().trim();
    console.log(campground_name);
    console.log(location)

    if (campground_name && location) {
        const response = await fetch('/api/campgrounds', {
            method: 'post',
            body: JSON.stringify({
                campground_name,
                location
            }),
            headers: {'Content-Type': 'application/json'}
        });
        
        // check response status
        if (response.ok) {
            alert("Campground Saved!")
        }
        else {
            alert(response.statusText);
        }
    }
};

//document.querySelector('.campground-list-item').addEventListener('submit', saveCampground);

document.querySelector("#cg-state-search-form").addEventListener('submit', campgroundStateSearch)
