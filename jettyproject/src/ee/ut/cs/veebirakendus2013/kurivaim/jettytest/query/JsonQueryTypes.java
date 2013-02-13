package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;


public enum JsonQueryTypes {
	BASE("base", JsonQueryTypeBase.class),
	INVALID("invalid", JsonQueryTypeInvalid.class),
	LOGIN("login", JsonQueryTypeLogin.class),
	STATUS("status", JsonQueryTypeStatus.class);
	
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
