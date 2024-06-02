chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let activeTab = tabs[0].id;
        chrome.storage.sync.get(["keybinds"], (result) => {
            if (result.keybinds) {
                switch (command) {
                    case result.keybinds.goBack:
                        chrome.tabs.goBack(activeTab);
                        break;
                    case result.keybinds.goForward:
                        chrome.tabs.goForward(activeTab);
                        break;
                    case result.keybinds.refreshPage:
                        chrome.tabs.reload(activeTab);
                        break;
                    case result.keybinds.highlightLinks:
                        chrome.scripting.executeScript({
                            target: {tabId: activeTab},
                            files: ['content.js']
                        });
                        break;
                }
            }
        });
    });
});

// Load user-defined keybinds from storage and apply them
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["keybinds"], (result) => {
        if (result.keybinds) {
            updateCommands(result.keybinds);
        }
    });
});

function updateCommands(keybinds) {
    chrome.commands.getAll((commands) => {
        commands.forEach((command) => {
            switch (command.name) {
                case "_execute_action":
                    chrome.commands.update({
                        name: command.name,
                        shortcut: keybinds[command.name]
                    });
                    break;
            }
        });
    });
}
