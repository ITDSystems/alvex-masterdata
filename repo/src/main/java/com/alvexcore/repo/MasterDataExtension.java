/**
 * Copyright © 2012 ITD Systems
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

package com.alvexcore.repo;

import com.alvexcore.repo.AlvexContentModel;
import com.alvexcore.repo.masterdata.AlvexMasterDataService;
import org.alfresco.model.ContentModel;
import org.alfresco.repo.security.authentication.AuthenticationUtil;
import org.alfresco.repo.security.authentication.AuthenticationUtil.RunAsWork;
import org.alfresco.repo.security.permissions.impl.model.Permission;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.MLText;
import org.alfresco.service.cmr.security.AuthorityType;
import org.alfresco.service.cmr.security.PermissionService;
import org.alfresco.service.namespace.QName;
import org.alfresco.service.cmr.version.VersionType;

import org.alfresco.repo.node.NodeServicePolicies;
import org.alfresco.repo.node.NodeServicePolicies.OnCreateNodePolicy;
import org.alfresco.repo.node.NodeServicePolicies.OnUpdatePropertiesPolicy;
import org.alfresco.repo.node.NodeServicePolicies.OnCreateAssociationPolicy;
import org.alfresco.repo.node.NodeServicePolicies.OnDeleteAssociationPolicy;
import org.alfresco.repo.policy.Behaviour;
import org.alfresco.repo.policy.JavaBehaviour;
import org.alfresco.repo.policy.PolicyComponent;

import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.AssociationRef;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.io.Serializable;

/**
 * MasterData extension implementation
 */

public class MasterDataExtension extends RepositoryExtension {
	
	public static final String ID_MASTER_DATA_CONFIG_PATH = "masterDataConfigPath";
	public static final String ID_MASTER_DATA_DATA_PATH = "masterDataDataPath";
	public static final String ID_MASTER_DATA_SERVICE_CONFIG_PATH = "masterDataServiceConfigPath";
		
	protected PolicyComponent policyComponent;
	protected AlvexDictionaryService alvexDictionaryService;
	protected AlvexMasterDataService alvexMasterDataService;
	
	public void setPolicyComponent(PolicyComponent policyComponent)
	{
		this.policyComponent = policyComponent;
	}
	
	public void setAlvexDictionaryService(AlvexDictionaryService alvexDictionaryService)
	{
		this.alvexDictionaryService = alvexDictionaryService;
	}
	
	public void setAlvexMasterDataService(AlvexMasterDataService alvexMasterDataService)
	{
		this.alvexMasterDataService = alvexMasterDataService;
	}
	
	// constructor
	public MasterDataExtension() throws Exception {
		id = "master-data";
		fileListPath = "alvex-master-data-file-list.txt";
		extInfoPath = "alvex-master-data.properties";
	}

	@Override
	public void init(boolean failIfInitialized) throws Exception {
		super.init(failIfInitialized);
		initializeStorage();
		
		// Create storage for master data
		QName[] MASTER_DATA_SERVICE_CONFIG_PATH = new QName[DATA_PATH.length + 2];
		QName[] MASTER_DATA_CONFIG_PATH = new QName[DATA_PATH.length + 2];
		QName[] MASTER_DATA_DATA_PATH = new QName[DATA_PATH.length + 2];
		for(int i = 0; i < DATA_PATH.length; i++) {
			MASTER_DATA_SERVICE_CONFIG_PATH[i] = MASTER_DATA_CONFIG_PATH[i] = MASTER_DATA_DATA_PATH[i] = DATA_PATH[i];
		}
		MASTER_DATA_SERVICE_CONFIG_PATH[DATA_PATH.length] 
				= MASTER_DATA_CONFIG_PATH[DATA_PATH.length] 
				= MASTER_DATA_DATA_PATH[DATA_PATH.length] 
				= QName.createQName(AlvexContentModel.ALVEX_MODEL_URI, "masterData");
		MASTER_DATA_SERVICE_CONFIG_PATH[DATA_PATH.length + 1] 
				= QName.createQName(AlvexContentModel.ALVEX_MODEL_URI, "config");
		MASTER_DATA_CONFIG_PATH[DATA_PATH.length + 1] 
				= QName.createQName(AlvexContentModel.ALVEX_MODEL_URI, "sources");
		MASTER_DATA_DATA_PATH[DATA_PATH.length + 1] 
				= QName.createQName(AlvexContentModel.ALVEX_MODEL_URI, "storage");
		// create data folder if needed
		NodeRef masterDataServiceConfigPath = extensionRegistry.createPath(MASTER_DATA_SERVICE_CONFIG_PATH, null, null);
		NodeRef masterDataConfigPath = extensionRegistry.createPath(MASTER_DATA_CONFIG_PATH, null, null);
		NodeRef masterDataDataPath = extensionRegistry.createPath(MASTER_DATA_DATA_PATH, null, null);
		addNodeToCache(ID_MASTER_DATA_SERVICE_CONFIG_PATH, masterDataServiceConfigPath);
		addNodeToCache(ID_MASTER_DATA_CONFIG_PATH, masterDataConfigPath);
		addNodeToCache(ID_MASTER_DATA_DATA_PATH, masterDataDataPath);
		
		// Init service
		alvexMasterDataService.setMasterDataExtension(this);
		alvexMasterDataService.setUp();
		
	}

	private void initializeStorage() throws Exception {
		PermissionService permissionService = extensionRegistry
				.getServiceRegistry().getPermissionService();
		permissionService.setPermission(getDataPath(),
				PermissionService.ALL_AUTHORITIES,
				PermissionService.CONTRIBUTOR, true);
	}
}
