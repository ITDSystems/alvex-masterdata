/**
 * Copyright © 2012-2017 ITD Systems
 *
 * This file is part of Alvex
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "dojo/request/xhr",
        "dojo/json",
        "dojo/_base/lang",
        "dojo/_base/array",
        "service/constants/Default",
        "alfresco/core/topics"
    ],
    function(declare, BaseService, Core, AlfXhr, xhr, JSON, lang, array, AlfConstants, topics) {

        return declare([BaseService, Core, AlfXhr], {

            constructor: function alvex_services_MasterDataService__constructor(args) {
                lang.mixin(this, args);

                this.alfSubscribe("ALVEX_SHOW_CREATE_SOURCE_FROM_DATALIST_FORM", lang.hitch(this, this.onShowCreateSourceFromDatalistForm));
                this.alfSubscribe("ALVEX_SHOW_CREATE_SOURCE_FROM_JSON_FORM", lang.hitch(this, this.onShowCreateSourceFromJSONForm));
                this.alfSubscribe("ALVEX_SHOW_CREATE_SOURCE_FROM_XML_FORM", lang.hitch(this, this.onShowCreateSourceFromXMLForm));
                this.alfSubscribe("ALVEX_GET_MASTERDATA_SOURCES", lang.hitch(this, this.onGetMasterDataSources));
                this.alfSubscribe("ALVEX_RETRIEVE_DATALISTS", lang.hitch(this, this.onRetrieveDatalists));
                this.alfSubscribe("ALVEX_RETRIEVE_DATALIST_FIELDS", lang.hitch(this, this.onRetrieveDatalistFields));
                this.alfSubscribe("ALVEX_SAVE_NEW_MASTERDATA_SOURCE", lang.hitch(this, this.onSaveNewMasterdataSource));
                this.alfSubscribe("ALVEX_DELETE_MASTERDATA_SOURCE", lang.hitch(this, this.onDeleteMasterdataSource));
                this.alfSubscribe("ALVEX_EDIT_MASTERDATA_SOURCE", lang.hitch(this, this.onEditMasterdataSource));
                this.alfSubscribe("ALVEX_SHOW_EDIT_MASTERDATA_ITEM_DIALOG", lang.hitch(this, this.onShowEditMasterdataItemDialog));
                this.alfSubscribe("ALVEX_SAVE_UPDATED_MASTERDATA_SOURCE", lang.hitch(this, this.onSaveUpdatedMasterdataSource));
                this.alfSubscribe("ALVEX_VIEW_MASTERDATA_SOURCE", lang.hitch(this, this.onViewMasterdataSource));
            },

            onShowCreateSourceFromDatalistForm: function alvex_services_MasterDataService__onShowCreateSourceFromDatalistForm(payload) {
                this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
                    dialogTitle: "masterdata.new.datalist",
                    dialogConfirmationButtonTitle: "button.save",
                    dialogCancellationButtonTitle: "button.cancel",
                    formSubmissionTopic: "ALVEX_SAVE_NEW_MASTERDATA_SOURCE",
                    formSubmissionGlobal: true,
                    formSubmissionPayloadMixin: {
                        type: "datalist"
                    },
                    widgets: [{
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.name",
                            name: "name",
                            requirementConfig: {
                                initialValue: true
                            },
                            validationConfig: [{
                                validation: "regex",
                                regex: "^((?!\/).)*$",
                                errorMessage: "masterdata.message.error.nameregex"
                            }]
                        }
                    }, {
                        name: "alfresco/forms/controls/Select",
                        config: {
                            fieldId: "SITE_DATALIST_SOURCE",
                            label: "masterdata.add.selectlist",
                            name: "datalist",
                            optionsConfig: {
                                publishTopic: "ALVEX_RETRIEVE_DATALISTS",
                            },
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }, {
                        name: "alfresco/forms/controls/Select",
                        config: {
                            label: "masterdata.add.valueField",
                            name: "valueColumn",
                            value: "",
                            optionsConfig: {
                                changesTo: [{
                                    targetId: 'SITE_DATALIST_SOURCE'
                                }],
                                publishTopic: topics.GET_FORM_VALUE_DEPENDENT_OPTIONS,
                                publishPayload: {
                                    publishTopic: "ALVEX_RETRIEVE_DATALIST_FIELDS"
                                },
                                publishGlobal: false
                            },
                            visibilityConfig: {
                                initialValue: false,
                                rules: [{
                                    targetId: "SITE_DATALIST_SOURCE",
                                    isNot: ["masterdata.new.datalist.choose_entity"],
                                    strict: true
                                }]
                            }
                        }
                    }, {
                        name: "alfresco/forms/controls/Select",
                        config: {
                            label: "masterdata.add.labelField",
                            name: "labelColumn",
                            value: "",
                            optionsConfig: {
                                changesTo: [{
                                    targetId: 'SITE_DATALIST_SOURCE'
                                }],
                                publishTopic: topics.GET_FORM_VALUE_DEPENDENT_OPTIONS,
                                publishPayload: {
                                    publishTopic: "ALVEX_RETRIEVE_DATALIST_FIELDS"
                                },
                                publishGlobal: false
                            },
                            visibilityConfig: {
                                initialValue: false,
                                rules: [{
                                    targetId: "SITE_DATALIST_SOURCE",
                                    isNot: ["masterdata.new.datalist.choose_entity"],
                                    strict: true
                                }]
                            }
                        }
                    }]
                });
            },

            onGetMasterDataSources: function alvex_services_MasterDataService__onGetMasterDataSources(payload) {
                var url = AlfConstants.PROXY_URI + "api/alvex/masterdata/sources";
                var noCache = new Date().getTime();

                var options = {
                    noCache: noCache
                };

                //var successFunction = lang.hitch(this, this.onGetMasterDataSourcesSuccess);

                if (url !== null) {
                    this.serviceXhr({
                        url: url,
                        query: options,
                        alfTopic: payload.alfResponseTopic || null,
                        alfResponseScope: payload.alfResponseScope,
                        method: "GET"
                            //      successCallback: successFunction
                    });
                }
            },

            onRetrieveDatalists: function alvex_services_MasterDataService__onRetrieveDatalists(payload) {
                var url = AlfConstants.PROXY_URI + "api/alvex/datalists/list-all";
                var noCache = new Date().getTime();

                var options = {
                    noCache: noCache
                };

                var successFunction = lang.hitch(this, this.onRetrieveDatalistsSuccess);

                if (url !== null) {
                    this.serviceXhr({
                        url: url,
                        query: options,
                        alfTopic: payload.responseTopic,
                        alfResponseScope: payload.alfResponseScope,
                        method: "GET",
                        successCallback: successFunction
                    });
                }
            },

            onRetrieveDatalistsSuccess: function alvex_services_MasterDataService__onRetrieveDatalistsSuccess(response, originalRequestConfig) {
                var newResponse = [{
                    value: "masterdata.new.datalist.choose_entity",
                    label: "masterdata.new.datalist.choose_entity"
                }];
                response.dls.forEach(function(item, i, dls) {
                    newResponse.push({
                        value: {
                            itemType: item.itemType,
                            datalistRef: item.nodeRef
                        },
                        label: item.listTitle + " (" + item.siteTitle + ")"
                    });
                });
                this.alfPublish(originalRequestConfig.alfTopic, {
                    options: newResponse
                });
            },

            onRetrieveDatalistFields: function alvex_services_MasterDataService__onRetrieveDatalistFields(payload) {
                var itemType = (payload.datalist != null ? payload.datalist.itemType : payload.assoc_alvexmd_masterDataStorage.itemType);
                if (itemType != "" && itemType != null) {
                    var url = AlfConstants.URL_SERVICECONTEXT + "alvex/components/data-lists/config/columns?itemType=" + itemType;
                    var noCache = new Date().getTime();

                    var options = {
                        noCache: noCache
                    };

                    var successFunction = lang.hitch(this, this.onRetrieveDatalistFieldsSuccess);

                    if (url !== null) {
                        this.serviceXhr({
                            url: url,
                            query: options,
                            alfTopic: payload.responseTopic,
                            alfResponseScope: payload.alfResponseScope,
                            method: "GET",
                            successCallback: successFunction
                        });
                    }
                } else {
                    this.alfPublish(payload.responseTopic, {
                        options: [{
                            label: "masterdata.new.datalist.selectDatalist",
                            value: "masterdata.new.datalist.selectDatalist"
                        }]
                    })
                }
            },

            onRetrieveDatalistFieldsSuccess: function alvex_services_MasterDataService__onRetrieveDatalistFieldsSuccess(response, originalRequestConfig) {
                var newResponse = [];
                response.columns.forEach(function(item, i, columns) {
                    newResponse.push({
                        value: item.name,
                        label: item.label
                    });
                });
                this.alfPublish(originalRequestConfig.alfTopic, {
                    options: newResponse
                });
            },

            onShowCreateSourceFromJSONForm: function alvex_services_MasterDataService__onShowCreateSourceFromJSONForm(payload) {
                this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
                    dialogTitle: "masterdata.new.restjson",
                    dialogConfirmationButtonTitle: "button.save",
                    dialogCancellationButtonTitle: "button.cancel",
                    formSubmissionTopic: "ALVEX_SAVE_NEW_MASTERDATA_SOURCE",
                    formSubmissionGlobal: true,
                    formSubmissionPayloadMixin: {
                        type: "restJSON"
                    },
                    widgets: [{
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.name",
                            name: "name",
                            requirementConfig: {
                                initialValue: true
                            },
                            validationConfig: [{
                                validation: "regex",
                                regex: "^((?!\/).)*$",
                                errorMessage: "masterdata.message.error.nameregex"
                            }]
                        }
                    }, {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.masterDataURL",
                            name: "masterDataURL",
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }, {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.dataRootJsonQuery",
                            name: "dataRootJsonQuery",
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }, {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.valueField",
                            name: "valueField",
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }, {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.labelField",
                            name: "labelField",
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }]
                });
            },

            onShowCreateSourceFromXMLForm: function alvex_services_MasterDataService__onShowCreateSourceFromXMLForm(payload) {
                this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
                    dialogTitle: "masterdata.new.restxml",
                    dialogConfirmationButtonTitle: "button.save",
                    dialogCancellationButtonTitle: "button.cancel",
                    formSubmissionTopic: "ALVEX_SAVE_NEW_MASTERDATA_SOURCE",
                    formSubmissionGlobal: true,
                    formSubmissionPayloadMixin: {
                        type: "restXML"
                    },
                    widgets: [{
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.name",
                            name: "name",
                            requirementConfig: {
                                initialValue: true
                            },
                            validationConfig: [{
                                validation: "regex",
                                regex: "^((?!\/).)*$",
                                errorMessage: "masterdata.message.error.nameregex"
                            }]
                        }
                    }, {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.masterDataURL",
                            name: "masterDataURL",
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }, {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.dataRootXpathQuery",
                            name: "dataRootXpathQuery",
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }, {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.valueFieldXML",
                            name: "valueXpath",
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }, {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                            label: "masterdata.add.labelFieldXML",
                            name: "labelXpath",
                            requirementConfig: {
                                initialValue: true
                            }
                        }
                    }]
                });
            },

            onSaveNewMasterdataSource: function alvex_services_MasterDataService__onSaveNewMasterdataSource(payload) {
                var url = AlfConstants.PROXY_URI + "api/alvex/masterdata/sources";
                var noCache = new Date().getTime();
                var options = {
                    noCache: noCache
                };

                var data = {
                    type: payload.type,
                    name: payload.name
                };

                if (data.type == "datalist") {
                    data.datalistRef = payload.datalist.datalistRef;
                    data.labelColumn = payload.labelColumn;
                    data.valueColumn = payload.valueColumn;
                }

                if (data.type == "restJSON") {
                    data.masterDataURL = payload.masterDataURL;
                    data.dataRootJsonQuery = payload.dataRootJsonQuery;
                    data.valueField = payload.valueField;
                    data.labelField = payload.labelField;
                    data.caching = "cached";
                }

                if (data.type == "restXML") {
                    data.masterDataURL = payload.masterDataURL;
                    data.dataRootXpathQuery = payload.dataRootXpathQuery;
                    data.valueXpath = payload.valueXpath;
                    data.labelXpath = payload.labelXpath;
                    data.caching = "cached";
                }
                this.serviceXhr({
                    url: url,
                    data: data,
                    method: "POST",
                    successCallback: this.onSaveNewMasterdataSourceSuccess,
                    failureCallback: this.onSaveNewMasterdataSourceFailure,
                    callbackScope: this
                });

            },

            onSaveNewMasterdataSourceSuccess: function alvex_services_MasterDataService__onSaveNewMasterdataSourceSuccess(response, originalRequestConfig) {
                this.alfPublish("ALF_DOCLIST_RELOAD_DATA");
            },

            onSaveNewMasterdataSourceFailure: function alvex_services_MasterDataService__onSaveNewMasterdataSourceFailure(response, originalRequestConfig) {
                this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
                    message: this.message("masterdata.msg.error")
                });
            },

            onDeleteMasterdataSource: function alvex_services_MasterDataService__onDeleteMasterdataSource(payload) {
                var responseTopic = this.generateUuid();
                this._actionDeleteHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onDeleteMasterdataSourceConfirmation), true);

                this.alfPublish(topics.CREATE_DIALOG, {
                    dialogId: "ALF_DELETE_CONTENT_DIALOG",
                    dialogTitle: this.message("masterdata.deleteSource.title"),
                    contentHeight: "100px",
                    widgetsContent: [{
                        name: "alfresco/html/Label",
                        config: {
                            label: "masterdata.deleteSource.message"
                        }
                    }],
                    widgetsButtons: [{
                        id: "ALF_DELETE_CONTENT_DIALOG_CONFIRMATION",
                        name: "alfresco/buttons/AlfButton",
                        config: {
                            label: this.message("button.delete"),
                            publishTopic: responseTopic,
                            publishPayload: {
                                name: payload.name,
                                responseScope: payload.alfResponseScope
                            }
                        }
                    }, {
                        id: "ALF_DELETE_CONTENT_DIALOG_CANCELLATION",
                        name: "alfresco/buttons/AlfButton",
                        config: {
                            label: this.message("button.cancel"),
                            publishTopic: "close"
                        }
                    }]
                });

            },

            onDeleteMasterdataSourceConfirmation: function alvex_services_MasterDataService__onDeleteMasterdataSourceConfirmation(payload) {
                this.alfUnsubscribeSaveHandles([this._actionDeleteHandle]);

                var responseTopic = this.generateUuid();
                var subscriptionHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onDeleteMasterdataSourceSuccess), true);

                this.serviceXhr({
                    alfTopic: responseTopic,
                    responseScope: payload.alfResponseScope,
                    subscriptionHandle: subscriptionHandle,
                    url: AlfConstants.PROXY_URI + "api/alvex/masterdata/sources/" + encodeURIComponent(payload.name) + "?alf_method=DELETE",
                    method: "POST"
                });
            },

            onDeleteMasterdataSourceSuccess: function alvex_services_MasterDataService__onDeleteMasterdataSourceSuccess(response) {
                this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
                    message: this.message("masterdata.deleteSource.success")
                });
                this.alfPublish("ALF_DOCLIST_RELOAD_DATA");
            },

            onEditMasterdataSource: function alvex_services_MasterDataService__onEditMasterdataSource(payload) {
                var url = AlfConstants.PROXY_URI + "api/alvex/masterdata/source?sourceRef=" + payload.nodeRef;
                var noCache = new Date().getTime();

                var options = {
                    noCache: noCache
                };

                var successFunction = lang.hitch(this, this.onShowEditMasterdataItemDialog);

                if (url !== null) {
                    this.serviceXhr({
                        url: url,
                        query: options,
                        alfTopic: payload.responseTopic,
                        alfResponseScope: payload.alfResponseScope,
                        method: "GET",
                        successCallback: successFunction
                    });
                }
            },

            onShowEditMasterdataItemDialog: function alvex_services_MasterDataService__onShowEditMasterdataItemDialog(response) {
                var formValue = {};
                if (response.dataSource.name != null) {
                    formValue["prop_cm_name"] = response.dataSource["name"];
                    formValue["assoc_alvexmd_masterDataStorage"] = (response.dataSource["masterDataStorage"] != null ? response.dataSource["masterDataStorage"] : null);
                    formValue["prop_alvexmd_datalistColumnValueField"] = (response.dataSource["datalistColumnValueField"] != null ? response.dataSource["datalistColumnValueField"] : null);
                    formValue["prop_alvexmd_datalistColumnLabelField"] = (response.dataSource["datalistColumnLabelField"] != null ? response.dataSource["datalistColumnLabelField"] : null);
                    formValue["prop_alvexmd_masterDataURL"] = (response.dataSource["masterDataURL"] != null ? response.dataSource["masterDataURL"] : null);
                    formValue["prop_alvexmd_dataRootJsonQuery"] = (response.dataSource["dataRootJsonQuery"] != null ? response.dataSource["dataRootJsonQuery"] : null);
                    formValue["prop_alvexmd_labelJsonField"] = (response.dataSource["labelJsonField"] != null ? response.dataSource["labelJsonField"] : null);
                    formValue["prop_alvexmd_valueJsonField"] = (response.dataSource["valueJsonField"] != null ? response.dataSource["valueJsonField"] : null);
                    formValue["prop_alvexmd_dataRootXpathQuery"] = (response.dataSource["dataRootXpathQuery"] != null ? response.dataSource["dataRootXpathQuery"] : null);
                    formValue["prop_alvexmd_valueXpath"] = (response.dataSource["valueXpath"] != null ? response.dataSource["valueXpath"] : null);
                    formValue["prop_alvexmd_labelXpath"] = (response.dataSource["labelXpath"] != null ? response.dataSource["labelXpath"] : null);
                };
                var nodeRef = response.dataSource.nodeRef;
                /*if (response.dataSource.type == "datalist") {

                    this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
                        dialogTitle: "masterdata.edit.datalist",
                        dialogConfirmationButtonTitle: "button.save",
                        dialogCancellationButtonTitle: "button.cancel",
                        formSubmissionTopic: "ALVEX_SAVE_UPDATED_MASTERDATA_SOURCE",
                        formSubmissionGlobal: true,
                        formValue: formValue,
                        formSubmissionPayloadMixin: {
                            alf_destination: nodeRef
                        },
                        widgets: [{
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.name",
                                name: "prop_cm_name",
                                requirementConfig: {
                                    initialValue: true
                                },
                                validationConfig: [{
                                    validation: "regex",
                                    regex: "^((?!\/).)*$",
                                    errorMessage: "masterdata.message.error.nameregex"
                                }]
                            }
                        }, {
                            name: "alfresco/forms/controls/Select",
                            config: {
                                fieldId: "SITE_DATALIST_SOURCE",
                                label: "masterdata.add.selectlist",
                                name: "assoc_alvexmd_masterDataStorage",
                                optionsConfig: {
                                    publishTopic: "ALVEX_RETRIEVE_DATALISTS",
                                },
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }, {
                            name: "alfresco/forms/controls/Select",
                            config: {
                                label: "masterdata.add.valueField",
                                name: "prop_alvexmd_datalistColumnValueField",
                                optionsConfig: {
                                    changesTo: [{
                                        targetId: 'SITE_DATALIST_SOURCE'
                                    }],
                                    publishTopic: topics.GET_FORM_VALUE_DEPENDENT_OPTIONS,
                                    publishPayload: {
                                        publishTopic: "ALVEX_RETRIEVE_DATALIST_FIELDS"
                                    },
                                    publishGlobal: false
                                },
                                visibilityConfig: {
                                    initialValue: false,
                                    rules: [{
                                        targetId: "SITE_DATALIST_SOURCE",
                                        isNot: ["masterdata.new.datalist.choose_entity"],
                                        strict: true
                                    }]
                                }
                            }
                        }, {
                            name: "alfresco/forms/controls/Select",
                            config: {
                                label: "masterdata.add.labelField",
                                name: "prop_alvexmd_datalistColumnLabelField",
                                optionsConfig: {
                                    changesTo: [{
                                        targetId: 'SITE_DATALIST_SOURCE'
                                    }],
                                    publishTopic: topics.GET_FORM_VALUE_DEPENDENT_OPTIONS,
                                    publishPayload: {
                                        publishTopic: "ALVEX_RETRIEVE_DATALIST_FIELDS"
                                    },
                                    publishGlobal: false
                                },
                                visibilityConfig: {
                                    initialValue: false,
                                    rules: [{
                                        targetId: "SITE_DATALIST_SOURCE",
                                        isNot: ["masterdata.new.datalist.choose_entity"],
                                        strict: true
                                    }]
                                }
                            }
                        }]
                    });
                } else*/
                if (response.dataSource.type == "restJSON") {
                    this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
                        dialogTitle: "masterdata.edit.restjson",
                        dialogConfirmationButtonTitle: "button.save",
                        dialogCancellationButtonTitle: "button.cancel",
                        formSubmissionTopic: "ALVEX_SAVE_UPDATED_MASTERDATA_SOURCE",
                        formSubmissionGlobal: true,
                        formValue: formValue,
                        formSubmissionPayloadMixin: {
                            alf_destination: nodeRef
                        },
                        widgets: [{
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.name",
                                name: "prop_cm_name",
                                requirementConfig: {
                                    initialValue: true
                                },
                                validationConfig: [{
                                    validation: "regex",
                                    regex: "^((?!\/).)*$",
                                    errorMessage: "masterdata.message.error.nameregex"
                                }]
                            }
                        }, {
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.masterDataURL",
                                name: "prop_alvexmd_masterDataURL",
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }, {
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.dataRootJsonQuery",
                                name: "prop_alvexmd_dataRootJsonQuery",
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }, {
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.valueField",
                                name: "prop_alvexmd_valueJsonField",
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }, {
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.labelField",
                                name: "prop_alvexmd_labelJsonField",
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }]
                    });
                } else if (response.dataSource.type == "restXML") {
                    this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
                        dialogTitle: "masterdata.edit.restxml",
                        dialogConfirmationButtonTitle: "button.save",
                        dialogCancellationButtonTitle: "button.cancel",
                        formSubmissionTopic: "ALVEX_SAVE_UPDATED_MASTERDATA_SOURCE",
                        formSubmissionGlobal: true,
                        formValue: formValue,
                        formSubmissionPayloadMixin: {
                            alf_destination: nodeRef
                        },
                        widgets: [{
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.name",
                                name: "prop_cm_name",
                                requirementConfig: {
                                    initialValue: true
                                },
                                validationConfig: [{
                                    validation: "regex",
                                    regex: "^((?!\/).)*$",
                                    errorMessage: "masterdata.message.error.nameregex"
                                }]
                            }
                        }, {
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.masterDataURL",
                                name: "prop_alvexmd_masterDataURL",
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }, {
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.dataRootXpathQuery",
                                name: "prop_alvexmd_dataRootXpathQuery",
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }, {
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.valueFieldXML",
                                name: "prop_alvexmd_valueXpath",
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }, {
                            name: "alfresco/forms/controls/TextBox",
                            config: {
                                label: "masterdata.add.labelFieldXML",
                                name: "prop_alvexmd_labelXpath",
                                requirementConfig: {
                                    initialValue: true
                                }
                            }
                        }]
                    });
                }

            },

            onSaveUpdatedMasterdataSource: function alvex_services_MasterDataService__onSaveUpdatedMasterdataSource(payload) {
                if (payload.alf_destination) {
                    var url = AlfConstants.PROXY_URI + "api/node/" + payload.alf_destination.replace(/\:\//g, "") + "/formprocessor";
                    var alfSuccessTopic = "ALF_DOCLIST_RELOAD_DATA";
                    var data = payload;
                    var config = {
                        alfSuccessTopic: alfSuccessTopic,
                        url: url,
                        data: data,
                        responseScope: "",
                        method: "POST",
                        callbackScope: this
                    };
                    this.serviceXhr(config);
                }
            },

            onViewMasterdataSource: function alvex_services_MasterDataService__onViewMasterdataSource(payload) {
                var url = AlfConstants.PROXY_URI + "api/alvex/masterdata/source?sourceRef=" + payload.nodeRef;
                var noCache = new Date().getTime();

                var options = {
                    noCache: noCache
                };

                var successFunction = lang.hitch(this, this.onShowViewMasterdataItemDialog);

                if (url !== null) {
                    this.serviceXhr({
                        url: url,
                        query: options,
                        alfTopic: payload.responseTopic,
                        alfResponseScope: payload.alfResponseScope,
                        method: "GET",
                        successCallback: successFunction
                    });
                }
            },

            onShowViewMasterdataItemDialog: function alvex_services_MasterDataService__onShowViewMasterdataItemDialog(response) {

                var widgets = [{
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.name",
                        currentItem: response,
                        propertyToRender: "dataSource.name",
                        renderOnNewLine: true
                    }
                }];
                if (response.dataSource.type == "datalist") {
                  widgets.push({
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.selectlist",
                        currentItem: response,
                        propertyToRender: "dataSource.masterDataStorage.label",
                        renderOnNewLine: true
                    }
                  }, {
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.valueField",
                        currentItem: response,
                        propertyToRender: "dataSource.datalistColumnValueField",
                        renderOnNewLine: true
                    }
                  }, {
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.labelField",
                        currentItem: response,
                        propertyToRender: "dataSource.datalistColumnLabelField",
                        renderOnNewLine: true
                    }
                  });
                } else if (response.dataSource.type == "restJSON") {
                  widgets.push({
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.masterDataURL",
                        currentItem: response,
                        propertyToRender: "dataSource.masterDataURL",
                        renderOnNewLine: true
                    }
                  }, {
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.dataRootJsonQuery",
                        currentItem: response,
                        propertyToRender: "dataSource.dataRootJsonQuery",
                        renderOnNewLine: true
                    }
                  }, {
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.valueField",
                        currentItem: response,
                        propertyToRender: "dataSource.valueJsonField",
                        renderOnNewLine: true
                    }
                  }, {
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.labelField",
                        currentItem: response,
                        propertyToRender: "dataSource.labelJsonField",
                        renderOnNewLine: true
                    }
                  });
                } else if (response.dataSource.type == "restXML") {
                  widgets.push({
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.masterDataURL",
                        currentItem: response,
                        propertyToRender: "dataSource.masterDataURL",
                        renderOnNewLine: true
                    }
                  }, {
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.dataRootXpathQuery",
                        currentItem: response,
                        propertyToRender: "dataSource.dataRootXpathQuery",
                        renderOnNewLine: true
                    }
                  }, {
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.valueFieldXML",
                        currentItem: response,
                        propertyToRender: "dataSource.valueXpath",
                        renderOnNewLine: true
                    }
                  }, {
                    name: "alfresco/renderers/Property",
                    config: {
                        label: "masterdata.add.labelFieldXML",
                        currentItem: response,
                        propertyToRender: "dataSource.labelXpath",
                        renderOnNewLine: true
                    }
                  });
                }
                this.alfPublish("ALF_CREATE_DIALOG_REQUEST", {
                    dialogTitle: "masterdata.button.view",
                    widgetsContent: widgets,
                    widgetsButtons: [{
                        name: "alfresco/buttons/AlfButton",
                        config: {
                            label: "button.cancel",
                            publishTopic: "ALF_CLOSE_DIALOG"
                        }
                    }]
                });

            }


        })
    });
