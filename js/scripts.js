// ------------------------------------------
//  VARIABLES
// ------------------------------------------

let usersArray = []; // Array stores objects containing user data
let selectedUser = 0; // Holds index value of selected user
const grid = document.querySelector('.grid');
const modal = document.querySelector('.modal');
const numberOfResults = 12;
const states =  {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District Of Columbia': 'DC',
    'Federated States Of Micronesia': 'FM',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Marshall Islands': 'MH',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Palau': 'PW',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
  }

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

// Loops through usersArray and accesses values of user objects then writes to page. Currently this html is being inserted into the divs with the class 'flex-item'. Ideally, this code should create those divs dynamically because if the amount of users fetched form the api were to change then the code would fail. The issue is that when I create the content dynamically my event handlers are failing because the elements they are added to do not exist at the time they are added. IDEA: I think I need to set the handler to a parent element and then check to see if the 'flex-item' divs exist.

function writeToPage(usersArray)  {
  usersArray.forEach((element, index) => {
    let flex = document.createElement('div');
    flex.classList.add('flex-item');
    flex.innerHTML = `
        <img id=user-${index} src=${usersArray[index].picture}>
        <div class="user-info">
          <h1 class="name">${usersArray[index].name}</h1>
            <p>${usersArray[index].email}</p>
            <p>${usersArray[index].city}</p>
        </div>`;
    grid.appendChild(flex);
  });
}

function createObject(data) {
  for (let i=0; i<data.results.length; i++) {
  let User = new UserInfo(
    `${data.results[i].name.first} ${data.results[i].name.last}`,
    data.results[i].email, data.results[i].location.city,
    data.results[i].location.street,
    data.results[i].location.state,
    data.results[i].location.postcode,
    data.results[i].dob.date,
    data.results[i].phone,
    data.results[i].picture.large
    );
  usersArray.push(User);
}
  return usersArray;
}

// ------------------------------------------
//  Object Constructor
// ------------------------------------------

// Constructs object from data fetched from API. Some data is modified using setters and getters. // IDEA: Find a way to turn one of the capitalize string setter logic into a function to refactor amount of code. Should this be done outside of object or within userInfo class

  class UserInfo {
    constructor(name, email, city, address, state, zip, dob, phone, picture) {
      this.name = name,
      this.email = email,
      this.city = city,
      this.address = address,
      this.state = state,
      this.zip = zip,
      this.dob = dob,
      this.phone = phone,
      this.picture = picture
    }

    //  Not currently using this method
    fullAddress() {
      return `${this.address} ${this.city} ${this.state} ${this.zip}`;
    }

    set dob(dob) {
      const dobFormatted = dob.substring(5, 10) + '-' + dob.substring(0, 4);
      this._dob = dobFormatted;
    }

    get dob() {
      return this._dob
    }

    set name(name) {
      const nameCaps = name.replace(/(^|\s)[a-z]/g, (name) => {
        return name.toUpperCase();
      });

      this._name = nameCaps;
    }

    get name() {
      return this._name
    }

    set address(address) {
      function titleCase(address) {
        address = address.toLowerCase()
        .split(' ')
        .map(function(address) {
        return address.replace(address[0], address[0].toUpperCase());
      });
      return address.join(' ');
      }
      this._address = titleCase(address);
    }

    get address() {
      return this._address
    }

    set city(city) {
      function titleCase(city) {
        city = city.toLowerCase()
        .split(' ')
        .map(function(city) {
          return city.replace(city[0], city[0].toUpperCase());
      });
      return city.join(' ');
    }

      this._city = titleCase(city);
    }

    get city() {
      return this._city
    }

    set state(state) {
      const stateCaps = state.replace(/(^|\s)[a-z]/g, (state) => {
        return state.toUpperCase();
      });
      this._state = stateCaps;
    }

    get state() {
      return this._state
    }

  }

  // ------------------------------------------
  //  FETCH USERS
  // ------------------------------------------

  fetch(`https://randomuser.me/api?nat=us&results=${numberOfResults}&inc=name,email,location,picture,phone,dob`)
    .then(response => response.json())
    .then(data => createObject(data))
    .then(data => writeToPage(data))
    .then(() => {
      let container = document.querySelectorAll('.flex-item');

      for (let i=0; i<container.length; i++) {
        container[i].addEventListener('click', () => {
          if (modal.className=='modal') {
            selectedUser = i;
            modal.classList.toggle('show-modal');

            document.querySelector('.modal-content').innerHTML = generateModalContent(usersArray, i);
          }
        });
      }

    });

// ------------------------------------------
//  OVERLAY FUNCTIONS
// ------------------------------------------


function generateModalContent(array, user) {
  return `
    <h2 class ="close-modal">&times;</h2>
    <img class="overlay-image"src='${array[user].picture}'>
    <div class="arrows">
      <p class='left-arrow'>&#9664;</p>
      <p class='right-arrow'>&#9654;</p>
    </div>
    <h1 class="name">${array[user].name}</h1>
    <p>${array[user].email}</p>
    <p>${array[user].city}</p>
    <div class="user-data">
      <p>${array[user].phone}</p>
      <p class="user-address">${array[user].address} ${states[array[user].state]} ${array[user].zip}</p>
      <p>${array[user].dob}</p>
    </div>
  `;
}

//  Handler fires and closes modal window when user clicks on close button or outside of modal window. If user clicks right or left arrows, handler triggers new html with the next or previous user.  IDEA Refactor so dynamic html isn't repeated twice//

modal.addEventListener('click', event => {
  if (event.target.className === 'close-modal' || event.target.className === 'modal show-modal') {
    modal.classList.toggle('show-modal');
  }
  //else if target == right arrow add to selectedUser
// U+25b6  &#9654
  else if (modal.classList.contains('show-modal') && event.target.className=='right-arrow') {
    if (selectedUser < usersArray.length-1) {
      selectedUser += 1;
      document.querySelector('.modal-content').innerHTML = generateModalContent(usersArray, selectedUser);
    }
  } else if (modal.classList.contains('show-modal') && event.target.className=='left-arrow') {
    if (selectedUser > 0) {
      selectedUser -= 1;
      document.querySelector('.modal-content').innerHTML = generateModalContent(usersArray, selectedUser);
    }
  }
})


// ------------------------------------------
//  SEARCH FUNCTION
// ------------------------------------------
const filterImages = () => {
  let filterValue, employees, caption;
  // Get input value
  filterValue = document.getElementById('search').value.toUpperCase();
  //gets nodelist array of elements with 'name' class
  employees = document.getElementsByClassName("name");
  //Loop through names
  for (let i=0; i<employees.length; i++) {
    caption = employees[i].textContent;
    //If matched display, if no match, set display to none
    if (caption.toUpperCase().indexOf(filterValue) > -1) {
      employees[i].parentNode.parentNode.style.display= '';
    } else {
      employees[i].parentNode.parentNode.style.display= 'none';
    }
  }
}

let search = document.getElementById('search');
search.addEventListener('keyup', filterImages);
