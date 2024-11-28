/////////////////////////////////Function 1////////////////////////////////////////

function createElemWithText(p1 = "p", p2 = "", p3) {
    const para = document.createElement(p1);
  
    para.textContent = p2;
  
    if (p3 != undefined)
      // if p3 is not defined, that indicates that its value is undefined. Therefore, we need to know if that is the case. If it's not, assign p3 w/ a class name.
      para.className = p3;
  
    return para;
  }
  
  /////////////////////////////////Function 2////////////////////////////////////////
  
  function createSelectOptions(users) {
    if (!users) return undefined;
  
    let optionArr = [];
  
    if (users != null) {
      optionArr = users.map((obj) => {
        let opt = document.createElement("option");
  
        opt.value = obj.id;
  
        opt.textContent = obj.name;
  
        return opt;
      });
  
      return optionArr;
    }
  }
  
  /////////////////////////////////Function 3////////////////////////////////////////
  
  function toggleCommentSection(postId) {
    if (!postId) return undefined;
  
    let section = document.querySelector(`section[data-post-id="${postId}"]`);
  
    if (section) section.classList.toggle("hide");
  
    return section;
  }
  
  /////////////////////////////////Function 4////////////////////////////////////////
  
  function toggleCommentButton(postId) {
    if (!postId) return undefined;
  
    let button = document.querySelector(`button[data-post-id="${postId}"]`);
  
    if (!button) return null;
  
    button.textContent =
      button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
  
    return button;
  }
  
  /////////////////////////////////Function 5////////////////////////////////////////
  
  function deleteChildElements(parentP) {
    if (!(parentP instanceof HTMLElement)) {
      // in other words, if parentP is not an HTML tag
      return undefined;
    }
  
    let childP = parentP.lastElementChild;
  
    while (childP) {
      parentP.removeChild(childP);
  
      childP = parentP.lastElementChild;
    }
  
    return parentP;
  }
    
  /////////////////////////////////Function 6////////////////////////////////////////
  
  function addButtonListeners() {
    // first you have to retrieve the main tag and then with that main tag, retrieve the buttons
    // because they want you to get the buttons specifically in main
    const buttons = document.querySelector("main").querySelectorAll("button");
  
    if (!buttons) return null;
  
    buttons.forEach((buttonObj) => {
      const postId = buttonObj.dataset.postId;
  
      if (postId) {
        buttonObj.addEventListener(
          "click",
          function (e) {
            toggleComments(e, postId);
          },
          false
        );
      }
    });
  
    return buttons;
  }
  
  /////////////////////////////////Function 7////////////////////////////////////////
  
  function removeButtonListeners() {
    const buttons = document.querySelector("main").querySelectorAll("button");
  
    if (!buttons) return null;
  
    buttons.forEach((buttonObj) => {
      const postId = buttonObj.dataset.postId;
  
      if (postId) {
        buttonObj.removeEventListener(
          "click",
          function (e) {
            toggleComments(e, postId);
          },
          false
        );
      }
    });
  
    return buttons;
  }
  
  /////////////////////////////////Function 8////////////////////////////////////////
  
  function createComments(jComments) {
    const fragment = document.createDocumentFragment();
  
    if (!jComments) return undefined;
  
    jComments.forEach((commObj) => {
      const article = document.createElement("article");
      const h3 = createElemWithText("h3", commObj.name);
      const para1 = createElemWithText("p", commObj.body);
      const para2 = createElemWithText("p", `From: ${commObj.email}`);
  
      article.append(h3, para1, para2);
  
      fragment.append(article);
    });
  
    return fragment;
  }
  
  /////////////////////////////////Function 9////////////////////////////////////////
  
  function populateSelectMenu(jUsers) {
    if (!jUsers) return undefined;
  
    const menuTag = document.getElementById("selectMenu");
  
    const optArr = createSelectOptions(jUsers);
  
    optArr.forEach((optObj) => {
      menuTag.append(optObj);
    });
  
    return menuTag;
  }
  
  /////////////////////////////////Function 10////////////////////////////////////////
  
  async function getUsers() {
    const url = "https://jsonplaceholder.typicode.com/users";
  
    try {
      const response = await fetch(url);
      const jUsers = await response.json();
  
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
  
      return jUsers;
    } catch (e) {
      console.error(e);
    }
  }
  
  /////////////////////////////////Function 11////////////////////////////////////////
  
  async function getUserPosts(userId) {
    if (!userId) return undefined;
  
    const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
  
    try {
      const response = await fetch(url);
      const jPostUserId = await response.json();
  
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
  
      return jPostUserId; // "Uses the fetch API to request all posts for a specific user id"
    } catch (e) {
      console.error(e);
    }
  }
  
  /////////////////////////////////Function 12////////////////////////////////////////
  
  async function getUser(userId) {
    if (!userId) return undefined;
  
    const url = `https://jsonplaceholder.typicode.com/users?id=${userId}`;
  
    try {
      const response = await fetch(url);
      const jUserId = await response.json();
  
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
  
      return jUserId[0]; // to return a specific user; "Uses the fetch API to request a specific user id"
    } catch (e) {
      console.error(e);
    }
  }
  
  /////////////////////////////////Function 13////////////////////////////////////////
  
  async function getPostComments(postId) {
    if (!postId) return undefined;
  
    const url = `https://jsonplaceholder.typicode.com/comments?postId=${postId}`;
  
    try {
      const response = await fetch(url);
      const jComments = await response.json();
  
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
  
      return jComments;
    } catch (e) {
      console.error(e);
    }
  }
  
  /////////////////////////////////Function 14////////////////////////////////////////
  
  async function displayComments(postId) {
    if (!postId) return undefined;
  
    const section = document.createElement("section");
  
    // have the data equal to postId
    // section.dataset.postId means a custom data-* attribute named data-post-id on the section tag; so this is how you refer to a custom data attribute
    section.dataset.postId = postId;
  
    section.classList.add("comments", "hide");
  
    const comments = await getPostComments(postId);
  
    const fragment = createComments(comments);
  
    section.append(fragment);
  
    return section;
  }
  
  /////////////////////////////////Function 15////////////////////////////////////////
  
  async function createPosts(jPosts) {
    if (!jPosts) return undefined;
  
    const fragment = document.createDocumentFragment();
  
    // can't use forEach because it doesn't handle async. Rather, use for...of    
    for (let postEl of jPosts) {    
      const article = document.createElement("article");
  
      const h2 = createElemWithText("h2", postEl.title);
  
      const para1 = createElemWithText("p", postEl.body);
  
      const para2 = createElemWithText("p", `Post ID: ${postEl.id}`);
  
      const author = await getUser(postEl.userId);
  
      const para3 = createElemWithText(
        "p",
        `Author: ${author.name} with ${author.company.name}`
      );
  
      const para4 = createElemWithText("p", `${author.company.catchPhrase}`);
  
      const button = createElemWithText("button", "Show Comments");
  
      button.dataset.postId = postEl.id;
  
      const section = await displayComments(postEl.id);
  
      // all of these tags are now added to the article tag
      article.append(h2, para1, para2, para3, para4, button, section);
  
      fragment.append(article);
    }
  
    return fragment;
  }
  
  /////////////////////////////////Function 16////////////////////////////////////////
  
  async function displayPosts(pData) {
    const main = document.querySelector("main");
  
    const element = pData
      ? await createPosts(pData)
      : (function () {
          const eleP = createElemWithText(
            "p",
            "Select an Employee to display their posts."
          );
          eleP.classList.add("default-text");
          return eleP;
        })();
    // () means to immediately call the function after it is defined
  
    main.append(element);
    return element;
  }
  
  /////////////////////////////////Function 17////////////////////////////////////////
  
  function toggleComments(event, postId) {
    if (!event || !postId) return undefined;
  
    event.target.listener = true;
  
    const section = toggleCommentSection(postId);
  
    const button = toggleCommentButton(postId);
  
    return [section, button];
  }
  
  /////////////////////////////////Function 18////////////////////////////////////////
  
  async function refreshPosts(jData) {
    if (!jData) return undefined;
  
    const removeButtons = removeButtonListeners();
  
    const mainTag = document.querySelector("main");
  
    const main = deleteChildElements(mainTag);
  
    const fragment = document.createDocumentFragment(await displayPosts(jData));
  
    const addButtons = addButtonListeners();
  
    return [removeButtons, main, fragment, addButtons];
  }
  
  /////////////////////////////////Function 19////////////////////////////////////////
  
  async function selectMenuChangeEventHandler(event) {
    if (!event) return undefined;
  
    const selectMenu = document.getElementById("selectMenu");
  
    selectMenu.disabled = true;
  
    const userId = event?.target?.value || 1;
  
    const posts = await getUserPosts(userId);
  
    const refreshPostsArray = await refreshPosts(posts);
  
    selectMenu.disabled = false;
  
    return [userId, posts, refreshPostsArray];
  }
  
  /////////////////////////////////Function 20////////////////////////////////////////
  
  async function initPage() {
    const users = await getUsers();
  
    const select = populateSelectMenu(users);
  
    return [users, select];
  }
  
  /////////////////////////////////Function 21////////////////////////////////////////
  
  async function initApp() {
    initPage();
  
    const selectMenu = document.getElementById("selectMenu");
  
    selectMenu.addEventListener("change", (e) => {
      selectMenuChangeEventHandler(e);
    });
  }
  
  document.addEventListener("DOMContentLoaded", initApp);
  