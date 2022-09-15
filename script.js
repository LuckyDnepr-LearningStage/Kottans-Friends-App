const actionsButtonsImages = [
    {
        id: "user_actions_chat",
        src: "./icons/icon-chat.png",
    },
    {
        id: "user_actions_add",
        src: "./icons/icon-add-friend.png",
    },
    {
        id: "user_actions_preview",
        src: "./icons/icon-preview.png",
    },
];

const settings = {
    baseURL: "https://randomuser.me/api/",
    numberOfUsers: 2000,
    usersPerPage: 12,
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
    userIDField: "uuid",
    filtersFields: ["gender", "age"],
    fieldsForSearchText: ["first", "last", "city", "username"],
};

let usersData,
    filteredUsersData,
    shownUsersNumber = 0;

const foundFriendsDOM = document.querySelector(".found_users"),
    filtersFormDOM = document.querySelector(".filter_form");

document
    .querySelector("#search_friends")
    .addEventListener("click", async function (e) {
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
    });

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
    filteredUsersData = usersData;
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
        showErrorMessage();
    }
}

function showErrorMessage() {
    foundFriendsDOM.innerHTML = `
        <div></div>
        <p class="error_massage">Ooops...</br>Something wrong with internet connection or server is busy.</br>Try later, please.</p>
        <div></div>`;
    toggleLoaderAnimation();
}

function renderUsersCards(usersData, container) {
    if (container.querySelector("#show_more")) {
        container.querySelector("#show_more").parentNode.remove();
    }
    let usersCardsForShow = [];
    for (
        let i = settings.usersPerPage * shownUsersNumber;
        i < settings.usersPerPage * (shownUsersNumber + 1);
        i++
    ) {
        if (i < usersData.length) {
            usersCardsForShow.push(createUserCardHTML(usersData[i]));
        } else {
            break;
        }
    }
    container.innerHTML +=
        usersCardsForShow.join("") + makePaginationButtonHTML();
    document.querySelector("#show_more").addEventListener("click", (e) => {
        shownUsersNumber++;
        renderUsersCards(filteredUsersData, foundFriendsDOM);
    });
}

function createUserCardHTML(user) {
    return (
        `<div class="user_card">` +
        makeUserCardAvatarHTML(user) +
        makeUserCardInfoHTML(user) +
        makeUserCardActionsButtonsHTML() +
        makeUserCardMoreInfoHTML(user) +
        `</div>`
    );

    function makeUserCardAvatarHTML(user) {
        return `<img
            src="${user.picture.large}"
            alt=""
            class="user_avatar"/>`;
    }

    function makeUserCardInfoHTML(user) {
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

    function makeUserCardActionsButtonsHTML() {
        return (
            `<div class="user_actions">` +
            actionsButtonsImages
                .map((actionImg) => {
                    return `<img
                    src="${actionImg.src}"
                    alt=""
                    class="user_actions_icon"
                    id="${actionImg.id}"
                />`;
                })
                .join("") +
            `</div>`
        );
    }

    function makeUserCardMoreInfoHTML(user) {
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

function makePaginationButtonHTML() {
    return `<div class="user_card">
    <button class="nav_menu_item" id="show_more">
            Show more...
            </button>
            </div>`;
}

function dobOfUser(date) {
    return new Date(date).toDateString();
}

document.querySelector("#filters_menu_btn").addEventListener("click", (e) => {
    document.querySelector(".main_aside").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");
});

document.querySelector(".disable_filter_btn").addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentNode
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
    filterFormSubmit();
});

filtersFormDOM.addEventListener("click", (e) => {
    if (e.target.classList.contains("formSubmit")) {
        filterFormSubmit();
    }
});

function filterFormSubmit() {
    foundFriendsDOM.innerHTML = "";
    filterUsers();
    sortFilteredUsers();
    renderUsersCards(filteredUsersData, foundFriendsDOM);
}

function filterUsers() {
    shownUsersNumber = 0;
    const filterFormData = new FormData(filtersFormDOM);
    filteredUsersData = usersData;
    settings.filtersFields.map((fieldName) => {
        const fieldValues = filterFormData.getAll(fieldName);
        if (fieldValues != 0) {
            filteredUsersData = filteredUsersData.filter((user) =>
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
            sortBy != undefined ? createSortFunction(sortBy) : () => true;
    filteredUsersData = filteredUsersData
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

document.querySelector(".text_search_input").addEventListener("input", (e) => {
    filterUsers();
    sortFilteredUsers();
        const searchTextRegExp = new RegExp(e.target.value, "g");
        filteredUsersData = filteredUsersData
            .map((user) => user)
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
        foundFriendsDOM.innerHTML = "";
        renderUsersCards(filteredUsersData, foundFriendsDOM);
});
