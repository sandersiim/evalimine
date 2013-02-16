package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;

public class JsonQueryTypeStatus implements JsonQueryInterface {
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
		
		if(!sqlHandler.validateConnection()) {
			return new JsonResponseTypeStatus(-1, "infoAction", "Getting status info failed - no database connection.");
		}
		
		return new JsonResponseTypeUserInfo("infoAction", queryInfo.getLoggedInUserInfo(), queryInfo.getLoggedInCandidateInfo());
	}
}
