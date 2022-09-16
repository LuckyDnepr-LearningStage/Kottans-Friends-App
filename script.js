const settings = {
    
    /* numberOfUsers: 24, */
    usersPerPage: 11,
    /* nations: ["ua"], */
    fetchOptions: {
        baseURL: "https://randomuser.me/api/",
        userFields : {
                gender: true,
                name: true,
                location: true,
                email: false,
                login: true,
                registered: false,
                dob: true,
                phone: false,
                cell: false,
                id: true,
                picture: true,
                nat: false,
            },
        nations: ["ua"],
        numberOfTotalUsers: 24,
        },
    filtersFields: ["gender", "age"],
    fieldsForSearchText: ["first", "last", "city", "username"],
    themes: {
        "dark": {
            "bcg-main": "252b30",
            "glare": "0f507e",
            "shadow": "000000",
            "elements": "1f1400",
            "font-color": "cc8500",
        },
        "light": {
            "bcg-main": "d3d3d3",
            "glare": "ffffff",
            "shadow": "051c2c",
            "elements": "ed9b07",
            "font-color": "000000",
        }
    },
    actionsLightThemeIconsSrc: {
        "chat": "./icons/icon-chat-l.png",
        "add": "./icons/icon-add-friend-l.png",
        "preview": "./icons/icon-preview-l.png",
        "previewHide": "./icons/icon-hidden-l.png",
        },
    actionsDarkThemeIconsSrc: {
        "chat": "./icons/icon-chat-d.png",
        "add": "./icons/icon-add-friend-d.png",
        "preview": "./icons/icon-preview-d.png",
        "previewHide": "./icons/icon-hidden-d.png",
        },
};

let usersData,
    filteredAndSortedUsersData,
    shownPagesOfUsersCount = 0;
    lightColorTheme = true;

async function searchFriendsButtonAction () {
    shownPagesOfUsersCount = 0;
    foundFriendsDOM.innerHTML = "";
    toggleLoaderAnimation();
    await searchFriends();
    renderUsersCards(usersData, foundFriendsDOM);
    toggleLoaderAnimation();
    $(".main_content").classList.remove("hide");
    $(".main").classList.remove("hide");
    $("#filters_menu_input_label").classList.remove("hide");
    $(".text_search").classList.remove("hide");
    clearFilters(filtersFormDOM);
}

function clearFilters(filtersDOM) {
    filtersDOM
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
}

function toggleLoaderAnimation() {
    $(".lds-ripple").classList.toggle("hide");
}

async function searchFriends() {
    usersData = await getUsers(
        createRequestUrl(settings.fetchOptions.baseURL, settings.fetchOptions.userFields),
        settings.fetchOptions.numberOfTotalUsers
    );
    filteredAndSortedUsersData = usersData;
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
    foundFriendsDOM.innerHTML = `
        <div></div>
        <p class="error_massage">Ooops...</br>Something wrong with internet connection or server is busy.</br>Try later, please.</p>
        <div></div>`;
    toggleLoaderAnimation();
}

function renderUsersCards(usersData, target) {
    if (target.querySelector("#show_more")) {
        target.querySelector("#show_more").parentNode.remove();
    }
    let usersCardsForRender = [];
    const shownUsers = settings.usersPerPage * shownPagesOfUsersCount,
        shownUsersAfterRender = settings.usersPerPage * (shownPagesOfUsersCount + 1);
    for (
        let i = shownUsers; i < shownUsersAfterRender; i++) {
        if (i < usersData.length) {
            usersCardsForRender.push(createUserCardHTML(usersData[i]));
        } else {
            break;
        }
    }
    target.innerHTML +=
        usersCardsForRender.join("") + createPaginationButtonHTML();
        addShowMoreUsersButtonEventListener();
}

function addShowMoreUsersButtonEventListener () {
    $("#show_more").addEventListener("click", (e) => {
        shownPagesOfUsersCount++;
        renderUsersCards(filteredAndSortedUsersData, foundFriendsDOM);
    });
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
        const iconsSrc = (lightColorTheme) 
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

function createPaginationButtonHTML() {
    return `<div class="user_card">
    <button class="nav_menu_item" id="show_more">
            Show more...
            </button>
            </div>`;
}

function dobOfUser(date) {
    return new Date(date).toDateString();
}

function filterUsers() {
    shownPagesOfUsersCount = 0;
    const filtersFormData = new FormData(filtersFormDOM);
    filteredAndSortedUsersData = usersData;
    settings.filtersFields.map((fieldName) => {
        const fieldValues = filtersFormData.getAll(fieldName);
        if (fieldValues != 0) {
            filteredAndSortedUsersData = filteredAndSortedUsersData.filter((user) =>
                filterFunction(fieldValues, fieldName, user)
            );
        }
    });
}

function filterFunction(fieldValues, fieldName, user) {
    const isRelatedUser = fieldValues
        .map((fieldValue) => checkUser(user, fieldName, fieldValue))
        .find((isRelated) => isRelated == true);
    return isRelatedUser ? true : false;
}

function checkUser(user, fieldName, fieldValue) {
    const [value, valueMax] = fieldValue.split("-");
    if (valueMax === undefined) {
        return getUserFieldValue(user, fieldName) === value ? true : false;
    } else {
        return getUserFieldValue(user, fieldName) >= value &&
            getUserFieldValue(user, fieldName) <= valueMax
            ? true
            : false;
    }
}

function sortFilteredUsers() {
    const filterFormData = new FormData(filtersFormDOM),
        sortBy = filterFormData.get("sorting"),
        sortFunction =
            (sortBy != undefined) ? createSortFunction(sortBy) : () => true;
    filteredAndSortedUsersData = filteredAndSortedUsersData
        .map((user) => user)
        .sort((userA, userB) => sortFunction(userA, userB));
}

function createSortFunction(sortBy) {
    const [sortField, directionCoeff] = sortTypeDecrypter(sortBy);
    return (userA, userB) => {
        return (
            directionCoeff *
            ((getUserFieldValue(userB, sortField) <
                getUserFieldValue(userA, sortField)) -
                (getUserFieldValue(userA, sortField) <
                    getUserFieldValue(userB, sortField)))
        );
    };
}

function sortTypeDecrypter(sortType) {
    switch (sortType) {
        case "name_asc":
            return ["first", 1];
        case "name_des":
            return ["first", -1];
        case "age_asc":
            return ["age", 1];
        case "age_des":
            return ["age", -1];
    }
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
/* 
foundFriendsDOM.addEventListener("click", (e) => {
    if (e.target.getAttribute("id") === "user_actions_preview") {
        e.target.src = e.target.classList.contains("active")
            ? "./icons/icon-preview.png"
            : "./icons/icon-hidden.png";
        e.path
            .find((node) => node.classList.contains("user_card"))
            .querySelector(".more_user_info")
            .classList.toggle("hide");
        e.target.classList.toggle("active");
    }
});
 */

/* 
textForSearch.addEventListener("input", (e) => {
    renderFilteredAndSortedUsers();
});
 */

function filterUsersBySearchText() {
    const searchTextRegExp = new RegExp(textForSearch.value.toLowerCase(), "g");
    filteredAndSortedUsersData = filteredAndSortedUsersData
        .filter((user) => {
            const isRelated = settings.fieldsForSearchText
                .map((field) => {
                    if (
                        getUserFieldValue(user, field)
                            .toLowerCase()
                            .match(
                                searchTextRegExp
                        ) != null
                    ) {
                        return true;
                    }
                })
                .indexOf(true);
            return isRelated != -1 ? true : false;
        });
}

function renderFilteredAndSortedUsers() {
    foundFriendsDOM.innerHTML = "";
    filterUsers();
    sortFilteredUsers();
    filterUsersBySearchText();
    renderUsersCards(filteredAndSortedUsersData, foundFriendsDOM);
}
