import { filterAndSortUsers } from "./filterAndSortUsers.js";
import { renderUsersCards } from "./renderUsersCards.js";
import { urlPropsActions } from "./urlPropsActions.js";

const settingsURL = "./settings.json";

let settings,
    usersData,
    filteredAndSortedUsersData,
    lightColorTheme = true;

const foundFriendsNode = $(".found_users"),
    filtersFormNode = $(".filter_form"),
    textForSearchNode = $(".text_search_input"),
    cssRoot = $(":root");

async function readParameters () {
    settings = await getData(settingsURL);
    urlParametersOnLoadPage();
};

onPageLoad();

function urlParametersOnLoadPage() {
    urlPropsActions.set("shownPages", "1");
    colorThemeOnLoadPage();
    genderFilterOnLoadPage();
}

function colorThemeOnLoadPage () {
    let colorTheme = urlPropsActions.get("colorTheme");
    if (colorTheme === null) {
        colorTheme = "light";
        urlPropsActions.set("colorTheme", colorTheme);
    }
    changeColorTheme(colorTheme);
}

function genderFilterOnLoadPage () {
    let genderFilter = urlPropsActions.get("gender");
    if (genderFilter !== null && genderFilter !== "none") {
        genderFilter = genderFilter.split(",");
            genderFilter.forEach((filterValue) => {
                Array.from(
                    document.querySelectorAll("input[type=checkbox]")
                ).find((input) => input.value == filterValue).checked = true;
            });
        }
}

async function onPageLoad() {
    await readParameters();
    foundFriendsNode.innerHTML = "";
    urlPropsActions.set("shownPages", "0");
    toggleLoaderAnimation();
    usersData = await getUsers(createRequestUrl());
    filteredAndSortedUsersData = usersData;
    showPageOfUsers();
    //renderUsersCards(usersData, foundFriendsNode, getRenderParameters());

    toggleLoaderAnimation();
    //$(".main_content").classList.remove("hide");
    //$(".main").classList.remove("hide");
    //$("#filters_menu_input_label").classList.remove("hide");
    //$(".text_search").classList.remove("hide");
    //clearFilters(filtersFormNode);
    addShowMoreUsersButtonEventListener();
}

function getRenderParameters() {
    return {
        lightColorTheme: lightColorTheme,
        actionsIconsSrc: settings.actionsIconsSrc,
        usersPerPage: settings.usersPerPage,
        shownPagesOfUsersCount: +urlPropsActions.get("shownPages"),
    };
}


function renderFilteredAndSortedUsers() {
    foundFriendsNode.innerHTML = "";
    shownPagesOfUsersCount = 0;
    const searchAndSortParameters = {
        filtersFormData: new FormData(filtersFormNode),
        filtersFields: settings.filtersFields,
        sortTypeDecrypter: settings.sortTypeDecrypter,
        fieldsForSearchText: settings.fieldsForSearchText,
        textForSearch: textForSearchNode.value,
    };
    const filteredAndSortedUsersData = filterAndSortUsers(
        usersData,
        searchAndSortParameters
    );
    renderUsersCards(
        filteredAndSortedUsersData,
        foundFriendsNode,
        getRenderParameters()
    );
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

function clearFilters(filtersNode) {
    filtersNode
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
}

function toggleLoaderAnimation() {
    $(".lds-ripple").classList.toggle("hide");
}

function $(selector) {
    return document.querySelector(selector);
}

textForSearchNode.addEventListener("input", (e) => {
    renderFilteredAndSortedUsers();
});

filtersFormNode.addEventListener("click", (e) => {
    if (e.target.classList.contains("formSubmit")) {
        /* const filtersFormData = new FormData(filtersFormNode);
        const parameterValues = filtersFormData.getAll(e.target.name);
        if (parameterValues.length != 0) {
            urlPropsActions.set(e.target.name, parameterValues.join(","));
        } else {
            urlPropsActions.del(e.target.name);
        } */
        updateSearchPropsInURL();
        /* const urlParameter =
            parameterValues.length != 0 ? parameterValues.join(",") : "none";
        urlPropsActions.set(e.target.name, urlParameter); */
        //renderFilteredAndSortedUsers();
    }
});

function updateSearchPropsInURL () {
    const filtersFormData = new FormData(filtersFormNode);
    const searchProps = [...settings.filtersFields, "sorting"];
    searchProps.forEach(field => {
        const filterValues = filtersFormData.getAll(field);
        if (filterValues.length != 0) {
            urlPropsActions.set(field, filterValues.join(","));
        } else {
            urlPropsActions.del(field);
        }
    });
}


$("#filters_menu_input").addEventListener("change", (e) => {
    //$("#filters_menu_input").checked = !$("#filters_menu_input").checked;
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
        //changePreviewIcon(e);
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
    const currentColorTheme = urlPropsActions.get("colorTheme");
    let newColorTheme;
    if (currentColorTheme === "light") {
        urlPropsActions.set("colorTheme", "dark");
        newColorTheme = "dark";
        e.target.innerText = "Dark theme";
    } else {
        urlPropsActions.set("colorTheme", "light");
        newColorTheme = "light";
        e.target.innerText = "Light theme";
    }
    changeColorTheme(newColorTheme);
});

function changeColorTheme(newColorTheme) {
    for (const cssVar in settings.themes[newColorTheme]) {
        cssRoot.style.setProperty(
            `--${cssVar}`,
            `${settings.themes[newColorTheme][cssVar]}`
        );
    }

/*     const oldColorTheme = newColorTheme == "light" ? "dark" : "light";
    document.querySelectorAll("img").forEach((img) => {
        if (!img.classList.contains("user_avatar")) {
            img.src = img.src.replace(oldColorTheme, newColorTheme);
        }
    }); */
}

function addShowMoreUsersButtonEventListener() {
    document.querySelector("#show_more").addEventListener("click", showPageOfUsers);
}

function showPageOfUsers () {
    const shownPagesOfUsersCount = +urlPropsActions.get("shownPages");
        if (
            shownPagesOfUsersCount * settings.usersPerPage <
            filteredAndSortedUsersData.length
        ) {
            renderUsersCards(
                filteredAndSortedUsersData,
                foundFriendsNode,
                getRenderParameters()
            );
            urlPropsActions.set("shownPages", +shownPagesOfUsersCount + 1);
        }
    }
