package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

public class JsonQueryTypeLogout implements JsonQueryInterface {
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		if(queryInfo.getLoggedInUserId() == 0) {
			return new JsonResponseTypeStatus(2, "logoutAction", "Logout failed - not logged in.");
		}
		else {
			queryInfo.removeLoggedInUserId();
			
			return new JsonResponseTypeStatus(1, "logoutAction", "Logout successful.");
		}
	}
}
