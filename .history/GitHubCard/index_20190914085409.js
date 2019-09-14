//#region Instructions
/* Step 1: using axios, send a GET request to the following URL 
           (replacing the palceholder with your Github name):
           https://api.github.com/users/<your name>
*/

/* Step 2: Inspect and study the data coming back, this is YOUR 
   github info! You will need to understand the structure of this 
   data in order to use it to build your component function 
   Skip to Step 3.
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

/* List of LS Instructors Github username's: 
  tetondan
  dustinmyers
  justsml
  luishrd
  bigknell
*/
//#endregion Instructions

const cards = document.querySelector('.cards');
const me = appendSectionToCards('Me');
const followers = appendSectionToCards('Followers');
const following = appendSectionToCards('Following');

//set local* = false to use live API data
const localGitHub = false;
const localFollowers = false;
const localFollowing = false;

const mockGitHubData = localGitHub ? gitHubData() : undefined;
const mockFollowers = localFollowers ? followersData() : undefined;
const mockFollowing = localFollowing ? followingData() : undefined;

// Fetch data
const myGitHubPromise = fetchData(mockGitHubData, 'https://api.github.com/users/PaulMEdwards');
console.log("myGitHubPromise:");
console.log(myGitHubPromise);

const followersArray = fetchData(mockFollowers, 'https://api.github.com/users/PaulMEdwards/followers');
console.log("followersArray:");
console.log(followersArray);

const followingArray = fetchData(mockFollowing, 'https://api.github.com/users/PaulMEdwards/following');
console.log("followingArray:");
console.log(followingArray);

// Append Card Data to DOM
appendCards(me, myGitHubPromise, 1);
appendCards(followers, followersArray, 5);
appendCards(following, followingArray, 5);


// Helper functions
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

  // Set content
  image.setAttribute('src', data.avatar_url);
  fullName.textContent = data.name != null ? data.name : data.login; //name can apparently be null...
  userName.textContent = data.login;
  location.textContent = data.location != null ? `Location: ${data.location}` : null;
  profile.textContent = "Profile: ";
  link.setAttribute('href', data.html_url);
  link.text = data.html_url;
  followers.innerHTML = typeof data.followers !== "undefined" ? `Followers: <a href="${data.html_url}?tab=followers">${data.followers}</a>` : null;
  following.innerHTML = typeof data.following !== "undefined" ? `Following: <a href="${data.html_url}?tab=following">${data.following}</a>` : null;
  bio.textContent = data.bio != null ? `Bio: ${data.bio}` : null;

  // Create Structure
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

  // Apply styles
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
        // target.insertAdjacentElement("afterend", buildGitHubProfileCard(currentData));
        target.appendChild(buildGitHubProfileCard(currentData));
      } else {
        console.log("Requests remaining: "+r.headers["x-ratelimit-remaining"]);
        console.log(`Building card using fetched data for ${currentLogin}`);
        axios.get('https://api.github.com/users/'+currentLogin).then((p) => {
          // target.insertAdjacentElement("afterend", buildGitHubProfileCard(p.data));
          target.appendChild(buildGitHubProfileCard(p.data));
        });
      }
    })
    .catch(e => {
      console.log(e);
    });
  }

  // subSet = [];
  // for (let i = 0; i <= count - 1; i++) {
  //   console.log(i);
  //   subSet.push(data[randomNumberGenerator(0, data.length - 1)]);
  // }
  // console.log("subSet:");
  // console.log(subSet);
  // subSet.forEach(g => {
  //   axios.get('https://api.github.com/users/' + g.login).then(function (results) {
  //     console.log(results);
  //     target.insertAdjacentElement("afterend", buildGitHubProfileCard(results.data));
  //   });
  // });
}

function randomNumberGenerator(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Mock DataSets
function gitHubData() {
  return {
    data: {
      avatar_url: "https://avatars0.githubusercontent.com/u/153847?v=4",
      bio: null,
      blog: "https://about.me/PaulMEdwards",
      company: "PKE Services",
      created_at: "2009-11-16T10:53:58Z",
      email: null,
      events_url: "https://api.github.com/users/PaulMEdwards/events{/privacy}",
      followers: 12,
      followers_url: "https://api.github.com/users/PaulMEdwards/followers",
      following: 28,
      following_url: "https://api.github.com/users/PaulMEdwards/following{/other_user}",
      gists_url: "https://api.github.com/users/PaulMEdwards/gists{/gist_id}",
      gravatar_id: "",
      hireable: true,
      html_url: "https://github.com/PaulMEdwards",
      id: 153847,
      location: "Brea, CA, USA",
      login: "PaulMEdwards",
      name: "Paul M Edwards",
      node_id: "MDQ6VXNlcjE1Mzg0Nw==",
      organizations_url: "https://api.github.com/users/PaulMEdwards/orgs",
      public_gists: 0,
      public_repos: 40,
      received_events_url: "https://api.github.com/users/PaulMEdwards/received_events",
      repos_url: "https://api.github.com/users/PaulMEdwards/repos",
      site_admin: false,
      starred_url: "https://api.github.com/users/PaulMEdwards/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/PaulMEdwards/subscriptions",
      type: "User",
      updated_at: "2019-09-05T01:03:48Z",
      url: "https://api.github.com/users/PaulMEdwards"
    }
  };
}

function followersData() {
  return {
    data: [
      {
        "login": "MichalPaszkiewicz",
        "id": 6673982,
        "node_id": "MDQ6VXNlcjY2NzM5ODI=",
        "avatar_url": "https://avatars3.githubusercontent.com/u/6673982?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/MichalPaszkiewicz",
        "html_url": "https://github.com/MichalPaszkiewicz",
        "followers_url": "https://api.github.com/users/MichalPaszkiewicz/followers",
        "following_url": "https://api.github.com/users/MichalPaszkiewicz/following{/other_user}",
        "gists_url": "https://api.github.com/users/MichalPaszkiewicz/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/MichalPaszkiewicz/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/MichalPaszkiewicz/subscriptions",
        "organizations_url": "https://api.github.com/users/MichalPaszkiewicz/orgs",
        "repos_url": "https://api.github.com/users/MichalPaszkiewicz/repos",
        "events_url": "https://api.github.com/users/MichalPaszkiewicz/events{/privacy}",
        "received_events_url": "https://api.github.com/users/MichalPaszkiewicz/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "KevinHock",
        "id": 3076393,
        "node_id": "MDQ6VXNlcjMwNzYzOTM=",
        "avatar_url": "https://avatars1.githubusercontent.com/u/3076393?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/KevinHock",
        "html_url": "https://github.com/KevinHock",
        "followers_url": "https://api.github.com/users/KevinHock/followers",
        "following_url": "https://api.github.com/users/KevinHock/following{/other_user}",
        "gists_url": "https://api.github.com/users/KevinHock/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/KevinHock/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/KevinHock/subscriptions",
        "organizations_url": "https://api.github.com/users/KevinHock/orgs",
        "repos_url": "https://api.github.com/users/KevinHock/repos",
        "events_url": "https://api.github.com/users/KevinHock/events{/privacy}",
        "received_events_url": "https://api.github.com/users/KevinHock/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "ornichola",
        "id": 1502708,
        "node_id": "MDQ6VXNlcjE1MDI3MDg=",
        "avatar_url": "https://avatars1.githubusercontent.com/u/1502708?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/ornichola",
        "html_url": "https://github.com/ornichola",
        "followers_url": "https://api.github.com/users/ornichola/followers",
        "following_url": "https://api.github.com/users/ornichola/following{/other_user}",
        "gists_url": "https://api.github.com/users/ornichola/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/ornichola/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/ornichola/subscriptions",
        "organizations_url": "https://api.github.com/users/ornichola/orgs",
        "repos_url": "https://api.github.com/users/ornichola/repos",
        "events_url": "https://api.github.com/users/ornichola/events{/privacy}",
        "received_events_url": "https://api.github.com/users/ornichola/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "Nappa9693",
        "id": 17730472,
        "node_id": "MDQ6VXNlcjE3NzMwNDcy",
        "avatar_url": "https://avatars3.githubusercontent.com/u/17730472?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Nappa9693",
        "html_url": "https://github.com/Nappa9693",
        "followers_url": "https://api.github.com/users/Nappa9693/followers",
        "following_url": "https://api.github.com/users/Nappa9693/following{/other_user}",
        "gists_url": "https://api.github.com/users/Nappa9693/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Nappa9693/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Nappa9693/subscriptions",
        "organizations_url": "https://api.github.com/users/Nappa9693/orgs",
        "repos_url": "https://api.github.com/users/Nappa9693/repos",
        "events_url": "https://api.github.com/users/Nappa9693/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Nappa9693/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "Lovesan",
        "id": 227641,
        "node_id": "MDQ6VXNlcjIyNzY0MQ==",
        "avatar_url": "https://avatars1.githubusercontent.com/u/227641?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Lovesan",
        "html_url": "https://github.com/Lovesan",
        "followers_url": "https://api.github.com/users/Lovesan/followers",
        "following_url": "https://api.github.com/users/Lovesan/following{/other_user}",
        "gists_url": "https://api.github.com/users/Lovesan/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Lovesan/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Lovesan/subscriptions",
        "organizations_url": "https://api.github.com/users/Lovesan/orgs",
        "repos_url": "https://api.github.com/users/Lovesan/repos",
        "events_url": "https://api.github.com/users/Lovesan/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Lovesan/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "woodrdk",
        "id": 32694603,
        "node_id": "MDQ6VXNlcjMyNjk0NjAz",
        "avatar_url": "https://avatars1.githubusercontent.com/u/32694603?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/woodrdk",
        "html_url": "https://github.com/woodrdk",
        "followers_url": "https://api.github.com/users/woodrdk/followers",
        "following_url": "https://api.github.com/users/woodrdk/following{/other_user}",
        "gists_url": "https://api.github.com/users/woodrdk/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/woodrdk/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/woodrdk/subscriptions",
        "organizations_url": "https://api.github.com/users/woodrdk/orgs",
        "repos_url": "https://api.github.com/users/woodrdk/repos",
        "events_url": "https://api.github.com/users/woodrdk/events{/privacy}",
        "received_events_url": "https://api.github.com/users/woodrdk/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "markpairdha",
        "id": 40805316,
        "node_id": "MDQ6VXNlcjQwODA1MzE2",
        "avatar_url": "https://avatars3.githubusercontent.com/u/40805316?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/markpairdha",
        "html_url": "https://github.com/markpairdha",
        "followers_url": "https://api.github.com/users/markpairdha/followers",
        "following_url": "https://api.github.com/users/markpairdha/following{/other_user}",
        "gists_url": "https://api.github.com/users/markpairdha/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/markpairdha/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/markpairdha/subscriptions",
        "organizations_url": "https://api.github.com/users/markpairdha/orgs",
        "repos_url": "https://api.github.com/users/markpairdha/repos",
        "events_url": "https://api.github.com/users/markpairdha/events{/privacy}",
        "received_events_url": "https://api.github.com/users/markpairdha/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "Dmitriy-Vas",
        "id": 48634525,
        "node_id": "MDQ6VXNlcjQ4NjM0NTI1",
        "avatar_url": "https://avatars2.githubusercontent.com/u/48634525?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Dmitriy-Vas",
        "html_url": "https://github.com/Dmitriy-Vas",
        "followers_url": "https://api.github.com/users/Dmitriy-Vas/followers",
        "following_url": "https://api.github.com/users/Dmitriy-Vas/following{/other_user}",
        "gists_url": "https://api.github.com/users/Dmitriy-Vas/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Dmitriy-Vas/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Dmitriy-Vas/subscriptions",
        "organizations_url": "https://api.github.com/users/Dmitriy-Vas/orgs",
        "repos_url": "https://api.github.com/users/Dmitriy-Vas/repos",
        "events_url": "https://api.github.com/users/Dmitriy-Vas/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Dmitriy-Vas/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "cnlien",
        "id": 8670945,
        "node_id": "MDQ6VXNlcjg2NzA5NDU=",
        "avatar_url": "https://avatars1.githubusercontent.com/u/8670945?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/cnlien",
        "html_url": "https://github.com/cnlien",
        "followers_url": "https://api.github.com/users/cnlien/followers",
        "following_url": "https://api.github.com/users/cnlien/following{/other_user}",
        "gists_url": "https://api.github.com/users/cnlien/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/cnlien/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/cnlien/subscriptions",
        "organizations_url": "https://api.github.com/users/cnlien/orgs",
        "repos_url": "https://api.github.com/users/cnlien/repos",
        "events_url": "https://api.github.com/users/cnlien/events{/privacy}",
        "received_events_url": "https://api.github.com/users/cnlien/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "leachcoding",
        "id": 42565053,
        "node_id": "MDQ6VXNlcjQyNTY1MDUz",
        "avatar_url": "https://avatars3.githubusercontent.com/u/42565053?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/leachcoding",
        "html_url": "https://github.com/leachcoding",
        "followers_url": "https://api.github.com/users/leachcoding/followers",
        "following_url": "https://api.github.com/users/leachcoding/following{/other_user}",
        "gists_url": "https://api.github.com/users/leachcoding/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/leachcoding/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/leachcoding/subscriptions",
        "organizations_url": "https://api.github.com/users/leachcoding/orgs",
        "repos_url": "https://api.github.com/users/leachcoding/repos",
        "events_url": "https://api.github.com/users/leachcoding/events{/privacy}",
        "received_events_url": "https://api.github.com/users/leachcoding/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "raypugh07",
        "id": 48686907,
        "node_id": "MDQ6VXNlcjQ4Njg2OTA3",
        "avatar_url": "https://avatars1.githubusercontent.com/u/48686907?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/raypugh07",
        "html_url": "https://github.com/raypugh07",
        "followers_url": "https://api.github.com/users/raypugh07/followers",
        "following_url": "https://api.github.com/users/raypugh07/following{/other_user}",
        "gists_url": "https://api.github.com/users/raypugh07/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/raypugh07/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/raypugh07/subscriptions",
        "organizations_url": "https://api.github.com/users/raypugh07/orgs",
        "repos_url": "https://api.github.com/users/raypugh07/repos",
        "events_url": "https://api.github.com/users/raypugh07/events{/privacy}",
        "received_events_url": "https://api.github.com/users/raypugh07/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "meholt",
        "id": 47041979,
        "node_id": "MDQ6VXNlcjQ3MDQxOTc5",
        "avatar_url": "https://avatars0.githubusercontent.com/u/47041979?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/meholt",
        "html_url": "https://github.com/meholt",
        "followers_url": "https://api.github.com/users/meholt/followers",
        "following_url": "https://api.github.com/users/meholt/following{/other_user}",
        "gists_url": "https://api.github.com/users/meholt/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/meholt/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/meholt/subscriptions",
        "organizations_url": "https://api.github.com/users/meholt/orgs",
        "repos_url": "https://api.github.com/users/meholt/repos",
        "events_url": "https://api.github.com/users/meholt/events{/privacy}",
        "received_events_url": "https://api.github.com/users/meholt/received_events",
        "type": "User",
        "site_admin": false
      }
    ]
  };
}

function followingData() {
  return {
    data: [
      {
        "login": "ginatrapani",
        "id": 60632,
        "node_id": "MDQ6VXNlcjYwNjMy",
        "avatar_url": "https://avatars0.githubusercontent.com/u/60632?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/ginatrapani",
        "html_url": "https://github.com/ginatrapani",
        "followers_url": "https://api.github.com/users/ginatrapani/followers",
        "following_url": "https://api.github.com/users/ginatrapani/following{/other_user}",
        "gists_url": "https://api.github.com/users/ginatrapani/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/ginatrapani/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/ginatrapani/subscriptions",
        "organizations_url": "https://api.github.com/users/ginatrapani/orgs",
        "repos_url": "https://api.github.com/users/ginatrapani/repos",
        "events_url": "https://api.github.com/users/ginatrapani/events{/privacy}",
        "received_events_url": "https://api.github.com/users/ginatrapani/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "piroor",
        "id": 70062,
        "node_id": "MDQ6VXNlcjcwMDYy",
        "avatar_url": "https://avatars2.githubusercontent.com/u/70062?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/piroor",
        "html_url": "https://github.com/piroor",
        "followers_url": "https://api.github.com/users/piroor/followers",
        "following_url": "https://api.github.com/users/piroor/following{/other_user}",
        "gists_url": "https://api.github.com/users/piroor/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/piroor/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/piroor/subscriptions",
        "organizations_url": "https://api.github.com/users/piroor/orgs",
        "repos_url": "https://api.github.com/users/piroor/repos",
        "events_url": "https://api.github.com/users/piroor/events{/privacy}",
        "received_events_url": "https://api.github.com/users/piroor/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "koush",
        "id": 73924,
        "node_id": "MDQ6VXNlcjczOTI0",
        "avatar_url": "https://avatars0.githubusercontent.com/u/73924?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/koush",
        "html_url": "https://github.com/koush",
        "followers_url": "https://api.github.com/users/koush/followers",
        "following_url": "https://api.github.com/users/koush/following{/other_user}",
        "gists_url": "https://api.github.com/users/koush/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/koush/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/koush/subscriptions",
        "organizations_url": "https://api.github.com/users/koush/orgs",
        "repos_url": "https://api.github.com/users/koush/repos",
        "events_url": "https://api.github.com/users/koush/events{/privacy}",
        "received_events_url": "https://api.github.com/users/koush/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "cyanogen",
        "id": 102151,
        "node_id": "MDQ6VXNlcjEwMjE1MQ==",
        "avatar_url": "https://avatars3.githubusercontent.com/u/102151?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/cyanogen",
        "html_url": "https://github.com/cyanogen",
        "followers_url": "https://api.github.com/users/cyanogen/followers",
        "following_url": "https://api.github.com/users/cyanogen/following{/other_user}",
        "gists_url": "https://api.github.com/users/cyanogen/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/cyanogen/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/cyanogen/subscriptions",
        "organizations_url": "https://api.github.com/users/cyanogen/orgs",
        "repos_url": "https://api.github.com/users/cyanogen/repos",
        "events_url": "https://api.github.com/users/cyanogen/events{/privacy}",
        "received_events_url": "https://api.github.com/users/cyanogen/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "commonsguy",
        "id": 103772,
        "node_id": "MDQ6VXNlcjEwMzc3Mg==",
        "avatar_url": "https://avatars0.githubusercontent.com/u/103772?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/commonsguy",
        "html_url": "https://github.com/commonsguy",
        "followers_url": "https://api.github.com/users/commonsguy/followers",
        "following_url": "https://api.github.com/users/commonsguy/following{/other_user}",
        "gists_url": "https://api.github.com/users/commonsguy/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/commonsguy/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/commonsguy/subscriptions",
        "organizations_url": "https://api.github.com/users/commonsguy/orgs",
        "repos_url": "https://api.github.com/users/commonsguy/repos",
        "events_url": "https://api.github.com/users/commonsguy/events{/privacy}",
        "received_events_url": "https://api.github.com/users/commonsguy/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "Tasssadar",
        "id": 120108,
        "node_id": "MDQ6VXNlcjEyMDEwOA==",
        "avatar_url": "https://avatars2.githubusercontent.com/u/120108?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Tasssadar",
        "html_url": "https://github.com/Tasssadar",
        "followers_url": "https://api.github.com/users/Tasssadar/followers",
        "following_url": "https://api.github.com/users/Tasssadar/following{/other_user}",
        "gists_url": "https://api.github.com/users/Tasssadar/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Tasssadar/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Tasssadar/subscriptions",
        "organizations_url": "https://api.github.com/users/Tasssadar/orgs",
        "repos_url": "https://api.github.com/users/Tasssadar/repos",
        "events_url": "https://api.github.com/users/Tasssadar/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Tasssadar/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "ChainsDD",
        "id": 146700,
        "node_id": "MDQ6VXNlcjE0NjcwMA==",
        "avatar_url": "https://avatars0.githubusercontent.com/u/146700?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/ChainsDD",
        "html_url": "https://github.com/ChainsDD",
        "followers_url": "https://api.github.com/users/ChainsDD/followers",
        "following_url": "https://api.github.com/users/ChainsDD/following{/other_user}",
        "gists_url": "https://api.github.com/users/ChainsDD/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/ChainsDD/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/ChainsDD/subscriptions",
        "organizations_url": "https://api.github.com/users/ChainsDD/orgs",
        "repos_url": "https://api.github.com/users/ChainsDD/repos",
        "events_url": "https://api.github.com/users/ChainsDD/events{/privacy}",
        "received_events_url": "https://api.github.com/users/ChainsDD/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "brucejcooper",
        "id": 152088,
        "node_id": "MDQ6VXNlcjE1MjA4OA==",
        "avatar_url": "https://avatars3.githubusercontent.com/u/152088?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/brucejcooper",
        "html_url": "https://github.com/brucejcooper",
        "followers_url": "https://api.github.com/users/brucejcooper/followers",
        "following_url": "https://api.github.com/users/brucejcooper/following{/other_user}",
        "gists_url": "https://api.github.com/users/brucejcooper/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/brucejcooper/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/brucejcooper/subscriptions",
        "organizations_url": "https://api.github.com/users/brucejcooper/orgs",
        "repos_url": "https://api.github.com/users/brucejcooper/repos",
        "events_url": "https://api.github.com/users/brucejcooper/events{/privacy}",
        "received_events_url": "https://api.github.com/users/brucejcooper/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "Eug89",
        "id": 227244,
        "node_id": "MDQ6VXNlcjIyNzI0NA==",
        "avatar_url": "https://avatars2.githubusercontent.com/u/227244?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Eug89",
        "html_url": "https://github.com/Eug89",
        "followers_url": "https://api.github.com/users/Eug89/followers",
        "following_url": "https://api.github.com/users/Eug89/following{/other_user}",
        "gists_url": "https://api.github.com/users/Eug89/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Eug89/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Eug89/subscriptions",
        "organizations_url": "https://api.github.com/users/Eug89/orgs",
        "repos_url": "https://api.github.com/users/Eug89/repos",
        "events_url": "https://api.github.com/users/Eug89/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Eug89/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "Lovesan",
        "id": 227641,
        "node_id": "MDQ6VXNlcjIyNzY0MQ==",
        "avatar_url": "https://avatars1.githubusercontent.com/u/227641?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Lovesan",
        "html_url": "https://github.com/Lovesan",
        "followers_url": "https://api.github.com/users/Lovesan/followers",
        "following_url": "https://api.github.com/users/Lovesan/following{/other_user}",
        "gists_url": "https://api.github.com/users/Lovesan/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Lovesan/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Lovesan/subscriptions",
        "organizations_url": "https://api.github.com/users/Lovesan/orgs",
        "repos_url": "https://api.github.com/users/Lovesan/repos",
        "events_url": "https://api.github.com/users/Lovesan/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Lovesan/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "nolanlawson",
        "id": 283842,
        "node_id": "MDQ6VXNlcjI4Mzg0Mg==",
        "avatar_url": "https://avatars0.githubusercontent.com/u/283842?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/nolanlawson",
        "html_url": "https://github.com/nolanlawson",
        "followers_url": "https://api.github.com/users/nolanlawson/followers",
        "following_url": "https://api.github.com/users/nolanlawson/following{/other_user}",
        "gists_url": "https://api.github.com/users/nolanlawson/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/nolanlawson/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/nolanlawson/subscriptions",
        "organizations_url": "https://api.github.com/users/nolanlawson/orgs",
        "repos_url": "https://api.github.com/users/nolanlawson/repos",
        "events_url": "https://api.github.com/users/nolanlawson/events{/privacy}",
        "received_events_url": "https://api.github.com/users/nolanlawson/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "atinm",
        "id": 342736,
        "node_id": "MDQ6VXNlcjM0MjczNg==",
        "avatar_url": "https://avatars1.githubusercontent.com/u/342736?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/atinm",
        "html_url": "https://github.com/atinm",
        "followers_url": "https://api.github.com/users/atinm/followers",
        "following_url": "https://api.github.com/users/atinm/following{/other_user}",
        "gists_url": "https://api.github.com/users/atinm/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/atinm/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/atinm/subscriptions",
        "organizations_url": "https://api.github.com/users/atinm/orgs",
        "repos_url": "https://api.github.com/users/atinm/repos",
        "events_url": "https://api.github.com/users/atinm/events{/privacy}",
        "received_events_url": "https://api.github.com/users/atinm/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "al177",
        "id": 658256,
        "node_id": "MDQ6VXNlcjY1ODI1Ng==",
        "avatar_url": "https://avatars0.githubusercontent.com/u/658256?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/al177",
        "html_url": "https://github.com/al177",
        "followers_url": "https://api.github.com/users/al177/followers",
        "following_url": "https://api.github.com/users/al177/following{/other_user}",
        "gists_url": "https://api.github.com/users/al177/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/al177/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/al177/subscriptions",
        "organizations_url": "https://api.github.com/users/al177/orgs",
        "repos_url": "https://api.github.com/users/al177/repos",
        "events_url": "https://api.github.com/users/al177/events{/privacy}",
        "received_events_url": "https://api.github.com/users/al177/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "JackpotClavin",
        "id": 969887,
        "node_id": "MDQ6VXNlcjk2OTg4Nw==",
        "avatar_url": "https://avatars2.githubusercontent.com/u/969887?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/JackpotClavin",
        "html_url": "https://github.com/JackpotClavin",
        "followers_url": "https://api.github.com/users/JackpotClavin/followers",
        "following_url": "https://api.github.com/users/JackpotClavin/following{/other_user}",
        "gists_url": "https://api.github.com/users/JackpotClavin/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/JackpotClavin/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/JackpotClavin/subscriptions",
        "organizations_url": "https://api.github.com/users/JackpotClavin/orgs",
        "repos_url": "https://api.github.com/users/JackpotClavin/repos",
        "events_url": "https://api.github.com/users/JackpotClavin/events{/privacy}",
        "received_events_url": "https://api.github.com/users/JackpotClavin/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "jazzsequence",
        "id": 991511,
        "node_id": "MDQ6VXNlcjk5MTUxMQ==",
        "avatar_url": "https://avatars2.githubusercontent.com/u/991511?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/jazzsequence",
        "html_url": "https://github.com/jazzsequence",
        "followers_url": "https://api.github.com/users/jazzsequence/followers",
        "following_url": "https://api.github.com/users/jazzsequence/following{/other_user}",
        "gists_url": "https://api.github.com/users/jazzsequence/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/jazzsequence/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/jazzsequence/subscriptions",
        "organizations_url": "https://api.github.com/users/jazzsequence/orgs",
        "repos_url": "https://api.github.com/users/jazzsequence/repos",
        "events_url": "https://api.github.com/users/jazzsequence/events{/privacy}",
        "received_events_url": "https://api.github.com/users/jazzsequence/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "skirkby",
        "id": 1088892,
        "node_id": "MDQ6VXNlcjEwODg4OTI=",
        "avatar_url": "https://avatars1.githubusercontent.com/u/1088892?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/skirkby",
        "html_url": "https://github.com/skirkby",
        "followers_url": "https://api.github.com/users/skirkby/followers",
        "following_url": "https://api.github.com/users/skirkby/following{/other_user}",
        "gists_url": "https://api.github.com/users/skirkby/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/skirkby/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/skirkby/subscriptions",
        "organizations_url": "https://api.github.com/users/skirkby/orgs",
        "repos_url": "https://api.github.com/users/skirkby/repos",
        "events_url": "https://api.github.com/users/skirkby/events{/privacy}",
        "received_events_url": "https://api.github.com/users/skirkby/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "DerTeufel",
        "id": 1208550,
        "node_id": "MDQ6VXNlcjEyMDg1NTA=",
        "avatar_url": "https://avatars3.githubusercontent.com/u/1208550?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/DerTeufel",
        "html_url": "https://github.com/DerTeufel",
        "followers_url": "https://api.github.com/users/DerTeufel/followers",
        "following_url": "https://api.github.com/users/DerTeufel/following{/other_user}",
        "gists_url": "https://api.github.com/users/DerTeufel/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/DerTeufel/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/DerTeufel/subscriptions",
        "organizations_url": "https://api.github.com/users/DerTeufel/orgs",
        "repos_url": "https://api.github.com/users/DerTeufel/repos",
        "events_url": "https://api.github.com/users/DerTeufel/events{/privacy}",
        "received_events_url": "https://api.github.com/users/DerTeufel/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "Rockncoder",
        "id": 1497092,
        "node_id": "MDQ6VXNlcjE0OTcwOTI=",
        "avatar_url": "https://avatars3.githubusercontent.com/u/1497092?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Rockncoder",
        "html_url": "https://github.com/Rockncoder",
        "followers_url": "https://api.github.com/users/Rockncoder/followers",
        "following_url": "https://api.github.com/users/Rockncoder/following{/other_user}",
        "gists_url": "https://api.github.com/users/Rockncoder/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Rockncoder/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Rockncoder/subscriptions",
        "organizations_url": "https://api.github.com/users/Rockncoder/orgs",
        "repos_url": "https://api.github.com/users/Rockncoder/repos",
        "events_url": "https://api.github.com/users/Rockncoder/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Rockncoder/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "ussrlongbow",
        "id": 1707164,
        "node_id": "MDQ6VXNlcjE3MDcxNjQ=",
        "avatar_url": "https://avatars2.githubusercontent.com/u/1707164?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/ussrlongbow",
        "html_url": "https://github.com/ussrlongbow",
        "followers_url": "https://api.github.com/users/ussrlongbow/followers",
        "following_url": "https://api.github.com/users/ussrlongbow/following{/other_user}",
        "gists_url": "https://api.github.com/users/ussrlongbow/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/ussrlongbow/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/ussrlongbow/subscriptions",
        "organizations_url": "https://api.github.com/users/ussrlongbow/orgs",
        "repos_url": "https://api.github.com/users/ussrlongbow/repos",
        "events_url": "https://api.github.com/users/ussrlongbow/events{/privacy}",
        "received_events_url": "https://api.github.com/users/ussrlongbow/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "tfolbrecht",
        "id": 6099765,
        "node_id": "MDQ6VXNlcjYwOTk3NjU=",
        "avatar_url": "https://avatars3.githubusercontent.com/u/6099765?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/tfolbrecht",
        "html_url": "https://github.com/tfolbrecht",
        "followers_url": "https://api.github.com/users/tfolbrecht/followers",
        "following_url": "https://api.github.com/users/tfolbrecht/following{/other_user}",
        "gists_url": "https://api.github.com/users/tfolbrecht/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/tfolbrecht/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/tfolbrecht/subscriptions",
        "organizations_url": "https://api.github.com/users/tfolbrecht/orgs",
        "repos_url": "https://api.github.com/users/tfolbrecht/repos",
        "events_url": "https://api.github.com/users/tfolbrecht/events{/privacy}",
        "received_events_url": "https://api.github.com/users/tfolbrecht/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "cnlien",
        "id": 8670945,
        "node_id": "MDQ6VXNlcjg2NzA5NDU=",
        "avatar_url": "https://avatars1.githubusercontent.com/u/8670945?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/cnlien",
        "html_url": "https://github.com/cnlien",
        "followers_url": "https://api.github.com/users/cnlien/followers",
        "following_url": "https://api.github.com/users/cnlien/following{/other_user}",
        "gists_url": "https://api.github.com/users/cnlien/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/cnlien/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/cnlien/subscriptions",
        "organizations_url": "https://api.github.com/users/cnlien/orgs",
        "repos_url": "https://api.github.com/users/cnlien/repos",
        "events_url": "https://api.github.com/users/cnlien/events{/privacy}",
        "received_events_url": "https://api.github.com/users/cnlien/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "ssahon",
        "id": 11844179,
        "node_id": "MDQ6VXNlcjExODQ0MTc5",
        "avatar_url": "https://avatars0.githubusercontent.com/u/11844179?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/ssahon",
        "html_url": "https://github.com/ssahon",
        "followers_url": "https://api.github.com/users/ssahon/followers",
        "following_url": "https://api.github.com/users/ssahon/following{/other_user}",
        "gists_url": "https://api.github.com/users/ssahon/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/ssahon/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/ssahon/subscriptions",
        "organizations_url": "https://api.github.com/users/ssahon/orgs",
        "repos_url": "https://api.github.com/users/ssahon/repos",
        "events_url": "https://api.github.com/users/ssahon/events{/privacy}",
        "received_events_url": "https://api.github.com/users/ssahon/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "Nappa9693",
        "id": 17730472,
        "node_id": "MDQ6VXNlcjE3NzMwNDcy",
        "avatar_url": "https://avatars3.githubusercontent.com/u/17730472?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Nappa9693",
        "html_url": "https://github.com/Nappa9693",
        "followers_url": "https://api.github.com/users/Nappa9693/followers",
        "following_url": "https://api.github.com/users/Nappa9693/following{/other_user}",
        "gists_url": "https://api.github.com/users/Nappa9693/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Nappa9693/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Nappa9693/subscriptions",
        "organizations_url": "https://api.github.com/users/Nappa9693/orgs",
        "repos_url": "https://api.github.com/users/Nappa9693/repos",
        "events_url": "https://api.github.com/users/Nappa9693/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Nappa9693/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "konchada2",
        "id": 26350788,
        "node_id": "MDQ6VXNlcjI2MzUwNzg4",
        "avatar_url": "https://avatars2.githubusercontent.com/u/26350788?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/konchada2",
        "html_url": "https://github.com/konchada2",
        "followers_url": "https://api.github.com/users/konchada2/followers",
        "following_url": "https://api.github.com/users/konchada2/following{/other_user}",
        "gists_url": "https://api.github.com/users/konchada2/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/konchada2/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/konchada2/subscriptions",
        "organizations_url": "https://api.github.com/users/konchada2/orgs",
        "repos_url": "https://api.github.com/users/konchada2/repos",
        "events_url": "https://api.github.com/users/konchada2/events{/privacy}",
        "received_events_url": "https://api.github.com/users/konchada2/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "woodrdk",
        "id": 32694603,
        "node_id": "MDQ6VXNlcjMyNjk0NjAz",
        "avatar_url": "https://avatars1.githubusercontent.com/u/32694603?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/woodrdk",
        "html_url": "https://github.com/woodrdk",
        "followers_url": "https://api.github.com/users/woodrdk/followers",
        "following_url": "https://api.github.com/users/woodrdk/following{/other_user}",
        "gists_url": "https://api.github.com/users/woodrdk/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/woodrdk/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/woodrdk/subscriptions",
        "organizations_url": "https://api.github.com/users/woodrdk/orgs",
        "repos_url": "https://api.github.com/users/woodrdk/repos",
        "events_url": "https://api.github.com/users/woodrdk/events{/privacy}",
        "received_events_url": "https://api.github.com/users/woodrdk/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "meholt",
        "id": 47041979,
        "node_id": "MDQ6VXNlcjQ3MDQxOTc5",
        "avatar_url": "https://avatars0.githubusercontent.com/u/47041979?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/meholt",
        "html_url": "https://github.com/meholt",
        "followers_url": "https://api.github.com/users/meholt/followers",
        "following_url": "https://api.github.com/users/meholt/following{/other_user}",
        "gists_url": "https://api.github.com/users/meholt/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/meholt/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/meholt/subscriptions",
        "organizations_url": "https://api.github.com/users/meholt/orgs",
        "repos_url": "https://api.github.com/users/meholt/repos",
        "events_url": "https://api.github.com/users/meholt/events{/privacy}",
        "received_events_url": "https://api.github.com/users/meholt/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "raypugh07",
        "id": 48686907,
        "node_id": "MDQ6VXNlcjQ4Njg2OTA3",
        "avatar_url": "https://avatars1.githubusercontent.com/u/48686907?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/raypugh07",
        "html_url": "https://github.com/raypugh07",
        "followers_url": "https://api.github.com/users/raypugh07/followers",
        "following_url": "https://api.github.com/users/raypugh07/following{/other_user}",
        "gists_url": "https://api.github.com/users/raypugh07/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/raypugh07/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/raypugh07/subscriptions",
        "organizations_url": "https://api.github.com/users/raypugh07/orgs",
        "repos_url": "https://api.github.com/users/raypugh07/repos",
        "events_url": "https://api.github.com/users/raypugh07/events{/privacy}",
        "received_events_url": "https://api.github.com/users/raypugh07/received_events",
        "type": "User",
        "site_admin": false
      },
      {
        "login": "lizdoyle",
        "id": 49792606,
        "node_id": "MDQ6VXNlcjQ5NzkyNjA2",
        "avatar_url": "https://avatars3.githubusercontent.com/u/49792606?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/lizdoyle",
        "html_url": "https://github.com/lizdoyle",
        "followers_url": "https://api.github.com/users/lizdoyle/followers",
        "following_url": "https://api.github.com/users/lizdoyle/following{/other_user}",
        "gists_url": "https://api.github.com/users/lizdoyle/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/lizdoyle/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/lizdoyle/subscriptions",
        "organizations_url": "https://api.github.com/users/lizdoyle/orgs",
        "repos_url": "https://api.github.com/users/lizdoyle/repos",
        "events_url": "https://api.github.com/users/lizdoyle/events{/privacy}",
        "received_events_url": "https://api.github.com/users/lizdoyle/received_events",
        "type": "User",
        "site_admin": false
      }
    ]
  };
}