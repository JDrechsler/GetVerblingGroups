var socket = io()

var appVars = {
    selectedLang: "EN",
    apiJson: [],
    groups: [],
    status: ""
}

var appMethods = {
    getCurrentApi: function() {
        console.log('Anfrage an Server');
        socket.emit('request-groups', appVars.selectedLang)
        socket.on('response-apiString', function(apiString) {
            console.log('Antwort vom Server');
            getGroupsFromApi(apiString, appVars.selectedLang)
        })
    },
    openAllGroups: function() {
        console.log('openAll')
        for (var i = 0; i < appVars.groups.length; i++) {
            console.log(appVars.groups[i].hangout_url)
            window.open(appVars.groups[i].hangout_url)
        }
    }
}

var appWatchers = {
    selectedLang: function() {
        appVars.groups = []
        appVars.status = ""
    }
}

function getGroupsFromApi(api, lang) {
    appVars.groups = []
    var apiJson = JSON.parse(api)
    appVars.apiJson = apiJson
    for (var i = 0; i < apiJson.data.length; i++) {
        if (apiJson.data[i].language == lang.toLowerCase()) {
            var groupObj = apiJson.data[i]
            if (groupObj.hangout_url != null) {
                appVars.groups.push({
                    hangout_url: groupObj.hangout_url,
                    num_participants: groupObj.num_participants,
                    google_participants: groupObj.google_participants
                })
                console.log(`${groupObj.hangout_url}, ${groupObj.num_participants}, ${groupObj.participants.length}`);
            }
        }
    }
    if (appVars.groups.length < 1) {

        appVars.status = 'Could not find any groups. Try a different language :)'
    }
    else {
        appVars.status = `Found: ${appVars.groups.length} ${appVars.selectedLang} groups`
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Vue({
        el: '#app',
        data: appVars,
        methods: appMethods,
        watch: appWatchers
    })

    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    }
    document.body.ondrop = (ev) => {
        ev.preventDefault();
    }
})
