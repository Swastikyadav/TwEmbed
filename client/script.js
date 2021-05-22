// Fetch profile data
function fetchProfile(event) {
  event.preventDefault();

  // Access input value
  const twitterHandle = document.querySelector(".t-username-input");

  // Fetch Profile
  fetch(`/api/v1/getuser/${twitterHandle.value}`)
  .then(res => res.json())
  .then(data => {
    if (data.name && data.screen_name) {
      console.log(data);
      showProfile(data);
    } else {
      alert("Please provide valid twitter handle.");
    }
  })
  .catch(error => {
    alert(`Something went wrong.
Error: ${error.message}`);
    return;
  })
  .finally(() => {
    // Empty input field
    twitterHandle.value = "";
  });
}



// create elements and append to right documents.
function showProfile(userProfile) {
  // Set display none for notice-badge
  const noticeBadge = document.querySelector(".notice-badge");
  noticeBadge.style.display = "none";

  // Remove profileCard and embedInfo if exists
  const profile = document.querySelector(".profileCard");
  const info = document.querySelector(".embedInfo");

  if (!!profile || !!info) {
    profile.remove();
    info.remove();
  }

  // Main section
  const mainElement = document.querySelector(".main");
  mainElement.style.cssText = `
    display: block;
  `;
  
  // profile card section
  const profileCard = createElement({
    type: "section",
    props: {class: "profileCard"}
  });

  const imageContainer = createElement({
    type: "div",
    props: {
      class: "img-container"
    },
    styles: `background-color: skyblue; background-image: url(${userProfile.profile_banner_url})`,
  });

  const profileImage = createElement({
    type: "img",
    props: {
      class: "profile-img",
      src: changeProfileImgUrl(userProfile.profile_image_url_https),
    },
  });

  const profileName = createElement({
    type: "div",
    props: {
      class: "profile-name",
    },
    content: `<p class="name">${userProfile.name}</p><p class="twitter-handle">@${userProfile.screen_name}</p>`
  });

  const profileBio = createElement({
    type: "p",
    props: {
      class: "profile-bio"
    },
    content: setDescLinks(userProfile.description),
  });

  const locationAndUrl = createElement({
    type: "p",
    props: {
      class: "location-and-url",
    },
    content: `<span class="location">📍 ${userProfile.location}</span> <span class="url">🔗 <a href="${userProfile.url}" target="_blank">${userProfile.url}</a></span>`,
  });

  const followCount = createElement({
    type: "p",
    props: {
      class: "follow-count",
    },
    content: `<span class="following"><span class="count">${userProfile.friends_count}</span> Following</span> <span class="followers"><span class="count">${userProfile.followers_count}</span> Followers</span>`,
  });

  imageContainer.appendChild(profileImage);
  profileCard.appendChild(imageContainer);
  profileCard.appendChild(profileName);
  profileCard.appendChild(profileBio);
  profileCard.appendChild(locationAndUrl);
  profileCard.appendChild(followCount);

  // Embed info
  const embedInfo = createElement({
    type: "p",
    props: {
      class: "embedInfo"
    },
    content: "Add the following div and script tag in your HTML where you want to embed your profile.",
  });

  // Append profileCard and embedCode sections in mainElement.
  // mainElement.removeChild(mainElement.firstElementChild);
  mainElement.insertBefore(profileCard, mainElement.lastElementChild);
  mainElement.insertBefore(embedInfo, mainElement.lastElementChild);

  // Add widget script code snippet
  const snippet = document.querySelector(".snippet");
  snippet.parentElement.style.display = "block";
  snippet.innerHTML = `&lt;div id="embed-div"&gt;&lt/div&gt<br />&lt;script id="embed-script" src="https://cdn.jsdelivr.net/gh/Swastikyadav/embeddable-twitter-profile@master/client/widget-v2/index.js" data-user="${userProfile.screen_name}"&gt;&lt;/script&gt;`
}

// Change profile image url to a higher dimesion url.
function changeProfileImgUrl(url) {
  const reversedUrl = url.split("").reverse().join("");
  const reversedNewUrl = reversedUrl.replace("lamron", "004x004");
  const newUrl = reversedNewUrl.split("").reverse().join("");

  return newUrl;
}

// Make links in description clickable in profile bio.
function setDescLinks(description) {
  const descArr = description.split(" ");
  const updatedDescArr = descArr.map(word => {
    if (word.startsWith("https") || word.startsWith("http")) {
      return `<a href="${word}" target="_blank">${word}</a>`;
    }

    return word;
  });

  return updatedDescArr.join(" ");
}

// Create element function.
function createElement({type, props, styles, content}) {
  const element = document.createElement(type);
  for(let key in props) {
    element.setAttribute(key, props[key]);
  }
  element.innerHTML = content || "";
  element.style.cssText = styles;

  return element;
}