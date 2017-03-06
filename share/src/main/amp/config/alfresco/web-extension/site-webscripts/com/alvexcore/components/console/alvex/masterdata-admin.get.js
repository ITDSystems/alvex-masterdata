var userData = {};
var groups = user.properties["alfUserGroups"];
if (groups != null) {
    groups = groups.split(",");
    var processedGroups = {};
    for (var i = 0; i < groups.length; i++) {
        processedGroups[groups[i]] = true;
    }
    userData.groups = processedGroups;
}
userData.isNetworkAdmin = user.properties["isNetworkAdmin"];
userData.isAdmin = user.capabilities["isAdmin"];

var MasterDataServiceScope = "MANAGE_MASTERDATA_SERVICE_";

model.jsonModel = {
    services: [{
        name: "alfresco/services/LoggingService",
        config: {
            loggingPreferences: {
                enabled: true,
                all: true,
                warn: true,
                error: true
            }
        }
    }, {
        name: "alvex-masterdata/services/MasterDataService"
    }, {
        name: "alfresco/services/OptionsService"
    }],
    widgets: [{
        id: "SET_PAGE_TITLE",
        name: "alfresco/header/SetTitle",
        config: {
            title: msg.get("tool.masterdata-admin.label")
        }
    }, {
        id: "SHARE_VERTICAL_LAYOUT",
        name: "alfresco/layout/VerticalWidgets",
        config: {
            widgets: [{
                name: "alfresco/html/Spacer",
                config: {
                    height: "10px"
                }
            }, {
                id: "MENUBAR",
                name: "alfresco/menus/AlfMenuBar",
                align: "left",
                config: {
                    widgets: [{
                        id: "ADD_DATALIST_SOURCE_BUTTON",
                        name: "alfresco/menus/AlfMenuBarItem",
                        config: {
                            label: "masterdata.add.datalist",
                            publishTopic: "ALVEX_SHOW_CREATE_SOURCE_FROM_DATALIST_FORM"
                        }
                    }, {
                        id: "ADD_DATALIST_SOURCE_BUTTON",
                        name: "alfresco/menus/AlfMenuBarItem",
                        config: {
                            label: "masterdata.add.restjson",
                            publishTopic: "ALVEX_SHOW_CREATE_SOURCE_FROM_JSON_FORM"
                        }
                    }, {
                        id: "ADD_DATALIST_SOURCE_BUTTON",
                        name: "alfresco/menus/AlfMenuBarItem",
                        config: {
                            label: "masterdata.add.restxml",
                            publishTopic: "ALVEX_SHOW_CREATE_SOURCE_FROM_XML_FORM"
                        }
                    }]
                }
            }, {
                id: "DOCLIB_DOCUMENT_LIST",
                name: "alfresco/lists/AlfList",
                config: {
                    useHash: false,
                    usePagination: false,
                    loadDataPublishTopic: "ALVEX_GET_MASTERDATA_SOURCES",
                    itemsProperty: "dataSources",
                    widgets: [{
                        name: "alfresco/lists/views/AlfListView",
                        config: {
                            itemKey: "nodeRef",
                            widgetsForHeader: [{
                                name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                                config: {
                                    label: "masterdata.source.name",
                                    sortable: false
                                }
                            }, {
                                name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                                config: {
                                    label: "masterdata.source.type",
                                    sortable: false
                                }
                            }, {
                                name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                                config: {
                                    label: "",
                                    sortable: false
                                }
                            }],
                            widgets: [{
                                name: "alfresco/documentlibrary/views/layouts/Row",
                                config: {
                                    widgets: [{
                                        name: "alfresco/documentlibrary/views/layouts/Cell",
                                        config: {
                                            additionalCssClasses: "mediumpad",
                                            widgets: [{
                                                name: "alfresco/renderers/Property",
                                                config: {
                                                    propertyToRender: "name",
                                                    renderAsLink: false
                                                }
                                            }]
                                        }
                                    }, {
                                        name: "alfresco/documentlibrary/views/layouts/Cell",
                                        config: {
                                            additionalCssClasses: "mediumpad",
                                            widgets: [{
                                                name: "alfresco/renderers/Property",
                                                config: {
                                                    propertyToRender: "type",
                                                    renderAsLink: false
                                                }
                                            }]
                                        }
                                    }, {
                                        name: "alfresco/documentlibrary/views/layouts/Cell",
                                        config: {
                                            additionalCssClasses: "mediumpad",
                                            widgets: [{
                                                name: "alfresco/renderers/PublishAction",
                                                config: {
                                                    iconClass: "info-16",
                                                    altText: "masterdata.button.view",
                                                    publishTopic: "ALVEX_VIEW_MASTERDATA_SOURCE",
                                                    publishPayloadType: "PROCESS",
                                                    publishPayloadModifiers: ["processCurrentItemTokens"],
                                                    publishPayload: {
                                                      nodeRef: "{nodeRef}"
                                                    },
                                                    publishGlobal: true
                                                }
                                            }, {
                                                name: "alfresco/renderers/PublishAction",
                                                config: {
                                                    iconClass: "edit-16",
                                                    altText: "button.edit",
                                                    publishTopic: "ALVEX_EDIT_MASTERDATA_SOURCE",
                                                    publishPayloadType: "PROCESS",
                                                    publishPayloadModifiers: ["processCurrentItemTokens"],
                                                    publishPayload: {
                                                      nodeRef: "{nodeRef}"
                                                    },
                                                    publishGlobal: true,
                                                    renderFilter: [{
                                                      property: "type",
                                                      values: ["restJSON", "restXML"]
                                                    }]
                                                }
                                            }, {
                                                name: "alfresco/renderers/PublishAction",
                                                config: {
                                                    iconClass: "delete-16",
                                                    altText: "button.delete",
                                                    publishTopic: "ALVEX_DELETE_MASTERDATA_SOURCE",
                                                    publishPayloadType: "PROCESS",
                                                    publishPayloadModifiers: ["processCurrentItemTokens"],
                                                    publishGlobal: true,
                                                    publishPayload: {
                                                      name: "{name}"
                                                    }
                                                }
                                            }]
                                        }
                                    }]
                                }
                            }]
                        }
                    }]
                }
            }]
        }
    }]
};
