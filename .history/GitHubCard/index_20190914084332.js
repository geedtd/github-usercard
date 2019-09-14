/* Step 1: using axios, send a GET request to the following URL 
           (replacing the palceholder with your Github name):
           https://api.github.com/users/<your name>
*/

/* Step 2: Inspect and study the data coming back, this is YOUR 
   github info! You will need to understand the structure of this 
   data in order to use it to build your component function 
   Skip to Step 3.
*/

/* Step 3: Create a function that accepts a single object as its only argument,
          Using DOM methods and properties, create a component that will return the following DOM element:
<div class="card">
  <img src={image url of user} />
  <div class="card-info">
    <h3 class="name">{users name}</h3>
    <p class="username">{users user name}</p>
    <p>Location: {users location}</p>
    <p>Profile: 
      <a href={address to users github page}>{address to users github page}</a>
    </p>
    <p>Followers: {users followers count}</p>
    <p>Following: {users following count}</p>
    <p>Bio: {users bio}</p>
  </div>
</div>
*/

/* Step 4: Pass the data received from Github into your function, 
           create a new component and add it to the DOM as a child of .cards
*/

/* Step 5: Now that you have your own card getting added to the DOM, either 
          follow this link in your browser https://api.github.com/users/<Your github name>/followers 
          , manually find some other users' github handles, or use the list found 
          at the bottom of the page. Get at least 5 different Github usernames and add them as
          Individual strings to the friendsArray below.
          
          Using that array, iterate over it, requesting data for each user, creating a new card for each
          user, and adding that card to the DOM.
*/



/* List of LS Instructors Github username's: 
  tetondan
  dustinmyers
  justsml
  luishrd
  bigknell
*/

const cards = document.querySelector('.cards');
const me = appendSectionToCards('Me');
const followers = appendSectionToCards('Followers');
const following = appendSectionToCards('Following');

const localGitHub = false;
const localFollowers = false;
const localFollowing = false;

const mockGitHubData = localGitHub ? gitHubData() : undefined;
const mockFollowers = localFollowers ? followersData() : undefined;
const mockFollowing = localFollowing ? followingData() : undefined;

//fetching data
const myGitHubPromise = fetchData(mockGitHubData, 'https://api.github.com/users/geedtd');
console.log("myGitHubPromise:");
console.log(myGitHubPromise);

const followersArray = fetchData(mockFollowers, 'https://api.github.com/users/geedtd/followers');
console.log("followersArray:");
console.log(followersArray);

const followingArray = fetchData(mockFollowing, 'https://api.github.com/users/geedtd/following');
console.log("followingArray:");
console.log(followingArray);

//appending cards to DOM
appendCards(me, myGitHubPromise, 1);
appendCards(followers, followersArray, 5);
appendCards(following, followingArray, 5);

function appendSectionToCards(name, element = 'h2') {
  const newSection = document.createElement(element);
  newSection.textContent = name;
  newSection.classList.add(name.toLowerCase());
  cards.appendChild(newSection);
  return document.querySelector(element + '.' + name.toLowerCase());
}

async function fetchData(localData, remoteDataSourceUri) {
  if (typeof localData !== "undefined") {
    return await Promise.resolve(localData);
  } else {
    return await axios.get(remoteDataSourceUri);
  }
}

function buildGitHubProfileCard(data) {
  // Create Elements
  const card = document.createElement('div');
  const image = document.createElement('img');
  const cardInfo = document.createElement('div');
  const fullName = document.createElement('h3');
  const userName = document.createElement('p');
  const location = document.createElement('p');
  const profile = document.createElement('p');
  const link = document.createElement('a');
  const followers = document.createElement('p');
  const following = document.createElement('p');
  const bio = document.createElement('p');

  //setting content 

  image.setAttribute('src', data.avatar_url);
  fullName.textContent = data.name != null ? data.name : data.login;
  userName.textContent = data.login;
  location.textContent = data.location != null ? `Location: ${data.location}` : null;
  profile.textContent = "Profile: ";
  link.setAttribute('href', data.html_url);
  link.text = data.html_url;
  followers.innerHTML = typeof data.followers !== "undefined" ? `Followers: <a href="${data.html_url}?tab=followers">${data.followers}</a>` : null;
  following.innerHTML = typeof data.following !== "undefined" ? `Following: <a href="${data.html_url}?tab=following">${data.following}</a>` : null;
  bio.textContent = data.bio != null ? `Bio: ${data.bio}` : null;

  // creating structure

  card.appendChild(image);
  card.appendChild(cardInfo);
  cardInfo.appendChild(fullName);
  cardInfo.appendChild(userName);
  cardInfo.appendChild(location);
  cardInfo.appendChild(profile);
  profile.appendChild(link);
  cardInfo.appendChild(followers);
  cardInfo.appendChild(following);
  cardInfo.appendChild(bio);

  //styling

  card.classList.add('card');
  fullName.classList.add('name');
  userName.classList.add('username');

  return card;
}

function appendCards(target, data, count = 1, random = false) {
  console.log(`appendCardsData for '${target.textContent}':`);
  console.log(data);

  for (let i = 0; i <= count-1; i++) {
    data.then(r => {
      const localData = typeof r.status === "undefined";
      const arrayYN = typeof r.data[i] !== "undefined";
      const currentLogin = arrayYN ? r.data[i].login : r.data.login;
      const currentData = arrayYN ? r.data[i] : r.data;

      console.log(i);
      console.log(`Status: `+r.status);
      console.log("Local: "+localData);
      console.log('Type: '+typeof r.data[i]);
      console.log('arrayYN: '+arrayYN);
      console.log('currentLogin: '+currentLogin);
      console.log("currentData:")
      console.log(currentData);
      
      if (localData) {
        console.log(`Building card using local data for ${currentLogin}`);
        target.insertAdjacentElement("afterend", buildGitHubProfileCard(currentData));
      } else {
        console.log("Requests remaining: "+r.headers["x-ratelimit-remaining"]);
        console.log(`Building card using fetched data for ${currentLogin}`);
        axios.get('https://api.github.com/users/'+currentLogin).then((p) => {
          target.insertAdjacentElement("afterend", buildGitHubProfileCard(p.data));
        });
      }
    })
    .catch(e => {
      console.log(e);
    });
  }



function randomNumberGenerator(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


//did mock data suggested in help channel do to limit on API usage
function gitHubData() {
  return {
    data: {
      avatar_url: "https://avatars2.githubusercontent.com/u/28853379?v=4",
      bio: null,
      blog: "https://about.me/geedtd",
      company: null,
      created_at: "2017-05-22T03:14:21Z",
      email: null,
      events_url: "https://api.github.com/users/geedtd/events{/privacy}",
      followers: 2,
      followers_url: "https://api.github.com/users/geedtd/followers",
      following: 7,
      following_url: "https://api.github.com/users/geedtd/following{/other_user}",
      gists_url: "https://api.github.com/users/geedtd/gists{/gist_id}",
      gravatar_id: " ",
      hireable: false,
      html_url: "https://github.com/geedtd",
      id: 28853379,
      location: "Los Angeles",
      login: "geedtd",
      name: "Gerardo C",
      node_id: "MDQ6VXNlcjI4ODUzMzc5",
      organizations_url: "https://api.github.com/users/geedtd/orgs",
      public_gists: 0,
      public_repos: 18,
      received_events_url: "https://api.github.com/users/geedtd/received_events",
      repos_url: "https://api.github.com/users/geedtd/repos",
      site_admin: false,
      starred_url: "https://api.github.com/users/geedtd/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/geedtd/subscriptions",
      type: "User",
      updated_at: "2019-09-11T01:57:56Z",
      url: "https://api.github.com/users/geedtd"
    }
  };
}

function followersData() {
  return {
    data: []
  };
}

function followingData() {
  return {
    data: [

    ]
  };
}}