package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;


public enum JsonQueryTypes {
	INVALID("invalid", JsonQueryTypeInvalid.class),
	LOGIN("login", JsonQueryTypeLogin.class),
	LOGOUT("logout", JsonQueryTypeLogout.class),
	STATUS("status", JsonQueryTypeStatus.class),
	CANDIDATES("candidates", JsonQueryTypeCandidates.class),
	PARTIES("parties", JsonQueryTypeParties.class),
	REGIONS("regions", JsonQueryTypeRegions.class),
	VOTE("vote", JsonQueryTypeVote.class),
	APPLICATION("application", JsonQueryTypeApplication.class),
	PHOTO("photo", JsonQueryTypePhoto.class),
	SETREGION("setregion", JsonQueryTypeSetRegion.class),
	ADMINLOGIN("adminlogin", JsonQueryTypeAdminLogin.class),
	ADMINUSERS("adminusers", JsonQueryTypeAdminUsers.class),
	SESSIONID("sessionid", JsonQueryTypeSessionId.class),
	CHANGEPASS("changepass", JsonQueryTypeChangePass.class);
	
	private final String typeName;
	private final Class<? extends JsonQueryInterface> typeClass;
	
	
	private JsonQueryTypes(String typeName, Class<? extends JsonQueryInterface> typeClass) {
		this.typeName = typeName;
		this.typeClass = typeClass;
	}
	
	
	public String getName() {
		return typeName;
	}
	
	
	public Class<? extends JsonQueryInterface> getImplClass() {
		return typeClass;
	}
}
