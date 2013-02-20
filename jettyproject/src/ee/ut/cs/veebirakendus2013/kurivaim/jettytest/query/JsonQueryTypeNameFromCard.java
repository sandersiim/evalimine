package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

public class JsonQueryTypeNameFromCard implements JsonQueryInterface {
	protected static final int RESPONSECODE_SUCCESS = 10;
	protected static final int RESPONSECODE_NOIDAUTH = 1;
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		String firstName = queryInfo.getSessionStringParameter("firstName"), lastName = queryInfo.getSessionStringParameter("lastName");
		
		if(firstName != null && lastName != null) {
			return new JsonResponseTypeStatus(RESPONSECODE_SUCCESS, "nameFromId", firstName + "|" + lastName);
		}
		else {
			return new JsonResponseTypeStatus(RESPONSECODE_NOIDAUTH, "nameFromId", "Error - not logged in with ID card.");
		}
	}
}
