var socket = io()

var appVars = {
    selectedLang: "EN",
    apiJson: [],
    groups: []
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
    openAllGroups: function(groups) {
        console.log('openAll')
        for (var i = 0; i < groups.length; i++) {
            window.open(groups[i])
        }
    }
}

var appWatchers = {
    selectedLang: function() {
        appVars.groups = []
    }
}

function getGroupsFromApi(api, lang) {
    appVars.groups = []
    var apiJson = JSON.parse(api)
    appVars.apiJson = apiJson
    for (var i = 0; i < apiJson.data.length; i++) {
        if (apiJson.data[i].language == lang.toLowerCase()) {
            var group = apiJson.data[i].hangout_url
            if (group != null) {
                console.log(group)
                appVars.groups.push(group)
            }
        }
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
