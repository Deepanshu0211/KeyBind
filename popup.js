document.addEventListener('DOMContentLoaded', () => {
    const goBackInput = document.getElementById('goBack');
    const goForwardInput = document.getElementById('goForward');
    const refreshPageInput = document.getElementById('refreshPage');
    const highlightLinksInput = document.getElementById('highlightLinks');
    const saveButton = document.getElementById('save');

    // Load saved keybinds
    chrome.storage.sync.get(["keybinds"], (result) => {
        if (result.keybinds) {
            goBackInput.value = result.keybinds.goBack || 'Ctrl+Left';
            goForwardInput.value = result.keybinds.goForward || 'Ctrl+Right';
            refreshPageInput.value = result.keybinds.refreshPage || 'Ctrl+R';
            highlightLinksInput.value = result.keybinds.highlightLinks || 'Ctrl+L';
        }
    });

    // Save new keybinds
    saveButton.addEventListener('click', () => {
        const keybinds = {
            goBack: goBackInput.value,
            goForward: goForwardInput.value,
            refreshPage: refreshPageInput.value,
            highlightLinks: highlightLinksInput.value
        };
        chrome.storage.sync.set({ keybinds }, () => {
            updateCommands(keybinds);
            alert('Keybinds saved! Please reload the extension to apply changes.');
        });
    });

    function updateCommands(keybinds) {
        chrome.commands.update({
            name: "go-back",
            shortcut: keybinds.goBack
        });
        chrome.commands.update({
            name: "go-forward",
            shortcut: keybinds.goForward
        });
        chrome.commands.update({
            name: "refresh-page",
            shortcut: keybinds.refreshPage
        });
        chrome.commands.update({
            name: "highlight-links",
            shortcut: keybinds.highlightLinks
        });
    }
});
