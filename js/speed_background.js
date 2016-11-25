try {
    speeddial.storage.open();
    speeddial.storage.createTable();
    sync_add_group = function(b, a) {
        return speeddial.storage.sync_add_group(b, a)
    };
    sync_edit_group = function(b, a) {
        return speeddial.storage.sync_edit_group(b, a)
    };
    sync_remove_group = function(a) {
        return speeddial.storage.sync_remove_group(a)
    };
    sync_order_groups = function(a) {
        return speeddial.storage.sync_order_groups(a)
    };
    sync_add_bookmark = function(b, a) {
        return speeddial.storage.sync_add_bookmark(b, a)
    };
    sync_edit_bookmark = function(b, a) {
        return speeddial.storage.sync_edit_bookmark(b, a)
    };
    sync_move_bookmark = function(b, a) {
        return speeddial.storage.sync_move_bookmark(b, a)
    };
    sync_remove_bookmark = function(a) {
        return speeddial.storage.sync_remove_bookmark(a)
    };
    sync_order_bookmarks = function(a) {
        return speeddial.storage.sync_order_bookmarks(a)
    };
    sync_to_server = function(a) {
        return speeddial.storage.sync_to_server(a)
    };
    sync_settings = function() {
        return speeddial.storage.sync_settings()
    };
    import_settings = function(a, b) {
        return speeddial.storage.import_settings(a, b)
    };
    test_sync_account = function(a) {
        return speeddial.storage.test_sync_account(a)
    };
    sync = function(a) {
        return speeddial.storage.sync(a)
    };
    merge_or_sync = function(b, a) {
        return speeddial.storage.merge_or_sync(b, a)
    };
    backup = function(a) {
        return speeddial.storage.backup(a)
    };
    get_user_backups = function(a) {
        return speeddial.storage.get_user_backups(a)
    };
    upload = function(b, a, c) {
        return speeddial.storage.upload(b, a, c)
    };
    sync_usage = function() {
        try {
            speeddial.storage.sync_usage()
        } catch(a) {
            console.log(a)
        }
    };
    get_user_token = function(a, b) {
        return speeddial.storage.get_user_token(a, b)
    };
    charge = function(a, b) {
        return speeddial.storage.charge(a, b)
    };
    sign_up = function(a, b) {
        return speeddial.storage.sign_up(a, b)
    };
    create_group = function(a, b) {
        return speeddial.storage.addGroup(a, b)
    };
    setTimeout(function() {
        backup()
    },
    1000);
    setTimeout(function() {
        sync()
    },
    25000);
    chrome.alarms.create("sync", {
        periodInMinutes: 360
    });
    chrome.alarms.onAlarm.addListener(function(a) {
        if (a && a.name == "sync") {
            console.log("[" + Date.now() + "] Synchronizing ...");
            sync()
        }
    });
    function makeThumbnail(a, b) {
        setTimeout(function() {
            try {
                chrome.tabs.captureVisibleTab(null, {
                    format: "png"
                },
                function(f) {
                    var h = document.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
                    var d = h.getContext("2d");
                    var g = document.createElement("img");
                    g.onload = function() {
                        try {
                            resized_width = 460;
                            quality = 0.65;
                            if (localStorage["options.thumbnailQuality"] == "low") {
                                resized_width = 360;
                                quality = 0.65
                            }
                            if (localStorage["options.thumbnailQuality"] == "high") {
                                resized_width = 720;
                                quality = 0.65
                            }
                            resized_height = Math.ceil((resized_width / g.width) * g.height);
                            h.width = resized_width;
                            h.height = resized_height;
                            d.drawImage(g, 0, 0, resized_width, resized_height);
                            speeddial.storage.db.transaction(function(j) {
                                j.executeSql("DELETE FROM thumbnails WHERE url = ?", [a],
                                function() {
                                    j.executeSql("INSERT INTO thumbnails (url, thumbnail) values (?, ?)", [a, h.toDataURL("image/jpeg", quality)], null,
                                    function(k, l) {
                                        alert("Something unexpected happened: " + l.message)
                                    })
                                })
                            });
                            g = null
                        } catch(i) {
                            console.log(i)
                        }
                    };
                    g.src = f
                })
            } catch(c) {
                console.log(c)
            }
        },
        b)
    }
    chrome.tabs.onUpdated.addListener(function(f, a, c) {
        try {
            if (c.selected && c.url) {
                if (localStorage.requestThumbnail && localStorage.requestThumbnail != "" && localStorage.requestThumbnail != "undefined" && typeof localStorage.requestThumbnail != "undefined") {
                    var b = localStorage.requestThumbnail.split("|||");
                    if (b[0] == c.id) {
                        if (c.status == "complete") {
                            if (c.url.indexOf("mail.google.com") > -1 || c.url.indexOf("twitter.com") > -1) {
                                if (validateUrl(c.url)) {
                                    makeThumbnail(b[1], 1000)
                                }
                            } else {
                                if (validateUrl(c.url)) {
                                    makeThumbnail(b[1], 135)
                                }
                            }
                            localStorage.requestThumbnail = ""
                        }
                        b = null
                    }
                }
            }
        } catch(d) {
            console.log(d)
        }
    });
    chrome.tabs.onCreated.addListener(function(a) {
        if (localStorage.refresh_create == "true") {
            localStorage.refresh_url = "";
            localStorage.refresh_create = "false";
            localStorage.refresh_id = "";
            localStorage.refreshThumbnail = ""
        }
        if (localStorage.refreshThumbnail != "") {
            localStorage.refresh_url = localStorage.refreshThumbnail;
            localStorage.refresh_create = "true";
            localStorage.refresh_id = a.id;
            localStorage.refreshThumbnail = ""
        }
    });
    chrome.tabs.onUpdated.addListener(function(c, a, b) {
        if (localStorage.refreshThumbnail != "") {
            localStorage.refresh_url = localStorage.refreshThumbnail;
            localStorage.refresh_create = "true";
            localStorage.refresh_id = b.id;
            localStorage.refreshThumbnail = ""
        }
    });
    chrome.tabs.onSelectionChanged.addListener(function(a, b) {
        if (a) {
            try {
                chrome.tabs.getSelected(null,
                function(f) {
                    if (f) {
                        if (localStorage.refresh_create == "true") {
                            if (f.selected && f.url && f.id == localStorage.refresh_id) {
                                var d = localStorage.refresh_url;
                                if (f.status == "complete") {
                                    localStorage.refresh_url = "";
                                    localStorage.refresh_create = "false";
                                    localStorage.refresh_id = "";
                                    localStorage.refreshThumbnail = "";
                                    if (d.indexOf("mail.google.com") > -1 || d.indexOf("twitter.com") > -1) {
                                        if (validateUrl(d)) {
                                            makeThumbnail(d, 1000)
                                        }
                                    } else {
                                        if (validateUrl(d)) {
                                            makeThumbnail(d, 145)
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            } catch(c) {
                console.log(c)
            }
        }
    });
    chrome.tabs.onUpdated.addListener(function(d, b, c) {
        if (localStorage.refresh_create == "true") {
            if (c) {
                if (c.selected && c.url && c.id == localStorage.refresh_id) {
                    var a = localStorage.refresh_url;
                    if (c.status == "complete") {
                        localStorage.refresh_url = "";
                        localStorage.refresh_create = "false";
                        localStorage.refresh_id = "";
                        localStorage.refreshThumbnail = "";
                        if (a.indexOf("mail.google.com") > -1 || a.indexOf("twitter.com") > -1) {
                            if (validateUrl(a)) {
                                makeThumbnail(a, 1000)
                            }
                        } else {
                            if (validateUrl(a)) {
                                makeThumbnail(a, 135)
                            }
                        }
                    }
                }
            }
        }
    });
    function contextmenu_addGroup(c, a) {
        var b = [];
        b.title = a.title;
        b.url = encodeURI(a.url);
        b.idgroup = c.id;
        speeddial.storage.addItem(b,
        function() {});
        if (a.url && validateUrl(a.url)) {
            makeThumbnail(a.url, 0)
        }
    }
    function contextmenu_createGroup(a) {
        chrome.contextMenus.create({
            title: a.title,
            contexts: ["all"],
            parentId: selectGroups,
            type: "normal",
            onclick: function(c, b) {
                contextmenu_addGroup(a, b)
            }
        })
    }
    function getGroups(b) {
        var a = [];
        speeddial.storage.db.transaction(function(c) {
            c.executeSql("SELECT * FROM groups ORDER BY position ASC", [],
            function(d, f) {
                if (f.rows.length > 0) {
                    for (var g = 0; g < f.rows.length; g++) {
                        a.push(f.rows.item(g))
                    }
                    return b(a)
                }
            })
        })
    }
    function addCurrentPage(a, b) {
        chrome.tabs.query({
            windowId: chrome.windows.WINDOW_ID_CURRENT,
            active: true
        },
        function(c) {
            if (c && c[0]) {
                tab = c[0];
                if (!tab || !tab.url || !tab.title) {
                    return
                }
                var d = [];
                d.title = tab.title;
                d.url = encodeURI(tab.url);
                d.thumbnail = "";
                d.idgroup = a || 0;
                speeddial.storage.addItem(d,
                function() {});
                if (tab.url && validateUrl(tab.url)) {
                    makeThumbnail(tab.url, 0)
                }
                return b()
            }
        })
    }
    function contextmenu_loadGroups() {
        speeddial.storage.db.transaction(function(a) {
            a.executeSql("SELECT * FROM groups ORDER BY position ASC", [],
            function(b, c) {
                if (c.rows.length > 0) {
                    chrome.contextMenus.create({
                        type: "separator",
                        parentId: rootElement
                    });
                    selectGroups = chrome.contextMenus.create({
                        title: "Add to group",
                        contexts: ["all"],
                        parentId: rootElement,
                        type: "normal",
                    });
                    for (var d = 0; d < c.rows.length; d++) {
                        contextmenu_createGroup(c.rows.item(d))
                    }
                }
            })
        })
    }
    if (localStorage["options.showContextMenu"] == "1") {
        var selectGroups;
        var rootElement = chrome.contextMenus.create({
            contexts: ["all"],
            title: "Speed dial 2",
            type: "normal"
        });
        chrome.contextMenus.create({
            title: "Add current page",
            contexts: ["all"],
            parentId: rootElement,
            type: "normal",
            onclick: function(c, a) {
                var b = [];
                b.title = a.title;
                b.url = encodeURI(a.url);
                b.thumbnail = "";
                b.idgroup = 0;
                speeddial.storage.addItem(b,
                function() {});
                if (a.url && validateUrl(a.url)) {
                    makeThumbnail(a.url, 0)
                }
            }
        });
        chrome.contextMenus.create({
            type: "separator",
            parentId: rootElement
        });
        chrome.contextMenus.create({
            title: "Add all opened pages",
            contexts: ["all"],
            parentId: rootElement,
            type: "normal",
            onclick: function(b, a) {
                chrome.tabs.getAllInWindow(null,
                function(d) {
                    for (var c = 0; c < d.length; c++) {
                        if (d[c].title != "New tab") {
                            var f = [];
                            f.title = d[c].title;
                            f.url = encodeURI(d[c].url);
                            f.idgroup = 0;
                            speeddial.storage.addItem(f,
                            function() {})
                        }
                    }
                })
            }
        });
        contextmenu_loadGroups()
    }
    if (typeof localStorage._opened_tabs != "undefined") {
        localStorage._restore_tabs = localStorage._opened_tabs
    }
    localStorage.removeItem("_opened_tabs");
    localStorage.removeItem("_tmp_pinboard.tags");
    chrome.tabs.onUpdated.addListener(function(b, a, c) {
        if (c && c.url && c.title && c.incognito === false) {
            if (typeof localStorage._opened_tabs != "undefined") {
                var d = JSON.parse(localStorage._opened_tabs)
            } else {
                var d = {}
            }
            d[b] = {};
            d[b].url = c.url;
            d[b].title = c.title;
            d[b].pinned = c.pinned;
            localStorage._opened_tabs = JSON.stringify(d, null, 2)
        }
    });
    chrome.tabs.onRemoved.addListener(function(c, a) {
        if (typeof localStorage._opened_tabs != "undefined") {
            var h = JSON.parse(localStorage._opened_tabs);
            if (!h[c]) {
                return false
            }
            var g = h[c];
            delete h[c];
            localStorage._opened_tabs = JSON.stringify(h, null, 2);
            var b = g.url;
            var j = g.title;
            var f = /^(http:|https:|ftp:|file:)/;
            if (b && f.test(b)) {
                if (typeof localStorage._closed_tabs != "undefined") {
                    closedTabs = JSON.parse(localStorage._closed_tabs);
                    for (var d = 0; d < closedTabs.length; d++) {
                        if (closedTabs[d].url == b) {
                            closedTabs.splice(d, 1)
                        }
                    }
                    closedTabs.push({
                        url: b,
                        title: j
                    });
                    while (closedTabs.length > 25) {
                        closedTabs.shift()
                    }
                    localStorage._closed_tabs = JSON.stringify(closedTabs, null, 2)
                } else {
                    closedTabs = [];
                    closedTabs.push({
                        url: b,
                        title: j
                    });
                    localStorage._closed_tabs = JSON.stringify(closedTabs, null, 2)
                }
            }
            h = null
        }
    });
    chrome.extension.onRequest.addListener(function(c, b, a) {});
    if (localStorage["usage.uuid"] && localStorage["usage.interval"] && localStorage["usage.last"]) {
        if ((Math.round( + new Date() / 1000) - localStorage["usage.last"]) > localStorage["usage.interval"]) {
            sync_usage()
        }
    }
} catch(e) {
    console.log(e)
};