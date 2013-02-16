package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

public class JsonQueryTypeStatus implements JsonQueryInterface {
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		int userId = queryInfo.getLoggedInUserId();
		
		if(userId > 0) {
			return new JsonResponseTypeStatus(2, "loginStatus", "Logged in with user ID " + userId + ".");
		}
		else {
			return new JsonResponseTypeStatus(1, "loginStatus", "Not logged in");
		}
	}
	
}
