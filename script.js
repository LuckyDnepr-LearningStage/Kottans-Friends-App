const actionsButtonsImages = [
    {
        id: "user_actions_chat",
        srcL: "./icons/icon-chat-l.png",
        srcD: "./icons/icon-chat-d.png",
    },
    {
        id: "user_actions_add",
        srcL: "./icons/icon-add-friend-l.png",
        srcD: "./icons/icon-add-friend-d.png",
    },
    {
        id: "user_actions_preview",
        srcL: "./icons/icon-preview-l.png",
        srcD: "./icons/icon-preview-d.png",
    },
];

const settings = {
    baseURL: "https://randomuser.me/api/",
    numberOfUsers: 24,
    usersPerPage: 11,
    nations: ["ua"],
    fieldsToFetch: {
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
    }
};

let usersData,
    filteredAndSortedUsersData,
    shownUsersNumber = 0;
    lightColorTheme = true;

async function searchFriendsButtonAction () {
    document.querySelector(".main_content").classList.remove("hide");
    document.querySelector(".main").classList.remove("hide");
    foundFriendsDOM.innerHTML = "";
    shownUsersNumber = 0;
    toggleLoaderAnimation();
    await searchFriends();
    renderUsersCards(usersData, foundFriendsDOM);
    toggleLoaderAnimation();
    document.querySelector("#filters_menu_btn").classList.remove("hide");
    document.querySelector(".text_search").classList.remove("hide");
    clearFilters(filtersFormDOM);
}

function clearFilters(filtersDOM) {
    filtersDOM
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
}

function toggleLoaderAnimation() {
    document.querySelector(".lds-ripple").classList.toggle("hide");
}

async function searchFriends() {
    usersData = await getUsers(
        createRequestUrl(settings.baseURL, settings.fieldsToFetch),
        settings.numberOfUsers
    );
    filteredAndSortedUsersData = usersData;
    console.log(usersData);
}

function createRequestUrl(baseURL, fieldsToFetch) {
    return (
        `${baseURL}?inc=` +
        Object.keys(fieldsToFetch)
            .filter((key) => fieldsToFetch[key])
            .join(",")
    );
}

async function getUsers(url, numberOfUsers) {
    url += `&results=${+numberOfUsers}&nat=${settings.nations.join(",")}`;
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
    for (
        let i = settings.usersPerPage * shownUsersNumber;
        i < settings.usersPerPage * (shownUsersNumber + 1);
        i++
    ) {
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
    document.querySelector("#show_more").addEventListener("click", (e) => {
        shownUsersNumber++;
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
        return (
            `<div class="user_actions">` +
            actionsButtonsImages
                .map((actionImg) => {
                    return `<img
                    src="${(lightColorTheme) ? actionImg.srcL : actionImg.srcD}"
                    alt=""
                    class="user_actions_icon"
                    id="${actionImg.id}"
                />`;
                })
                .join("") +
            `</div>`
        );
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

/* 
document.querySelector("#filters_menu_btn").addEventListener("click", (e) => {
    document.querySelector(".main_aside").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");
});
 */

/* 
document.querySelector(".disable_filter_btn").addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentNode
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
    renderFilteredAndSortedUsers();
});
 */

/* 
filtersFormDOM.addEventListener("click", (e) => {
    if (e.target.classList.contains("formSubmit")) {
        renderFilteredAndSortedUsers();
    }
});
 */

function filterUsers() {
    shownUsersNumber = 0;
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
    const searchTextRegExp = new RegExp(textForSearch.value, "g");
    filteredAndSortedUsersData = filteredAndSortedUsersData
        //.map((user) => user)
        .filter((user) => {
            const isRelated = settings.fieldsForSearchText
                .map((field) => {
                    if (
                        getUserFieldValue(user, field).match(
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

/* 
document
    .querySelector("#theme_change_input_label")
    .addEventListener("click", (e) => {
        lightColorTheme = !lightColorTheme;
        e.target.classList.toggle("dark");
        const cssRoot = document.querySelector(":root");
        let theme;
        if (e.target.classList.contains("dark")) {
            theme = settings.themes.dark;
        } else {
            theme = settings.themes.light;
        }
        for (const cssVar in theme) {
            cssRoot.style.setProperty(`--${cssVar}`, `#${theme[cssVar]}`);
        }

    document.querySelectorAll('img').forEach(img => {
        if (!img.classList.contains("user_avatar")) {
            img.src = img.src.slice(0, -5) + ((lightColorTheme) ? 'l.png' : 'd.png');
        }
    })
    });
     */
