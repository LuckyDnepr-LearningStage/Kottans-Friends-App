import { filterUsers } from "./filterUsers.js";
import { sortUsers } from "./sortUsers.js";

const settingsURL = "./settings.json";

let settings,
    usersData,
    filteredAndSortedUsersData,
    shownPagesOfUsersCount = 0,
    lightColorTheme = true;

(async function getSettings() {
    settings = await getData(settingsURL);
})();

async function searchFriends() {
    shownPagesOfUsersCount = 0;
    foundFriendsNode.innerHTML = "";
    toggleLoaderAnimation();
    usersData = await getUsers(createRequestUrl());
    filteredAndSortedUsersData = usersData;
    renderUsersCards(usersData, foundFriendsNode);
    toggleLoaderAnimation();
    $(".main_content").classList.remove("hide");
    $(".main").classList.remove("hide");
    $("#filters_menu_input_label").classList.remove("hide");
    $(".text_search").classList.remove("hide");
    clearFilters(filtersFormNode);
}

function renderFilteredAndSortedUsers() {
    foundFriendsNode.innerHTML = "";
    shownPagesOfUsersCount = 0;
    const filteredUsers = filterUsers(usersData, settings.filtersFields, filtersFormNode);
    sortUsers(filteredUsers, settings.sortTypeDecrypter, filtersFormNode);
    filterUsersBySearchText();
    renderUsersCards(filteredUsers, foundFriendsNode);
}

function createRequestUrl() {
    const fieldsToFetch = settings.fetchOptions.userFields,
        numberOfTotalUsers = settings.fetchOptions.numberOfTotalUsers,
        nations = settings.fetchOptions.nations.join(",");
    return (
        `${settings.fetchOptions.baseURL}?inc=` +
        Object.keys(fieldsToFetch)
            .filter((key) => fieldsToFetch[key])
            .join(",") +
        `&results=${+numberOfTotalUsers}&nat=${nations}`
    );
}

async function getUsers(url) {
    return (await getData(url)).results;
}

async function getData(requestUrl) {
    try {
        const response = await fetch(requestUrl);
        const json = await response.json();
        return json;
    } catch (error) {
        renderErrorMessage();
    }
}

function renderErrorMessage() {
    if (foundFriendsNode) {
        foundFriendsNode.innerHTML = `
        <div></div>
        <p class="error_massage">Ooops...</br>Something wrong with internet connection or server is busy.</br>Try later, please.</p>
        <div></div>`;
        toggleLoaderAnimation();
    } else {
    }
}

function renderUsersCards(usersData, target) {
    const usersCardsForRender = collectUsersCardsForRender(usersData);
    if (target.querySelector("#show_more")) {
        target
            .querySelector("#show_more")
            .parentNode.insertAdjacentHTML("beforebegin", usersCardsForRender);
    } else {
        target.innerHTML = usersCardsForRender + createShowMoreButtonHTML();
        addShowMoreUsersButtonEventListener();
    }

    function collectUsersCardsForRender(usersData) {
        let usersCardsForRender = [];
        const shownUsers = settings.usersPerPage * shownPagesOfUsersCount,
            shownUsersAfterRender =
                settings.usersPerPage * (shownPagesOfUsersCount + 1);
        for (let i = shownUsers; i < shownUsersAfterRender; i++) {
            if (i < usersData.length) {
                usersCardsForRender.push(createUserCardHTML(usersData[i]));
            } else {
                break;
            }
        }
        return usersCardsForRender.join("");
    }

    function createUserCardHTML(user) {
        return (
            `<div class="user_card">` +
            createUserCardAvatarHTML(user) +
            createUserCardInfoHTML(user) +
            createUserCardActionsButtonsHTML() +
            createUserCardMoreInfoHTML(user) +
            `</div>`
        );

        function createUserCardAvatarHTML(user) {
            return `<img
            src="${user.picture.large}"
            alt=""
            class="user_avatar"/>`;
        }

        function createUserCardInfoHTML(user) {
            let gSymbol = "";
            switch (user.gender) {
                case "female":
                    gSymbol = "&#9792";
                    break;
                case "male":
                    gSymbol = "&#9794";
                    break;
                default:
                    break;
            }
            return `<div class="less_user_info">
            <p class="user_nickname">
            ${user.login.username} ${gSymbol};
            </p>
            <p class="user_age">Age: ${user.dob.age}</p>
            </div>`;
        }

        function createUserCardActionsButtonsHTML() {
            const iconsSrc = lightColorTheme
                ? settings.actionsLightThemeIconsSrc
                : settings.actionsDarkThemeIconsSrc;
            return `<div class="user_actions">
        <img src="${iconsSrc.chat}" alt="" class="user_actions_icon" id="user_actions_chat"/>
        <img src="${iconsSrc.add}" alt="" class="user_actions_icon" id="user_actions_add"/>
        <img src="${iconsSrc.preview}" alt="" class="user_actions_icon" id="user_actions_preview"/>
        </div>`;
        }

        function createUserCardMoreInfoHTML(user) {
            return `<div class="more_user_info hide">
                <p>
                    <span class="extra_field">First name:</span>
                    ${user.name.first}
                </p>
                <p>
                    <span class="extra_field"
                        >Second name:</span
                    >
                    ${user.name.last}
                </p>
                <p>
                    <span class="extra_field"
                        >Day OF Birth:</span
                    >
                    ${dobOfUser(user.dob.date)}
                </p>
                <p>
                    <span class="extra_field">Location:</span>
                    ${user.location.city}, ${user.location.country}
                </p>
            </div>`;
        }
    }

    function createShowMoreButtonHTML() {
        return `<div class="user_card">
    <button class="nav_menu_item" id="show_more">
            Show more...
            </button>
            </div>`;
    }

    function addShowMoreUsersButtonEventListener() {
        $("#show_more").addEventListener("click", (e) => {
            shownPagesOfUsersCount++;
            renderUsersCards(filteredAndSortedUsersData, foundFriendsNode);
        });
    }
}

function dobOfUser(date) {
    return new Date(date).toDateString();
}

function filterUsersBySearchText() {
    const searchTextRegExp = new RegExp(textForSearch.value.toLowerCase(), "g");
    filteredAndSortedUsersData = filteredAndSortedUsersData.filter((user) => {
        const isRelated = settings.fieldsForSearchText
            .map((field) => {
                if (
                    getUserFieldValue(user, field)
                        .toLowerCase()
                        .match(searchTextRegExp) != null
                ) {
                    return true;
                }
            })
            .indexOf(true);
        return isRelated != -1 ? true : false;
    });
}

function getUserFieldValue(obj, field) {
    for (const prop in obj) {
        if (typeof obj[prop] === "object") {
            const value = getUserFieldValue(obj[prop], field);
            if (value) {
                return value;
            }
        } else {
            if (prop === field) {
                return obj[prop];
            }
        }
    }
}

function clearFilters(filtersNode) {
    filtersNode
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
}

function toggleLoaderAnimation() {
    $(".lds-ripple").classList.toggle("hide");
}


const foundFriendsNode = $(".found_users"),
    filtersFormNode = $(".filter_form"),
    textForSearch = $(".text_search_input"),
    cssRoot = $(":root");

function $(selector) {
    return document.querySelector(selector);
}

textForSearch.addEventListener("input", (e) => {
    renderFilteredAndSortedUsers();
});

filtersFormNode.addEventListener("click", (e) => {
    if (e.target.classList.contains("formSubmit")) {
        renderFilteredAndSortedUsers();
    }
});

$("#search_friends").addEventListener("click", searchFriends);

$("#filters_menu_input_label").addEventListener("click", (e) => {
    $("#filters_menu_input").checked = !$("#filters_menu_input").checked;
    $(".main_aside").classList.toggle("hide");
    $(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");
});

$(".disable_filter_btn").addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentNode
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
});

foundFriendsNode.addEventListener("click", (e) => {
    if (e.target.getAttribute("id") === "user_actions_preview") {
        e.target.classList.toggle("active");
        changePreviewIcon(e);
        showMoreUserInfo(e);
    }

    function changePreviewIcon(e) {
        if (e.target.classList.contains("active")) {
            e.target.src = lightColorTheme
                ? settings.actionsLightThemeIconsSrc.previewHide
                : settings.actionsDarkThemeIconsSrc.previewHide;
        } else {
            e.target.src = lightColorTheme
                ? settings.actionsLightThemeIconsSrc.preview
                : settings.actionsDarkThemeIconsSrc.preview;
        }
    }

    function showMoreUserInfo(e) {
        e.path
            .find((node) => node.classList.contains("user_card"))
            .querySelector(".more_user_info")
            .classList.toggle("hide");
    }
});

$("#theme_change_input_label").addEventListener("click", (e) => {
    lightColorTheme = !lightColorTheme;
    e.target.classList.toggle("dark");
    let theme;
    if (e.target.classList.contains("dark")) {
        theme = settings.themes.dark;
        e.target.innerText = "Dark theme";
    } else {
        theme = settings.themes.light;
        e.target.innerText = "Light theme";
    }
    for (const cssVar in theme) {
        cssRoot.style.setProperty(`--${cssVar}`, `#${theme[cssVar]}`);
    }

    document.querySelectorAll("img").forEach((img) => {
        if (!img.classList.contains("user_avatar")) {
            img.src =
                img.src.slice(0, -5) + (lightColorTheme ? "l.png" : "d.png");
        }
    });
});
