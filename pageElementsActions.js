const foundFriendsDOM = $(".found_users"),
    filtersFormDOM = $(".filter_form"),
    textForSearch = $(".text_search_input"),
    cssRoot = $(":root");

function $ (selector) {
    return document.querySelector(selector);
}

$("#search_friends").addEventListener("click", searchFriendsButtonAction);

$("#filters_menu_input_label").addEventListener("click", (e) => {
    $("#filters_menu_input").checked = !$("#filters_menu_input").checked;
    $(".main_aside").classList.toggle("hide");
    $(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");
});


filtersFormDOM.addEventListener("click", (e) => {
    if (e.target.classList.contains("formSubmit")) {
        renderFilteredAndSortedUsers();
    }
});

$(".disable_filter_btn").addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentNode
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
    renderFilteredAndSortedUsers();
});

document
    .querySelector("#theme_change_input_label")
    .addEventListener("click", (e) => {
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
                    img.src.slice(0, -5) +
                    (lightColorTheme ? "l.png" : "d.png");
            }
        });
    });




    
foundFriendsDOM.addEventListener("click", (e) => {
    if (e.target.getAttribute("id") === "user_actions_preview") {
        changePreviewIcon (e);
    }
});

function changePreviewIcon (e) {
    e.target.src = e.target.classList.contains("active")
            ? ((lightColorTheme) 
                ? settings.actionsLightThemeIconsSrc.preview 
                : settings.actionsDarkThemeIconsSrc.preview)
            : ((lightColorTheme) 
                ? settings.actionsLightThemeIconsSrc.previewHide 
                : settings.actionsDarkThemeIconsSrc.previewHide);
        e.path
            .find((node) => node.classList.contains("user_card"))
            .querySelector(".more_user_info")
            .classList.toggle("hide");
        e.target.classList.toggle("active");
}

textForSearch.addEventListener("input", (e) => {
    renderFilteredAndSortedUsers();
});
