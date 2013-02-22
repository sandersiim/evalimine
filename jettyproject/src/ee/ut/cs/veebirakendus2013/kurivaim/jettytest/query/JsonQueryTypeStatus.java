package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;

public class JsonQueryTypeStatus implements JsonQueryInterface {
	
	String statusType;
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
		
		if(statusType != null && statusType.equals("authStatus")) {
			return new JsonResponseTypeStatus(1, "authStatus", queryInfo.getSessionStringParameter("authStatus"));
		}
		else {
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "infoAction", "Getting status info failed - no database connection.");
			}
			
			String cardFirstName = queryInfo.getSessionStringParameter("firstName"), cardLastName = queryInfo.getSessionStringParameter("lastName");
			
			return new JsonResponseTypeUserInfo("infoAction", queryInfo.getLoggedInUserInfo(), queryInfo.getLoggedInCandidateInfo(), cardFirstName, cardLastName);
		}
	}
}
