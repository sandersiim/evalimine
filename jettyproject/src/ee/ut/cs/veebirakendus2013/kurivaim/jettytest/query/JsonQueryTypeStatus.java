package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpSession;

public class JsonQueryTypeStatus implements JsonQueryInterface {
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		HttpSession session = queryInfo.getRequest().getSession();
		Object userName = session.getAttribute("username");
		
		if(userName != null && userName instanceof String) {
			return new JsonResponseTypeStatus(2, "loginStatus", "Logged in as '" + ((String)userName) + "'.");
		}
		else {
			return new JsonResponseTypeStatus(1, "loginStatus", "Not logged in");
		}
	}
	
}
